"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

function AnimatedCounter({ target, suffix = "", delay = 0 }: { target: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      const duration = 2000;
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setCount(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, target, delay]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const stats = [
    { value: 100000, suffix: "+", label: "ATTENDEES", description: "Annual footfall across 3 days" },
    { value: 500, suffix: "+", label: "EVENTS", description: "Competitions, workshops, talks" },
    { value: 42, suffix: "", label: "NATIONS", description: "Global participation" },
    { value: 25, suffix: "+", label: "YEARS", description: "Of innovation legacy" },
  ];

  const features = [
    { icon: "◈", title: "AI SUMMIT", desc: "Keynotes from frontier researchers. Live demos of next-gen models. Panel discussions on alignment and safety.", accent: "#4CE0D2" },
    { icon: "⬡", title: "ROBOWARS", desc: "30kg combat robots. Autonomous and driver-controlled. Metal flies. Last machine standing wins.", accent: "#5B8DEF" },
    { icon: "⟐", title: "HACKFEST 36H", desc: "36-hour build sprint. 500 teams. Real problems. Ship something that matters.", accent: "#8B5CF6" },
    { icon: "✦", title: "SPACE TECH", desc: "Cubesat design. Orbital mechanics. Launch window calculations. Build the future of space.", accent: "#6366F1" },
    { icon: "◉", title: "QUANTUM LAB", desc: "Real quantum hardware. Implement Shor's algorithm. Error correction deep-dive.", accent: "#FF3D8A" },
    { icon: "◎", title: "SUSTAINABILITY", desc: "Green tech. Smart cities. Renewable grids. Technology that heals the planet.", accent: "#FFB347" },
  ];

  return (
    <section ref={sectionRef} className="relative py-0 overflow-hidden">
      {/* Hero-style full-bleed intro */}
      <div className="relative min-h-screen flex items-center justify-center px-4 md:px-12">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(76,224,210,0.04) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(139,92,246,0.03) 0%, transparent 50%)",
          }}
        />

        <motion.div
          className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          style={{ y: parallaxY }}
        >
          {/* Left: large editorial text */}
          <div>
            <motion.div
              className="font-mono text-xs text-signal-cyan/60 mb-6"
              style={{ letterSpacing: "0.2em" }}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              ABOUT // TECHFEST IIT BOMBAY
            </motion.div>

            <motion.h2
              className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-ice">ASIA&apos;S</span>
              <br />
              <span className="text-ice">LARGEST</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #4CE0D2, #8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SCIENCE
              </span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #FF3D8A)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                FESTIVAL
              </span>
            </motion.h2>

            <motion.p
              className="font-body text-lg md:text-xl text-ice-dim/70 leading-relaxed max-w-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              Three days where 100,000+ minds converge to explore AI, robotics, quantum computing, space technology, and sustainability. Not just a festival — an encounter with the future.
            </motion.p>

            <motion.div
              className="h-px mb-8"
              style={{
                background: "linear-gradient(90deg, #4CE0D2, transparent)",
                maxWidth: 160,
              }}
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={isInView ? { scaleX: 1 } : undefined}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.p
              className="font-body text-sm text-ice-dim/50 leading-relaxed max-w-md"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              Founded in 1998, Techfest has grown from a college symposium into a global platform for innovation. Every year, it brings together students, researchers, industry leaders, and dreamers to push the boundaries of what technology can achieve.
            </motion.p>
          </div>

          {/* Right: Stats grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="relative p-6 rounded-xl overflow-hidden"
                style={{
                  background: "rgba(12, 18, 32, 0.5)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(76,224,210,0.08)",
                }}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : undefined}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -2, borderColor: "rgba(76,224,210,0.2)" }}
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-signal-cyan mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} delay={400 + i * 150} />
                </div>
                <div className="font-mono text-[10px] text-ice/80 mb-2" style={{ letterSpacing: "0.15em" }}>
                  {stat.label}
                </div>
                <div className="font-body text-xs text-ice-dim/40">
                  {stat.description}
                </div>
                {/* Accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, rgba(76,224,210,0.3), transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Feature grid — full-width cinematic */}
      <div className="relative py-24 md:py-32 px-4 md:px-12 lg:px-20">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="font-mono text-xs text-signal-cyan/50 mb-4" style={{ letterSpacing: "0.2em" }}>
            WHAT AWAITS // THE EXPERIENCE
          </div>
          <h3 className="font-display text-3xl md:text-4xl font-bold text-ice mb-16">
            SIX WORLDS.{" "}
            <span style={{ background: "linear-gradient(135deg, #4CE0D2, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              INFINITE DISCOVERY.
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="group relative p-8 rounded-xl cursor-pointer overflow-hidden"
                style={{
                  background: "rgba(12, 18, 32, 0.4)",
                  border: `1px solid ${feat.accent}10`,
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, borderColor: `${feat.accent}30` }}
                data-cursor="EXPLORE"
              >
                <div className="text-3xl mb-4" style={{ color: feat.accent, filter: `drop-shadow(0 0 8px ${feat.accent}30)` }}>
                  {feat.icon}
                </div>
                <h4 className="font-display text-lg font-bold text-ice mb-3">{feat.title}</h4>
                <p className="font-body text-sm text-ice-dim/60 leading-relaxed">{feat.desc}</p>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 100%, ${feat.accent}08 0%, transparent 70%)` }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
