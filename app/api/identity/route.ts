import { NextResponse } from "next/server";
import { randomIdentity } from "@/lib/repo";

export const dynamic = "force-dynamic";

export function GET() {
  const identity = randomIdentity();
  if (!identity) return NextResponse.json({ error: "no identities, run npm run db:seed" }, { status: 500 });
  const pin = String(100000 + Math.floor(Math.random() * 900000));
  return NextResponse.json({ ...identity, pin });
}
