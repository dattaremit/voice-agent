import { getCall } from "@/lib/repositories/calls";

export const isCallInProgress = async (callId: string) => (await getCall(callId))?.status === "in_progress";
