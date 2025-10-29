"use client";
import { useEffect, useRef } from "react";

interface NoiseEffectProps {
  className?: string;
  opacity?: number;
}

export default function NoiseEffect({ className = "", opacity = 0.07 }: NoiseEffectProps) {
  const noiseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noiseElement = noiseRef.current;
    if (!noiseElement) return;

    let animationId: number;

    const animate = () => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      noiseElement.style.transform = `translate(${x}px, ${y}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={noiseRef}
      className={`noise-overlay ${className}`}
      style={{
        pointerEvents: "none",
        position: "fixed",
        top: "-25vh",
        left: "-25vw",
        width: "150vw",
        height: "150vh",
        zIndex: 10,
        backgroundImage: 'url("/images/noise.png")',
        backgroundSize: "200px 200px",
        backgroundRepeat: "repeat",
        opacity,
        willChange: "transform",
        mixBlendMode: "normal",
      }}
    />
  );
}


