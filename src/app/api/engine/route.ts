import { z } from "zod";
import { buildProtocol, deriveElementGaps } from "@/lib/protocol";

const requestSchema = z.object({
  earth: z.number().min(0).max(4),
  wood: z.number().min(0).max(4),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: "Earth and Wood ratings must be numbers from 0 to 4." },
      { status: 400 },
    );
  }

  const gaps = deriveElementGaps(parsed.data);
  return Response.json({ gaps, protocol: buildProtocol(gaps) });
}
