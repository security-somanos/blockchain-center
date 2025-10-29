"use client";

import React from "react";
import { getSampleEvents, formatDateRange, type EventsByMonth, type EventItem } from "@/lib/events";
import { Calendar, MapPin, ChevronRight, Search, Mail } from "lucide-react";

const MONTH_LABELS: Record<string, string> = {
  october: "October",
  november: "November",
  december: "December",
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
  june: "June",
  july: "July",
  august: "August",
  september: "September",
};

const MONTH_ORDER = [
  "october",
  "november",
  "december",
  "january",
  "february",
  "april",
];

function groupByMonth(items: EventItem[]): EventsByMonth {
  const out: EventsByMonth = {};
  for (const it of items) {
    const key = it.month || "unknown";
    if (!out[key]) out[key] = [];
    out[key].push(it);
  }
  return out;
}

export default function EventsPage() {
  const [query, setQuery] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subStatus, setSubStatus] = React.useState<{ type: "idle" } | { type: "loading" } | { type: "error", message: string } | { type: "success", message: string }>({ type: "idle" });
  const [byMonth, setByMonth] = React.useState<EventsByMonth | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/events?max=32&translations=en", { headers: { accept: "application/json" } });
        const json = await res.json().catch(() => ({}));
        const items: EventItem[] = Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) {
          if (items.length > 0) {
            setByMonth(groupByMonth(items));
          } else {
            setByMonth(getSampleEvents());
          }
        }
      } catch {
        if (!cancelled) setByMonth(getSampleEvents());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filterMatch = (e: EventItem): boolean => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const hay = `${e.title} ${e.organizer || ""} ${e.city} ${e.country}`.toLowerCase();
    return hay.includes(q);
  };

  const fallbackSample = React.useMemo(() => getSampleEvents(), []);
  const source = React.useMemo(() => {
    if (byMonth) return byMonth;
    if (!loading) return fallbackSample; // after load, if API empty -> use sample
    return {} as EventsByMonth; // during loading, show skeleton
  }, [byMonth, loading, fallbackSample]);

  const filtered: EventsByMonth = React.useMemo(() => {
    const out: EventsByMonth = {};
    for (const [m, arr] of Object.entries(source)) {
      const f = arr.filter(filterMatch);
      if (f.length) out[m] = f;
    }
    return out;
  }, [source, query]);

  const nearby: EventItem | undefined = React.useMemo(() => {
    // Pick the first event in order as a placeholder for "Nearby"
    for (const key of MONTH_ORDER) {
      const arr = source[key];
      if (arr && arr.length) return { ...arr[0], isLive: true };
    }
    return undefined;
  }, [source]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubStatus({ type: "loading" });
    try {
      const res = await fetch("/api/events/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubStatus({ type: "error", message: json?.error || "Subscription failed" });
        return;
      }
      setSubStatus({ type: "success", message: "Subscribed successfully" });
      setEmail("");
    } catch {
      setSubStatus({ type: "error", message: "Subscription failed" });
    }
  };

  return (
    <div className="px-6 sm:px-12 my-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Events list */}
      <div className="space-y-6 lg:col-span-2">
        {/* Search */}
        <div className="relative rounded-2xl border border-white/10 bg-[#090909]">
          <div className="p-4 flex items-center gap-3">
            <Search className="w-5 h-5 text-white/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, cities, organizers"
              className="w-full bg-transparent outline-none text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* Month sections */}
        {loading ? (
          <section className="rounded-2xl border border-white/10 bg-[#0b0b0b] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="inline-block h-2 w-2 rounded-full bg-white/40" />
                <span className="uppercase tracking-wide">Loading events…</span>
              </div>
            </div>
            <ul className="divide-y divide-white/10">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md bg-white/10 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 bg-white/10 animate-pulse rounded" />
                      <div className="h-3 w-1/3 bg-white/10 animate-pulse rounded" />
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                      <div className="h-3 w-28 bg-white/10 animate-pulse rounded" />
                      <div className="h-3 w-24 bg-white/10 animate-pulse rounded" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : (
        MONTH_ORDER.map((m) => {
          const events = filtered[m];
          if (!events || events.length === 0) return null;
          return (
            <section key={m} className="rounded-2xl border border-white/10 bg-[#0b0b0b] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span className="inline-block h-2 w-2 rounded-full bg-white/60" />
                  <span className="uppercase tracking-wide">{MONTH_LABELS[m] || m}</span>
                </div>
              </div>
              <ul className="divide-y divide-white/10">
                {events.map((ev) => (
                  <li key={ev.id} className="group">
                    <a href="#" className="flex items-center gap-4 px-4 py-4 hover:bg-white/5">
                      <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden border border-white/10 bg-white/5">
                        <img src={ev.image || "/blockchain-center-logo.svg"} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-white font-semibold truncate">{ev.title}</div>
                        <div className="text-white/60 text-xs truncate">
                          {ev.eventsCount ? `${ev.eventsCount} event${ev.eventsCount > 1 ? "s" : ""}` : "Upcoming"}
                          {typeof ev.subscribers === "number" ? ` · ${ev.subscribers} Subscribers` : null}
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-4 text-sm text-white/70">
                        {(ev.city || ev.country) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="whitespace-nowrap">{[ev.city, ev.country].filter(Boolean).join(", ")}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="whitespace-nowrap">{formatDateRange(ev.startDate, ev.endDate)}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        }))}
      </div>

      {/* Right: Sidebar */}
      <div className="space-y-6">
        {/* Nearby */}
        <div className="rounded-2xl border border-white/10 bg-[#090909] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <div className="text-white font-semibold">Nearby events</div>
            <div className="text-white/60 text-xs">Today</div>
          </div>
          {nearby ? (
            <div className="p-4">
              <a href="#" className="block rounded-xl border border-white/10 bg-white/5 hover:border-white/50 transition-colors">
                <div className="flex items-start gap-3 p-4">
                  <div className="relative">
                    {nearby.isLive && (
                      <span className="absolute -top-2 left-0 text-[10px] font-semibold text-orange-400">LIVE</span>
                    )}
                    <div className="h-16 w-16 rounded-md overflow-hidden border border-white/10 bg-white/5">
                      <img src={nearby.image || "/blockchain-center-logo.svg"} alt="" className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-semibold leading-tight">{nearby.title}</div>
                    <div className="mt-1 text-white/70 text-xs flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{nearby.city}, {nearby.country}</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ) : (
            <div className="p-4 text-white/60 text-sm">No nearby events.</div>
          )}
        </div>

        {/* Subscribe */}
        <div className="rounded-2xl border border-white/10 bg-[#090909]">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-violet-600/20 border border-violet-400/30 flex items-center justify-center text-violet-300 font-bold">B</div>
              <div className="text-white font-semibold">Crypto</div>
            </div>
            <p className="text-white/70 text-sm mt-2">
              Subscribe to stay updated with the latest events, calendars, and announcements.
            </p>
            <form onSubmit={handleSubscribe} className="mt-3 space-y-2">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2">
                <Mail className="w-4 h-4 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@email.com"
                  className="w-full bg-transparent outline-none text-white placeholder:text-white/50"
                />
              </div>
              <button type="submit" disabled={subStatus.type === "loading"} className="w-full rounded-full bg-white text-black py-2 font-medium hover:bg-gray-200 transition-colors disabled:opacity-60">
                {subStatus.type === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
              {subStatus.type === "success" && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-3 py-2 text-sm text-center">{subStatus.message}</div>
              )}
              {subStatus.type === "error" && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2 text-sm text-center">{subStatus.message}</div>
              )}
            </form>
          </div>
        </div>

        {/* Mini map placeholder */}
        <div className="rounded-2xl border border-white/10 bg-[#090909] h-60 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(/images/noise.png)", backgroundSize: "cover" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_0_6px_rgba(128,90,213,0.25)]" />
          </div>
        </div>
      </div>
    </div>
  );
}


