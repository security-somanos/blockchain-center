export type EventItem = {
  id: string;
  title: string;
  organizer?: string;
  eventsCount?: number;
  subscribers?: number;
  city: string;
  country: string;
  venue?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  month: string; // lowercased english month name e.g. "october"
  image?: string;
  slug: string;
  isLive?: boolean;
};

export type EventsByMonth = Record<string, EventItem[]>;

function slugify(input: string): string {
  const base = (input || "")
    .toLowerCase()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "event";
}

function toId(prefix: string, index: number): string {
  return `${prefix}-${index}`;
}

export function getSampleEvents(): EventsByMonth {
  const items: EventItem[] = [
    {
      id: toId("money2020", 1),
      title: "Money20/20",
      organizer: "Money20/20",
      eventsCount: 1,
      subscribers: 406,
      city: "Las Vegas",
      country: "United States",
      startDate: "2025-10-26",
      endDate: "2025-10-29",
      month: "october",
      image: "/blockchain-center-logo.svg",
      slug: slugify("Money20/20 2025"),
    },
    {
      id: toId("blockchain-life", 1),
      title: "Blockchain Life",
      organizer: "Blockchain Life",
      eventsCount: 3,
      subscribers: 352,
      city: "Dubai",
      country: "United Arab Emirates",
      startDate: "2025-10-28",
      endDate: "2025-10-29",
      month: "october",
      image: "/blockchain-center-logo.svg",
      slug: slugify("Blockchain Life Dubai 2025"),
    },
    {
      id: toId("bf-conference", 1),
      title: "Blockchain Futurist Conference",
      organizer: "Untraceable",
      city: "Miami",
      country: "United States",
      startDate: "2025-11-05",
      endDate: "2025-11-06",
      month: "november",
      image: "/blockchain-center-logo.svg",
      slug: slugify("Blockchain Futurist Conference Miami 2025"),
    },
    {
      id: toId("web-summit", 1),
      title: "Web Summit",
      organizer: "Web Summit",
      eventsCount: 60,
      subscribers: 771,
      city: "Lisbon",
      country: "Portugal",
      startDate: "2025-11-10",
      endDate: "2025-11-13",
      month: "november",
      image: "/blockchain-center-logo.svg",
      slug: slugify("Web Summit 2025"),
    },
    {
      id: toId("adopting-bitcoin", 1),
      title: "Adopting Bitcoin",
      organizer: "Adopting Bitcoin",
      city: "San Salvador",
      country: "El Salvador",
      startDate: "2025-11-14",
      endDate: "2025-11-15",
      month: "november",
      image: "/blockchain-center-logo.svg",
      slug: slugify("Adopting Bitcoin 2025"),
    },
    {
      id: toId("devconnect", 1),
      title: "Devconnect",
      organizer: "Ethereum Foundation",
      eventsCount: 158,
      subscribers: 990,
      city: "Buenos Aires",
      country: "Argentina",
      startDate: "2025-11-17",
      endDate: "2025-11-22",
      month: "november",
      image: "/blockchain-center-logo.svg",
      slug: slugify("Devconnect Buenos Aires 2025"),
    },
    {
      id: toId("australian-crypto-convention", 1),
      title: "Australian Crypto Convention",
      organizer: "AUS Crypto Con",
      eventsCount: 2,
      subscribers: 136,
      city: "Sydney",
      country: "Australia",
      startDate: "2025-11-22",
      endDate: "2025-11-23",
      month: "november",
      image: "/blockchain-center-logo.svg",
      slug: slugify("Australian Crypto Convention 2025"),
    },
    {
      id: toId("india-blockchain-week", 1),
      title: "India Blockchain Week",
      organizer: "IBW",
      city: "Bengaluru",
      country: "India",
      startDate: "2025-12-01",
      endDate: "2025-12-02",
      month: "december",
      image: "/blockchain-center-logo.svg",
      slug: slugify("India Blockchain Week 2025"),
    },
    {
      id: toId("breakpoint", 1),
      title: "Breakpoint 2025 Community Events",
      organizer: "Solana",
      eventsCount: 17,
      subscribers: 364,
      city: "Abu Dhabi",
      country: "United Arab Emirates",
      startDate: "2025-12-11",
      endDate: "2025-12-13",
      month: "december",
      image: "/blockchain-center-logo.svg",
      slug: slugify("Breakpoint 2025"),
    },
    {
      id: toId("davosweb3", 1),
      title: "DavosWeb3",
      organizer: "Web3",
      city: "Davos",
      country: "Switzerland",
      startDate: "2026-01-21",
      endDate: "2026-01-21",
      month: "january",
      image: "/blockchain-center-logo.svg",
      slug: slugify("DavosWeb3 2026"),
    },
    {
      id: toId("nft-paris", 1),
      title: "NFT Paris",
      organizer: "NFT Paris",
      city: "Paris",
      country: "France",
      startDate: "2026-02-05",
      endDate: "2026-02-06",
      month: "february",
      image: "/blockchain-center-logo.svg",
      slug: slugify("NFT Paris 2026"),
    },
    {
      id: toId("consensus-hk", 1),
      title: "Consensus Hong Kong",
      organizer: "Consensus",
      city: "Hong Kong",
      country: "China",
      startDate: "2026-02-10",
      endDate: "2026-02-12",
      month: "february",
      image: "/blockchain-center-logo.svg",
      slug: slugify("Consensus Hong Kong 2026"),
    },
    {
      id: toId("bitcoin-2026", 1),
      title: "Bitcoin 2026",
      organizer: "Bitcoin Conference",
      city: "Las Vegas",
      country: "United States",
      startDate: "2026-04-27",
      endDate: "2026-04-29",
      month: "april",
      image: "/blockchain-center-logo.svg",
      slug: slugify("Bitcoin 2026"),
      isLive: false,
    },
  ];

  const grouped: EventsByMonth = {};
  for (const event of items) {
    if (!grouped[event.month]) grouped[event.month] = [];
    grouped[event.month].push(event);
  }
  return grouped;
}

