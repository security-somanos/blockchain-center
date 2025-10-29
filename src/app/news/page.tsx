"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Newspaper, Clock, ExternalLink } from "lucide-react";
import type { NormalizedNewsItem } from "@/lib/news";

export default function NewsPage() {
	const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
	const [items, setItems] = React.useState<NormalizedNewsItem[]>([]);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		let cancelled = false;
		(async () => {
			setIsLoading(true);
			try {
				const res = await fetch("/api/news", { headers: { accept: "application/json" } });
				const json = await res.json().catch(() => ({ data: [] }));
				if (!cancelled) {
					setItems(Array.isArray(json?.data) ? json.data : []);
				}
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const categories = React.useMemo(() => {
		const present = Array.from(new Set(items.map((n) => n.category).filter(Boolean)));
		return ["all", ...present];
	}, [items]);

	const filtered = selectedCategory === "all" ? items : items.filter((i) => i.category === selectedCategory);

	return (
		<div className="space-y-6 px-6 sm:px-12 my-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="relative"
			>
				<div className="relative rounded-2xl border border-white/10 bg-[#090909] backdrop-blur">
					<div className="p-6">
						<div className="text-white text-xl font-bold flex items-center gap-2">
							<Newspaper className="w-6 h-6" />
							<span>Crypto News & Analysis</span>
						</div>
						<div className="flex flex-wrap gap-2 mt-4">
							{categories.map((category) => (
								<button
									key={category}
									onClick={() => setSelectedCategory(category)}
									className={
										"px-4 py-2 rounded-xl font-medium transition-all duration-300 border cursor-pointer " +
										(selectedCategory === category
											? "bg-white/15 text-white border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.35)]"
											: "text-white/70 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]")
									}
								>
									{category.charAt(0).toUpperCase() + category.slice(1)}
								</button>
							))}
						</div>
					</div>
				</div>
			</motion.div>

			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{Array.from({ length: 8 }).map((_, idx) => (
						<div key={idx} className="relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
							<div className="w-full h-48 bg-white/10 animate-pulse" />
							<div className="p-6 space-y-3">
								<div className="h-5 w-3/4 bg-white/10 animate-pulse rounded" />
								<div className="h-4 w-full bg-white/10 animate-pulse rounded" />
								<div className="h-4 w-5/6 bg-white/10 animate-pulse rounded" />
								<div className="flex items-center justify-between pt-1">
									<div className="h-4 w-40 bg-white/10 animate-pulse rounded" />
									<div className="h-4 w-4 bg-white/10 animate-pulse rounded" />
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{filtered.map((news, index) => {
						const time = news.pubDate ? new Date(news.pubDate).toLocaleString() : "";
						return (
							<motion.div
								key={news.id + "-" + index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.05 }}
								className="relative group"
							>
								<Link href={`/news/${encodeURIComponent(news.slug)}`} className="block">
									<div className="relative rounded-2xl border border-white/10 bg-[#090909] hover:border-white/60 transition-all duration-300 overflow-hidden">
										<div className="relative">
											<img
												src={news.image || "/blockchain-center-logo.svg"}
												alt={news.title}
												className="w-full h-48 object-cover"
											/>
											<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
											<span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-white/15 text-xs text-white px-2 py-1 border border-white/20">
												{news.category}
											</span>
										</div>

										<div className="p-6">
											<h3 className="text-white font-bold text-lg mb-3">{news.title}</h3>
											{news.description && (
												<p className="text-white/70 text-sm mb-4">{news.description}</p>
											)}
											<div className="flex items-center justify-between text-white/70 text-sm">
												<div className="flex items-center gap-2">
													<Clock className="w-4 h-4" />
													<span>{time}</span>
												</div>
												{news.link ? (
													<a
														href={news.link}
														target="_blank"
														rel="noopener noreferrer"
														onClick={(e) => e.stopPropagation()}
														title="Open source"
														className="text-white/50 hover:text-white"
													>
														<ExternalLink className="w-4 h-4" />
													</a>
												) : (
													<ExternalLink className="w-4 h-4 text-white/40" />
												)}
											</div>
										</div>
									</div>
								</Link>
							</motion.div>
						);
					})}
				</div>
			)}
		</div>
	);
}
