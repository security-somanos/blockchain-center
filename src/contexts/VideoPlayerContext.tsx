"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export type VideoItem = {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  poster?: string;
  type: "episode" | "lesson";
  category?: "speakers" | "conferences" | "academy";
  courseId?: string;
  lessonId?: string;
  episodeId?: string;
  nextUrl?: string;
  prevUrl?: string;
};

type VideoPlayerContextType = {
  currentVideo: VideoItem | null;
  isPlaying: boolean;
  isMinimized: boolean;
  playerPosition: "main" | "bottom" | "pip";
  playVideo: (video: VideoItem) => void;
  pauseVideo: () => void;
  resumeVideo: () => void;
  stopVideo: () => void;
  toggleMinimize: () => void;
  maximizeVideo: () => void;
  setPlayerPosition: (position: "main" | "bottom" | "pip") => void;
  goToNext: () => void;
  goToPrevious: () => void;
  videoPlayerRef: React.RefObject<any>;
};

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export function VideoPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playerPosition, setPlayerPositionState] = useState<"main" | "bottom" | "pip">("main");
  const videoPlayerRef = React.useRef<any>(null);
  const pathname = usePathname();
  const mainPlayerPathRef = useRef<string | null>(null);
  const savedCurrentTimeRef = useRef<number>(0);
  const wasPlayingRef = useRef<boolean>(false);

  // Track the path where main player is located
  useEffect(() => {
    if (playerPosition === "main" && currentVideo) {
      // Determine the expected path based on video type
      if (currentVideo.type === "episode" && currentVideo.episodeId) {
        mainPlayerPathRef.current = `/academy/${currentVideo.category}/${currentVideo.episodeId}`;
      } else if (currentVideo.type === "lesson" && currentVideo.courseId && currentVideo.lessonId) {
        mainPlayerPathRef.current = `/academy/courses/${currentVideo.courseId}/${currentVideo.lessonId}`;
      }
    }
  }, [playerPosition, currentVideo]);

  // Save video state before position change
  useEffect(() => {
    if (videoPlayerRef.current && currentVideo) {
      const saveState = () => {
        if (videoPlayerRef.current?.getCurrentTime) {
          savedCurrentTimeRef.current = videoPlayerRef.current.getCurrentTime();
        }
        if (videoPlayerRef.current?.getVideoElement) {
          const videoElement = videoPlayerRef.current.getVideoElement();
          if (videoElement) {
            wasPlayingRef.current = !videoElement.paused;
          }
        }
      };

      // Save state periodically
      const interval = setInterval(saveState, 500);
      return () => clearInterval(interval);
    }
  }, [currentVideo]);

  // Restore video state when player position changes (only when moving to pip/bottom)
  useEffect(() => {
    if (videoPlayerRef.current && currentVideo && savedCurrentTimeRef.current > 0 && playerPosition !== "main") {
      const restoreState = () => {
        if (videoPlayerRef.current?.setCurrentTime) {
          videoPlayerRef.current.setCurrentTime(savedCurrentTimeRef.current);
        }
        if (wasPlayingRef.current && videoPlayerRef.current?.play) {
          setTimeout(() => {
            videoPlayerRef.current?.play();
          }, 300);
        }
      };

      // Small delay to ensure player is ready in new position
      const timeout = setTimeout(restoreState, 300);
      return () => clearTimeout(timeout);
    }
  }, [playerPosition, currentVideo]);

  // Auto-minimize when navigating away from main player page
  useEffect(() => {
    if (
      currentVideo &&
      playerPosition === "main" &&
      mainPlayerPathRef.current &&
      pathname !== mainPlayerPathRef.current
    ) {
      // Save current state before switching
      if (videoPlayerRef.current?.getCurrentTime) {
        savedCurrentTimeRef.current = videoPlayerRef.current.getCurrentTime();
      }
      if (videoPlayerRef.current?.getVideoElement) {
        const videoElement = videoPlayerRef.current.getVideoElement();
        if (videoElement) {
          wasPlayingRef.current = !videoElement.paused;
        }
      }
      
      // User navigated away from the main player page, move to pip
      setPlayerPositionState("pip");
      setIsMinimized(true);
    }
  }, [pathname, currentVideo, playerPosition]);

  const playVideo = useCallback((video: VideoItem) => {
    setCurrentVideo(video);
    setIsPlaying(true);
    setIsMinimized(false);
    setPlayerPositionState("main");
    // Play video when it's ready
    setTimeout(() => {
      if (videoPlayerRef.current?.play) {
        videoPlayerRef.current.play();
      }
    }, 100);
  }, []);

  const pauseVideo = useCallback(() => {
    setIsPlaying(false);
    if (videoPlayerRef.current?.pause) {
      videoPlayerRef.current.pause();
    }
  }, []);

  const resumeVideo = useCallback(() => {
    setIsPlaying(true);
    if (videoPlayerRef.current?.play) {
      videoPlayerRef.current.play();
    }
  }, []);

  const stopVideo = useCallback(() => {
    setIsPlaying(false);
    setCurrentVideo(null);
    setIsMinimized(false);
    setPlayerPositionState("main");
    if (videoPlayerRef.current?.pause) {
      videoPlayerRef.current.pause();
    }
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => {
      const newState = !prev;
      setPlayerPositionState(newState ? "pip" : "main");
      return newState;
    });
  }, []);

  const maximizeVideo = useCallback(() => {
    setIsMinimized(false);
    setPlayerPositionState("main");
  }, []);

  const handleSetPlayerPosition = useCallback((position: "main" | "bottom" | "pip") => {
    setPlayerPositionState(position);
    if (position === "pip") {
      setIsMinimized(true);
    } else {
      setIsMinimized(false);
    }
  }, []);

  const goToNext = useCallback(() => {
    if (currentVideo?.nextUrl) {
      window.location.href = currentVideo.nextUrl;
    }
  }, [currentVideo]);

  const goToPrevious = useCallback(() => {
    if (currentVideo?.prevUrl) {
      window.location.href = currentVideo.prevUrl;
    }
  }, [currentVideo]);

  return (
    <VideoPlayerContext.Provider
      value={{
        currentVideo,
        isPlaying,
        isMinimized,
        playerPosition,
        playVideo,
        pauseVideo,
        resumeVideo,
        stopVideo,
        toggleMinimize,
        maximizeVideo,
        setPlayerPosition: handleSetPlayerPosition,
        goToNext,
        goToPrevious,
        videoPlayerRef,
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);
  if (context === undefined) {
    throw new Error("useVideoPlayer must be used within a VideoPlayerProvider");
  }
  return context;
}

