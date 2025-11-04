"use client";

import React, { useEffect, useRef } from "react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2, X } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";
import { motion, AnimatePresence } from "framer-motion";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayerBar() {
  const {
    currentAudio,
    isPlaying,
    currentTime,
    duration,
    pauseAudio,
    resumeAudio,
    stopAudio,
    seekTo,
    goToNext,
    goToPrevious,
    audioPlayerRef,
  } = useAudioPlayer();

  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragPosition, setDragPosition] = React.useState(0);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayProgress = isDragging ? dragPosition : progress;

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !currentAudio) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  // Handle progress bar drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setDragPosition(percentage * 100);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      setDragPosition(percentage * 100);
    };

    const handleMouseUp = () => {
      if (isDragging && currentAudio) {
        const newTime = (dragPosition / 100) * duration;
        seekTo(newTime);
      }
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragPosition, duration, currentAudio, seekTo]);

  // Add padding to body when player is visible
  useEffect(() => {
    if (currentAudio) {
      document.body.style.paddingBottom = "100px";
    } else {
      document.body.style.paddingBottom = "0px";
    }
    return () => {
      document.body.style.paddingBottom = "0px";
    };
  }, [currentAudio]);

  if (!currentAudio) return null;

  return (
    <AnimatePresence>
      {currentAudio && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-[#0b0b0b] border-t border-white/10 shadow-2xl"
        >
          {/* Progress Bar */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            onMouseDown={handleMouseDown}
            className="h-1 bg-white/10 cursor-pointer hover:h-1.5 transition-all"
          >
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${displayProgress}%` }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 py-3">
            <div className="flex items-center gap-4">
              {/* Thumbnail & Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {currentAudio.thumbnail && (
                  <div className="h-14 w-14 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
                    <img
                      src={currentAudio.thumbnail}
                      alt={currentAudio.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm line-clamp-1">
                    {currentAudio.title}
                  </h3>
                  <p className="text-white/60 text-xs">Lesson</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  {currentAudio.prevUrl && (
                    <button
                      onClick={goToPrevious}
                      className="h-8 w-8 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                      title="Previous"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={isPlaying ? pauseAudio : resumeAudio}
                    className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>
                  {currentAudio.nextUrl && (
                    <button
                      onClick={goToNext}
                      className="h-8 w-8 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                      title="Next"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-white/60 text-xs">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-2">
                <button
                  className="h-8 w-8 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                  title="Volume"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={stopAudio}
                  className="h-8 w-8 rounded-full border border-white/20 bg-transparent text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Hidden audio element */}
          <AudioPlayer
            ref={audioPlayerRef}
            src={currentAudio.audioUrl}
            autoplay={isPlaying}
            onPlay={resumeAudio}
            onPause={pauseAudio}
            className="hidden"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}


