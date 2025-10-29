"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

type Step = {
  title: string;
  text: string;
};

const STEPS: Step[] = [
  {
    title: "The global hub for blockchain innovation",
    text:
      "BlockchainCenter.com connects governments, universities, and private industry to accelerate responsible adoption worldwide.",
  },
  {
    title: "A federated network of national Blockchain Centers",
    text:
      "Neutral infrastructure enabling nations to build local ecosystems aligned to a shared global framework.",
  },
  {
    title: "Shaping digital sovereignty and Web3 governance",
    text:
      "Guiding organizations with standards, education, and collaboration toward a trusted, decentralized future.",
  },
];

function PillarCard({ title, text }: { title: string; text: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const dprRef = useRef<number>(1);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const DOT_SPACING = 12; // px
    const BASE_R = 0.8; // px
    const GROWTH = 1.4; // px
    const RADIUS = 160; // px
    const COLOR = { r: 255, g: 255, b: 255 };

    const render = () => {
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create an internal grid of dots
      const cols = Math.ceil(rect.width / DOT_SPACING) + 1;
      const rows = Math.ceil(rect.height / DOT_SPACING) + 1;

      const mouse = mouseRef.current;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cx = x * DOT_SPACING + (DOT_SPACING / 2);
          const cy = y * DOT_SPACING + (DOT_SPACING / 2);

          let influence = 0;
          if (mouse) {
            const dx = mouse.x - (rect.left + cx);
            const dy = mouse.y - (rect.top + cy);
            const dist = Math.hypot(dx, dy);
            const t = 1 - Math.min(1, dist / RADIUS);
            influence = t > 0 ? Math.pow(t, 1.4) : 0; // softer falloff
          }

          if (influence <= 0) continue; // invisible when far

          const r = BASE_R + influence * GROWTH;
          const a = 0.08 + influence * 0.22; // closer -> more alpha
          ctx.fillStyle = `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, ${a.toFixed(0)})`;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-lg border border-white/10 bg-[#090909] p-6 backdrop-blur-sm">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />
      <h5 className="relative text-lg sm:text-xl font-semibold mb-2">{title}</h5>
      <p className="relative text-gray-300">{text}</p>
    </div>
  );
}

export default function AboutPage() {
  const heroLineRefs = useRef<HTMLSpanElement[]>([]);
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<HTMLDivElement[]>([]);
  const textRefs = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero lines slide-up
      gsap.set(heroLineRefs.current, { yPercent: 100, opacity: 0 });
      gsap.to(heroLineRefs.current, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        delay: 0.2,
      });

      // Pinned grid with holds + quick transitions on a scrubbed timeline
      const allBlocks = [...titleRefs.current, ...textRefs.current];
      gsap.set(allBlocks, { autoAlpha: 0 });
      if (titleRefs.current[0] && textRefs.current[0]) {
        gsap.set([titleRefs.current[0], textRefs.current[0]], { autoAlpha: 1 });
      }

      const HOLD = 1; // hold length (scroll units)
      const TRANSITION = 0.15; // quick crossfade (scroll units)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current!,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: pinSectionRef.current!,
          invalidateOnRefresh: true,
        },
      });

      tl.to({}, { duration: HOLD });
      tl.to([titleRefs.current[0], textRefs.current[0]], { autoAlpha: 0, duration: TRANSITION, ease: "power1.out" });
      tl.to([titleRefs.current[1], textRefs.current[1]], { autoAlpha: 1, duration: TRANSITION, ease: "power1.out" }, "<");
      tl.to({}, { duration: HOLD });
      tl.to([titleRefs.current[1], textRefs.current[1]], { autoAlpha: 0, duration: TRANSITION, ease: "power1.out" });
      tl.to([titleRefs.current[2], textRefs.current[2]], { autoAlpha: 1, duration: TRANSITION, ease: "power1.out" }, "<");
      tl.to({}, { duration: HOLD });
    }, pinSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen w-full">
      {/* Hero */}
      <section className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="overflow-hidden">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            <span
              ref={(el) => {
                if (el) heroLineRefs.current[0] = el;
              }}
              className="inline-block"
            >
                Blockchain Center
            </span>
          </h1>
        </div>
        <div className="mt-2 overflow-hidden">
          <h2 className="text-xl font-normal text-gray-300 sm:text-2xl md:text-3xl">
            <span
              ref={(el) => {
                if (el) heroLineRefs.current[1] = el;
              }}
              className="inline-block"
            >
              A Global Framework for the Decentralized Era
            </span>
          </h2>
        </div>
      </section>

      {/* Pinned grid section wrapped in tall trigger for holds */}
      <div ref={triggerRef} style={{ height: "400vh" }} className="relative">
        <section ref={pinSectionRef} className="relative h-screen w-full">
          {/* Cross lines */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/15" />
          </div>

          {/* 2x2 grid */}
          <div className="grid h-full w-full grid-cols-2 grid-rows-2">
            {/* Top-left */}
            <div className="relative flex items-end justify-end p-6 sm:p-10 text-right">
              {STEPS.map((step, i) => (
                <div
                  key={`title-${i}`}
                  ref={(el) => {
                    if (el) titleRefs.current[i] = el;
                  }}
                  className="absolute max-w-[80%]"
                >
                  <h3 className="text-2xl font-semibold sm:text-4xl md:text-5xl">{step.title}</h3>
                </div>
              ))}
            </div>

            {/* Top-right (empty) */}
            <div />

            {/* Bottom-left (empty) */}
            <div />

            {/* Bottom-right */}
            <div className="relative flex items-start justify-start p-6 sm:p-10 text-left">
              {STEPS.map((step, i) => (
                <div
                  key={`text-${i}`}
                  ref={(el) => {
                    if (el) textRefs.current[i] = el;
                  }}
                  className="absolute max-w-xl text-gray-300"
                >
                  <p className="text-base sm:text-lg md:text-xl">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Extra spacer to continue natural scroll after pin */}
      <div className="h-[40vh]" />

      {/* Vision */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">
        <div className="max-w-3xl">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">The CERN of Blockchain</h3>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
            Founded on the vision of creating “the CERN of Blockchain,” Blockchain Center serves as a neutral,
            international infrastructure that empowers nations to develop their own blockchain ecosystems—responsibly,
            transparently, and with shared standards of excellence.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-8 sm:pb-12">
        <h4 className="text-xl sm:text-2xl font-semibold mb-6">How we help</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <PillarCard
            title="Build Infrastructure"
            text="Establish research labs, regulatory sandboxes, and digital asset frameworks."
          />
          <PillarCard
            title="Educate & Certify Talent"
            text="Deliver blockchain literacy, technical training, and accredited certifications."
          />
          <PillarCard
            title="Accelerate Innovation"
            text="Support startups, enterprises, and public institutions building blockchain solutions."
          />
          <PillarCard
            title="Foster Collaboration"
            text="Bridge academia, industry, and policymakers to shape the digital economy."
          />
        </div>
      </section>

      {/* Federated Model */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl sm:text-2xl font-semibold mb-3">Federated, aligned, and interoperable</h4>
            <p className="text-gray-300 leading-relaxed">
              Each Blockchain Center operates under a federated model, aligned with local priorities but united by a
              common global framework—ensuring progress remains inclusive, interoperable, and impact-driven.
            </p>
          </div>
          <div>
            <h4 className="text-xl sm:text-2xl font-semibold mb-3">Built for digital sovereignty</h4>
            <p className="text-gray-300 leading-relaxed">
              As the world transitions toward digital sovereignty and Web3 governance, Blockchain Center stands as a
              trusted guide—helping every nation and organization participate in the future of trust and transparency.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="rounded-xl border border-white/10 bg-[#090909] p-8 sm:p-10 text-center">
          <h4 className="text-2xl sm:text-3xl font-semibold mb-3">Join the network</h4>
          <p className="text-gray-300 mb-6">
            Partner with Blockchain Center to launch a national center, certify talent, or accelerate innovation.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-2 text-sm text-white hover:border-white/20 hover:bg-white/5 transition-colors"
          >
            Contact us
          </a>
        </div>
      </section>
    </main>
  );
}


