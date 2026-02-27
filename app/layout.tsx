import type { Metadata } from "next";
import { Poppins, Ballet, Instrument_Serif, Lora} from "next/font/google";

import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ballet = Ballet({
  variable: "--font-ballet",
  subsets: ["latin"],
  weight: ["400"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], //regular, medium, semibold, bold
});


export const metadata: Metadata = {
  title: "Steven Phan (@stevenphanny)",
  description: "Hi, I'm Steven Phan (@stevenphanny), a software engineer who strives to be just a little better every day. As of right now, I'm a project officer for the Monash Association of Coding (MAC).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} ${poppins.variable} ${ballet.variable} ${instrumentSerif.className} tracking-wider antialiased`}
      >
      {children}
      <Analytics />
      <SpeedInsights />
      </body>
    </html>
  );
}
