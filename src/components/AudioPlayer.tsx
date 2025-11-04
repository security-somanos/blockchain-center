"use client";

import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";

export type AudioPlayerHandle = {
  play: () => Promise<void>;
  pause: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setCurrentTime: (time: number) => void;
  getAudioElement: () => HTMLAudioElement | null;
};

type AudioPlayerProps = {
  src: string;
  autoplay?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onLoadedMetadata?: () => void;
};

export const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  ({ src, autoplay = false, className = "", onPlay, onPause, onTimeUpdate, onLoadedMetadata }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useImperativeHandle(ref, () => ({
      play: async () => {
        if (audioRef.current) {
          try {
            await audioRef.current.play();
            onPlay?.();
          } catch (error) {
            console.error("Error playing audio:", error);
          }
        }
      },
      pause: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          onPause?.();
        }
      },
      getCurrentTime: () => {
        return audioRef.current?.currentTime || 0;
      },
      getDuration: () => {
        return audioRef.current?.duration || 0;
      },
      setCurrentTime: (time: number) => {
        if (audioRef.current) {
          audioRef.current.currentTime = time;
        }
      },
      getAudioElement: () => {
        return audioRef.current;
      },
    }));

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const handleTimeUpdate = () => {
        onTimeUpdate?.(audio.currentTime);
      };

      const handleLoadedMetadata = () => {
        onLoadedMetadata?.();
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }, [onTimeUpdate, onLoadedMetadata]);

    return (
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoplay}
        className={className}
        preload="metadata"
      />
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";


