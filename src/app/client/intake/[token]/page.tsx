import { ClientPortalForm } from "@/components/client-portal-form";

export const instant = false;

export default async function IntakePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ClientPortalForm mode="intake" token={token} />;
}
