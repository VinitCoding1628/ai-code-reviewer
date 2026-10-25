"use client";;
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Marker-pen sweep that draws behind the text when it scrolls into view.
 * Useful for the one phrase in a paragraph that has to land.
 */
export function TextHighlighter({
  children,
  color = "color-mix(in oklch, var(--primary) 20%, transparent)",
  duration = 0.7,
  className,
  /** Skip IntersectionObserver — use for above-the-fold copy that is always visible on load. */
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
        initial={{ scaleX: immediate ? 1 : 0 }}
        animate={shouldAnimate ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: reducedMotion ? 0 : duration,
          ease: [0.22, 1, 0.36, 1],
          delay: immediate ? 0 : 0.5
        }}
        style={{ background: color }}
        className="absolute -inset-x-1 inset-y-0 origin-left rounded-sm"
      />
      <span className={cn("relative", className)}>{children}</span>
    </span>
  );
}
