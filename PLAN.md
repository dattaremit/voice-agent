# Patient Follow-Up Voice Agent — Plan

The agent calls a patient after a visit, asks a fixed set of follow-up questions, and writes a summary for the clinician.

## Stack

| Layer | Choice |
|---|---|
| Web app | Next.js 16 (App Router, Server Actions), React 19, TypeScript, Bun |
| UI | shadcn/ui + Tailwind v4, custom **Winter** theme, fully rounded buttons |
| Database | PostgreSQL 17 (local Homebrew) + **Drizzle ORM** + `postgres` driver |
| Validation | Zod (shared schemas for forms, API and the summary) |
| Voice agent | Python 3.13 + **Pipecat 1.2**, managed with `uv` |
| Transport | Pipecat SmallWebRTC (browser mic, no extra key); Twilio phone calls later |
| Turn detection | Deepgram Flux end-of-turn + LLM turn-completion marker (● / ◐ / ○) + Silero VAD for barge-in |
| STT / LLM / TTS | Deepgram Flux / OpenAI GPT-6.1 Terra at low reasoning effort (Responses API over WebSocket) / Cartesia Sonic-3 |
| Summary | OpenAI GPT-6.1 Sol, structured output validated with Zod |
| Auth | None for now |

Drizzle over Prisma: no codegen step, no engine binary, SQL-first schema in TypeScript, fast cold starts.

## Repository layout

```
voice-agent/
├─ app/                         Next.js routes (pages + route handlers only)
│  ├─ page.tsx                  Dashboard: patients and recent calls
│  ├─ visits/[id]/page.tsx      Visit detail + "Start follow-up call"
│  ├─ calls/[id]/page.tsx       Live call screen, then clinician summary
│  └─ api/calls/[id]/complete/route.ts   Webhook from the agent
├─ components/
│  ├─ ui/                       shadcn primitives (generated, single source)
│  └─ <feature>/                One component per file, composed from ui/
├─ lib/
│  ├─ db/{client,schema}.ts
│  ├─ env.ts                    Zod-validated env, imported everywhere
│  ├─ repositories/             One file per table: all queries live here
│  ├─ services/                 Business logic (summary generation, triage)
│  └─ schemas/                  Zod schemas shared by UI, API and services
├─ agent/                       Python Pipecat service
│  ├─ main.py                   HTTP + WebRTC entrypoint
│  ├─ pipeline.py               Builds the Pipecat pipeline
│  ├─ questions.py              The follow-up question flow
│  ├─ red_flags.py              Escalation detection
│  └─ reporter.py               Sends transcript + answers to the web app
├─ drizzle/                     Generated migrations
└─ .env.example
```

## Data model

- **patients**: id, name, dateOfBirth, phone, createdAt
- **visits**: id, patientId, visitDate, reason, clinicianName, notes
- **calls**: id, visitId, status (`scheduled | in_progress | completed | failed`), startedAt, endedAt
- **call_turns**: id, callId, role (`agent | patient`), text, createdAt
- **call_answers**: id, callId, questionKey, value (jsonb)
- **call_summaries**: id, callId, triageLevel (`routine | follow_up | urgent`), summary, symptoms (jsonb), medicationAdherence, redFlags (jsonb), actions (jsonb), createdAt

## Call flow

1. Clinician opens a patient visit and clicks **Start follow-up call**. A Server Action creates a `calls` row.
2. The browser connects to the agent over WebRTC, passing `callId`; the agent loads the patient context (see below).
3. The agent verifies identity (name + date of birth), then works through the questions:
   overall feeling → pain 0–10 → medications taken / side effects → visit-specific symptoms → red-flag check → questions for the clinician.
4. Each answer is recorded through a tool call (`record_answer(key, value)`), so no question is skipped.
5. A red flag (chest pain, heavy bleeding, high fever, breathing trouble, self-harm) stops the script. The agent gives emergency instructions and marks the call urgent.
6. When the call ends, the agent posts the transcript and answers to `/api/calls/[id]/complete` (signed with `AGENT_WEBHOOK_SECRET`).
7. The web app generates the summary with Sonnet 5.5, validates it with Zod, stores it, and the call page shows the clinician view.

## Patient memory and prompt caching

Two separate mechanisms, each doing one job.

**Memory across calls (Postgres).**
- Every call stores its transcript, answers and summary.
- At call start the agent calls `POST /api/calls/[id]/start` (bearer `AGENT_WEBHOOK_SECRET`): the call moves to `in_progress` and the response carries the visit, the patient, and the last 3 call summaries (triage, pain and symptoms, medication adherence, red flags).
- That context is injected into the system prompt, so the agent opens with continuity ("Last week your pain was 6/10, how is it today?").
- Summaries are injected, never raw transcripts: smaller prompts, less exposed PHI, better focus.

**Speed and cost within a call (OpenAI prompt caching).**
- The cache is short-lived, so it does not replace memory; it makes every turn of a live call cheaper and faster to first token.
- OpenAI caches the longest matching prompt prefix automatically, and the WebSocket Responses session sends only the new turn via `previous_response_id` with `store=false`.
- Prompt order is fixed from most to least stable:
  1. Static instructions + question flow + tool definitions
  2. Patient context block (stable for the whole call)
  3. Conversation so far
  4. Latest patient utterance
- Nothing volatile (timestamps, ids) goes into the stable prefix; the call date lives in the patient context block, written once.
- The agent logs `cache_read_input_tokens` per turn; zero reads after turn 2 is treated as a bug.

## Winter theme

- Light: frost-white background, glacier-blue primary, slate text, pale ice cards.
- Dark: polar-night navy background, aurora-teal accent, soft snow foreground.
- Defined once as CSS variables in `app/globals.css`; components only use tokens.
- `Button` base class uses `rounded-full`; inputs and cards use the shared `--radius`.

## Code rules

- No comments in code.
- Single responsibility: one component, hook, repository or service per file, each doing one thing.
- No duplication: shared UI goes in `components/ui` or a feature component, shared logic in `lib/`, shared types come from Zod schemas.
- Database access only through `lib/repositories`.
- Env access only through `lib/env.ts` (web) and `agent/config.py` (agent).

## Milestones

1. **Foundation**: shadcn init, Winter theme, Postgres, Drizzle schema + migrations, seed script, env validation.
2. **Dashboard**: visits list, visit detail, call history, start-call Server Action.
3. **Voice agent**: Pipecat pipeline (VAD + Flux turn detection + LLM completion marker + OpenAI + Cartesia), browser connect, live transcript, call context endpoint, prompt caching with cache-hit logging.
4. **Question flow**: tool-based answer capture, identity check, red-flag escalation.
5. **Summary**: completion webhook, Sonnet summary, clinician summary page with triage badge and previous-calls comparison.
6. **Polish**: barge-in tuning, error/empty states, call retry, optional Twilio outbound.

## Getting started

```bash
cp .env.example .env
sed -i '' "s/^AGENT_WEBHOOK_SECRET=.*/AGENT_WEBHOOK_SECRET=$(openssl rand -hex 32)/" .env
createdb voice_agent
bun install
bun run db:migrate
bun run db:seed
bun dev

bun run agent
```
