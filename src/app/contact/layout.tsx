import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact",
	description: "Get in touch with Blockchain Center for partnerships, programs, and inquiries.",
	alternates: { canonical: "/contact" },
	openGraph: {
		title: "Contact | Blockchain Center",
		description: "Get in touch with Blockchain Center.",
		url: "/contact",
		images: [
			{ url: "/banner.png", width: 1200, height: 630, alt: "Blockchain Center" },
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact | Blockchain Center",
		description: "Get in touch with Blockchain Center.",
		images: ["/banner.png"],
	},
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
	return children as React.ReactElement;
}
