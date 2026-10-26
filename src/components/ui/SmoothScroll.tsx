"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { useAppStore, selectScrollProgress, selectScrollVelocity } from "@/lib/store";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollProgress = useAppStore((s) => s.setScrollProgress);
  const setScrollVelocity = useAppStore((s) => s.setScrollVelocity);
  const lastProgress = useRef(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis scroll with Zustand store
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(progress);
      setScrollVelocity(progress - lastProgress.current);
      lastProgress.current = progress;
    };

    lenis.on("scroll", onScroll);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setScrollProgress, setScrollVelocity]);

  return <>{children}</>;
}
