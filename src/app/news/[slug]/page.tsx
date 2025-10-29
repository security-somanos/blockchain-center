import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ExternalLink } from "lucide-react";
import { fetchNews, slugify, type NormalizedNewsItem } from "@/lib/news";

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

async function getArticle(slug: string): Promise<NormalizedNewsItem | null> {
	const items = await fetchNews({ revalidate });
	const decoded = decodeURIComponent(slug);
	return items.find((it) => it.slug === decoded) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const article = await getArticle(slug);
	if (!article) {
		return { title: "News | Blockchain Center" };
	}
	return {
		title: article.title,
		description: article.description || article.content?.slice(0, 160),
		openGraph: {
			title: article.title,
			description: article.description || undefined,
			images: article.image ? [article.image] : undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: article.title,
			description: article.description || undefined,
			images: article.image ? [article.image] : undefined,
		},
	};
}

export default async function NewsArticlePage({ params }: PageProps) {
	const { slug } = await params;
	const article = await getArticle(slug);
	if (!article) {
		return (
			<div className="px-6 sm:px-12 py-10">
				<div className="rounded-2xl border border-white/10 bg-white/5 p-8">
					<h1 className="text-2xl font-semibold">Article not found</h1>
					<p className="text-white/70 mt-2">The article may have been removed or is temporarily unavailable.</p>
					<div className="mt-6">
						<Link href="/news" className="inline-block rounded-xl border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/10">Back to News</Link>
					</div>
				</div>
			</div>
		);
	}

	const time = article.pubDate ? new Date(article.pubDate).toLocaleString() : "";

	return (
		<div className="space-y-6 px-6 sm:px-12 py-6">
			<div className="flex items-center gap-4 text-white/80">
				<Link href="/news" className="rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/10">Back</Link>
				<div className="flex items-center gap-2 text-sm">
					<Clock className="w-4 h-4" />
					<span>{time}</span>
					<span>•</span>
					<span>{article.source}</span>
				</div>
			</div>

			<div className="relative max-w-5xl mx-auto">
				<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
					{article.image && (
						<div className="relative">
							<img src={article.image} alt={article.title} className="w-full h-80 object-cover" />
							<div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
						</div>
					)}
					<div className="p-8">
						<h1 className="text-3xl font-bold text-white mb-4 leading-tight">{article.title}</h1>
						{article.content ? (
							<div
								className="prose prose-invert max-w-none [&>p]:mb-3 [&>hr]:border-white/15 [&>hr]:mb-3"
								dangerouslySetInnerHTML={{ __html: article.content }}
							/>
						) : (
							<p className="text-white/80">{article.description}</p>
						)}
						{article.link && (
							<div className="mt-6">
								<a
									href={article.link}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 text-white/80 hover:text-white"
								>
									<ExternalLink className="w-4 h-4" />
									<span>Open original</span>
								</a>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
