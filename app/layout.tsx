import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import StoreInitializer from "../components/StoreInitializer";
import ConditionalFooter from "@/components/ConditionalFooter";
import { schemaData } from "../seo/schemaDataSeo";
import { homePageMetadata } from "../seo/homeSeo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = homePageMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} 
        />
      </head>
      <body
        className={`w-full ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreInitializer />
        <Navbar/>
        {children}
        <ConditionalFooter/>
      </body>
    </html>
  );
}
