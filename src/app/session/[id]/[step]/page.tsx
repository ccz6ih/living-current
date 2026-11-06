import { notFound } from "next/navigation";
import { SessionFlow } from "@/components/session-flow";
import { getClient } from "@/lib/demo-data";
import { flowSteps } from "@/lib/session-steps";

export const instant = false;

export default async function SessionStepPage({
  params,
}: {
  params: Promise<{ id: string; step: string }>;
}) {
  const { id, step } = await params;
  const client = getClient(id);
  if (!client || !flowSteps.some(({ id: stepId }) => stepId === step)) notFound();
  return <SessionFlow client={client} step={step} />;
}
