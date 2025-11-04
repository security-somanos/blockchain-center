"use client";

import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

export type HTML5VideoPlayerHandle = {
  play: () => Promise<void>;
  pause: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setCurrentTime: (time: number) => void;
  getVideoElement: () => HTMLVideoElement | null;
};

type HTML5VideoPlayerProps = {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onLoadedMetadata?: () => void;
};

export const HTML5VideoPlayer = forwardRef<HTML5VideoPlayerHandle, HTML5VideoPlayerProps>(
  ({ src, poster, autoplay = false, controls = true, className = "", onPlay, onPause, onTimeUpdate, onLoadedMetadata }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(ref, () => ({
      play: async () => {
        if (videoRef.current) {
          try {
            await videoRef.current.play();
            onPlay?.();
          } catch (error) {
            console.error("Error playing video:", error);
          }
        }
      },
      pause: () => {
        if (videoRef.current) {
          videoRef.current.pause();
          onPause?.();
        }
      },
      getCurrentTime: () => {
        return videoRef.current?.currentTime || 0;
      },
      getDuration: () => {
        return videoRef.current?.duration || 0;
      },
      setCurrentTime: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time;
        }
      },
      getVideoElement: () => {
        return videoRef.current;
      },
    }));

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleTimeUpdate = () => {
        onTimeUpdate?.(video.currentTime);
      };

      const handleLoadedMetadata = () => {
        onLoadedMetadata?.();
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }, [onTimeUpdate, onLoadedMetadata]);

    return (
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={controls}
        autoPlay={autoplay}
        playsInline
        className={className}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    );
  }
);

HTML5VideoPlayer.displayName = "HTML5VideoPlayer";

