"use client";

import { motion } from "framer-motion";
import PortfolioSection from "./PortfolioSection";

const tiers = [
  {
    name: "PLATINUM",
    color: "#EAF2FF",
    sponsors: ["TECHGIANT", "QUANTUM LABS", "NEURAL CORP", "ORBIT SYSTEMS"],
  },
  {
    name: "GOLD",
    color: "#FFB347",
    sponsors: ["DATAFLOW", "SYNTHWAVE AI", "CIRCUITRY", "PHOTON", "VOID TECH"],
  },
  {
    name: "SILVER",
    color: "#9AACC4",
    sponsors: ["ALGOX", "BYTEFORCE", "HEXACORE", "NOVA DYNAMICS", "PRISM", "ZENITH"],
  },
];

export default function SponsorsUniverse() {
  return (
    <PortfolioSection
      label="SPONSORS UNIVERSE // OUR CONSTELLATION"
      heading="POWERED BY STARS"
      headingGradient="linear-gradient(135deg, #FFB347, #4CE0D2)"
      description="WANT TO JOIN THE CONSTELLATION? — SPONSOR@TECHFEST.IITB.AC.IN"
      accent="#FFB347"
      index={5}
    >
      <div className="max-w-5xl mx-auto space-y-12">
        {tiers.map((tier, ti) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: ti * 0.15 }}
            viewport={{ once: true }}
          >
            <div
              className="font-mono text-[9px] mb-4"
              style={{ letterSpacing: "0.15em", color: tier.color }}
            >
              // {tier.name}
            </div>
            <div className="flex flex-wrap gap-4">
              {tier.sponsors.map((name) => (
                <div
                  key={name}
                  className="glass-panel px-6 py-4 group cursor-pointer relative overflow-hidden"
                  style={{
                    borderColor: `${tier.color}20`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${tier.color}08 0%, transparent 70%)`,
                    }}
                  />
                  <span
                    className="font-mono text-xs relative z-10 transition-colors duration-300"
                    style={{ letterSpacing: "0.1em", color: tier.color }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-center font-mono text-[10px] text-ice-dim mt-16"
        style={{ letterSpacing: "0.08em" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        WANT TO JOIN THE CONSTELLATION? — SPONSOR@TECHFEST.IITB.AC.IN
      </motion.p>
    </PortfolioSection>
  );
}
