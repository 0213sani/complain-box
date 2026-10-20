import "./env";
import { checkBlocklist } from "../lib/blocklist";
import { moderate } from "../lib/moderate";
import { cases } from "./moderation-cases";

async function main() {
  let fails = 0, warns = 0, modDown = 0;
  for (const { text, expect } of cases) {
    const l1 = checkBlocklist(text, "public");
    const l2 = await moderate(text, "public", 15000);
    if (!l2.ok) modDown++;
    const blocked = l1.blocked || !l2.safe;
    let mark = "ok  ";
    if (expect === "block" && !blocked) (mark = "FAIL"), fails++;
    if (expect === "pass" && l1.blocked) (mark = "FAIL"), fails++; // blocklist false positive
    else if (expect === "pass" && !l2.safe) (mark = "warn"), warns++; // model false positive
    const why = [l1.blocked ? `L1 ${l1.reason}` : "", !l2.safe ? `L2 ${l2.reason}` : ""].filter(Boolean).join("; ");
    console.log(`${mark} [${expect}] ${text}${why ? `  -> ${why}` : ""}`);
  }
  console.log(`\n${cases.length} cases, ${fails} fail, ${warns} warn (model blocked a normal complaint).`);
  if (modDown) console.log(`Model unreachable for ${modDown} cases: layer 2 failed closed.`);
  process.exit(fails ? 1 : 0);
}
main();
