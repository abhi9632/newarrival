import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { ConsoleEasterEgg } from "@/components/ConsoleEasterEgg";
import "./globals.css";

const displayFace = Space_Grotesk({
  variable: "--font-display-face",
  subsets: ["latin"],
});

const bodyFace = IBM_Plex_Sans({
  variable: "--font-body-face",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "NewArrival",
  description:
    "A live model of your legal status in Australia. Four facts in, a dated and sourced obligation timeline out.",
};

export const viewport: Viewport = {
  themeColor: "#f6f3ec", // matches --color-bg
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFace.variable} ${bodyFace.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ConsoleEasterEgg />
      </body>
    </html>
  );
}
