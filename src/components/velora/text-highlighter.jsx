"use client";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Marker-pen sweep that draws behind the text when it scrolls into view.
 * Useful for the one phrase in a paragraph that has to land.
 */
export function TextHighlighter({
  children,
  color = "color-mix(in srgb, var(--primary) 28%, transparent)",
  duration = 0.7,
  className,
  /** Skip IntersectionObserver — animate on mount (e.g. above-the-fold hero). */
  immediate = false,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.15,
    margin: "0px 0px -5% 0px",
  });
  const reducedMotion = useReducedMotion();
  const shouldAnimate = immediate || inView;

  return (
    <span
      ref={ref}
      data-slot="text-highlighter"
      className="relative inline-block"
    >
      {/* Painted first so the text stacks above it without a negative
          z-index, which would fall behind an ancestor's background. */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: shouldAnimate ? 1 : 0 }}
        transition={{
          duration: reducedMotion ? 0 : duration,
          ease: [0.22, 1, 0.36, 1],
          delay: reducedMotion ? 0 : immediate ? 0.35 : 0.5,
        }}
        style={{
          background: color,
          transformOrigin: "left center",
        }}
        className="absolute -inset-x-1 inset-y-0 z-0 rounded-sm will-change-transform"
      />
      <span className={cn("relative z-[1]", className)}>{children}</span>
    </span>
  );
}
