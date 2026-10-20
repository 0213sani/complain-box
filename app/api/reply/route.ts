import { NextResponse } from "next/server";
import { generateReply } from "@/lib/reply";
import { identityExists, insertComplaint } from "@/lib/repo";
import { fallbackReplies, pick } from "@/lib/fallbackReplies";

export const dynamic = "force-dynamic";
const MAX_LEN = 160;

export async function POST(req: Request) {
  let body: { identityId?: unknown; pin?: unknown; complaint?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const identityId = Number(body.identityId);
  const pin = String(body.pin ?? "");
  const complaint = String(body.complaint ?? "").trim().slice(0, MAX_LEN);
  if (!complaint || !/^\d{6}$/.test(pin) || !Number.isInteger(identityId) || !identityExists(identityId)) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  try {
    const r = await generateReply(complaint);
    const complaintId = insertComplaint({ identityId, pin, complaint, reply: r.reply, voice: r.voice });
    return NextResponse.json({ complaintId, reply: r.reply, voice: r.voice, source: r.source });
  } catch (e) {
    // the kiosk never shows an error: canned reply, not saved (so it cannot be posted)
    console.error("[reply]", e);
    return NextResponse.json({ complaintId: null, reply: pick(fallbackReplies.relative), voice: "relative", source: "fallback" });
  }
}
