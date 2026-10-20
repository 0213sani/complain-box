import { STAGE } from "@/lib/kiosk/stage";

// Step 3 placeholder backdrop. Real street scene comes in step 4.
export default function PlaceholderScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-ochre to-terracotta" />
      <div className="absolute inset-x-0 bg-brick" style={{ top: 260, height: STAGE.ground - 260 }} />
      <div className="absolute inset-x-0 bottom-0 bg-ink" style={{ top: STAGE.ground }} />
    </>
  );
}
