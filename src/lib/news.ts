export type NormalizedNewsItem = {
	id: string;
	title: string;
	link: string;
	pubDate?: string;
	description?: string;
	content?: string;
	category: string;
	source: string;
	image?: string;
	slug: string;
};

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function pickString(...candidates: unknown[]): string {
	for (const candidate of candidates) {
		if (isNonEmptyString(candidate)) return candidate.trim();
		if (candidate && typeof candidate === "object" && isNonEmptyString((candidate as any).__cdata)) {
			return (candidate as any).__cdata.trim();
		}
	}
	return "";
}

function extractHostname(url: string): string {
	try {
		return new URL(url).hostname;
	} catch {
		return "markets.cryptos.com";
	}
}

export function slugify(input: string): string {
	const base = (input || "").toLowerCase()
		.replace(/&/g, "-and-")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return base || "news-item";
}

export function normalizeNewsItems(items: unknown[]): NormalizedNewsItem[] {
	return (Array.isArray(items) ? items : []).map((raw, index) => {
		const it = raw as Record<string, unknown>;
		const id = pickString(
			it.id,
			it.guid,
			it.uuid,
			it._id,
			it.url,
			it.link,
			String(index)
		);

		const title = pickString(it.title, (it as any).headline, (it as any).name) || "Untitled";
		const link = pickString(it.link, (it as any).url, (it as any).permalink);
		const pubDate = pickString(
			(it as any).pubDate,
			(it as any).published_at,
			(it as any).date,
			(it as any).created_at
		);
		const description = pickString(
			(it as any).description,
			(it as any).summary,
			(it as any).excerpt
		);
		const content = pickString(
			(it as any).content,
			(it as any).body,
			(it as any).full_text,
			(it as any).text,
			description
		);
		const image = pickString(
			(it as any).image,
			(it as any).image_url,
			(it as any).thumbnail,
			(it as any).imageUrl,
			(it as any).coverImage
		);
		const category = ((): string => {
			const c = pickString(
				(it as any).category,
				Array.isArray((it as any).categories) ? (it as any).categories[0] : undefined
			);
			return c ? c.toLowerCase() : "other";
		})();
		const source = pickString((it as any).source, extractHostname(link));
		const slug = slugify(title);

		return { id, title, link, pubDate, description, content, category, source, image, slug };
	});
}

function firstArrayLike(obj: any): unknown[] {
	if (!obj || typeof obj !== "object") return [];
	for (const key of Object.keys(obj)) {
		const val = (obj as any)[key];
		if (Array.isArray(val)) return val;
	}
	return [];
}

export async function fetchNews(options?: { revalidate?: number }): Promise<NormalizedNewsItem[]> {
	const revalidate = options?.revalidate ?? 3600;
	const res = await fetch("https://markets.cryptos.com/api/news", {
		headers: { accept: "application/json" },
		next: { revalidate },
	});
	if (!res.ok) {
		return [];
	}
	let json: any;
	try {
		json = await res.json();
	} catch {
		return [];
	}
	const items = Array.isArray(json?.data)
		? json.data
		: Array.isArray(json?.news)
			? json.news
			: Array.isArray(json?.items)
				? json.items
				: Array.isArray(json?.results)
					? json.results
					: firstArrayLike(json);
	return normalizeNewsItems(items);
}
