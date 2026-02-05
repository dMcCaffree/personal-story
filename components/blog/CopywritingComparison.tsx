"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

const examples = [
  {
    category: "Headline",
    ai: "Revolutionize Your Workflow with Our Cutting-Edge Platform",
    human: "Your workflow is broken. We fixed it.",
    aiFlags: [
      "Vague promise ('revolutionize')",
      "Buzzword overload ('cutting-edge')",
      "No specific value",
    ],
    humanWins: [
      "Direct and honest",
      "Addresses pain point",
      "Makes a bold claim",
    ],
  },
  {
    category: "Product Description",
    ai: "Seamlessly integrate with your existing tools to boost productivity and drive results across your organization with our innovative solution.",
    human: "We plug into Slack, Gmail, and Notion. Stop switching tabs. Save 2 hours a day.",
    aiFlags: [
      "Generic benefits",
      "No specifics ('existing tools')",
      "Corporate jargon",
    ],
    humanWins: [
      "Names specific integrations",
      "Concrete benefit (2 hours)",
      "Clear problem solved",
    ],
  },
  {
    category: "CTA",
    ai: "Get Started Today and Transform Your Business",
    human: "Start your free trial (no credit card needed)",
    aiFlags: [
      "Overpromises ('transform')",
      "Creates anxiety ('today')",
      "No friction acknowledgment",
    ],
    humanWins: [
      "Clear action",
      "Addresses objection",
      "Low-pressure framing",
    ],
  },
  {
    category: "Feature",
    ai: "Our advanced analytics engine leverages machine learning algorithms to provide actionable insights that empower data-driven decision making.",
    human: "See which features people actually use. Then build more of those.",
    aiFlags: [
      "Technical jargon spam",
      "Vague outcome ('insights')",
      "Buzzword bingo",
    ],
    humanWins: [
      "Plain English",
      "Specific use case",
      "Clear cause and effect",
    ],
  },
  {
    category: "About Us",
    ai: "We're a passionate team of innovators dedicated to delivering exceptional experiences and empowering our customers to achieve their goals.",
    human: "We got tired of switching between 15 apps to ship one feature. So we built this.",
    aiFlags: [
      "Generic platitudes",
      "No real story",
      "Could apply to anyone",
    ],
    humanWins: [
      "Origin story",
      "Specific pain point",
      "Relatable frustration",
    ],
  },
];

export function CopywritingComparison() {
  const { theme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const example = examples[selectedIndex];

  return (
    <div className="my-12">
      {/* Category selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.category}
            type="button"
            onClick={() => setSelectedIndex(examples.indexOf(ex))}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              selectedIndex === examples.indexOf(ex)
                ? theme === "dark"
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-black/40 bg-black/10 text-black"
                : theme === "dark"
                  ? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                  : "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
            }`}
          >
            {ex.category}
          </button>
        ))}
      </div>

      {/* Comparison */}
      <div className="relative">
        <AnimatePresence initial={false}>
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, filter: "blur(10px)", position: "absolute", inset: 0 }}
            animate={{ opacity: 1, filter: "blur(0px)", position: "relative" }}
            exit={{ opacity: 0, filter: "blur(10px)", position: "absolute", inset: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-4"
        >
          {/* AI Version */}
          <div
            className={`rounded-xl border backdrop-blur-xl p-6 ${
              theme === "dark"
                ? "border-red-500/30 bg-red-500/5"
                : "border-red-500/30 bg-red-50/50"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`font-mono text-sm font-bold ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                🤖 AI-Generated
              </span>
              <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                Generic
              </span>
            </div>
            <p
              className={`mb-4 text-lg italic leading-relaxed ${
                theme === "dark" ? "text-white/90" : "text-black/90"
              }`}
            >
              &quot;{example.ai}&quot;
            </p>
            <div className="space-y-1">
              {example.aiFlags.map((flag, i) => (
                <div
                  key={flag}
                  className={`flex items-start gap-2 text-sm ${
                    theme === "dark" ? "text-red-400" : "text-red-700"
                  }`}
                >
                  <span className="text-xs">❌</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Human Version */}
          <div
            className={`rounded-xl border backdrop-blur-xl p-6 ${
              theme === "dark"
                ? "border-green-500/30 bg-green-500/5"
                : "border-green-500/30 bg-green-50/50"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`font-mono text-sm font-bold ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                ✍️ Human-Written
              </span>
              <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
                Memorable
              </span>
            </div>
            <p
              className={`mb-4 text-lg font-medium leading-relaxed ${
                theme === "dark" ? "text-white/90" : "text-black/90"
              }`}
            >
              &quot;{example.human}&quot;
            </p>
            <div className="space-y-1">
              {example.humanWins.map((win, i) => (
                <div
                  key={win}
                  className={`flex items-start gap-2 text-sm ${
                    theme === "dark" ? "text-green-400" : "text-green-700"
                  }`}
                >
                  <span className="text-xs">✅</span>
                  <span>{win}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        </AnimatePresence>
      </div>

      {/* Writing checklist */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`mt-6 rounded-xl border backdrop-blur-xl p-6 ${
          theme === "dark"
            ? "border-white/20 bg-white/5"
            : "border-black/20 bg-black/5"
        }`}
      >
        <h4
          className={`mb-3 font-bold ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          The Human Copy Checklist:
        </h4>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Use specific numbers, not vague promises",
            "Name actual tools/integrations",
            "Address one pain point clearly",
            "Write how you'd actually speak",
            "Cut all buzzwords and jargon",
            "Make a claim you can defend",
          ].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className={`flex items-start gap-2 text-sm ${
                theme === "dark" ? "text-white/70" : "text-black/70"
              }`}
            >
              <span className="text-blue-500">•</span>
              <span>{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Final insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-4 rounded-lg border p-4 text-sm ${
          theme === "dark"
            ? "border-white/10 bg-white/5 text-white/60"
            : "border-black/10 bg-black/5 text-black/60"
        }`}
      >
        <span className="font-bold">The test:</span> If you can swap your brand
        name with a competitor&apos;s and the copy still works, it&apos;s too generic.
        Good copy is *specific* to your product and your users&apos; problems.
      </motion.div>
    </div>
  );
}

