import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { CSPostHogProvider } from "./providers";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Founders Inc. [Ship It]",
  description:
    "Ship It is a 4 week sprint from Feb 24th to March 21st out of Fort Mason, SF.",
  openGraph: {
    title: "Founders Inc. [Ship It]",
    description:
      "Ship It is a 4 week sprint from Feb 24th to March 21st out of Fort Mason, SF.",
    url: "https://shipit.f.inc",
    siteName: "Founders Inc. Ship It",
    images: [
      {
        url: "/og.png",
        width: 800,
        height: 600,
      },
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CSPostHogProvider>
        <body className={`${inter.variable} antialiased`}>{children}</body>
      </CSPostHogProvider>
    </html>
  );
}
