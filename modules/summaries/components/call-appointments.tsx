import { BulletList } from "@/components/shared/bullet-list";
import { SectionCard } from "@/components/shared/section-card";
import { listAppointmentsForCall } from "@/modules/scheduling/appointment-repository";
import { clinicLabel } from "@/modules/scheduling/zoned-time";

export async function CallAppointments({ callId }: { callId: string }) {
  const appointments = await listAppointmentsForCall(callId);
  return (
    <SectionCard title="Appointments from this call">
      <BulletList
        items={appointments.map(
          (item) => `${clinicLabel(item.startsAt)} with ${item.clinicianName} for ${item.reason} (${item.status})`,
        )}
        empty="No appointment was booked on this call."
      />
    </SectionCard>
  );
}
