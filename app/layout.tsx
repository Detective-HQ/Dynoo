import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dynoo — Wear the Legacy",
  description: "Dynoo makes everyday tees with a distinctive identity.",
  openGraph: {
    title: "Dynoo — Wear the Legacy",
    description: "Everyday wear. Distinctive identity.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
