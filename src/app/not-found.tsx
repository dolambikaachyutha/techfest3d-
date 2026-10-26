"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void overflow-hidden">
      {/* Glitch lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-px bg-plasma-magenta/20"
          style={{ top: `${10 + i * 12}%` }}
          animate={{
            x: [0, i % 2 === 0 ? 20 : -20, 0, i % 2 === 0 ? -10 : 10, 0],
            opacity: [0.1, 0.4, 0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Static noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,61,138,0.1) 2px, transparent 4px)",
        }}
      />

      {/* Reality Not Found */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="font-mono text-[10px] text-plasma-magenta/60 mb-4"
          style={{ letterSpacing: "0.3em" }}
        >
          ERROR // DIMENSION_NOT_FOUND
        </div>

        <h1
          className="font-display text-6xl md:text-8xl font-bold text-ice mb-4"
          style={{
            textShadow: "0 0 40px rgba(255,61,138,0.3)",
          }}
        >
          REALITY
          <br />
          NOT FOUND
        </h1>

        <p className="font-body text-sm text-ice-dim mb-12 max-w-md mx-auto">
          You have strayed outside the boundaries of the Sentient Multiverse.
          This dimension does not exist — yet.
        </p>

        {/* Portal button */}
        <Link href="/">
          <motion.div
            className="relative inline-flex items-center justify-center w-24 h-24 cursor-pointer group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Spinning ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-signal-cyan/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border border-signal-cyan/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner glow */}
            <div className="absolute inset-4 rounded-full bg-signal-cyan/10 group-hover:bg-signal-cyan/20 transition-colors" />
            <span
              className="relative font-mono text-[9px] text-signal-cyan"
              style={{ letterSpacing: "0.12em" }}
            >
              RETURN
            </span>
          </motion.div>
        </Link>

        <div
          className="font-mono text-[9px] text-ice-dim/40 mt-6"
          style={{ letterSpacing: "0.1em" }}
        >
          RETURN TO MULTIVERSE
        </div>
      </motion.div>
    </div>
  );
}
