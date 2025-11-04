"use client";

import React from "react";
import Link from "next/link";
import { use } from "react";
import { usePathname } from "next/navigation";
import { getCourseById, getLessonById, getCommentsByLessonId, getCategoryInfo, type Lesson, type Comment } from "@/lib/academy";
import { Play, Plus, Clock, ChevronLeft, Share2, Star, MessageCircle, BookOpen } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";

type PageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  });
}

function getYouTubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}`;
}

export default function LessonPage({ params }: PageProps) {
  const { courseId, lessonId } = use(params);
  
  const course = React.useMemo(() => getCourseById(courseId), [courseId]);
  const lesson = React.useMemo(() => getLessonById(courseId, lessonId), [courseId, lessonId]);
  const comments = React.useMemo(() => getCommentsByLessonId(lessonId), [lessonId]);
  const categoryInfo = React.useMemo(() => {
    return getCategoryInfo().find((c) => c.id === "academy");
  }, []);

  const relatedLessons = React.useMemo(() => {
    if (!course) return [];
    return course.lessons
      .filter((l) => l.id !== lessonId)
      .sort((a, b) => a.order - b.order)
      .slice(0, 3);
  }, [course, lessonId]);

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Lesson not found</h1>
          <Link
            href={`/academy/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Course</span>
          </Link>
        </div>
      </div>
    );
  }

  const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order);
  const currentLessonIndex = sortedLessons.findIndex((l) => l.id === lessonId);
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < sortedLessons.length - 1 
    ? sortedLessons[currentLessonIndex + 1] 
    : null;
  const prevLesson = currentLessonIndex > 0 
    ? sortedLessons[currentLessonIndex - 1] 
    : null;

  const { playAudio, currentAudio } = useAudioPlayer();

  const handlePlayAudio = React.useCallback(() => {
    if (!lesson) return;
    const audioUrl = lesson.audioUrl || `/videos/video.mp4`; // Fallback for now
    playAudio({
      id: lesson.id,
      title: lesson.title,
      audioUrl: audioUrl,
      thumbnail: lesson.thumbnail,
      courseId: courseId,
      lessonId: lesson.id,
      nextUrl: nextLesson ? `/academy/courses/${courseId}/${nextLesson.id}` : undefined,
      prevUrl: prevLesson ? `/academy/courses/${courseId}/${prevLesson.id}` : undefined,
    });
  }, [lesson, courseId, nextLesson, prevLesson, playAudio]);

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 py-8">
        {/* Back Button */}
        <Link
          href={`/academy/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to {course.title}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Lesson Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Lesson {lesson.order}
                </span>
                {lesson.rating && (
                  <div className="flex items-center gap-1 text-white/70 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{lesson.rating}</span>
                    {lesson.ratingCount && (
                      <span className="text-white/50">({lesson.ratingCount})</span>
                    )}
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
              <p className="text-white/60 text-lg">{course.title}</p>
              <div className="flex items-center gap-4 text-white/50 text-sm">
                <span>{formatDate(lesson.date)}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration}</span>
                </div>
              </div>
            </div>

            {/* Audio Thumbnail/Artwork */}
            {lesson.audioUrl && (
              <div className="rounded-xl border border-white/10 bg-[#0b0b0b] overflow-hidden">
                <div className="aspect-square bg-black flex items-center justify-center">
                  <div className="h-64 w-64 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img
                      src={lesson.thumbnail}
                      alt={lesson.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About this lesson</h2>
              <p className="text-white/70 leading-relaxed">{lesson.description}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayAudio}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{currentAudio?.id === lesson.id ? "Playing..." : "Play Lesson"}</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add to Playlist</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              {prevLesson ? (
                <Link
                  href={`/academy/courses/${courseId}/${prevLesson.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs text-white/60">Previous</div>
                    <div className="text-sm font-medium">{prevLesson.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextLesson ? (
                <Link
                  href={`/academy/courses/${courseId}/${nextLesson.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs text-white/60">Next</div>
                    <div className="text-sm font-medium">{nextLesson.title}</div>
                  </div>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* Comments Section */}
            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comments ({comments.length})
                </h2>
                <button className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors text-sm">
                  Add Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold shrink-0">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm">{comment.author}</span>
                          <span className="text-white/50 text-xs">{formatDate(comment.date)}</span>
                          {comment.rating && (
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < comment.rating!
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-white/20"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-white/70 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Lessons */}
            {relatedLessons.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">More from this course</h2>
                <div className="space-y-2">
                  {relatedLessons.map((related) => (
                    <Link
                      key={related.id}
                      href={`/academy/courses/${courseId}/${related.id}`}
                      className="block rounded-lg border border-white/10 bg-[#0b0b0b] hover:bg-white/5 transition-all p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
                          <img 
                            src={related.thumbnail} 
                            alt={related.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-emerald-400">Lesson {related.order}</span>
                            {related.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-white/70 text-xs">{related.rating}</span>
                              </div>
                            )}
                          </div>
                          <h3 className="text-white font-semibold mb-1 line-clamp-1">{related.title}</h3>
                          <div className="flex items-center gap-4 text-white/50 text-xs">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{related.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar (Spotify-style) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Course Info */}
              <div className="rounded-2xl border border-emerald-500/20 bg-[#0b0b0b] overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold text-white">Course</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="h-48 w-full rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-white font-semibold line-clamp-2">{course.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-3">{course.description}</p>
                  <Link
                    href={`/academy/courses/${courseId}`}
                    className="inline-block px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
                  >
                    View All Lessons
                  </Link>
                </div>
              </div>

              {/* Next Lessons */}
              <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Next Lessons
                </h3>
                <div className="space-y-3">
                  {sortedLessons
                    .filter((l) => l.order > lesson.order)
                    .slice(0, 5)
                    .map((l) => (
                      <Link
                        key={l.id}
                        href={`/academy/courses/${courseId}/${l.id}`}
                        className="block group"
                      >
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="h-12 w-12 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
                            <img
                              src={l.thumbnail}
                              alt={l.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm line-clamp-1 group-hover:text-emerald-400 transition-colors">
                              {l.title}
                            </div>
                            <div className="text-white/50 text-xs mt-0.5">
                              Lesson {l.order} • {l.duration}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  {sortedLessons.filter((l) => l.order > lesson.order).length === 0 && (
                    <p className="text-white/50 text-sm text-center py-4">No more lessons</p>
                  )}
                </div>
              </div>

              {/* Lesson Info */}
              <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
                <h3 className="text-sm font-semibold text-white mb-3">About this lesson</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Duration</span>
                    <span className="text-white">{lesson.duration}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Published</span>
                    <span className="text-white">{formatDate(lesson.date)}</span>
                  </div>
                  {lesson.rating && (
                    <div className="flex justify-between text-white/70">
                      <span>Rating</span>
                      <div className="flex items-center gap-1 text-white">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{lesson.rating}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

