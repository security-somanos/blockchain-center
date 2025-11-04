"use client";

import React from "react";
import Link from "next/link";
import { getAllCourses, getCategoryInfo, type Course } from "@/lib/academy";
import { ChevronLeft, Star, Clock, BookOpen } from "lucide-react";

export default function CoursesPage() {
  const courses = React.useMemo(() => getAllCourses(), []);
  const categoryInfo = React.useMemo(() => {
    return getCategoryInfo().find((c) => c.id === "academy");
  }, []);

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

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Academy</h1>
          <p className="text-white/70 text-lg max-w-2xl">
            {categoryInfo?.description || "Educational content covering blockchain fundamentals, advanced topics, and practical applications."}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/academy/courses/${course.id}`}
              className="group rounded-2xl border border-emerald-500/20 bg-[#0b0b0b] hover:border-emerald-500/40 transition-all overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {course.genre}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-white/70 text-sm line-clamp-3">{course.description}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.lessons.length} lessons</span>
                    </div>
                    {course.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white">{course.rating}</span>
                        {course.ratingCount && (
                          <span className="text-white/50">
                            ({course.ratingCount > 1000 ? (course.ratingCount / 1000).toFixed(1) + "k" : course.ratingCount})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

