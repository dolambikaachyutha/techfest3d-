"use client";

import { motion } from "framer-motion";

const footerLinks = [
  { label: "ABOUT", href: "#" },
  { label: "EVENTS", href: "#events" },
  { label: "COMPETITIONS", href: "#competitions" },
  { label: "WORKSHOPS", href: "#workshops" },
  { label: "SPONSORS", href: "#sponsors" },
  { label: "CONTACT", href: "#contact" },
  { label: "REGISTER", href: "#register" },
];

const socialLinks = [
  { label: "INSTAGRAM", icon: "◎" },
  { label: "TWITTER", icon: "◈" },
  { label: "YOUTUBE", icon: "▶" },
  { label: "LINKEDIN", icon: "◆" },
];

export default function FooterCore() {
  return (
    <footer className="relative py-32 px-4 md:px-16 overflow-hidden">
      {/* Giant core sphere */}
      <div className="flex flex-col items-center mb-20">
        {/* Rotating rings */}
        <div className="relative w-48 h-48 mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border border-signal-cyan/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border border-signal-cyan/15"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-6 rounded-full border border-signal-cyan/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          {/* Core glow */}
          <div className="absolute inset-10 rounded-full flex items-center justify-center">
            <motion.div
              className="w-20 h-20 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(76,224,210,0.4) 0%, rgba(76,224,210,0.05) 70%)",
              }}
              animate={{
                boxShadow: [
                  "0 0 30px rgba(76,224,210,0.2), 0 0 60px rgba(76,224,210,0.1)",
                  "0 0 50px rgba(76,224,210,0.4), 0 0 100px rgba(76,224,210,0.15)",
                  "0 0 30px rgba(76,224,210,0.2), 0 0 60px rgba(76,224,210,0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          {/* Center point */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: "#4CE0D2",
                boxShadow: "0 0 20px rgba(76,224,210,0.8)",
              }}
            />
          </div>
        </div>

        <div className="font-mono text-[9px] text-signal-cyan mb-2" style={{ letterSpacing: "0.2em" }}>
          THE TECHFEST CORE
        </div>
        <div className="font-display text-3xl md:text-5xl font-bold text-ice text-center">
          THE FUTURE IS NOT SOMETHING
          <br />
          THAT HAPPENS TO US.
        </div>
        <div className="font-display text-3xl md:text-5xl font-bold text-center mt-2">
          <span className="bg-gradient-to-r from-signal-cyan to-quantum-violet bg-clip-text text-transparent">
            IT IS SOMETHING WE BUILD.
          </span>
        </div>
      </div>

      {/* Links grid */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {footerLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="font-mono text-[10px] text-ice-dim hover:text-signal-cyan transition-colors text-center py-2"
              style={{ letterSpacing: "0.1em" }}
              whileHover={{ y: -2 }}
              data-cursor="NAVIGATE"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-6 mb-12">
          {socialLinks.map((social) => (
            <motion.button
              key={social.label}
              className="font-mono text-[10px] text-ice-dim hover:text-signal-cyan transition-colors flex items-center gap-2 cursor-pointer"
              style={{ letterSpacing: "0.08em" }}
              whileHover={{ y: -2 }}
              data-cursor="OPEN"
            >
              <span>{social.icon}</span>
              <span className="hidden md:inline">{social.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-circuit-line pt-6 text-center">
          <div className="font-mono text-[9px] text-ice-dim" style={{ letterSpacing: "0.1em" }}>
            TECHFEST IIT BOMBAY 2027 · THE SENTIENT MULTIVERSE
          </div>
          <div className="font-mono text-[8px] text-ice-dim mt-1" style={{ letterSpacing: "0.08em" }}>
            WHERE THE FUTURE BECOMES REAL
          </div>
        </div>
      </div>

      {/* Final call to action */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <div className="font-display text-2xl md:text-4xl font-bold text-ice mb-2">
          WELCOME TO TECHFEST 2027
        </div>
        <div className="font-display text-lg md:text-2xl font-bold bg-gradient-to-r from-signal-cyan to-quantum-violet bg-clip-text text-transparent mb-8">
          WHERE THE FUTURE BECOMES REAL
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="#register"
            className="font-mono text-sm text-signal-cyan border border-signal-cyan/50 px-8 py-3 rounded hover:bg-signal-cyan/10 transition-all text-center"
            style={{ letterSpacing: "0.12em" }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(76,224,210,0.3)" }}
            whileTap={{ scale: 0.95 }}
            data-cursor="JOIN THE MULTIVERSE"
          >
            REGISTER NOW
          </motion.a>
          <motion.a
            href="#events"
            className="font-mono text-sm text-ice-dim border border-ice-dim/30 px-8 py-3 rounded hover:text-ice hover:border-ice/50 transition-all text-center"
            style={{ letterSpacing: "0.12em" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-cursor="EXPLORE"
          >
            EXPLORE EVENTS
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
