"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, selectCurrentSection } from "@/lib/store";

const novaResponses: Record<string, string[]> = {
  default: [
    "I'm NOVA, your guide through the Sentient Multiverse. What would you like to explore?",
    "Ask me about events, competitions, workshops, or sponsors!",
    "I can help you navigate any of the six worlds.",
  ],
  events: [
    "Techfest 2027 features 200+ events across AI, Robotics, Space Tech, Quantum Computing, and Sustainability. Want me to show you specific categories?",
  ],
  robowars: [
    "ROBOWARS: The mechanical arena where autonomous bots compete. Prize pool: ₹5,00,000. Registration opens January 2027. Shall I add it to your journey?",
  ],
  hackfest: [
    "HACKFEST 36H: A 36-hour marathon of code, creativity, and chaos. Teams of 4. Build the impossible. Prizes worth ₹3,00,000.",
  ],
  register: [
    "Registration for Techfest 2027 opens soon. Early birds get priority access to all workshops and exclusive merchandise. Want me to notify you?",
  ],
  schedule: [
    "Techfest 2027 runs January 16-18, 2027 at IIT Bombay. Day 1: Competitions. Day 2: Workshops & Exhibitions. Day 3: Main events & Closing Ceremony.",
  ],
  sponsors: [
    "Our sponsors include TechGiant, Quantum Labs, Neural Corp, and Orbit Systems. Each represents a pillar of innovation at Techfest.",
  ],
  location: [
    "Techfest 2027 is held at IIT Bombay, Powai, Mumbai. The campus transforms into six interconnected worlds during the festival.",
  ],
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("event") || lower.includes("what")) return novaResponses.events[0];
  if (lower.includes("robo") || lower.includes("war")) return novaResponses.robowars[0];
  if (lower.includes("hack") || lower.includes("code")) return novaResponses.hackfest[0];
  if (lower.includes("register") || lower.includes("sign")) return novaResponses.register[0];
  if (lower.includes("schedule") || lower.includes("when") || lower.includes("date")) return novaResponses.schedule[0];
  if (lower.includes("sponsor") || lower.includes("partner")) return novaResponses.sponsors[0];
  if (lower.includes("where") || lower.includes("location") || lower.includes("campus")) return novaResponses.location[0];
  return novaResponses.default[Math.floor(Math.random() * novaResponses.default.length)];
}

const sectionTips: Record<number, string> = {
  2: "Welcome to the City of Minds — hover the neural nodes to discover AI events!",
  3: "The Mechanical Kingdom awaits. Click the robotic arms to see Robowars specs.",
  4: "Cosmic Empire: explore the planets, each represents a Techfest category.",
  5: "Fractured Reality — quantum particles react to your cursor. Try clicking!",
  6: "Living Earth: help restore balance by interacting with energy nodes.",
  7: "Convergence: all worlds unite. The future is human.",
};

export default function NovaAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "nova"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const currentSection = useAppStore(selectCurrentSection);
  const messagesEnd = useRef<HTMLDivElement>(null);

  // Section-specific tips on first visit
  const visitedSections = useRef(new Set<number>());

  useEffect(() => {
    if (currentSection >= 2 && currentSection <= 7 && !visitedSections.current.has(currentSection)) {
      visitedSections.current.add(currentSection);
      const tip = sectionTips[currentSection];
      if (tip) {
        setMessages((prev) => [...prev, { role: "nova", text: tip }]);
      }
    }
  }, [currentSection]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(userMsg);
      setMessages((prev) => [...prev, { role: "nova", text: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating NOVA orb */}
      <motion.button
        className="fixed bottom-6 right-6 z-[120] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: "radial-gradient(circle, rgba(76,224,210,0.2) 0%, rgba(12,18,32,0.9) 70%)",
          border: "1px solid rgba(76,224,210,0.3)",
          boxShadow: isOpen
            ? "0 0 30px rgba(76,224,210,0.4)"
            : "0 0 15px rgba(76,224,210,0.2)",
        }}
        animate={{
          boxShadow: [
            "0 0 15px rgba(76,224,210,0.2)",
            "0 0 25px rgba(76,224,210,0.35)",
            "0 0 15px rgba(76,224,210,0.2)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        onClick={() => setIsOpen(!isOpen)}
        data-cursor="NOVA AI GUIDE"
      >
        <span className="text-signal-cyan text-sm font-mono" style={{ letterSpacing: "0.05em" }}>
          {minimized ? "◆" : "N"}
        </span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-[120] w-80 md:w-96"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(12, 18, 32, 0.92)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(76, 224, 210, 0.15)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-circuit-line">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-signal-cyan animate-pulse" />
                  <span className="font-mono text-[10px] text-signal-cyan" style={{ letterSpacing: "0.15em" }}>
                    NOVA AI
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-ice-dim" style={{ letterSpacing: "0.1em" }}>
                    ONLINE
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="font-mono text-[10px] text-ice-dim hover:text-ice cursor-pointer"
                  >
                    [X]
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="font-mono text-[10px] text-ice-dim mb-2" style={{ letterSpacing: "0.15em" }}>
                      HOW CAN WE GUIDE YOUR JOURNEY?
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                      {["Events", "Robowars", "HackFest", "Register", "Schedule"].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setInput(q);
                            setTimeout(() => {
                              setMessages((prev) => [...prev, { role: "user", text: q }]);
                              setIsTyping(true);
                              setTimeout(() => {
                                setMessages((prev) => [...prev, { role: "nova", text: getResponse(q) }]);
                                setIsTyping(false);
                              }, 800);
                            }, 100);
                          }}
                          className="font-mono text-[9px] text-signal-cyan border border-signal-cyan/30 px-3 py-1 rounded hover:bg-signal-cyan/10 transition-colors cursor-pointer"
                          style={{ letterSpacing: "0.08em" }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-xs font-body ${
                        msg.role === "user"
                          ? "bg-signal-cyan/10 text-ice"
                          : "bg-deep-slate/80 text-ice-dim"
                      }`}
                      style={{
                        border: msg.role === "nova" ? "1px solid rgba(76,224,210,0.1)" : "none",
                      }}
                    >
                      {msg.role === "nova" && (
                        <div className="font-mono text-[8px] text-signal-cyan mb-1" style={{ letterSpacing: "0.1em" }}>
                          NOVA //
                        </div>
                      )}
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-deep-slate/80 rounded-lg px-3 py-2 text-xs">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 h-1 rounded-full bg-signal-cyan"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEnd} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-circuit-line">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask NOVA anything..."
                    className="flex-1 bg-deep-slate/50 border border-circuit-line rounded px-3 py-2 font-mono text-[10px] text-ice placeholder:text-ice-dim/40 focus:outline-none focus:border-signal-cyan/50"
                    style={{ letterSpacing: "0.05em" }}
                  />
                  <button
                    onClick={handleSend}
                    className="font-mono text-[10px] text-signal-cyan border border-signal-cyan/40 px-3 py-2 hover:bg-signal-cyan/10 transition-colors cursor-pointer rounded"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
