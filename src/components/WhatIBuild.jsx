/**
 * WhatIBuild.jsx  �  "What I Build" sticky stacked-card scroll section
 *
 * Animation contract:
 *  - Each card is position:sticky, each one sits a step lower than the last.
 *  - As a card enters its sticky zone it arrives rotated (3�) and scaled (0.94).
 *    It straightens and scales to 1 as it settles.
 *  - Settled cards do not move again � they are covered by the next.
 *  - Mobile (=768px): plain vertical stack with whileInView fade-up.
 *  - prefers-reduced-motion: all cards rendered in settled state, no animation.
 *
 * Self-contained: .wib-* class names, zero global style changes.
 * All colors come from the existing CSS custom properties.
 */

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

/* --------------------------------------------------------------
   CARD DATA
   -------------------------------------------------------------- */
const CARDS = [
  {
    index: "01",
    heading: "Data dashboards\nthat ship fast",
    body: "I build product interfaces around real data � sales analytics, expense trackers, petrol station pipelines. The emphasis is always on something a person can open on day one and immediately read.",
    cta: "View analytics project",
    ctaHref: "https://github.com/safvenn/SALES-ANALETCIS",
    bg: "#ECD06F",
    textColor: "#171717",
    borderColor: "#171717",
    shadowColor: "#171717",
    images: [
      { src: "/wib-card1-dashboard.jpg", alt: "Sales analytics dashboard UI" },
      { src: "/wib-card1-expense.jpg",   alt: "Expense tracker app UI"         },
    ],
  },
  {
    index: "02",
    heading: "Interaction\nthat feels alive",
    body: "This section is built exactly the way I build motion: scroll-driven, entering with a hint of rotation, settling into place. I use Framer Motion to add weight and intention � not decoration.",
    cta: "View Bikespot project",
    ctaHref: "https://github.com/safvenn",
    bg: "#FF9398",
    textColor: "#171717",
    borderColor: "#171717",
    shadowColor: "#171717",
    images: [
      { src: "/wib-card2-motion.jpg",    alt: "Scroll-driven animation design"  },
      { src: "/wib-card2-micro.jpg",     alt: "Mobile micro-interactions"       },
    ],
  },
  {
    index: "03",
    heading: "Full sites &\nlanding pages",
    body: "Portfolio sites, campaign pages, multi-section landing pages. I start with the type scale and motion system before touching layout, so the design holds together at every breakpoint.",
    cta: "View trip project",
    ctaHref: "https://github.com/safvenn",
    bg: "#49C5B6",
    textColor: "#171717",
    borderColor: "#171717",
    shadowColor: "#171717",
    images: [
      { src: "/wib-card3-landing.jpg",   alt: "SaaS marketing landing page"     },
      { src: "/wib-card3-portfolio.jpg", alt: "Neobrutalist portfolio site"      },
    ],
  },
  {
    index: "04",
    heading: "Data pipelines\n& AI backends",
    body: "End-to-end: raw CSV in, FastAPI out, Gemini AI insight on top. I have processed 150 K-row datasets, built RAG pipelines, and connected ML models to production REST APIs.",
    cta: "View petrol analytics project",
    ctaHref: "https://github.com/safvenn/petrol-pumb-analysis",
    bg: "#171717",
    textColor: "#FFF8E8",
    borderColor: "#FFF8E8",
    shadowColor: "rgba(255,248,232,0.25)",
    images: [
      { src: "/wib-card4-api.jpg",       alt: "FastAPI Swagger documentation"   },
      { src: "/wib-card4-pipeline.jpg",  alt: "ML data pipeline architecture"   },
    ],
  },
  {
    index: "05",
    heading: "Generative AI\n& LLM apps",
    body: "Prompt engineering, RAG pipelines, vector search, hallucination guardrails. I connect Gemini and OpenAI models to real data sources and wrap them in production-ready APIs - not just chat demos.",
    cta: "View AI analytics project",
    ctaHref: "https://github.com/safvenn/SALES-ANALETCIS",
    bg: "#ECD06F",
    textColor: "#171717",
    borderColor: "#171717",
    shadowColor: "#171717",
    images: [
      { src: "/wib-card5-ai.jpg",  alt: "Generative AI chat interface with sales analysis" },
      { src: "/wib-card5-rag.jpg", alt: "RAG pipeline architecture diagram"                },
    ],
  },
  {
    index: "06",
    heading: "Intelligent\nautomation",
    body: "n8n workflows, scheduled Python scrapers, auto-generated Power BI reports. I replace repetitive manual tasks with reliable pipelines that run at 09:00 every morning without anyone pressing a button.",
    cta: "View automation work",
    ctaHref: "https://github.com/safvenn",
    bg: "#FF9398",
    textColor: "#171717",
    borderColor: "#171717",
    shadowColor: "#171717",
    images: [
      { src: "/wib-card6-n8n.jpg",    alt: "n8n workflow automation canvas"           },
      { src: "/wib-card6-report.jpg", alt: "Auto-generated analytics report dashboard" },
    ],
  },
];

/* --------------------------------------------------------------
   LAYOUT CONSTANTS
   -------------------------------------------------------------- */
