import type { DeviceErrorType } from "@pipecat-ai/client-js";

const messages: Partial<Record<DeviceErrorType, string>> = {
  "not-found": "No microphone found. Connect a headset or choose an input in System Settings → Sound, then reload and try again.",
  permissions: "Microphone access is blocked. Allow it in the browser's site settings, then reload and try again.",
  "in-use": "Another app is using the microphone. Close it, then reload and try again.",
};

export const micErrorMessage = (type: DeviceErrorType) =>
  messages[type] ?? "The microphone could not be started. Check your input device and try again.";
