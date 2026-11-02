import { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import { cancelFrame, frame } from "motion/react";

import "lenis/dist/lenis.css";

/**
 * Lenis smooth scroll driven by Motion's frame loop (see motion.dev/docs/lenis).
 * Use with `root` on long pages; unmount to restore native scroll on other routes.
 */
export function SmoothScroll({ children, className, options }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    function update({ timestamp }) {
      lenisRef.current?.lenis?.raf(timestamp);
    }

    frame.setup(update, true);

    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      className={className}
      options={{
        autoRaf: false,
        lerp: 0.08,
        smoothWheel: true,
        ...options,
      }}
    >
      {children}
    </ReactLenis>
  );
}
