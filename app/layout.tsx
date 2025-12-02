import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import StoreInitializer from "../components/StoreInitializer";
import Footer from "@/components/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://imdhardware.com"),
  title: "IMD Hardware - Your Trusted Hardware Partner",
  description: "IMD Hardware offers top-quality hardware solutions for all your needs. Shop now for the best deals.",
  applicationName: "IMD Hardware",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
    apple: "/logo.jpeg",
    other: [
      { rel: "mask-icon", url: "/logo.jpeg" },
    ],
  },
  other: {
    "msapplication-TileImage": "/logo.jpeg",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-tooltip": "IMD Hardware",
    "msapplication-starturl": "/",
  },
  openGraph: {
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://imdhardware.com",
    siteName: "IMD Hardware",
    title: "IMD Hardware - Your Trusted Hardware Partner",
    description: "IMD Hardware offers top-quality hardware solutions for all your needs. Shop now for the best deals.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://imdhardware.com"}/logo.jpeg`,
        width: 800,
        height: 600,
        alt: "IMD Hardware Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IMD Hardware - Your Trusted Hardware Partner",
    description: "IMD Hardware offers top-quality hardware solutions for all your needs. Shop now for the best deals.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://imdhardware.com"}/logo.jpeg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`w-full ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreInitializer />
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
