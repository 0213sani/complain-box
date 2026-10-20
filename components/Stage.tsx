"use client";
import { useEffect, useState } from "react";
import { STAGE } from "@/lib/kiosk/stage";

// Fixed 1600x1000 stage scaled to fit the window, letterboxed.
export default function Stage({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE.w, window.innerHeight / STAGE.h));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-clip bg-maroon">
      <div
        className="relative shrink-0 overflow-clip"
        style={{ width: STAGE.w, height: STAGE.h, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {children}
      </div>
    </div>
  );
}
