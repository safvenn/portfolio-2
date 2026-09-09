import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
  Sparkles, CheckCircle2, ShieldCheck, QrCode, Cpu,
  ExternalLink, GraduationCap, BrainCircuit, Database,
  Layers, Code2, Globe, MapPin, Zap, RefreshCw
} from 'lucide-react';

/* ─── Holographic Specular Foil Sheen (Refined Minimal Sheen) ─── */
const FoilSheen = ({ isHovered }) => {
  return (
    <div
      className="id-foil-sheen"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        background: 'linear-gradient(125deg, transparent 25%, rgba(255,255,255,0.7) 42%, rgba(236,208,111,0.25) 50%, rgba(73,197,182,0.2) 58%, transparent 75%)',
        backgroundSize: '250% 250%',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: isHovered ? 0.6 : 0.15,
        mixBlendMode: 'overlay',
        transition: 'opacity 0.4s ease',
      }}
    />
  );
};

/* ─── Neo-Brutalist Lanyard Slot Punch Hole ─── */
const LanyardSlot = () => (
  <div style={{
    position: 'absolute',
    top: '11px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '46px',
    height: '9px',
    borderRadius: '9999px',
    background: '#171717',
    border: '1.5px solid #171717',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
    zIndex: 12,
  }} />
);

/* ─── Neo-Brutalist Gold SIM Smart Chip ─── */
const SmartChip = () => (
  <div style={{
    width: '40px',
    height: '28px',
    borderRadius: '6px',
    background: 'linear-gradient(135deg, #ECD06F 0%, #E5C352 50%, #D4B84A 100%)',
    border: '2px solid #171717',
    boxShadow: '2px 2px 0 #171717',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  }}>
    {/* Micro-traces */}
    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1.5px', background: '#171717' }} />
    <div style={{ position: 'absolute', left: '36%', top: 0, bottom: 0, width: '1.5px', background: '#171717' }} />
    <div style={{ position: 'absolute', right: '36%', top: 0, bottom: 0, width: '1.5px', background: '#171717' }} />
    <div style={{ position: 'absolute', top: '25%', left: '36%', right: '36%', bottom: '25%', borderRadius: '2px', border: '1.5px solid #171717' }} />
  </div>
);

/* ─── Stylized Neo-Brutal Barcode ─── */
const BarcodeSVG = ({ code = "PORTFOLIO ID: SF-2026" }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%' }}>
    <svg width="100%" height="20" viewBox="0 0 160 20" fill="none" style={{ display: 'block' }}>
      {[
        2, 5, 7, 11, 14, 17, 21, 24, 28, 30, 34, 38, 42, 45, 49, 53, 56, 60, 64, 67,
        71, 74, 77, 81, 84, 88, 92, 95, 99, 103, 107, 111, 114, 118, 122, 126, 130,
        134, 137, 141, 145, 149, 153, 156
      ].map((x, i) => (
        <rect
          key={i}
          x={x}
          y="0"
          width={i % 4 === 0 ? "2.2" : i % 6 === 0 ? "1.6" : "1"}
          height="20"
          fill="#171717"
          opacity={i % 2 === 0 ? "1" : "0.8"}
        />
      ))}
    </svg>
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.6rem',
      fontWeight: 800,
      letterSpacing: '0.12em',
      color: '#171717',
      textAlign: 'center',
    }}>
      {code}
    </div>
  </div>
);

/* ─── Security Matrix Graphic (Themed) ─── */
const MatrixGraphic = () => (
  <div style={{
    width: '44px',
    height: '44px',
    background: '#FFF8E8',
    border: '2px solid #171717',
    borderRadius: '8px',
    boxShadow: '2px 2px 0 #171717',
    padding: '4px',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridTemplateRows: 'repeat(5, 1fr)',
    gap: '2px',
    flexShrink: 0,
  }}>
    {[
      1,1,1,0,1,
      1,0,1,1,0,
      1,1,0,1,1,
      0,1,1,0,1,
      1,0,1,1,1
    ].map((val, idx) => (
      <div
        key={idx}
        style={{
          background: val ? '#49C5B6' : '#FF9398',
          borderRadius: '1px',
        }}
      />
    ))}
  </div>
);

/* =============================================
   MAIN DIGITAL ID CARD COMPONENT (ON-THEME NEO-BRUTAL)
   ============================================= */