const NAV_H   = 80;  // px: nav bar height
const STEP_PX = 22;  // px: vertical offset between each stacked card edge

/* --------------------------------------------------------------
   SCOPED CSS � injected once into <head>
   -------------------------------------------------------------- */
const STYLES = `
.wib-section {
  position: relative;
  padding-top: 7rem;
  background: var(--primary-dark);
  background-image: radial-gradient(rgba(23,23,23,0.08) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
}

/* -- Header -- */
.wib-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 3.5rem;
}
.wib-label {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  font-family: var(--font-display);
  font-size: .78rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--ink);
  padding: .4rem 1.1rem;
  border: 2px solid var(--ink);
  border-radius: var(--radius-pill);
  background: var(--secondary);
  margin-bottom: 1.25rem;
  box-shadow: 3px 3px 0 var(--ink);
  transform: rotate(-1deg);
}
.wib-h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem,4.5vw,3.2rem);
  font-weight: 800;
  letter-spacing: -.03em;
  line-height: 1.1;
  color: var(--ink);
  margin-bottom: .85rem;
}
.wib-subhead {
  font-family: var(--font-main);
  font-size: 1rem;
  color: var(--text-2);
  max-width: 520px;
  line-height: 1.7;
}

/* -- Track -- */
.wib-track {
  position: relative;
}

/* -- Sticky wrapper per card -- */
.wib-sticky {
  position: sticky;
  width: 100%;
  display: flex;
  justify-content: center;
  /* top and height set inline */
}

/* -- Card surface -- */
.wib-card {
  width: 100%;
  max-width: 1100px;
  border-radius: var(--radius-lg);
  border: 2px solid;
  overflow: hidden;
  will-change: transform;
}
.wib-card-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 460px;
}

/* Left: text */
.wib-card-content {
  padding: 3rem 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.75rem;
}
.wib-card-top { display: flex; flex-direction: column; gap: 1rem; }
.wib-index {
  font-family: var(--font-mono);
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .08em;
  opacity: .55;
}
.wib-h3 {
  font-family: var(--font-display);
  font-size: clamp(1.85rem,3.2vw,2.8rem);
  font-weight: 800;
  letter-spacing: -.035em;
  line-height: 1.1;
  white-space: pre-line;
  margin: 0;
}
.wib-body {
  font-family: var(--font-main);
  font-size: .95rem;
  line-height: 1.7;
  max-width: 42ch;
  opacity: .82;
}
.wib-cta {
  display: inline-flex;
  align-items: center;
  gap: .55rem;
  padding: .75rem 1.5rem;
  border-radius: var(--radius-pill);
  font-family: var(--font-main);
  font-size: .85rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  border: 2px solid;
  transition: transform .2s var(--ease), box-shadow .2s var(--ease);
  white-space: nowrap;
  align-self: flex-start;
}
@media (hover:hover) and (pointer:fine) { .wib-cta:hover  { transform: translate(2px,2px); } }
.wib-cta:active { transform: translate(4px,4px); }

/* Right: images */
.wib-card-visuals {
  padding: 2.5rem 2.5rem 2.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: flex-end;
}
.wib-thumb {
  width: 100%;
  max-width: 340px;
  border-radius: var(--radius);
  border: 2px solid;
  object-fit: cover;
  aspect-ratio: 16 / 9;
  display: block;
}

/* -- Bottom spacer -- */
.wib-spacer { height: 7rem; }

/* --- MOBILE FALLBACK --------------- */
@media (max-width: 768px) {
  .wib-section { padding-top: 4rem; }
  .wib-header { padding: 0 1.25rem 2.5rem; }
  .wib-track {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 0 1.25rem 2rem;
  }
  .wib-sticky {
    position: static !important;
    top: auto !important;
    height: auto !important;
  }
  .wib-card { max-width: 100%; border-radius: 16px; }
  .wib-card-inner { grid-template-columns: 1fr; min-height: auto; }
  .wib-card-content { padding: 1.75rem 1.5rem; gap: 1.25rem; }
  .wib-card-visuals {
    padding: 0 1.5rem 1.5rem;
    flex-direction: row;
    align-items: flex-start;
    overflow-x: auto;
    scrollbar-width: none;
    gap: .75rem;
  }
  .wib-card-visuals::-webkit-scrollbar { display: none; }
  .wib-thumb { min-width: 160px; max-width: 200px; flex-shrink: 0; }
  .wib-h3 { font-size: 1.6rem; white-space: normal; }
  .wib-body { font-size: .88rem; }
  .wib-spacer { height: 3rem; }
}

/* --- REDUCED MOTION ---------------- */
@media (prefers-reduced-motion: reduce) {
  .wib-sticky {
    position: static !important;
    top: auto !important;
    height: auto !important;
  }
  .wib-track {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 0 2rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  .wib-card { max-width: 100%; }
  .wib-spacer { display: none; }
}
`;

/* --------------------------------------------------------------
   CARD CONTENT (shared between modes)
   -------------------------------------------------------------- */
