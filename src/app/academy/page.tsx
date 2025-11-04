"use client";

import React from "react";
import Link from "next/link";
import { getCategoryInfo, getPreviewEpisodes, getPreviewCourses, type CategoryInfo } from "@/lib/academy";
import { Play, ChevronRight, Clock, BookOpen, Star } from "lucide-react";

export default function AcademyPage() {
  const categories = React.useMemo(() => getCategoryInfo(), []);
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Academy</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Explore our collection of educational content, expert interviews, and conference highlights. 
            Learn from industry leaders and stay updated with the latest in blockchain technology.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((category, idx) => {
            const previewEpisodes = category.id !== "academy" ? getPreviewEpisodes(category.id, 3) : [];
            const previewCourses = category.id === "academy" ? getPreviewCourses(3) : [];
            const isExpanded = expandedCategory === category.id;

            return (
              <section key={category.id} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                      <img 
                        src={category.thumbnail} 
                        alt={category.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{category.title}</h2>
                      <p className="text-white/60 text-sm">
                        {category.episodeCount} episodes • {category.genre}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={category.id === "academy" ? "/academy/courses" : `/academy/${category.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Preview Episodes/Courses */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.id === "academy" ? (
                    // For academy, show course previews
                    previewCourses.map((course) => (
                      <Link
                        key={course.id}
                        href={`/academy/courses/${course.id}`}
                        className="group rounded-xl border border-emerald-500/20 bg-[#0b0b0b] hover:border-emerald-500/40 transition-all overflow-hidden"
                      >
                        <div className="p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 rounded-lg overflow-hidden border border-emerald-500/20 bg-white/5 shrink-0">
                              <img 
                                src={course.thumbnail} 
                                alt={course.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-emerald-400 transition-colors">
                                {course.title}
                              </h3>
                              <p className="text-white/50 text-xs mt-1">{category.title}</p>
                            </div>
                          </div>
                          <p className="text-white/60 text-xs line-clamp-2">{course.description}</p>
                          <div className="flex items-center gap-3 text-white/50 text-xs">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{course.lessons.length} lessons</span>
                            </div>
                            {course.rating && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{course.rating}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    previewEpisodes.map((episode) => (
                      <Link
                        key={episode.id}
                        href={`/academy/${category.id}/${episode.id}`}
                        className="group rounded-xl border border-white/10 bg-[#0b0b0b] hover:border-white/30 transition-all overflow-hidden"
                      >
                      <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
                            <img 
                              src={episode.thumbnail} 
                              alt={episode.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-white/90">
                              {episode.title}
                            </h3>
                            <p className="text-white/50 text-xs mt-1">{episode.podcastName}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shrink-0 opacity-0 group-hover:opacity-100"
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                        <p className="text-white/60 text-xs line-clamp-2">{episode.description}</p>
                        <div className="flex items-center gap-3 text-white/50 text-xs">
                          <span>{new Date(episode.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{episode.duration}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

