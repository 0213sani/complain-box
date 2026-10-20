import { memo } from "react";
import Backdrop from "./Backdrop";
import PostOffice from "./PostOffice";
import { Bananas, Canopy } from "./Foliage";
import { Bench, FruitStall, Sacks, Wires } from "./Props";
import { LOOKS, SeatedReader, Standing } from "./People";
import Ground from "./Ground";
import Atmosphere from "./Atmosphere";

// Static street, 1600x1000, back to front. The post box and postman are drawn on top by Kiosk.
function StreetScene() {
  return (
    <svg viewBox="0 0 1600 1000" width={1600} height={1000} className="absolute inset-0" aria-hidden>
      <Backdrop />
      <Bananas />
      <PostOffice />
      <Wires />
      <Canopy />
      <Ground />
      <Standing x={110} y={812} s={0.92} look={LOOKS.cream} />
      <FruitStall />
      <Sacks x={1150} y={820} />
      <Bench x={1290} y={770} w={230} />
      <SeatedReader x={1350} y={770} s={0.95} look={LOOKS.white} />
      <Standing x={1545} y={830} s={1} look={LOOKS.rust} />
      <Atmosphere />
    </svg>
  );
}

export default memo(StreetScene);