function CardContent({ card }) {
  const isDark      = card.bg === "#171717";
  const ctaBorder   = isDark ? "#FFF8E8" : "#171717";
  const ctaBg       = isDark ? "rgba(255,248,232,0.08)" : "rgba(23,23,23,0.07)";
  const ctaShadow   = isDark ? "#FFF8E8" : "#171717";
  const thumbShadow = isDark ? "rgba(255,248,232,0.2)"  : "#171717";
  const thumbBorder = isDark ? "rgba(255,248,232,0.3)"  : "#171717";

  return (
    <div className="wib-card-inner">
      {/* Left column */}
      <div className="wib-card-content">
        <div className="wib-card-top">
          <span className="wib-index" style={{ color: card.textColor }}>
            ({card.index})
          </span>
          <h3 className="wib-h3" style={{ color: card.textColor }}>
            {card.heading}
          </h3>
        </div>

        <p className="wib-body" style={{ color: card.textColor }}>
          {card.body}
        </p>

        <a
          href={card.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="wib-cta"
          style={{
            color: card.textColor,
            borderColor: ctaBorder,
            background: ctaBg,
            boxShadow: `3px 3px 0 ${ctaShadow}`,
          }}
        >
          {card.cta} <ArrowRight size={14} />
        </a>
      </div>

      {/* Right column */}
      <div className="wib-card-visuals">
        {card.images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            loading="lazy"
            className="wib-thumb"
            style={{
              boxShadow: `4px 4px 0 ${thumbShadow}`,
              borderColor: thumbBorder,
              transform: i % 2 === 0 ? "rotate(-1.2deg)" : "rotate(0.8deg)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------
   ANIMATED CARD WRAPPER (desktop scroll-driven)
   -------------------------------------------------------------- */
function AnimatedCard({ card, index, totalCards, isMobile, reduceMotion }) {
  const stickyTop    = NAV_H + index * STEP_PX;
  const cardHeight   = `calc(100dvh - ${stickyTop}px)`;

  // Scroll range for this card's entry (fraction of the full page)
  // We split [0..1] into (totalCards + 1) slices.
  const sliceSize  = 1 / (totalCards + 1);
  const rangeStart = index * sliceSize;
  const rangeEnd   = rangeStart + sliceSize * 0.55; // settle within first 55% of slice

  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [rangeStart, rangeEnd], [0, 1], { clamp: true });
  const rotate   = useTransform(progress, [0, 1], [3, 0]);
  const scale    = useTransform(progress, [0, 1], [0.94, 1]);
  const yEntry   = useTransform(progress, [0, 1], [40, 0]);

  // -- Mobile / reduced-motion: no sticky, just a fade-in reveal --
  if (isMobile || reduceMotion) {
    return (
      <div className="wib-sticky" style={{ top: stickyTop }}>
        <motion.div
          className="wib-card"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{
            duration: 0.55,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: index * 0.07,
          }}
          style={{
            background:  card.bg,
            borderColor: card.borderColor,
            boxShadow:   `4px 4px 0 ${card.shadowColor}`,
          }}
        >
          <CardContent card={card} />
        </motion.div>
      </div>
    );
  }

  // -- Desktop: scroll-driven enter --
  return (
    <div
      className="wib-sticky"
      style={{ top: stickyTop, height: cardHeight }}
    >
      <motion.div
        className="wib-card"
        style={{
          background:     card.bg,
          borderColor:    card.borderColor,
          boxShadow:      `4px 4px 0 ${card.shadowColor}`,
          rotate,
          scale,
          y: yEntry,
          transformOrigin: "bottom center",
        }}
      >
        <CardContent card={card} />
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------------
   SECTION HEADER
   -------------------------------------------------------------- */
function WibHeader() {
  return (
    <div className="wib-header">
      <motion.div
        className="wib-label"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.45 }}
      >
        How I Work
      </motion.div>

      <motion.h2
        id="wib-heading"
        className="wib-h2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        What I Build
      </motion.h2>

      <motion.p
        className="wib-subhead"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.45, delay: 0.2 }}
      >
        Four ways I actually work � scroll through to see each one settle into place.
      </motion.p>
    </div>
  );
}

/* --------------------------------------------------------------
   MAIN EXPORT
   -------------------------------------------------------------- */
export default function WhatIBuild() {
  const reduceMotion = useReducedMotion();

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const totalCards  = CARDS.length;
  // Track height: (N + 1) viewport heights gives each card ~1vh of scroll room
  // plus an initial viewport for the section heading to scroll into view.
  const trackHeight = `${totalCards + 1}00dvh`;

  return (
    <>
      <style>{STYLES}</style>

      <section
        id="what-i-build"
        className="wib-section"
        aria-labelledby="wib-heading"
      >
        <WibHeader />

        <div
          className="wib-track"
          style={
            !isMobile && !reduceMotion
              ? { height: trackHeight }
              : undefined
          }
        >
          {CARDS.map((card, i) => (
            <AnimatedCard
              key={card.index}
              card={card}
              index={i}
              totalCards={totalCards}
              isMobile={isMobile}
              reduceMotion={!!reduceMotion}
            />
          ))}
        </div>

        {!isMobile && !reduceMotion && <div className="wib-spacer" />}
      </section>
    </>
  );
}
