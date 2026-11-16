import { Suspense } from "react";
import { AppointmentTable } from "@/modules/scheduling/components/appointment-table";
import { APPOINTMENT_COLUMNS } from "@/modules/scheduling/components/appointment-columns";
import { RecentCalls } from "@/modules/calls/components/recent-calls";
import { StartCallForm } from "@/modules/calls/components/start-call-form";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeading } from "@/components/layout/page-heading";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { SectionHeading } from "@/components/shared/section-heading";
import { TableSkeleton } from "@/components/shared/table-skeleton";

export default function Home() {
  return (
    <PageContainer>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeading title="Scheduling desk" description="Patients call Ava to book, reschedule or cancel appointments." />
        <StartCallForm />
      </div>
      <section className="space-y-4">
        <SectionHeading title="Upcoming appointments" />
        <Suspense fallback={<TableSkeleton columns={APPOINTMENT_COLUMNS} />}>
          <AppointmentTable />
        </Suspense>
      </section>
      <section className="space-y-4">
        <SectionHeading title="Recent calls" />
        <Suspense fallback={<PageSkeleton />}>
          <RecentCalls />
        </Suspense>
      </section>
    </PageContainer>
  );
}
