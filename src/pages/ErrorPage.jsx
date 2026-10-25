import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

import { ShimmerButton } from "@/components/velora/shimmer-button";
import { SpotlightCard } from "@/components/velora/spotlight-card";

const DIGITS = ["4", "0", "4"];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function AnimatedDigit({ digit, index }) {
  return (
    <motion.span
      className="relative inline-block select-none font-semibold tabular-nums tracking-tighter"
      initial={{ opacity: 0, y: 48, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 14,
        delay: index * 0.1,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-primary/30 via-primary/10 to-transparent blur-2xl"
      />
      <span
        className="relative bg-linear-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-[clamp(4.5rem,18vw,8.5rem)] leading-none text-transparent"
      >
        {digit}
      </span>
    </motion.span>
  );
}

const ErrorPage = () => {
  return (
    <section
      className="relative flex min-h-[calc(100dvh-4.5rem)] items-center justify-center overflow-hidden px-4 pb-16 pt-24 sm:px-6 dark:bg-transparent"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_10%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_10%,transparent)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_at_center,black_35%,transparent_82%)] dark:bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_40%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_40%,transparent)_1px,transparent_1px)] dark:mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      <motion.div
        className="relative z-10 w-full max-w-xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <SpotlightCard
          color="color-mix(in oklab, var(--primary) 18%, transparent)"
          className="border-border/60 bg-card/80 p-6 shadow-lg shadow-primary/5 backdrop-blur-xl sm:p-10"
        >
          <motion.div variants={item} className="mb-6 flex justify-center">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <SearchX className="size-3.5 text-primary" aria-hidden />
              404 · Page not found
            </span>
          </motion.div>

          <motion.div
            variants={item}
            className="flex items-center justify-center gap-1 sm:gap-2"
            aria-hidden
          >
            {DIGITS.map((digit, index) => (
              <AnimatedDigit key={index} digit={digit} index={index} />
            ))}
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            This route doesn&apos;t exist
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            Looks like you took a wrong turn — this route doesn’t exist.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex justify-center">
            <Link to="/" className="w-full  sm:w-auto">
              <ShimmerButton className="h-11 w-full">
                Back to home
              </ShimmerButton>
            </Link>
          </motion.div>
        </SpotlightCard>
      </motion.div>
    </section>
  );
};

export default ErrorPage;
