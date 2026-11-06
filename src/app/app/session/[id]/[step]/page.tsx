"use client";

import { useParams } from "next/navigation";
import { useSessions, type Step } from "@/lib/store";
import { IntakeStep } from "@/components/session/IntakeStep";
import { PulseStep } from "@/components/session/PulseStep";
import { TongueStep } from "@/components/session/TongueStep";
import { ReadingStep } from "@/components/session/ReadingStep";
import { ProtocolStep } from "@/components/session/ProtocolStep";
import { PointsStep } from "@/components/session/PointsStep";
import { ReportStep } from "@/components/session/ReportStep";

export default function SessionStepPage() {
  const { id, step } = useParams<{ id: string; step: Step }>();
  const { getSession } = useSessions();
  const session = getSession(id);
  if (!session) return null;

  switch (step) {
    case "intake":
      return <IntakeStep session={session} />;
    case "pulse":
      return <PulseStep session={session} />;
    case "tongue":
      return <TongueStep session={session} />;
    case "reading":
      return <ReadingStep session={session} kind="opening" />;
    case "protocol":
      return <ProtocolStep session={session} />;
    case "points":
      return <PointsStep session={session} />;
    case "closing":
      return <ReadingStep session={session} kind="closing" />;
    case "report":
      return <ReportStep session={session} />;
    default:
      return <div className="p-8">Unknown step.</div>;
  }
}
