import { NextResponse } from "next/server";
import { checkBlocklist } from "@/lib/blocklist";
import { moderate } from "@/lib/moderate";
import { claimForWall, getComplaint, setWallStatus } from "@/lib/repo";

export const dynamic = "force-dynamic";

async function passesPublic(text: string): Promise<boolean> {
  if (checkBlocklist(text, "public").blocked) return false;
  return (await moderate(text, "public")).safe;
}

export async function POST(req: Request) {
  const { complaintId } = await req.json().catch(() => ({}));
  const id = Number(complaintId);
  const c = Number.isInteger(id) ? getComplaint(id) : undefined;
  if (!c) return NextResponse.json({ status: "rejected" }, { status: 404 });

  // only the first request gets past this; repeats see the current status
  if (!claimForWall(id)) return NextResponse.json({ status: c.wall_status, duplicate: true });

  try {
    const [a, b] = await Promise.all([passesPublic(c.complaint_text), passesPublic(c.reply_text)]);
    const status = !(a && b) ? "rejected" : process.env.WALL_REQUIRES_APPROVAL === "false" ? "approved" : "pending";
    setWallStatus(id, status);
    return NextResponse.json({ status });
  } catch (e) {
    console.error("[wall/post]", e);
    setWallStatus(id, "rejected");
    return NextResponse.json({ status: "rejected" });
  }
}
