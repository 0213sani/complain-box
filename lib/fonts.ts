import { Rozha_One, Kalam, Hind } from "next/font/google";

// all three include Devanagari glyphs
const rozha = Rozha_One({ weight: "400", subsets: ["latin", "devanagari"], variable: "--font-rozha" });
const kalam = Kalam({ weight: ["400", "700"], subsets: ["latin", "devanagari"], variable: "--font-kalam" });
const hind = Hind({ weight: ["400", "600"], subsets: ["latin", "devanagari"], variable: "--font-hind" });

export const fontVars = `${rozha.variable} ${kalam.variable} ${hind.variable}`;
