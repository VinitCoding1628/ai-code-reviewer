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
  className
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reducedMotion = useReducedMotion();

  return (
    <span
      ref={ref}
      data-slot="text-highlighter"
      className={cn("relative inline-block", className)}
    >
      {/* Painted first so the text stacks above it without a negative
          z-index, which would fall behind an ancestor's background. */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: reducedMotion ? 0 : duration,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.5
        }}
        style={{ background: color }}
        className="absolute -inset-x-1 inset-y-0 origin-left rounded-sm"
      />
      <span className="relative">{children}</span>
    </span>
  );
}
