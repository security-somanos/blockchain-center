import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover upcoming blockchain and crypto events worldwide.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events | Blockchain Center",
    description: "Discover upcoming blockchain and crypto events worldwide.",
    url: "/events",
    images: [
      { url: "/banner.png", width: 1200, height: 630, alt: "Blockchain Center" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events | Blockchain Center",
    description: "Discover upcoming blockchain and crypto events worldwide.",
    images: ["/banner.png"],
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}



