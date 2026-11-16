# Midi Scheduling Voice Agent

A patient talks to Ava from a laptop browser. Ava verifies who they are, collects basic intake, finds open times, and books, reschedules or cancels clinician appointments against a mocked scheduler. It never gives medical advice and escalates emergencies. After the call, the care team sees a summary, the intake answers, the appointment changes and the transcript.

## How a call flows

```
Browser mic ──WebRTC──▶ Pipecat agent (Python)
                         ├─ Silero VAD            barge-in
                         ├─ Deepgram Flux         speech to text + end of turn
                         ├─ LLM turn marker ● ◐ ○ waits when the patient is mid-thought
                         ├─ GPT-6.1 Terra         conversation + tool calls
                         └─ Cartesia Sonic-3      text to speech ──WebRTC──▶ Browser speaker
                                   │
                         tool calls (bearer token, scoped to one call)
                                   ▼
                         Next.js API ──▶ Postgres (patients, clinicians, appointments, calls)
                                   │
                         call ends ─▶ transcript saved ─▶ GPT-6.1 Sol summary (background)
```

1. The scheduling desk page creates a call; the browser connects to the agent over WebRTC.
2. `POST /api/calls/:id/start` marks the call in progress and returns today's date, clinic hours and clinicians.
3. Ava asks for full name and date of birth and calls `identify_patient`. Only after a match can the call book or cancel, and only for that patient.
4. For a new booking Ava asks five intake questions, saving each with `record_intake`.
5. `find_available_slots` filters by clinician, specialty, date and morning or afternoon. Ava offers at most two options and books only after the patient confirms the read-back.
6. Rescheduling books the new time first, then cancels the old one, so the patient never loses their place.
7. Emergency symptoms stop scheduling: Ava tells the caller to call 911, records a red flag and ends the call.
8. When the call ends, the transcript is saved and a structured summary with a triage level is generated in the background.

## Core components and how to change them

| Component | Where | What to change |
|---|---|---|
| Clinic hours, slot length, booking window | `modules/scheduling/clinic-hours.ts` | Constants |
| Slot generation, time zones | `modules/scheduling/slot-grid.ts`, `zoned-time.ts` | Pure functions, no clock or DB access |
| Availability | `modules/scheduling/availability.ts` | Slot grid minus booked appointments |
| Booking | `modules/scheduling/book-appointment.ts` | Validates clinician and slot, inserts once |
| Double-booking guard | `appointments_clinician_slot_booked` partial unique index | Enforced by Postgres, not by the model |
| Patient identity | `modules/patients/identify-patient.ts` | Name and date of birth match, then the call is bound to that patient |
| Agent API guards | `lib/api/agent-call-route.ts`, `modules/calls/active-call-route.ts`, `identified-call-route.ts` | Bearer auth, call in progress, identified patient |
| Summaries | `modules/summaries/` | Load input, generate with the model, persist |
| Agent behaviour | `agent/src/scheduling_agent/conversation/instructions.py` | Call flow, tool rules, safety rules |
| Intake questions | `agent/src/scheduling_agent/conversation/intake.py` | One list drives the prompt and the tool's allowed keys |
| Tools | `agent/src/scheduling_agent/tools/schemas.py`, `handlers.py` | JSON schemas, and thin handlers that call the API |
| Speech and model services | `agent/src/scheduling_agent/services/` | One factory each for STT, LLM and TTS |
| Turn-taking | `agent/src/scheduling_agent/pipeline/turn_taking.py` | VAD, Flux end of turn, LLM completion marker |
| Models | `.env` (`OPENAI_CALL_MODEL`, `OPENAI_SUMMARY_MODEL`) | Swap without code changes |
| Speech pronunciations | `agent/src/scheduling_agent/services/spoken_forms.py` | Text transforms before TTS, e.g. 911 → "nine one one" |

## Module layout

```
app/                     routes only: pages, server action, agent API handlers
lib/                     shared infrastructure: db, env, API auth, routing, formatting, OpenAI client
modules/
  patients/              identity lookup
  scheduling/            clinic hours, slots, availability, clinicians, appointments, booking
  calls/                 call lifecycle, transcript, intake answers, live call UI
  summaries/             post-call summary pipeline and review UI
components/              ui primitives, shared and layout components
agent/src/scheduling_agent/
  clinic_api/            HTTP client and typed calls to the web app
  conversation/          instructions, intake, outcomes, prompt, transcript
  tools/                 tool schemas and handlers
  services/              speech to text, language model, text to speech
  pipeline/              session wiring, turn-taking, cache metrics
```

