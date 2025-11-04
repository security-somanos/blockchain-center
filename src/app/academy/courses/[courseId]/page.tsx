"use client";

import React from "react";
import Link from "next/link";
import { use } from "react";
import { getCourseById, getCategoryInfo, type Course, type Lesson } from "@/lib/academy";
import { Play, Clock, ChevronLeft, Star, BookOpen, Pin, PinOff } from "lucide-react";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    day: "numeric", 
    month: "short", 
    year: "numeric" 
  });
}

export default function CoursePage({ params }: PageProps) {
  const { courseId } = use(params);
  const course = React.useMemo(() => getCourseById(courseId), [courseId]);
  const categoryInfo = React.useMemo(() => {
    return getCategoryInfo().find((c) => c.id === "academy");
  }, []);

  const [pinnedAbout, setPinnedAbout] = React.useState(false);
  const [showFullDescription, setShowFullDescription] = React.useState(false);
  const [hoveredLesson, setHoveredLesson] = React.useState<string | null>(null);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course not found</h1>
          <Link
            href="/academy/courses"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </Link>
        </div>
      </div>
    );
  }

  const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 py-8">
        {/* Back Button */}
        <Link
          href="/academy/courses"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Lessons List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {course.genre}
                </span>
                {course.rating && (
                  <div className="flex items-center gap-1 text-white/70 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                    {course.ratingCount && (
                      <span className="text-white/50">
                        ({course.ratingCount > 1000 ? (course.ratingCount / 1000).toFixed(1) + "k" : course.ratingCount})
                      </span>
                    )}
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white">{course.title}</h1>
              <p className="text-white/60 text-lg">{categoryInfo?.title || "Academy"}</p>
              <div className="flex items-center gap-4 text-white/50 text-sm">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons.length} lessons</span>
                </div>
                <span>•</span>
                <span>{formatDate(course.date)}</span>
              </div>
            </div>

            {/* Lessons List */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white mb-4">Lessons</h2>
              {sortedLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onMouseEnter={() => setHoveredLesson(lesson.id)}
                  onMouseLeave={() => setHoveredLesson(null)}
                  className="group rounded-lg border border-white/10 bg-[#0b0b0b] hover:bg-white/5 transition-all"
                >
                  <Link href={`/academy/courses/${courseId}/${lesson.id}`}>
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
                          <img 
                            src={lesson.thumbnail} 
                            alt={lesson.title}
                            className="h-full w-full object-cover"
                          />
                          {hoveredLesson === lesson.id && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                                <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                              </div>
                            </div>
                          )}
                          <div className="absolute top-1 left-1 bg-emerald-500/90 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                            {lesson.order}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold mb-1 line-clamp-1">{lesson.title}</h3>
                          <p className="text-white/70 text-sm line-clamp-2 mb-2">{lesson.description}</p>
                          <div className="flex items-center gap-4 text-white/50 text-xs">
                            <span>{formatDate(lesson.date)}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.duration}</span>
                            </div>
                            {lesson.rating && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{lesson.rating}</span>
                                </div>
                              </>
                            )}
                          </div>
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
            <div className="sticky top-8">
              <div className="rounded-2xl border border-emerald-500/20 bg-[#0b0b0b] overflow-hidden">
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
                  {/* Course Image */}
                  <div className="h-48 w-full rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <p className={`text-white/70 text-sm ${showFullDescription ? "" : "line-clamp-4"}`}>
                      {course.description}
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

                  {/* Course Stats */}
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Lessons</span>
                      <span className="text-white">{course.lessons.length}</span>
                    </div>
                    {course.rating && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white">{course.rating}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Genre</span>
                      <span className="text-white">{course.genre}</span>
                    </div>
                  </div>

                  {/* Genre */}
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {course.genre}
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

