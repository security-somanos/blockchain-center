import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/news";

export const runtime = "edge";

export async function GET() {
	try {
		const items = await fetchNews({ revalidate: 3600 });
		return NextResponse.json({ data: items }, { status: 200 });
	} catch {
		return NextResponse.json({ data: [] }, { status: 200 });
	}
}
