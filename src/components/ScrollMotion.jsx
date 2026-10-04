"use client";

import { useRef, useState } from "react";
import {
  motion as Motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { motionTokens } from "../lib/motion-tokens";

const elements = {
  div: Motion.div,
  article: Motion.article,
  button: Motion.button,
  h2: Motion.h2,
};

// Observe each item separately so long mobile lists never wait for a whole row.
export function Reveal({ as = "div", order = 0, children, ...props }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const [focused, setFocused] = useState(false);
  const Element = elements[as];
  const visible = reduce || inView || focused;

  return (
    <Element
      {...props}
      ref={ref}
      data-scroll-reveal=""
      initial={reduce ? false : { opacity: 0, y: motionTokens.distance.lg }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : motionTokens.distance.lg }}
      exit={{ opacity: 0 }}
      transition={{
        duration: reduce || focused ? 0 : motionTokens.duration.slow,
        ease: motionTokens.easing.smooth,
        delay: reduce || focused ? 0 : order * motionTokens.stagger,
      }}
      onFocusCapture={() => setFocused(true)}
    >
      {children}
    </Element>
  );
}

export function HeroArtwork({ children }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, motionTokens.portrait.travel]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, motionTokens.portrait.rotation]);

  return (
    <div ref={ref} className="hero-artwork-anchor">
      <Motion.div className="hero-artwork" style={reduce ? undefined : { y, rotate }}>
        {children}
      </Motion.div>
    </div>
  );
}

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (reduce) return null;

  return (
    <Motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}