export function formatDateRange(start: string, end?: string): string {
  try {
    const s = new Date(start);
    const e = end ? new Date(end) : undefined;
    const day = s.getDate().toString().padStart(2, "0");
    const month = (s.getMonth() + 1).toString().padStart(2, "0");
    const startPart = `${day}/${month}`;
    if (!e) return startPart;
    const dayE = e.getDate().toString().padStart(2, "0");
    const monthE = (e.getMonth() + 1).toString().padStart(2, "0");
    return `${startPart} — ${dayE}/${monthE}`;
  } catch {
    return start;
  }
}

function monthStringFromDate(value: string): string {
  const d = new Date(value);
  const idx = d.getMonth();
  const names = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  return names[idx] || "unknown";
}

function pickLang(obj: any): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj === "object") {
    if (typeof obj.en === "string") return obj.en;
    const first = Object.values(obj).find((v) => typeof v === "string") as string | undefined;
    return first || "";
  }
  return "";
}

function parseIsoOrNull(value?: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function normalizeFromCoinMarketCal(items: any[]): EventItem[] {
  const result: EventItem[] = [];
  for (const it of Array.isArray(items) ? items : []) {
    const id = String(it?.id ?? "");
    const title = pickLang(it?.title) || "Untitled";
    const dateIso = parseIsoOrNull(it?.date_event) || parseIsoOrNull(it?.created_date) || new Date().toISOString();
    const month = monthStringFromDate(dateIso);
    const image = typeof it?.proof === "string" ? it.proof : undefined;
    const organizer = Array.isArray(it?.coins)
      ? (it.coins
          .map((c: any) => c?.symbol || pickLang(c?.name))
          .filter((s: string) => typeof s === "string" && s)
          .join(", ") || undefined)
      : undefined;
    result.push({
      id,
      title,
      organizer,
      city: "",
      country: "",
      startDate: dateIso,
      endDate: undefined,
      month,
      image,
      slug: slugify(`${title}-${id}`),
      isLive: false,
    });
  }
  return result;
}


