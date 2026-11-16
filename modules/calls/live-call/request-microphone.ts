export type MicAccess = "checking" | "prompt" | "granted" | "denied" | "missing";

const accessFromError = (error: unknown): MicAccess =>
  error instanceof DOMException && error.name === "NotFoundError" ? "missing" : "denied";

export async function requestMicrophone(): Promise<MicAccess> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return "granted";
  } catch (error) {
    return accessFromError(error);
  }
}

export async function readMicPermission(): Promise<MicAccess> {
  try {
    const status = await navigator.permissions.query({ name: "microphone" as PermissionName });
    return status.state;
  } catch {
    return "prompt";
  }
}
