import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"About Blockchain Center: a neutral global framework connecting governments, academia, and industry to accelerate responsible blockchain adoption.",
	alternates: { canonical: "/about" },
	openGraph: {
		title: "About | Blockchain Center",
		description:
			"A global hub advancing blockchain innovation through standards, education, and collaboration.",
		url: "/about",
		images: [
			{ url: "/banner.png", width: 1200, height: 630, alt: "Blockchain Center" },
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "About | Blockchain Center",
		description:
			"A global hub advancing blockchain innovation through standards, education, and collaboration.",
		images: ["/banner.png"],
	},
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
	return children as React.ReactElement;
}