export default function DigitalIdCard({ scrollProgress }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [manualFlipped, setManualFlipped] = useState(false);

  // Mouse tilt parallax values (subtle, exact constraint: X ±3deg, Y ±5deg)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(mouseY, { stiffness: 220, damping: 24 });
  const tiltY = useSpring(mouseX, { stiffness: 220, damping: 24 });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Strict bounded tilt: max Y ±5deg, max X ±3deg
    mouseX.set((x / (rect.width / 2)) * 5);
    mouseY.set(-(y / (rect.height / 2)) * 3);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Map scroll progress (0.15 to 0.78) into 0deg -> 180deg flip around Y axis
  const scrollRotateY = useTransform(
    scrollProgress,
    [0.15, 0.78],
    [0, 180]
  );
  const smoothScrollRotateY = useSpring(scrollRotateY, { stiffness: 120, damping: 24, mass: 0.8 });

  // Effective rotation combines scroll progress and manual toggle button
  const [effectiveRotateY, setEffectiveRotateY] = useState(0);

  useEffect(() => {
    const unsub = smoothScrollRotateY.on('change', (val) => {
      if (!manualFlipped) {
        setEffectiveRotateY(val);
      }
    });
    return () => unsub();
  }, [smoothScrollRotateY, manualFlipped]);

  const toggleManualFlip = (e) => {
    e?.stopPropagation();
    setManualFlipped(prev => {
      const next = !prev;
      setEffectiveRotateY(next ? 180 : 0);
      return next;
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        perspective: '1500px',
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* 3D Scene Wrapper with Mouse Parallax Tilt */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={toggleManualFlip}
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: 'preserve-3d',
          cursor: 'pointer',
          position: 'relative',
          width: 'clamp(320px, 92vw, 490px)',
          height: 'clamp(560px, 78vh, 720px)',
        }}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
      >
        {/* Flip Container (Synchronized with scroll progress) */}
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            rotateY: effectiveRotateY,
            position: 'relative',
          }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
        >
          {/* =========================================
              CARD FRONT: DIGITAL IDENTITY (NEO-BRUTAL THEME)
              ========================================= */}
          <div
            className="id-card-face id-card-front"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              background: '#FFF8E8',
              border: '2.5px solid #171717',
              boxShadow: isHovered ? '9px 9px 0 #171717' : '6px 6px 0 #171717',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.35rem',
              backgroundImage: 'radial-gradient(rgba(23, 23, 23, 0.04) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            <LanyardSlot />
            <FoilSheen isHovered={isHovered} />

            {/* Top Row: SmartChip, ID Code, India Badge */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.65rem',
              marginBottom: '0.6rem',
              zIndex: 4,
            }}>
              {/* Chip & Security Code */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <SmartChip />
                <div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#171717',
                  }}>
                    AI-2026
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    color: '#171717',
                    letterSpacing: '0.04em',
                  }}>
                    PORTFOLIO MEMBER
                  </div>
                </div>
              </div>

              {/* Country Badge */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.22rem 0.65rem',
                  borderRadius: '9999px',
                  background: '#ECD06F',
                  border: '1.5px solid #171717',
                  boxShadow: '2px 2px 0 #171717',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: '#171717',
                }}>
                  <Globe size={11} />
                  <span>INDIA</span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.54rem',
                  color: '#171717',
                  marginTop: '0.2rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}>
                  SEC // LVL-01
                </div>
              </div>
            </div>

            {/* Top Typography: Neo-Brutalist Bold Header */}
            <div style={{ position: 'relative', zIndex: 4, marginBottom: '0.2rem' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.1rem, 5.2vw, 2.9rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: '#171717',
              }}>
                SAFVAN
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.1rem, 5.2vw, 2.9rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: '#49C5B6',
                WebkitTextStroke: '1.5px #171717',
              }}>
                SIDHEEQ
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginTop: '0.45rem',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.18rem 0.55rem',
                  borderRadius: '9999px',
                  background: '#FF9398',
                  border: '1.5px solid #171717',
                  boxShadow: '2px 2px 0 #171717',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  color: '#171717',
                  letterSpacing: '0.04em',
                }}>
                  AI ENGINEER
                </span>
                <span style={{ color: '#171717', fontWeight: 800 }}>•</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  color: '#171717',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}>
                  DATA SCIENCE / ML / GENAI
                </span>
              </div>
            </div>

            {/* Middle Canvas: Layered Avatar & Editorial Graphics */}
            <div style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              overflow: 'hidden',
              marginTop: '0.2rem',
              marginBottom: '0.35rem',
            }}>
              {/* Giant Outlined Background Typographic Layers */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.1rem',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 1,
                opacity: 0.75,
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3.6rem',
                  fontWeight: 900,
                  lineHeight: 0.88,
                  color: 'transparent',
                  WebkitTextStroke: '1.5px rgba(23, 23, 23, 0.08)',
                  whiteSpace: 'nowrap',
                }}>
                  AI ENGINEER
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3.4rem',
                  fontWeight: 900,
                  lineHeight: 0.88,
                  color: 'transparent',
                  WebkitTextStroke: '1.5px rgba(23, 23, 23, 0.08)',
                  whiteSpace: 'nowrap',
                  paddingLeft: '1.2rem',
                }}>
                  FASTAPI • ML
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3.4rem',
                  fontWeight: 900,
                  lineHeight: 0.88,
                  color: 'transparent',
                  WebkitTextStroke: '1.5px rgba(23, 23, 23, 0.07)',
                  whiteSpace: 'nowrap',
                }}>
                  GENAI • RAG
                </div>
              </div>

              {/* Left Side Vertical Identification Strip (#49C5B6 Mint Teal) */}
              <div style={{
                position: 'absolute',
                left: '3px',
                top: '8%',
                bottom: '8%',
                width: '26px',
                borderRadius: '8px',
                background: '#49C5B6',
                border: '1.5px solid #171717',
                boxShadow: '2px 2px 0 #171717',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                zIndex: 4,
                pointerEvents: 'none',
              }}>
                <div style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.56rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#171717',
                }}>
                  # 2026 // DEV-PASS
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  fontSize: '0.5rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#171717',
                  fontWeight: 900,
                  textAlign: 'center',
                }}>
                  <span>PY</span>
                  <span>SQL</span>
                  <span>ML</span>
                  <span>AI</span>
                </div>
              </div>

              {/* Ambient Soft Gold Halo behind Avatar */}
              <div style={{
                position: 'absolute',
                top: '42%',
                left: '52%',
                transform: 'translate(-50%, -50%)',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(236, 208, 111, 0.35) 0%, rgba(73, 197, 182, 0.15) 45%, transparent 75%)',
                filter: 'blur(26px)',
                zIndex: 2,
                pointerEvents: 'none',
              }} />

              {/* Main Avatar Cutout Image */}
              <img
                src="/avatar-hero.png"
                alt="Safvan Sidheeq Digital ID Portrait"
                style={{
                  height: '96%',
                  width: 'auto',
                  maxHeight: '410px',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 3,
                  userSelect: 'none',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
                  filter: 'drop-shadow(0 10px 16px rgba(23, 23, 23, 0.15))',
                  display: 'block',
                }}
              />

              {/* Floating ID Tech Sticker Badge */}
              <div style={{
                position: 'absolute',
                right: '4px',
                bottom: '16%',
                zIndex: 5,
                background: '#ECD06F',
                border: '1.5px solid #171717',
                borderRadius: '8px',
                padding: '0.28rem 0.6rem',
                boxShadow: '2.5px 2.5px 0 #171717',
                fontFamily: 'var(--font-display)',
                fontSize: '0.64rem',
                fontWeight: 800,
                color: '#171717',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}>
                <Zap size={11} fill="#171717" color="#171717" />
                <span>AI-CORE</span>
              </div>
            </div>

            {/* Bottom Dashboard & Status Bar */}
            <div style={{
              position: 'relative',
              zIndex: 4,
              borderTop: '2px solid #171717',
              paddingTop: '0.6rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
            }}>
              {/* Badge + Sub-domains */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.4rem',
              }}>
                {/* Available for Opportunities Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  background: '#49C5B6',
                  border: '1.5px solid #171717',
                  boxShadow: '2px 2px 0 #171717',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: '#171717',
                }}>
                  <span style={{
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: '#171717',
                    display: 'inline-block',
                  }} />
                  AVAILABLE FOR OPPORTUNITIES
                </div>

                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#171717',
                  letterSpacing: '0.04em',
                }}>
                  DATA • ML • GENAI • BACKEND
                </span>
              </div>

              {/* Barcode Strip */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}>
                <div style={{ flex: 1 }}>
                  <BarcodeSVG code="PORTFOLIO ID: SF-2026" />
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  color: '#171717',
                  fontWeight: 800,
                  textAlign: 'right',
                }}>
                  [ CLICK OR SCROLL TO FLIP ]
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              CARD BACK: TECHNICAL CREDENTIAL (NEO-BRUTAL THEME)
              ========================================= */}
          <div
            className="id-card-face id-card-back"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              borderRadius: '24px',
              background: '#FFF8E8',
              border: '2.5px solid #171717',
              boxShadow: isHovered ? '9px 9px 0 #171717' : '6px 6px 0 #171717',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.35rem',
              backgroundImage: 'radial-gradient(rgba(23, 23, 23, 0.04) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              transition: 'box-shadow 0.2s ease',
            }}
          >
            <LanyardSlot />
            <FoilSheen isHovered={isHovered} />

            {/* Back Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.65rem',
              marginBottom: '0.75rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #171717',
              zIndex: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="#171717" />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#171717',
                }}>
                  VERIFIED DEVELOPER CREDENTIAL
                </span>
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                background: '#49C5B6',
                border: '1.5px solid #171717',
                boxShadow: '2px 2px 0 #171717',
                fontSize: '0.58rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                color: '#171717',
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#171717', display: 'inline-block'
                }} />
                STATUS: BUILDING
              </div>
            </div>

            {/* Back Title: ABOUT ME */}
            <div style={{ marginBottom: '0.65rem', zIndex: 4 }}>
              <div style={{
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: '#FF9398',
                border: '1.5px solid #171717',
                boxShadow: '2px 2px 0 #171717',
                fontSize: '0.6rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                color: '#171717',
                marginBottom: '0.35rem',
              }}>
                SECTION // 01
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3.6vw, 1.9rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: '#171717',
                marginBottom: '0.3rem',
              }}>
                ABOUT ME
              </h3>
              <p style={{
                fontFamily: 'var(--font-main)',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                color: '#3A3A3A',
                fontWeight: 500,
              }}>
                AI Engineer focused on Machine Learning, Generative AI, Data Analytics and scalable backend systems. Building production-grade intelligent pipelines, autonomous agents, and high-throughput APIs.
              </p>
            </div>

            {/* Structured Credentials Grid (Strictly NO SCROLL) */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.55rem',
              overflow: 'hidden',
              zIndex: 4,
            }}>
              {/* Block 1: Education */}
              <div style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1.8px solid #171717',
                boxShadow: '2.5px 2.5px 0 #171717',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  color: '#171717',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.15rem',
                }}>
                  <GraduationCap size={13} color="#171717" />
                  <span>Education</span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#171717',
                }}>
                  BCA — MES Kalladi College
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: '#3A3A3A',
                  fontWeight: 500,
                }}>
                  University of Calicut
                </div>
              </div>

              {/* Block 2: Focus Areas */}
              <div style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1.8px solid #171717',
                boxShadow: '2.5px 2.5px 0 #171717',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  color: '#171717',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.25rem',
                }}>
                  <BrainCircuit size={13} color="#171717" />
                  <span>Focus</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.3rem',
                }}>
                  {[
                    { name: 'Machine Learning', bg: '#ECD06F' },
                    { name: 'Generative AI', bg: '#49C5B6' },
                    { name: 'Data Science', bg: '#FF9398' },
                    { name: 'Backend Engineering', bg: '#FFF8E8' },
                    { name: 'AI Automation', bg: '#ECD06F' },
                  ].map((area, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        background: area.bg,
                        border: '1.2px solid #171717',
                        boxShadow: '1.5px 1.5px 0 #171717',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        color: '#171717',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {area.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Block 3: Tech Stack */}
              <div style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1.8px solid #171717',
                boxShadow: '2.5px 2.5px 0 #171717',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  color: '#171717',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.25rem',
                }}>
                  <Code2 size={13} color="#171717" />
                  <span>Tech Stack</span>
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.25rem',
                }}>
                  {[
                    'Python', 'FastAPI', 'SQL', 'PostgreSQL', 'MongoDB',
                    'Pandas', 'NumPy', 'Scikit-learn', 'LangChain', 'RAG',
                    'LLMs', 'Flutter', 'React'
                  ].map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '0.12rem 0.42rem',
                        borderRadius: '6px',
                        background: '#FFF8E8',
                        border: '1.2px solid #171717',
                        boxShadow: '1px 1px 0 #171717',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: '#171717',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Back Footer: Security Hologram, Coordinates & Signature */}
            <div style={{
              position: 'relative',
              zIndex: 4,
              marginTop: '0.55rem',
              paddingTop: '0.5rem',
              borderTop: '2px solid #171717',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}>
              <MatrixGraphic />

              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  color: '#171717',
                }}>
                  <CheckCircle2 size={12} color="#171717" />
                  <span>VERIFIED DEVELOPER // AUTH</span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.54rem',
                  color: '#3A3A3A',
                  marginTop: '0.1rem',
                  fontWeight: 600,
                }}>
                  LOCATION: INDIA [11.25° N, 75.78° E]
                </div>
                {/* Digital Signature */}
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#171717',
                  marginTop: '0.15rem',
                  letterSpacing: '-0.02em',
                }}>
                  Safvan Sidheeq
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Interactive Helper Button (Matching Site Neo-Brutal Primary Buttons) */}
      <motion.button
        onClick={toggleManualFlip}
        whileHover={{ scale: 1.04, y: -2, boxShadow: '5px 5px 0 #171717' }}
        whileTap={{ scale: 0.96, boxShadow: '2px 2px 0 #171717' }}
        style={{
          marginTop: '1.25rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1.3rem',
          borderRadius: '9999px',
          background: '#ECD06F',
          border: '2px solid #171717',
          boxShadow: '4px 4px 0 #171717',
          fontFamily: 'var(--font-display)',
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#171717',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'background 0.2s ease',
        }}
      >
        <RefreshCw size={13} style={{ transform: effectiveRotateY > 90 ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease' }} />
        <span>{effectiveRotateY > 90 ? 'Flip to Front (Portrait)' : 'Flip to Back (Credentials)'}</span>
      </motion.button>
    </div>
  );
}
