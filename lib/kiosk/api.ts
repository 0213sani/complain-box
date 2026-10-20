import type { Identity, ReplyData, WallState } from "./machine";
import { fallbackReplies, pick } from "../fallbackReplies";

const randPin = () => String(100000 + Math.floor(Math.random() * 900000));
const LOCAL_IDENTITY = { id: 1, title: "Registered Chai Enthusiast", dept: "Dept. of Pending Tasks", place: "Room 404, Block C" };

export async function fetchIdentity(): Promise<Identity> {
  try {
    const r = await fetch("/api/identity", { cache: "no-store" });
    if (!r.ok) throw new Error();
    return await r.json();
  } catch {
    return { ...LOCAL_IDENTITY, pin: randPin() };
  }
}

// Never rejects: after 8s or any error, a canned reply (not saved, so it can't be posted).
export async function sendComplaint(identity: Identity, complaint: string): Promise<ReplyData> {
  try {
    const r = await fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identityId: identity.id, pin: identity.pin, complaint }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error();
    return await r.json();
  } catch {
    return { complaintId: null, reply: pick(fallbackReplies.relative), voice: "relative" };
  }
}

export async function postToWall(complaintId: number | null): Promise<WallState> {
  if (complaintId == null) return "rejected";
  try {
    const r = await fetch("/api/wall/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complaintId }),
    });
    const { status } = await r.json();
    return status === "pending" || status === "approved" ? status : "rejected";
  } catch {
    return "rejected";
  }
}
