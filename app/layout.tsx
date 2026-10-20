import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taqneeq Post",
  description: "Drop your shikayat here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontVars} antialiased`}>{children}</body>
    </html>
  );
}
