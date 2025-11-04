"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export type AudioItem = {
  id: string;
  title: string;
  audioUrl: string;
  thumbnail?: string;
  courseId: string;
  lessonId: string;
  nextUrl?: string;
  prevUrl?: string;
};

type AudioPlayerContextType = {
  currentAudio: AudioItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playAudio: (audio: AudioItem) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  seekTo: (time: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  audioPlayerRef: React.RefObject<any>;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentAudio, setCurrentAudio] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioPlayerRef = React.useRef<any>(null);
  const pathname = usePathname();
  const mainPlayerPathRef = useRef<string | null>(null);

  // Track the path where main player is located
  useEffect(() => {
    if (currentAudio) {
      mainPlayerPathRef.current = `/academy/courses/${currentAudio.courseId}/${currentAudio.lessonId}`;
    }
  }, [currentAudio]);

  // Auto-pause when navigating away (but keep audio loaded)
  useEffect(() => {
    if (
      currentAudio &&
      mainPlayerPathRef.current &&
      pathname !== mainPlayerPathRef.current
    ) {
      // User navigated away, pause but keep loaded
      if (audioPlayerRef.current?.pause) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [pathname, currentAudio]);

  // Update current time
  useEffect(() => {
    if (!audioPlayerRef.current || !currentAudio) return;

    const updateTime = () => {
      if (audioPlayerRef.current?.getCurrentTime) {
        setCurrentTime(audioPlayerRef.current.getCurrentTime());
      }
      if (audioPlayerRef.current?.getDuration) {
        const dur = audioPlayerRef.current.getDuration();
        if (dur > 0) {
          setDuration(dur);
        }
      }
    };

    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, [currentAudio]);

  const playAudio = useCallback((audio: AudioItem) => {
    setCurrentAudio(audio);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioPlayerRef.current?.play) {
        audioPlayerRef.current.play();
      }
    }, 100);
  }, []);

  const pauseAudio = useCallback(() => {
    setIsPlaying(false);
    if (audioPlayerRef.current?.pause) {
      audioPlayerRef.current.pause();
    }
  }, []);

  const resumeAudio = useCallback(() => {
    setIsPlaying(true);
    if (audioPlayerRef.current?.play) {
      audioPlayerRef.current.play();
    }
  }, []);

  const stopAudio = useCallback(() => {
    setIsPlaying(false);
    setCurrentAudio(null);
    setCurrentTime(0);
    setDuration(0);
    if (audioPlayerRef.current?.pause) {
      audioPlayerRef.current.pause();
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioPlayerRef.current?.setCurrentTime) {
      audioPlayerRef.current.setCurrentTime(time);
      setCurrentTime(time);
    }
  }, []);

  const goToNext = useCallback(() => {
    if (currentAudio?.nextUrl) {
      window.location.href = currentAudio.nextUrl;
    }
  }, [currentAudio]);

  const goToPrevious = useCallback(() => {
    if (currentAudio?.prevUrl) {
      window.location.href = currentAudio.prevUrl;
    }
  }, [currentAudio]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentAudio,
        isPlaying,
        currentTime,
        duration,
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
        seekTo,
        goToNext,
        goToPrevious,
        audioPlayerRef,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}


