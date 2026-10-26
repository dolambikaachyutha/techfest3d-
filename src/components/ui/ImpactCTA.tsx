"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import MagneticButton from "./MagneticButton";

const techDomains = [
  { icon: "🤖", label: "AI/ML", x: "10%", y: "20%", delay: 0 },
  { icon: "⚡", label: "Robotics", x: "80%", y: "15%", delay: 0.1 },
  { icon: "🚀", label: "Space", x: "15%", y: "75%", delay: 0.2 },
  { icon: "🔮", label: "Quantum", x: "85%", y: "70%", delay: 0.3 },
  { icon: "🌱", label: "Green Tech", x: "50%", y: "10%", delay: 0.4 },
  { icon: "🧠", label: "Neuroscience", x: "50%", y: "85%", delay: 0.5 },
  { icon: "💡", label: "IoT", x: "25%", y: "45%", delay: 0.6 },
  { icon: "🎮", label: "Gaming", x: "75%", y: "45%", delay: 0.7 },
];

export default function ImpactCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Full-screen cinematic CTA */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Background effects */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(76,224,210,0.06) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.04) 0%, transparent 40%), radial-gradient(ellipse at 80% 20%, rgba(255,61,138,0.03) 0%, transparent 40%)",
          }}
        />

        {/* Orbiting tech domain icons */}
        <div className="absolute inset-0 pointer-events-none">
          {techDomains.map((tech, i) => (
            <motion.div
              key={tech.label}
              className="absolute"
              style={{ left: tech.x, top: tech.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 0.4, scale: 1 } : undefined}
              transition={{ duration: 0.8, delay: 0.5 + tech.delay, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-2xl md:text-3xl"
                style={{ filter: "drop-shadow(0 0 12px rgba(76,224,210,0.3))" }}
              >
                {tech.icon}
              </motion.div>
              <div
                className="font-mono text-[8px] text-center mt-1"
                style={{ color: "rgba(154,172,196,0.3)", letterSpacing: "0.1em" }}
              >
                {tech.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Central content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          style={{ scale }}
        >
          {/* Eyebrow */}
          <motion.div
            className="font-mono text-xs text-signal-cyan/60 mb-8"
            style={{ letterSpacing: "0.25em" }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            JANUARY 16-18, 2027 // IIT BOMBAY
          </motion.div>

          {/* Main headline */}
          <motion.h2
            className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-ice">THE</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #4CE0D2 0%, #8B5CF6 50%, #FF3D8A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FUTURE
            </span>
            <br />
            <span className="text-ice">AWAITS</span>
          </motion.h2>

          {/* Divider */}
          <motion.div
            className="h-px mx-auto mb-8"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(76,224,210,0.4), transparent)",
              maxWidth: 200,
            }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Subtext */}
          <motion.p
            className="font-body text-lg md:text-xl text-ice-dim/60 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Join 100,000+ innovators, builders, and dreamers for three days that redefine what technology can be. 
            This is not an event you attend. This is a universe you enter.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton
              className="font-mono text-sm text-void bg-signal-cyan px-10 py-4 rounded-sm hover:bg-signal-cyan/90 transition-all duration-300 font-bold"
              label="REGISTER NOW"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <span style={{ letterSpacing: "0.12em" }}>REGISTER NOW</span>
            </MagneticButton>
            <MagneticButton
              className="font-mono text-sm text-signal-cyan border border-signal-cyan/40 px-10 py-4 rounded-sm hover:bg-signal-cyan/10 transition-all duration-300"
              label="EXPLORE EVENTS"
            >
              <span style={{ letterSpacing: "0.12em" }}>EXPLORE EVENTS</span>
            </MagneticButton>
          </motion.div>

          {/* Micro details */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-16"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            {[
              { label: "VENUE", value: "IIT BOMBAY" },
              { label: "DAYS", value: "JAN 16-18" },
              { label: "EVENTS", value: "500+" },
              { label: "PRIZES", value: "₹15L+" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-mono text-[9px] text-ice-dim/30 mb-1" style={{ letterSpacing: "0.15em" }}>
                  {item.label}
                </div>
                <div className="font-mono text-sm text-ice/80" style={{ letterSpacing: "0.08em" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll-to-top hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: [0, 0.5, 0] } : undefined}
          transition={{ duration: 2, delay: 1.5, repeat: Infinity }}
        >
          <div className="font-mono text-[10px] text-ice-dim/40" style={{ letterSpacing: "0.1em" }}>
            ↑ SCROLL TO EXPLORE ↑
          </div>
        </motion.div>
      </div>
    </section>
  );
}
