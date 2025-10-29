import type { Metadata } from "next";
import type { Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NoiseEffect from "../components/NoiseEffect";

const roobert = localFont({
  src: [
    {
      path: "../../public/fonts/roobert/RoobertTRIAL-Light-BF67243fd502239.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/roobert/RoobertTRIAL-Regular-BF67243fd53fdf2.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/roobert/RoobertTRIAL-SemiBold-BF67243fd54213d.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-roobert",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://599f9e4a1a4e.ngrok.app"),
  title: {
    default: "Blockchain Center",
    template: "%s | Blockchain Center",
  },
  description:
    "Blockchain Center connects governments, universities, and industry to accelerate responsible blockchain adoption worldwide.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Blockchain Center",
    title: "Blockchain Center",
    description:
      "Blockchain Center connects governments, universities, and industry to accelerate responsible blockchain adoption worldwide.",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Blockchain Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blockchain Center",
    description:
      "Blockchain Center connects governments, universities, and industry to accelerate responsible blockchain adoption worldwide.",
    images: ["/banner.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roobert.variable} antialiased`}
      >
        <NoiseEffect />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
