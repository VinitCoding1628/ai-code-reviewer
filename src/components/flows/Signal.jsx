
import React from "react";
import { motion } from "framer-motion";
import {
  Bug,
  ChartNoAxesColumnIncreasing,
  ShieldCheck,
  FileCheck2,
  Sparkles,
} from "lucide-react";

import javascriptIcon from "../../assets/languages/javascript.svg";
import pythonIcon from "../../assets/languages/python.svg";
import cppIcon from "../../assets/languages/cpp.svg";
import typescriptIcon from "../../assets/languages/typescript.svg";
import logo from '../../assets/images/logo.svg'

const VIEWBOX_HEIGHT = 500;

const inputs = [
  {
    name: "JavaScript",
    src: javascriptIcon,
    color: "#FFF8D6",
    y: 45,
  },
  {
    name: "Python",
    src: pythonIcon,
    color: "#E8F4FF",
    y: 155,
  },
  {
    name: "C++",
    src: cppIcon,
    color: "#E7EFFF",
    y: 285,
  },
  {
    name: "TypeScript",
    src: typescriptIcon,
    color: "#E1F0FF",
    y: 405,
  },
];

const results = [
  {
    title: "Bug Detection",
    description: "Find potential bugs and logical issues.",
    Icon: Bug,
    color: "#EF4444",
    bg: "#FFF0F0",
    y: 35,
  },
  {
    title: "Performance",
    description: "Get suggestions to improve performance.",
    Icon: ChartNoAxesColumnIncreasing,
    color: "#F59E0B",
    bg: "#FFF5E5",
    y: 155,
  },
  {
    title: "Best Practices",
    description:
      "Follow industry standards and clean code principles.",
    Icon: ShieldCheck,
    color: "#10A66A",
    bg: "#E8FBEF",
    y: 275,
  },
  {
    title: "Suggested Fixes",
    description:
      "Apply AI-generated fixes with clear explanations.",
    Icon: FileCheck2,
    color: "#2583EA",
    bg: "#EAF4FF",
    y: 405,
  },
];

/*
 * Left paths:
 * Start at each input and curve inward toward the AI node.
 * Their curvature mirrors the branching curves on the right.
 */
const leftPaths = [
  "M 80 65 C 300 65, 375 250, 465 250 S 535 250, 570 250",
  "M 80 175 C 300 175, 375 250, 465 250 S 535 250, 570 250",
  "M 80 305 C 300 305, 375 250, 465 250 S 535 250, 570 250",
  "M 80 425 C 300 425, 375 250, 465 250 S 535 250, 570 250",
];

/*
 * Right paths:
 * Start at the AI node and branch toward the review result cards.
 */
// const rightPaths = [
//   "M 630 250 C 700 250, 745 65, 850 65 S 930 65, 1010 65",
//   "M 630 250 C 720 250, 755 175, 850 175 S 930 175, 1010 175",
//   "M 630 250 C 720 250, 755 305, 850 305 S 930 305, 1010 305",
//   "M 630 250 C 700 250, 745 425, 850 425 S 930 425, 1010 425",
// ];


const rightPaths = [
  "M 630 250 C 700 250, 745 65, 850 65 S 960 65, 1100 65",
  "M 630 250 C 720 250, 755 175, 850 175 S 960 175, 1100 175",
  "M 630 250 C 720 250, 755 305, 850 305 S 960 305, 1100 305",
  "M 630 250 C 700 250, 745 425, 850 425 S 960 425, 1100 425",
];

function FlowParticle({
  d,
  index,
  motionBegin,
  visibleOpacity,
  r,
  fill,
  filter,
}) {
  const dur = `${3.5 + index * 0.35}s`;

  return (
    <circle r={r} fill={fill} opacity="0" filter={filter}>
      <animate
        attributeName="opacity"
        from="0"
        to={visibleOpacity}
        dur="0.01s"
        begin={`${motionBegin}s`}
        fill="freeze"
      />
      <animateMotion
        dur={dur}
        begin={`${motionBegin}s`}
        repeatCount="indefinite"
        path={d}
      />
    </circle>
  );
}

function AnimatedPath({ d, index, side }) {
  const isLeft = side === "left";
  const particleColor = isLeft ? "#EF4444" : "#10B981";

  // Inputs animate first; output particles start afterward.
  const particleDelay = isLeft
    ? index * 0.55
    : 2.7 + index * 0.45;

  const pathDelay = isLeft
    ? index * 0.12
    : 1.8 + index * 0.12;

  return (
    <g>
      {/* Static base line */}
      <path
        d={d}
        fill="none"
        stroke="#789F95"
        strokeWidth="1.5"
        strokeOpacity="0.65"
        strokeLinecap="round"
      />

      {/* Animated path drawing */}
      <motion.path
        d={d}
        fill="none"
        stroke={particleColor}
        strokeWidth="1.7"
        strokeOpacity="0.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{
          duration: 1.4,
          delay: pathDelay,
          ease: "easeInOut",
        }}
      />

      <FlowParticle
        d={d}
        index={index}
        motionBegin={particleDelay}
        visibleOpacity={1}
        r={4}
        fill={particleColor}
        filter="url(#code-review-glow)"
      />
      <FlowParticle
        d={d}
        index={index}
        motionBegin={particleDelay}
        visibleOpacity={0.14}
        r={9}
        fill={particleColor}
      />
      <FlowParticle
        d={d}
        index={index}
        motionBegin={particleDelay + 1.5}
        visibleOpacity={0.8}
        r={2.5}
        fill={particleColor}
      />
    </g>
  );
}

function LanguageCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.1,
      }}
      className="absolute z-10 flex items-center rounded-md bg-white p-1 shadow-[0_6px_25px_rgba(15,23,42,0.08)] backdrop-blur sm:p-1.5 left-[1%] sm:left-[2%] md:left-[3%]"
      style={{
        top: `${(item.y / VIEWBOX_HEIGHT) * 100}%`,
        transform: "translateY(-50%)",
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-xl"
      >
        <img
          src={item.src}
          alt={`${item.name} logo`}
          className="h-5 w-5 object-contain sm:h-7 sm:w-7 md:h-8 md:w-8"
        />
      </span>
    </motion.div>
  );
}

function ResultCard({ item, index }) {
  const { title, description, Icon, color, bg, y } = item;

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: 0.5 + index * 0.12,
      }}
      className="absolute z-10 flex items-center gap-2 rounded-md border border-white/80 bg-white/95 px-2 py-1.5 shadow-[0_6px_25px_rgba(15,23,42,0.08)] backdrop-blur sm:gap-3 sm:px-3 sm:py-2 md:px-4 right-0 sm:-right-[2%] md:-right-[4%] lg:-right-[6%] w-[34%] min-w-[7.5rem] max-w-[11rem] sm:w-[30%] sm:max-w-[12rem] md:w-[24%] lg:w-[18%] lg:max-w-none"
      style={{
        top: `${(y / VIEWBOX_HEIGHT) * 100}%`,
        transform: "translateY(-50%)",
      }}
    >
      <span
        className="flex shrink-0 items-center justify-center rounded-xl p-1 sm:p-1.5"
        style={{
          backgroundColor: bg,
          color,
        }}
      >
        <Icon
          className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7"
          strokeWidth={2.1}
        />
      </span>

      <div className="min-w-0 flex-1">
        <h4 className="text-[9px] font-bold leading-tight text-slate-800 sm:text-[10px] md:text-xs lg:text-sm">
          {title}
        </h4>

        <p className="mt-0.5 line-clamp-2 text-[8px] leading-snug text-slate-500 sm:mt-1 sm:text-[9px] md:text-[10px] lg:line-clamp-none lg:text-xs">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Signal() {
  return (
    <section className="relative isolate w-full overflow-hidden py-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl lg:max-w-7xl px-3 sm:px-6">
        <div className="overflow-x-auto px-1 pb-1 sm:-mx-2 sm:px-2 lg:mx-0 lg:overflow-visible lg:px-0">
          <div
            className="relative mx-auto aspect-12/5 w-full lg:min-w-0"
            style={{ maxHeight: "min(70vh, 520px)" }}
          >
          <svg
            viewBox="0 0 1200 500"
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <filter
                id="code-review-glow"
                x="-200%"
                y="-200%"
                width="400%"
                height="400%"
              >
                <feGaussianBlur
                  stdDeviation="3"
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <radialGradient id="code-review-center-glow">
                <stop
                  offset="0%"
                  stopColor="#10B981"
                  stopOpacity="0.2"
                />
                <stop
                  offset="100%"
                  stopColor="#10B981"
                  stopOpacity="0"
                />
              </radialGradient>
            </defs>

            {/* Left-to-center paths */}
            {leftPaths.map((d, index) => (
              <AnimatedPath
                key={`left-${index}`}
                d={d}
                index={index}
                side="left"
              />
            ))}

            {/* Center-to-right paths */}
            {rightPaths.map((d, index) => (
              <AnimatedPath
                key={`right-${index}`}
                d={d}
                index={index}
                side="right"
              />
            ))}
          </svg>

          {/* Programming language cards */}
          {inputs.map((item, index) => (
            <LanguageCard
              key={item.name}
              item={item}
              index={index}
            />
          ))}

          {/* Center hub — circle aligned to SVG junction (50%, 50%) */}
          <div
            className="absolute left-1/2 top-1/2 z-20 w-[26%] -translate-x-1/2 -translate-y-1/2 sm:w-[24%] md:w-[23%]"
            style={{ aspectRatio: "1 / 1" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.2), transparent 70%)",
              }}
              animate={{
                scale: [0.9, 1.08, 0.9],
                opacity: [0.45, 0.9, 0.45],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute rounded-full border border-emerald-400/25 bg-emerald-300/10"
              style={{ inset: "20%" }}
              animate={{ scale: [1, 1.07, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4px border-white bg-white p-3 text-white shadow-[0_0_35px_rgba(16,185,129,0.3)] sm:border-[5px] sm:p-4 md:p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={logo}
                alt="AI Code Review"
                className="h-8 w-8 object-contain sm:h-10 sm:w-10 md:h-12 md:w-12"
              />
            </motion.div>
          </div>
          {/* Review result cards */}
          {results.map((item, index) => (
            <ResultCard
              key={item.title}
              item={item}
              index={index}
            />
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
