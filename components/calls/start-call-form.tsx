import { PhoneCall } from "lucide-react";
import { startCall } from "@/app/actions/calls";
import { SubmitButton } from "@/components/shared/submit-button";

export function StartCallForm({ visitId }: { visitId: string }) {
  return (
    <form action={startCall.bind(null, visitId)}>
      <SubmitButton size="lg">
        <PhoneCall />
        Start follow-up call
      </SubmitButton>
    </form>
  );
}
