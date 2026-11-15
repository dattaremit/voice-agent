import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">Patient Follow-Up</h1>
      <p className="max-w-xl text-muted-foreground">
        A voice agent calls patients after their visit, asks structured follow-up questions, and prepares a summary for the clinician.
      </p>
      <div className="flex gap-3">
        <Button size="lg">Start follow-up call</Button>
        <Button size="lg" variant="outline">View patients</Button>
      </div>
    </main>
  );
}
