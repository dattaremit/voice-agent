import { PhoneCall } from "lucide-react";
import { startCall } from "@/app/actions/calls";
import { SubmitButton } from "@/components/shared/submit-button";

export function StartCallForm() {
  return (
    <form action={startCall}>
      <SubmitButton size="lg">
        <PhoneCall />
        Call the clinic
      </SubmitButton>
    </form>
  );
}
