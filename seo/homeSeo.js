export const homePageMetadata = {
  title: "IMD Hardware | Hardware Manufacturer & Supplier",
  template: "%s | IMD Hardware",
  description:
    "IMD Hardware is a leading hardware manufacturer and supplier specializing in locks, door handles, screws, bolts, basket stoppers, and high-quality hardware products.",
  keywords:
    "IMD Hardware, hardware manufacturer, hardware supplier, locks manufacturer, door handles, screws, bolts, basket stopper, hardware exporter",

  metadataBase: new URL("https://imdhardware.com"),
  icons: {
    icon: "/images/logo.jpeg",
    shortcut: "/images/logo.jpeg",
    apple: "/images/logo.jpeg",
  },
  alternates: {
    canonical: "https://imdhardware.com",
    languages: {
      "en-US": "https://imdhardware.com",
    },
  },

  openGraph: {
    title: "IMD Hardware – Premium Hardware Manufacturer & Supplier",
    description:
      "Manufacturer of locks, door handles, screws, bolts, and premium hardware products. Trusted hardware supplier and exporter.",
    url: "https://imdhardware.com",
    siteName: "IMD Hardware",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IMD Hardware – Premium Hardware Manufacturer",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "IMD Hardware | Hardware Manufacturer & Supplier",
    description:
      "Top-quality locks, handles, screws, bolts, and hardware components manufactured by IMD Hardware.",
    creator: "@imdhardware",
    images: ["/og-image.png"],
  },
};
