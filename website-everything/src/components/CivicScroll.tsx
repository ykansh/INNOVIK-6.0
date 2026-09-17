"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const FRAME_COUNT = 157;

export default function CivicScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Load images on mount
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/sequence/frame_${i}.jpg`;
      img.onload = () => {
        loadCount++;
        setLoaded(loadCount);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Canvas drawing
  useEffect(() => {
    if (loaded < FRAME_COUNT || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const progress = smoothProgress.get();
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.floor(progress * FRAME_COUNT))
      );
      
      const img = images[frameIndex];
      if (!img) return;

      // Set canvas to a fixed 1920x1080 resolution for a clean cinematic fit
      canvas.width = 1920;
      canvas.height = 1080;
      
      ctx.clearRect(0, 0, 1920, 1080);
      
      // Draw the image to fill the 1920x1080 canvas
      ctx.drawImage(img, 0, 0, 1920, 1080);
    };

    const unsubscribe = smoothProgress.on("change", () => {
      requestAnimationFrame(render);
    });

    render();
    window.addEventListener("resize", render);
    
    return () => {
      unsubscribe();
      window.removeEventListener("resize", render);
    };
  }, [loaded, images, smoothProgress]);

  const heroOpacity = useTransform(smoothProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.1, 0.15], [0, 0, -20]);

  const indicatorOpacity = useTransform(smoothProgress, [0, 0.05, 0.1], [1, 1, 0]);

  const finalOpacity = useTransform(smoothProgress, [0.8, 0.9, 1], [0, 1, 1]);
  const finalY = useTransform(smoothProgress, [0.8, 0.9], [20, 0]);

  const percent = Math.floor((loaded / FRAME_COUNT) * 100);
  const filled = Math.floor(percent / 5);
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);

  return (
    <>
      {loaded < FRAME_COUNT && (
        <div className="fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-center bg-[#050505] text-white">
          <h1 className="text-4xl font-bold tracking-tight mb-4">CVQ</h1>
          <p className="text-white/60 mb-2 font-mono text-sm">Loading civic experience...</p>
          <p className="font-mono text-sm text-white/40">{bar} {percent}%</p>
        </div>
      )}

      <div ref={containerRef} className="relative h-[400vh] w-full bg-[#050505]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          />

          {/* LOGO */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50 pointer-events-auto">
            <div className="bg-black/35 backdrop-blur-[2px] px-4 py-2 md:px-6 md:py-3 rounded-lg border border-white/10 shadow-lg flex items-center justify-center">
              <img src="/logo.png" alt="CVQ Logo" className="h-12 md:h-16 w-auto object-contain" />
            </div>
          </div>
          
          {/* BEAT A — OPENING / HERO */}
          <motion.div 
            style={{ opacity: heroOpacity, y: heroY }}
            className="absolute bottom-0 left-0 flex flex-col justify-end text-left px-6 md:px-16 lg:px-24 pb-24 md:pb-32 pointer-events-none z-10 w-full md:w-[60%] lg:w-[45%]"
          >
            <div className="bg-[#050505]/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white/95 mb-3 md:mb-4 drop-shadow-xl">
                SEE A PROBLEM.<br />MAKE IT VISIBLE.
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-white/70 font-medium leading-relaxed">
                CVQ connects citizens with the people responsible for making our cities better.
              </p>
            </div>
          </motion.div>

          {/* SCROLL INDICATOR */}
          <motion.div
            style={{ opacity: indicatorOpacity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none text-white/40 text-xs font-semibold tracking-widest z-10"
          >
            SCROLL TO EXPLORE
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              ↓
            </motion.div>
          </motion.div>

          {/* BEAT B — FINAL MESSAGE */}
          <motion.div
            style={{ opacity: finalOpacity, y: finalY }}
            className="absolute bottom-0 right-0 flex flex-col justify-end text-left px-6 md:px-16 lg:px-24 pb-24 md:pb-32 pointer-events-none z-10 w-full md:w-[60%] lg:w-[45%]"
          >
            <div className="bg-[#050505]/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/5 shadow-2xl">
              <div className="text-white/40 text-xs font-semibold tracking-widest mb-4">
                PROBLEMS SHOULD NOT STOP AT A REPORT.
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white/95 mb-3 md:mb-4 leading-tight drop-shadow-xl">
                FROM REPORT TO REAL CHANGE.
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-white/70 font-medium leading-relaxed">
                From reporting a civic issue to seeing action on the ground — CVQ helps turn citizen voices into visible change.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
