import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "News",
	description: "Latest crypto and blockchain news and analysis curated by Blockchain Center.",
	alternates: { canonical: "/news" },
	openGraph: {
		title: "News | Blockchain Center",
		description: "Latest crypto and blockchain news and analysis.",
		url: "/news",
		images: [
			{ url: "/banner.png", width: 1200, height: 630, alt: "Blockchain Center" },
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "News | Blockchain Center",
		description: "Latest crypto and blockchain news and analysis.",
		images: ["/banner.png"],
	},
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
	return children as React.ReactElement;
}
