import { NextResponse } from "next/server";
import { normalizeFromCoinMarketCal } from "@/lib/events";

// Force dynamic at request time; never cache secrets
export const dynamic = "force-dynamic";

const BASE_URL = "https://developers.coinmarketcal.com/v1/events";

const ALLOWED_PARAMS = new Set([
  "page",
  "max",
  "dateRangeStart",
  "dateRangeEnd",
  "coins",
  "categories",
  "sortBy",
  "showOnly",
  "showViews",
  "showVotes",
  "translations",
]);

function buildQueryString(url: URL): string {
  const out = new URLSearchParams();
  for (const [k, v] of url.searchParams.entries()) {
    if (!ALLOWED_PARAMS.has(k)) continue;
    if (typeof v === "string" && v.length > 0) out.set(k, v);
  }
  if (!out.has("page")) out.set("page", "1");
  if (!out.has("max")) out.set("max", "16");
  if (!out.has("translations")) out.set("translations", "en");
  return out.toString();
}

export async function GET(request: Request) {
  const apiKey = process.env.COIN_MARKET_CAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server not configured with CoinMarketCal API key" },
      { status: 500 }
    );
  }

  const incoming = new URL(request.url);
  const qs = buildQueryString(incoming);
  const upstreamUrl = `${BASE_URL}?${qs}`;

  try {
    const res = await fetch(upstreamUrl, {
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
      // Always fetch fresh data
      cache: "no-store",
    });

    const json: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: json?.status?.error_message || "Failed to fetch events" },
        { status: res.status }
      );
    }

    const events = Array.isArray(json)
      ? json
      : Array.isArray(json?.body)
        ? json.body
        : Array.isArray(json?.events)
          ? json.events
          : Array.isArray(json?.data)
            ? json.data
            : [];

    const normalized = normalizeFromCoinMarketCal(events);

    return NextResponse.json({
      data: normalized,
      meta: json?._metadata ?? null,
      status: json?.status ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}