The model only decides what to say and which tool to call. Every rule that must always hold (identity before booking, valid slot, no double booking, own appointments only) is enforced in code and in the database.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Voice pipeline | Pipecat 1.16 (Python, `uv`) | Streaming STT, LLM and TTS with turn-taking and interruptions |
| Transport | SmallWebRTC in the browser | Laptop demo, no phone integration needed |
| STT | Deepgram Flux | Lowest-latency streaming with built-in end-of-turn detection |
| LLM (call) | OpenAI GPT-6.1 Terra, low reasoning effort, Responses API over WebSocket | Followed the call flow reliably; Luna was faster but skipped steps |
| LLM (summary) | OpenAI GPT-6.1 Sol, structured output | Runs after the call, so quality over speed |
| TTS | Cartesia Sonic-3 | About 0.4 s to first audio |
| Web app | Next.js 16, React 19, shadcn/ui (Winter theme) | Scheduling desk, live transcript, call review |
| Data | PostgreSQL 17 + Drizzle ORM | Transactions and the unique index that prevents double booking |

## Measured in this build

- Time to first token: GPT-6.1 Terra about 1.3 s, Cartesia about 0.4 s.
- Prompt cache reads on every turn after the first.
- Scripted scenarios passing: new booking with intake, reschedule, emergency escalation, unknown caller.
- API checks: unauthenticated 401, booking before identity 403, double booking 409, outside hours 409, cancelling another patient's appointment 404.

## Production design

### Authentication and access
- Patients: caller ID plus date of birth, then a one-time code by SMS before any change to an appointment.
- Staff: SSO (OIDC) with role-based access; clinicians see their own schedule.
- Agent to API: replace the shared secret with short-lived tokens minted per call and scoped to that call and patient, over mTLS.

### Privacy, HIPAA and PHI
- Business associate agreements with every vendor that touches audio or text: OpenAI, Deepgram, Cartesia, the WebRTC or telephony provider, hosting.
- `store: false` on every OpenAI request; zero-retention settings at each vendor where offered.
- Minimum necessary: the model sees only the identified patient's own appointments, never other patients.
- Encryption in transit and at rest (KMS), audit log of every tool call and data access, retention policy for audio and transcripts.
- Debug logging of prompts is turned off in production; logs are redacted.

### Reliability
- Database constraints, not the model, prevent double booking; booking requests carry idempotency keys so retries are safe.
- Real scheduling via the EHR's FHIR `Slot` and `Appointment` APIs behind the same service interface, with timeouts and a circuit breaker.
- Fallback providers for STT, LLM and TTS; if the agent fails, offer a human transfer or a callback.
- Health checks and alerts on call failures, tool errors and latency.

### Scale: 1,000 clinicians, 1 million patients
- About 3 calls per patient per year is 3 million calls a year, roughly 8,000 a day. With 15 % in the peak hour and 4-minute calls, that is about 80 concurrent calls; plan capacity for 300.
- Agent workers are stateless, so they scale horizontally behind a WebRTC or SIP provider.
- Postgres with indexes on clinician and start time and on patient, read replicas for availability, and a queue for summaries.

### Latency
- Budget per turn: end of turn about 0.3 s, model first token about 1.3 s, speech first audio about 0.4 s, under 2 s in total.
- Levers: prompt caching (already on), incremental context over WebSocket (already on), a short spoken filler while tools run, same-region deployment, eager end-of-turn.

### Evaluations
- The scripted patient harness runs scenario suites: booking, reschedule, cancel, unknown caller, emergency, a request for medical advice, a prompt-injection attempt, noisy or accented audio.
- Deterministic checks on the resulting database state (right slot, right patient, no double booking), plus an LLM judge for tone and guardrails.
- Tracked: task success, correct tool calls, guardrail adherence, latency p50 and p95, transcription accuracy on names and dates. Runs in CI before any prompt or model change ships.

### Rollout
1. Internal staff test calls.
2. Shadow mode: the agent proposes, a scheduler confirms.
3. One clinic, after-hours only, with human handoff always available.
4. Gradual percentage rollout behind a feature flag, with a kill switch.

### Success metrics
- Share of calls fully handled without a human, and time to book.
- Booking errors (target zero) and emergency escalation recall (target 100 %).
- Abandonment rate, transfer rate, patient satisfaction, no-show rate.
- Latency p95 under 2.5 s and cost per call.

## Code rules

- No comments in code.
- One responsibility per file; no duplicated logic or UI.
- Each feature module owns its repository, service, schema and components; `lib/` holds only shared infrastructure.
- Database access only through repository files; environment access only through `lib/env.ts` and `agent/src/scheduling_agent/config.py`.

## Getting started

```bash
cp .env.example .env
sed -i '' "s/^AGENT_WEBHOOK_SECRET=.*/AGENT_WEBHOOK_SECRET=$(openssl rand -hex 32)/" .env
createdb voice_agent
bun install
bun run db:migrate
bun run db:seed
(cd agent && uv sync)
bun dev
bun run agent
```

Open http://localhost:3000, click **Call the clinic**, then **Connect agent**, and talk to Ava. Sample patients: Maria Lopez (March 14, 1958), James Carter (July 2, 1971), Aisha Rahman (November 21, 1990).
