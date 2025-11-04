"use client";

import React, { useEffect } from "react";
import { useVideoPlayer } from "@/contexts/VideoPlayerContext";
import { Play, Pause, X, Minimize2, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { HTML5VideoPlayer } from "./HTML5VideoPlayer";
import { motion, AnimatePresence } from "framer-motion";

export function VideoPlayer() {
  const {
    currentVideo,
    isPlaying,
    playerPosition,
    stopVideo,
    pauseVideo,
    resumeVideo,
    goToNext,
    goToPrevious,
    setPlayerPosition,
    videoPlayerRef,
  } = useVideoPlayer();

  // Add padding to body when bottom controls are visible
  useEffect(() => {
    if (currentVideo && playerPosition === "bottom") {
      document.body.style.paddingBottom = "80px";
    } else {
      document.body.style.paddingBottom = "0px";
    }
    return () => {
      document.body.style.paddingBottom = "0px";
    };
  }, [currentVideo, playerPosition]);

  if (!currentVideo) return null;

  const handlePlay = () => {
    resumeVideo();
  };

  const handlePause = () => {
    pauseVideo();
  };

  // Single shared player component - same instance moves between positions
  // Using a stable key ensures React preserves the video element when moving between containers
  const sharedPlayer = currentVideo ? (
    <HTML5VideoPlayer
      key={`shared-player-${currentVideo.id}`}
      ref={videoPlayerRef}
      src={currentVideo.videoUrl}
      poster={currentVideo.poster || currentVideo.thumbnail}
      autoplay={isPlaying}
      controls={true}
      className="w-full h-full"
      onPlay={handlePlay}
      onPause={handlePause}
    />
  ) : null;

  return (
    <>
      {/* Minimized PiP Player */}
      <AnimatePresence mode="wait">
        {playerPosition === "pip" && currentVideo && (
          <motion.div
            key="pip-player"
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-80 rounded-lg border border-white/20 bg-[#0b0b0b] shadow-2xl overflow-hidden"
          >
            <div className="relative aspect-video bg-black">
              {sharedPlayer}
              <button
                onClick={stopVideo}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPlayerPosition("main")}
                className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center text-white transition-colors z-10"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-[#0b0b0b] border-t border-white/10">
              <p className="text-white text-sm font-medium line-clamp-1 mb-2">{currentVideo.title}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={isPlaying ? pauseVideo : resumeVideo}
                  className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                {currentVideo.prevUrl && (
                  <button
                    onClick={goToPrevious}
                    className="h-8 w-8 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {currentVideo.nextUrl && (
                  <button
                    onClick={goToNext}
                    className="h-8 w-8 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls Bar */}
      <AnimatePresence mode="wait">
        {currentVideo && playerPosition === "bottom" && (
          <motion.div
            key="bottom-player"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0b0b0b] border-t border-white/10 shadow-2xl"
          >
            <div className="mx-auto max-w-7xl px-6 py-4">
              <div className="flex items-center gap-4">
                {/* Video Player */}
                <div className="h-16 w-28 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
                  {sharedPlayer}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm line-clamp-1">{currentVideo.title}</h3>
                  <p className="text-white/60 text-xs">{currentVideo.type === "lesson" ? "Lesson" : "Episode"}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  {currentVideo.prevUrl && (
                    <button
                      onClick={goToPrevious}
                      className="h-10 w-10 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                      title="Previous"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={isPlaying ? pauseVideo : resumeVideo}
                    className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                  {currentVideo.nextUrl && (
                    <button
                      onClick={goToNext}
                      className="h-10 w-10 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                      title="Next"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setPlayerPosition("pip")}
                    className="h-10 w-10 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                    title="Minimize"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={stopVideo}
                    className="h-10 w-10 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

