"use client";

import React from "react";
import Link from "next/link";
import { use } from "react";
import { usePathname } from "next/navigation";
import { getCategoryInfo, getEpisodeById, getEpisodesByCategory, getCommentsByEpisodeId, type PodcastEpisode } from "@/lib/academy";
import { Play, Plus, Clock, ChevronLeft, Share2, Star, MessageCircle } from "lucide-react";
import { useVideoPlayer } from "@/contexts/VideoPlayerContext";
import { HTML5VideoPlayer } from "@/components/HTML5VideoPlayer";

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
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

export default function EpisodePage({ params }: PageProps) {
  const { category, slug } = use(params);
  const categoryId = category as "speakers" | "conferences" | "academy";
  
  const episode = React.useMemo(() => {
    return getEpisodeById(categoryId, slug);
  }, [categoryId, slug]);

  const categoryInfo = React.useMemo(() => {
    const info = getCategoryInfo().find((c) => c.id === categoryId);
    return info || getCategoryInfo()[0];
  }, [categoryId]);

  const relatedEpisodes = React.useMemo(() => {
    const all = getEpisodesByCategory(categoryId);
    return all.filter((ep) => ep.id !== episode?.id && !ep.isTrailer).slice(0, 3);
  }, [categoryId, episode]);

  const comments = React.useMemo(() => {
    if (!episode || categoryId === "academy") return [];
    return getCommentsByEpisodeId(episode.id, categoryId as "speakers" | "conferences");
  }, [episode, categoryId]);

  const { playVideo, currentVideo, playerPosition, videoPlayerRef, setPlayerPosition, pauseVideo, resumeVideo } = useVideoPlayer();
  const pathname = usePathname();
  const currentEpisodePath = React.useMemo(() => `/academy/${categoryId}/${episode?.id}`, [categoryId, episode?.id]);

  // Auto-minimize when navigating away from the main player page
  React.useEffect(() => {
    if (currentVideo?.id === episode?.id && playerPosition === "main" && pathname !== currentEpisodePath) {
      // User navigated away, move to pip
      setPlayerPosition("pip");
    }
  }, [pathname, currentEpisodePath, currentVideo?.id, episode?.id, playerPosition, setPlayerPosition]);

  // Also handle cleanup when component unmounts
  React.useEffect(() => {
    return () => {
      // When this page unmounts and video is playing, move to pip
      if (currentVideo?.id === episode?.id && playerPosition === "main" && videoPlayerRef.current) {
        const videoElement = videoPlayerRef.current.getVideoElement?.();
        if (videoElement && !videoElement.paused) {
          setPlayerPosition("pip");
        }
      }
    };
  }, [currentVideo?.id, episode?.id, playerPosition, setPlayerPosition, videoPlayerRef]);

  const handlePlay = React.useCallback(() => {
    resumeVideo();
  }, [resumeVideo]);

  const handlePause = React.useCallback(() => {
    pauseVideo();
  }, [pauseVideo]);

  // Set up next/previous URLs
  const nextEpisode = React.useMemo(() => {
    if (!episode) return null;
    const all = getEpisodesByCategory(categoryId);
    const currentIndex = all.findIndex((ep) => ep.id === episode.id);
    return currentIndex >= 0 && currentIndex < all.length - 1 ? all[currentIndex + 1] : null;
  }, [episode, categoryId]);

  const prevEpisode = React.useMemo(() => {
    if (!episode) return null;
    const all = getEpisodesByCategory(categoryId);
    const currentIndex = all.findIndex((ep) => ep.id === episode.id);
    return currentIndex > 0 ? all[currentIndex - 1] : null;
  }, [episode, categoryId]);

  const handlePlayVideo = React.useCallback(() => {
    if (!episode) return;
    // Use test video for now, or construct URL from youtubeId if needed
    const videoUrl = episode.videoUrl || (episode.youtubeId ? `/videos/video.mp4` : `/videos/video.mp4`);
    playVideo({
      id: episode.id,
      title: episode.title,
      videoUrl: videoUrl,
      thumbnail: episode.thumbnail,
      type: "episode",
      category: categoryId,
      episodeId: episode.id,
      nextUrl: nextEpisode ? `/academy/${categoryId}/${nextEpisode.id}` : undefined,
      prevUrl: prevEpisode ? `/academy/${categoryId}/${prevEpisode.id}` : undefined,
    });
  }, [episode, categoryId, nextEpisode, prevEpisode, playVideo]);

  if (!episode) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Episode not found</h1>
          <Link
            href={`/academy/${categoryId}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to {categoryInfo.title}</span>
          </Link>
        </div>
      </div>
    );
  }

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
          href={`/academy/${categoryId}`}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to {categoryInfo.title}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Episode Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles.bgAccent} ${styles.accentColor} border ${styles.borderColor}`}>
                  {episode.genre || categoryInfo.genre}
                </span>
                {episode.rating && (
                  <div className="flex items-center gap-1 text-white/70 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{episode.rating}</span>
                    {episode.ratingCount && (
                      <span className="text-white/50">({episode.ratingCount})</span>
                    )}
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white">{episode.title}</h1>
              <p className="text-white/60 text-lg">{episode.podcastName}</p>
              <div className="flex items-center gap-4 text-white/50 text-sm">
                <span>{formatDate(episode.date)}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{episode.duration}</span>
                </div>
              </div>
            </div>

            {/* Video Player */}
            {(episode.videoUrl || episode.youtubeId) && (
              <div className="rounded-xl border border-white/10 bg-[#0b0b0b] overflow-hidden">
                <div className="aspect-video bg-black">
                  {currentVideo?.id === episode.id && playerPosition !== "main" ? (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                      <div className="text-center">
                        <p className="mb-2">Video playing in {playerPosition === "pip" ? "minimized" : "bottom"} player</p>
                        <button
                          onClick={() => setPlayerPosition("main")}
                          className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
                        >
                          Return to Main Player
                        </button>
                      </div>
                    </div>
                  ) : currentVideo?.id === episode.id ? (
                    // Use shared player ref when this is the current video
                    <HTML5VideoPlayer
                      key={`episode-main-${episode.id}`}
                      ref={videoPlayerRef}
                      src={episode.videoUrl || `/videos/video.mp4`}
                      poster={episode.thumbnail}
                      autoplay={true}
                      controls={true}
                      className="w-full h-full"
                      onPlay={handlePlay}
                      onPause={handlePause}
                    />
                  ) : (
                    // Static player for non-current videos
                    <HTML5VideoPlayer
                      key={`episode-static-${episode.id}`}
                      src={episode.videoUrl || `/videos/video.mp4`}
                      poster={episode.thumbnail}
                      autoplay={false}
                      controls={true}
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">About this episode</h2>
              <p className="text-white/70 leading-relaxed">{episode.description}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayVideo}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Play Episode</span>
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

            {/* Comments Section */}
            {categoryId !== "academy" && (
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
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold shrink-0 ${
                          categoryId === "speakers" 
                            ? "bg-violet-500/20 text-violet-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
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
            )}

            {/* Related Episodes */}
            {relatedEpisodes.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">More from {categoryInfo.title}</h2>
                <div className="space-y-2">
                  {relatedEpisodes.map((related) => (
                    <Link
                      key={related.id}
                      href={`/academy/${categoryId}/${related.id}`}
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
                          <h3 className="text-white font-semibold mb-1 line-clamp-1">{related.title}</h3>
                          <p className="text-white/60 text-sm mb-2">{related.podcastName}</p>
                          <div className="flex items-center gap-4 text-white/50 text-xs">
                            <span>{formatDate(related.date)}</span>
                            <span>•</span>
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

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Category Info */}
              <div className={`rounded-2xl border ${styles.borderColor} bg-[#0b0b0b] overflow-hidden`}>
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold text-white">About {categoryInfo.title}</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="h-32 w-full rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img 
                      src={categoryInfo.thumbnail} 
                      alt={categoryInfo.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-white/70 text-sm line-clamp-4">{categoryInfo.description}</p>
                  <Link
                    href={`/academy/${categoryId}`}
                    className={`inline-block px-4 py-2 rounded-lg ${styles.bgAccent} ${styles.accentColor} text-sm font-medium hover:opacity-80 transition-opacity`}
                  >
                    View All Episodes
                  </Link>
                </div>
              </div>

              {/* Episode Stats */}
              <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Episode Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Duration</span>
                    <span className="text-white">{episode.duration}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Published</span>
                    <span className="text-white">{formatDate(episode.date)}</span>
                  </div>
                  {episode.rating && (
                    <div className="flex justify-between text-white/70">
                      <span>Rating</span>
                      <div className="flex items-center gap-1 text-white">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{episode.rating}</span>
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

