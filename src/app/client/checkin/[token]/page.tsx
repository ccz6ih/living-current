import { ClientPortalForm } from "@/components/client-portal-form";

export const instant = false;

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ClientPortalForm mode="checkin" token={token} />;
}
