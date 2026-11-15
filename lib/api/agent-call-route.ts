import { idSchema } from "@/lib/schemas/id";
import { isAgentRequest } from "./agent-auth";
import { errorResponse } from "./responses";

type AgentCallHandler = (callId: string, request: Request) => Promise<Response>;

export const agentCallRoute =
  (handler: AgentCallHandler) =>
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    if (!isAgentRequest(request)) return errorResponse(401, "Unauthorized");
    const id = idSchema.safeParse((await params).id);
    if (!id.success) return errorResponse(404, "Call not found");
    return handler(id.data, request);
  };
