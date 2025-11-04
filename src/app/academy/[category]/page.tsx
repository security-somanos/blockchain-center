"use client";

import React from "react";
import Link from "next/link";
import { use } from "react";
import { getCategoryInfo, getEpisodesByCategory, type PodcastEpisode } from "@/lib/academy";
import { Play, Plus, Clock, ChevronLeft, Pin, PinOff, Star } from "lucide-react";

type PageProps = {
  params: Promise<{ category: string }>;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    day: "numeric", 
    month: "short", 
    year: "numeric" 
  });
}

export default function CategoryPage({ params }: PageProps) {
  const { category } = use(params);
  const categoryId = category as "speakers" | "conferences" | "academy";
  
  const categoryInfo = React.useMemo(() => {
    const info = getCategoryInfo().find((c) => c.id === categoryId);
    return info || getCategoryInfo()[0];
  }, [categoryId]);

  const episodes = React.useMemo(() => {
    return getEpisodesByCategory(categoryId);
  }, [categoryId]);

  const [pinnedAbout, setPinnedAbout] = React.useState(false);
  const [showFullDescription, setShowFullDescription] = React.useState(false);
  const [hoveredEpisode, setHoveredEpisode] = React.useState<string | null>(null);

  const trailer = episodes.find((ep) => ep.isTrailer);
  const regularEpisodes = episodes.filter((ep) => !ep.isTrailer);

  // Different UI styles for each category
  const getCategoryStyle = () => {
    switch (categoryId) {
      case "speakers":
        return {
          accentColor: "text-violet-400",
          borderColor: "border-violet-500/20",
          bgAccent: "bg-violet-500/10",
        };
      case "conferences":
        return {
          accentColor: "text-blue-400",
          borderColor: "border-blue-500/20",
          bgAccent: "bg-blue-500/10",
        };
      case "academy":
        return {
          accentColor: "text-emerald-400",
          borderColor: "border-emerald-500/20",
          bgAccent: "bg-emerald-500/10",
        };
      default:
        return {
          accentColor: "text-white",
          borderColor: "border-white/20",
          bgAccent: "bg-white/10",
        };
    }
  };

  const styles = getCategoryStyle();

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 py-8">
        {/* Back Button */}
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Academy</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Episodes List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dropdowns */}
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 rounded-lg border border-white/10 bg-[#0b0b0b] text-white text-sm">
                <option>All Episodes</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-white/10 bg-[#0b0b0b] text-white text-sm">
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </div>

            {/* Episodes List */}
            <div className="space-y-1">
              {regularEpisodes.map((episode, idx) => (
                <div
                  key={episode.id}
                  onMouseEnter={() => setHoveredEpisode(episode.id)}
                  onMouseLeave={() => setHoveredEpisode(null)}
                  className="group rounded-lg border border-white/10 bg-[#0b0b0b] hover:bg-white/5 transition-all"
                >
                  <Link href={`/academy/${categoryId}/${episode.id}`}>
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
                          <img 
                            src={episode.thumbnail} 
                            alt={episode.title}
                            className="h-full w-full object-cover"
                          />
                          {hoveredEpisode === episode.id && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                                <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold mb-1 line-clamp-1">{episode.title}</h3>
                          <p className="text-white/60 text-sm mb-2">{episode.podcastName}</p>
                          <p className="text-white/70 text-sm line-clamp-2 mb-2">{episode.description}</p>
                          <div className="flex items-center gap-4 text-white/50 text-xs">
                            <span>{formatDate(episode.date)}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{episode.duration}</span>
                            </div>
                            {episode.progress !== undefined && (
                              <>
                                <span>•</span>
                                <span>Remaining: {episode.progress}%</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="h-10 w-10 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - About Section */}
          <div className="lg:col-span-1">
            <div className={`sticky top-8 ${pinnedAbout ? "" : ""}`}>
              <div className={`rounded-2xl border ${styles.borderColor} bg-[#0b0b0b] overflow-hidden`}>
                {/* Pin Button */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white">About</h2>
                  <button
                    onClick={() => setPinnedAbout(!pinnedAbout)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title={pinnedAbout ? "Unpin" : "Pin"}
                  >
                    {pinnedAbout ? (
                      <Pin className="w-5 h-5 text-white/70" />
                    ) : (
                      <PinOff className="w-5 h-5 text-white/40" />
                    )}
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Category Image */}
                  <div className="h-48 w-full rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img 
                      src={categoryInfo.thumbnail} 
                      alt={categoryInfo.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <p className={`text-white/70 text-sm ${showFullDescription ? "" : "line-clamp-4"}`}>
                      {categoryInfo.description}
                    </p>
                    {!showFullDescription && (
                      <button
                        onClick={() => setShowFullDescription(true)}
                        className="text-white/80 text-sm mt-2 hover:text-white transition-colors"
                      >
                        Show more
                      </button>
                    )}
                  </div>

                  {/* Trailer */}
                  {trailer && (
                    <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                      <div className="relative">
                        <img 
                          src={trailer.thumbnail} 
                          alt={trailer.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                            <Play className="w-6 h-6 text-black fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-white font-semibold text-sm mb-1">{trailer.title}</h4>
                        <p className="text-white/60 text-xs mb-2">Trailer</p>
                        <p className="text-white/50 text-xs">{trailer.duration}</p>
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  {categoryInfo.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-semibold">{categoryInfo.rating}</span>
                      </div>
                      <span className="text-white/60 text-sm">
                        ({categoryInfo.ratingCount ? (categoryInfo.ratingCount / 1000).toFixed(1) + "k" : "0"} ratings)
                      </span>
                    </div>
                  )}

                  {/* Genre */}
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${styles.bgAccent} ${styles.accentColor} border ${styles.borderColor}`}>
                      {categoryInfo.genre}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

