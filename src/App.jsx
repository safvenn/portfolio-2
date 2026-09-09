import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useInView, useMotionValue } from 'framer-motion';
import {
  Github, Linkedin, Mail, Phone, MapPin, ExternalLink,
  Download, Menu, X, Send, ArrowRight, ArrowUp,
  BarChart3, Database, FileSpreadsheet,
  BrainCircuit, Table2, PieChart, TrendingUp,
  Award, Briefcase, GraduationCap,
  Target, Lightbulb, Globe,
  ChevronDown, Eye, Sun, Moon,
  Code2, LineChart, Calendar, Layers,
  Zap, CheckCircle2, Bell, Users, Activity, Cpu, Sparkles, ArrowUpRight, Star
} from 'lucide-react';
import Resume from './components/Resume';

/* =============================================
   SMOOTH FADE-IN WRAPPER
   ============================================= */
const FadeIn = ({ children, delay = 0, direction = 'up', className, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
    none: { y: 0, x: 0 },
  };
  const d = directions[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: d.y, x: d.x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/* =============================================
   STAGGER VARIANTS
   ============================================= */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
};

/* =============================================
   ANIMATED COUNTER
   ============================================= */
const AnimatedCounter = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericValue));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, numericValue]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* =============================================
   MAGNETIC CURSOR (desktop only)
   ============================================= */
const MagneticCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(hover: none)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px';
        ringRef.current.style.top = ring.current.y + 'px';
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf.current); };
  }, [isMobile]);

  if (isMobile) return null;
  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
};

/* =============================================
   BACK TO TOP
   ============================================= */
const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const toggle = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', toggle, { passive: true });
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 900,
            width: 48, height: 48, borderRadius: '50%',
            background: '#ECD06F',
            border: '2px solid #171717',
            color: '#171717',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '3px 3px 0 #171717',
          }}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* =============================================
   NAVBAR
   ============================================= */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = useMemo(() => [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#tools' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ], []);

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 1000,
      padding: '0.85rem 0',
      transition: 'all 0.3s ease',
    }}>
      <div className="container">
        {/* Nav container pill */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: isScrolled ? '#FFF8E8' : 'rgba(255,248,232,0.92)',
          border: '2px solid #171717',
          borderRadius: '9999px',
          padding: '0.5rem 0.75rem 0.5rem 1.5rem',
          boxShadow: isScrolled ? '4px 4px 0 #171717' : '3px 3px 0 #171717',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(12px)',
        }}>
          {/* Logo */}
          <motion.a
            href="#"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: '#49C5B6',
              border: '2px solid #171717',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.9rem', color: '#171717',
              fontFamily: 'var(--font-display)',
            }}>S</div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', color: '#171717', fontFamily: 'var(--font-display)' }}>Safvan</span>
          </motion.a>

          {/* Desktop Nav */}
          <motion.div
            className="nav-desktop"
            style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ backgroundColor: '#ECD06F', y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontSize: '0.82rem', fontWeight: 600, color: '#171717',
                  padding: '0.4rem 1rem', borderRadius: '9999px',
                  transition: 'all 0.2s ease',
                }}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.button
              className="btn btn-primary"
              style={{ marginLeft: '0.5rem', padding: '0.45rem 1.25rem', minHeight: 40, fontSize: '0.82rem', borderRadius: '9999px' }}
              whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 #171717' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=safvankallayi7@gmail.com&su=Hiring Inquiry')}
            >
              Hire Me <ArrowRight size={13} />
            </motion.button>
          </motion.div>

          {/* Mobile Toggle */}
          <motion.button
            className="nav-mobile-toggle"
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              cursor: 'pointer', display: 'none', background: isMenuOpen ? '#ECD06F' : 'transparent',
              border: '2px solid #171717', borderRadius: '12px',
              color: '#171717', padding: '6px', minHeight: 44, minWidth: 44,
              alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: '#FFF8E8',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              gap: '0.5rem', zIndex: 999,
            }}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem',
                background: '#ECD06F', border: '2px solid #171717', borderRadius: '12px',
                color: '#171717', padding: '8px', cursor: 'pointer',
                minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '3px 3px 0 #171717',
              }}
              aria-label="Close menu"
            >
              <X size={22} />
            </motion.button>

            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + i * 0.06 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  fontSize: '2rem', fontWeight: 800, color: '#171717',
                  padding: '0.5rem 2rem', letterSpacing: '-0.03em',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.button
              className="btn btn-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.95 }}
              style={{ marginTop: '1rem', padding: '0.85rem 2.5rem' }}
              onClick={() => { setIsMenuOpen(false); window.open('https://mail.google.com/mail/?view=cm&fs=1&to=safvankallayi7@gmail.com&su=Hiring Inquiry'); }}
            >
              Hire Me <ArrowRight size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 769px) { .nav-desktop { display: flex !important; } .nav-mobile-toggle { display: none !important; } }
        @media (max-width: 768px) { .nav-desktop { display: none !important; } .nav-mobile-toggle { display: flex !important; } }
      `}</style>
    </nav>
  );
};

/* =============================================
   SECTION HEADER
   ============================================= */
const SectionHeader = ({ label, title, subtitle, light = false }) => (
  <div style={{ marginBottom: '3.5rem' }}>
    <FadeIn>
      <div className="section-label" style={{ transform: 'rotate(-1deg)', display: 'inline-flex' }}>{label}</div>
    </FadeIn>
    <FadeIn delay={0.1}>
      <h2 style={{
        fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
        marginBottom: '1rem',
        fontWeight: 800,
        color: light ? '#FFF8E8' : '#171717',
      }}>
        {title}
      </h2>
    </FadeIn>
    {subtitle && (
      <FadeIn delay={0.2}>
        <p style={{
          fontSize: '1rem',
          color: light ? 'rgba(255,248,232,0.8)' : '#3A3A3A',
          maxWidth: '560px',
          lineHeight: 1.7,
        }}>
          {subtitle}
        </p>
      </FadeIn>
    )}
  </div>
);

/* =============================================
   TILT CARD (desktop only)
   ============================================= */
const TiltCard = ({ children, className, style }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(hover: none)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 4, y: -x * 4 });
  }, [isMobile]);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={onMouseMove}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setIsHovered(false); }}
      style={{
        ...style,
        transform: isMobile
          ? undefined
          : `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'translateY(-6px) translateX(-3px)' : ''}`,
        transition: isHovered ? 'transform 0.08s ease' : 'transform 0.4s ease',
        boxShadow: isHovered ? '6px 6px 0 #171717' : '4px 4px 0 #171717',
      }}
    >
      {children}
    </div>
  );
};

/* =============================================
   HERO VISUAL — Floating Skill Bubbles around Avatar
   ============================================= */
const HeroVisual = () => {
  const bubbles = [
    { label: 'Python', bg: '#ECD06F', angle: -40, radius: 180 },
    { label: 'Machine Learning', bg: '#FF9398', angle: 30, radius: 195 },
    { label: 'FastAPI', bg: '#49C5B6', angle: 100, radius: 175 },
    { label: 'SQL', bg: '#ECD06F', angle: 160, radius: 190 },
    { label: 'Generative AI', bg: '#FF9398', angle: 220, radius: 180 },
    { label: 'Power BI', bg: '#FFF8E8', angle: 280, radius: 185 },
    { label: 'React', bg: '#49C5B6', angle: 330, radius: 170 },
    { label: 'Data Analytics', bg: '#ECD06F', angle: 70, radius: 200 },
  ];

  return (
    <div style={{
      position: 'relative',
      width: 420,
      height: 420,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {/* Outer decorative ring */}
      <div style={{
        position: 'absolute',
        width: 380,
        height: 380,
        border: '2px dashed rgba(23,23,23,0.25)',
        borderRadius: '50%',
        animation: 'spinSlow 60s linear infinite',
      }} />

      {/* Central avatar circle */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 120, damping: 20 }}
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '3px solid #171717',
          overflow: 'hidden',
          background: '#FFF8E8',
          boxShadow: '5px 5px 0 #171717',
          zIndex: 5,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <img
          src="/avatar.jpg"
          alt="Safvan Sidheeq"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
        />
      </motion.div>

      {/* Floating skill bubbles */}
      {bubbles.map((bubble, i) => {
        const rad = (bubble.angle * Math.PI) / 180;
        const x = Math.cos(rad) * bubble.radius;
        const y = Math.sin(rad) * bubble.radius;
        return (
          <motion.div
            key={bubble.label}
            className="skill-bubble"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { delay: 0.3 + i * 0.1, duration: 0.5 },
              scale: { delay: 0.3 + i * 0.1, duration: 0.5, type: 'spring', stiffness: 200 },
              y: {
                delay: 0.8 + i * 0.12,
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            style={{
              background: bubble.bg,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: `translate(-50%, -50%) rotate(${i % 2 === 0 ? '-2deg' : '1.5deg'})`,
              zIndex: 6,
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.35rem 0.85rem',
            }}
          >
            {bubble.label}
          </motion.div>
        );
      })}

      {/* Decorative blobs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 60, height: 60,
          top: 20, right: 30,
          background: '#FF9398',
          border: '2px solid #171717',
          borderRadius: '40% 60% 70% 30% / 50% 40% 60% 50%',
          boxShadow: '3px 3px 0 #171717',
          zIndex: 4,
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: 50, height: 50,
          bottom: 40, left: 20,
          background: '#ECD06F',
          border: '2px solid #171717',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          boxShadow: '3px 3px 0 #171717',
          zIndex: 4,
        }}
      />
    </div>
  );
};

/* =============================================
   HERO SECTION
   ============================================= */
const Hero = () => {
  const roles = useMemo(() => ['AI Engineer', 'Machine Learning', 'FastAPI & Backend', 'Prompt Engineering', 'Data Analytics'], []);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRoleIndex(prev => (prev + 1) % roles.length), 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="hero-section" id="hero">
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-content">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 1.1rem', borderRadius: '9999px',
                border: '2px solid #171717',
                background: '#FF9398',
                fontSize: '0.78rem', color: '#171717',
                fontFamily: 'var(--font-main)', fontWeight: 700,
                marginBottom: '1.75rem',
                boxShadow: '3px 3px 0 #171717',
                transform: 'rotate(-2deg)',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', border: '1px solid #171717' }}
              />
              Available for opportunities
            </motion.div>

            {/* Big greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                fontWeight: 700,
                color: 'rgba(23,23,23,0.6)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}>
                Hello, I'm
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.6rem, 6.5vw, 5rem)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                marginBottom: '0.5rem',
                color: '#171717',
              }}>
                Safvan
              </h1>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.6rem, 6.5vw, 5rem)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                marginBottom: '1.25rem',
                color: '#ECD06F',
                WebkitTextStroke: '2px #171717',
              }}>
                Sidheeq.
              </h1>
            </motion.div>

            {/* Rotating role */}
            <div style={{
              height: '2.4rem', overflow: 'hidden', marginBottom: '1.25rem',
              display: 'flex', alignItems: 'center',
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={roleIndex}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -28, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.35rem 1rem', borderRadius: '9999px',
                    border: '2px solid #171717',
                    background: '#49C5B6',
                    fontSize: 'clamp(0.82rem, 2vw, 1rem)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: '#171717',
                    boxShadow: '2px 2px 0 #171717',
                  }}
                >
                  <Zap size={14} />
                  {roles[roleIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
                color: 'rgba(23,23,23,0.7)',
                maxWidth: '460px',
                lineHeight: 1.75,
                marginBottom: '2rem',
                fontWeight: 500,
              }}
            >
              Aspiring AI Engineer specializing in Machine Learning, Generative AI, FastAPI backend engineering, and Data Analytics. Building intelligent applications and data pipelines.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="hero-cta-row"
              style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '2rem' }}
            >
              <motion.a
                whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 #171717' }}
                whileTap={{ scale: 0.97 }}
                href="#projects"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0 1.75rem', height: 52, borderRadius: 9999,
                  background: '#ECD06F', color: '#171717',
                  fontSize: '0.88rem', fontWeight: 700,
                  border: '2px solid #171717', cursor: 'pointer', textDecoration: 'none',
                  boxShadow: '4px 4px 0 #171717',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-main)',
                }}
              >
                <BarChart3 size={16} /> View Projects
              </motion.a>
              <motion.a
                whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 #171717' }}
                whileTap={{ scale: 0.97 }}
                href="#contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0 1.75rem', height: 52, borderRadius: 9999,
                  background: '#FFF8E8', color: '#171717',
                  fontSize: '0.88rem', fontWeight: 700,
                  border: '2px solid #171717', cursor: 'pointer', textDecoration: 'none',
                  boxShadow: '4px 4px 0 #171717',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-main)',
                }}
              >
                <Download size={16} /> Download CV
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="stats-row"
              style={{ maxWidth: '420px' }}
            >
              {[
                { number: '4', suffix: '+', label: 'Projects' },
                { number: '3', suffix: '+', label: 'Internships' },
                { number: '10', suffix: '+', label: 'Tech Tools' },
                { number: '5', suffix: '', label: 'Certifications' },
              ].map((stat, i) => (
                <motion.div key={i} className="stat-item" whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                  <div className="stat-number">
                    <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <div className="hero-dashboard-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroVisual />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={22} color="rgba(23,23,23,0.5)" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* =============================================
   ABOUT SECTION
   ============================================= */
const About = () => {
  const expertise = useMemo(() => [
    { icon: <Table2 size={20} />, title: 'Data Cleaning', desc: 'Transforming messy datasets into structured, analysis-ready data.', bg: '#ECD06F' },
    { icon: <Database size={20} />, title: 'SQL & Data Modeling', desc: 'Building multi-table data models and executing complex queries.', bg: '#FF9398' },
    { icon: <BarChart3 size={20} />, title: 'Dashboard Creation', desc: 'Designing interactive Power BI and Excel dashboards.', bg: '#49C5B6' },
    { icon: <TrendingUp size={20} />, title: 'Statistical Analysis', desc: 'Identifying patterns and trends for data-driven decisions.', bg: '#ECD06F' },
    { icon: <BrainCircuit size={20} />, title: 'EDA & Insights', desc: 'Conducting exploratory analysis to uncover business insights.', bg: '#FF9398' },
    { icon: <Target size={20} />, title: 'Business Intelligence', desc: 'Translating data into actionable business recommendations.', bg: '#49C5B6' },
  ], []);

  return (
    <section id="about" className="section" style={{ background: '#FFF8E8', backgroundImage: 'radial-gradient(rgba(23,23,23,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="container">
        <SectionHeader label="About Me" title="Who I Am" subtitle="A detail-oriented aspiring AI/Data Engineer passionate about turning data into decisions." />

        <div className="about-grid">
          {/* Left: Image & identity */}
          <FadeIn direction="left">
            <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center', transform: 'rotate(-1.5deg)' }}>
              <div style={{
                width: '180px', height: '180px',
                borderRadius: '50%',
                border: '3px solid #171717',
                overflow: 'hidden',
                margin: '0 auto 1rem',
                boxShadow: '4px 4px 0 #171717',
                background: '#F5EDDA',
              }}>
                <img
                  src="/avatar.jpg"
                  alt="Safvan Sidheeq"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                  loading="lazy"
                />
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: '#171717' }}>Safvan Sidheeq</h3>
              <div style={{
                display: 'inline-block',
                padding: '0.3rem 0.9rem',
                background: '#49C5B6',
                border: '2px solid #171717',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                fontFamily: 'var(--font-mono)',
                color: '#171717',
                boxShadow: '2px 2px 0 #171717',
                marginTop: '0.5rem',
              }}>AI / DATA ENGINEER</div>
            </div>
          </FadeIn>

          {/* Right: Text */}
          <FadeIn direction="right">
            <div className="glass-card" style={{ padding: '2rem' }}>
              <p style={{ color: '#3A3A3A', fontSize: '0.95rem', lineHeight: 1.85, marginBottom: '1.25rem' }}>
                I am an aspiring <span style={{
                  background: '#ECD06F', padding: '0.1rem 0.5rem',
                  borderRadius: '6px', border: '1.5px solid #171717',
                  fontWeight: 700,
                }}>AI Engineer</span> with strong skills in Artificial Intelligence, Machine Learning, FastAPI backend engineering, and Data Analytics (SQL, Python, Power BI, Excel). I enjoy building intelligent applications, prompt engineering, and processing data to extract actionable insights.
              </p>
              <p style={{ color: '#3A3A3A', fontSize: '0.95rem', lineHeight: 1.85 }}>
                My experience spans internships as a <strong style={{ color: '#171717' }}>Data Science Intern at Luminar Technolab</strong>, <strong style={{ color: '#171717' }}>Flutter Intern at CODEEDEX TECHNOLOGIES</strong>, and <strong style={{ color: '#171717' }}>Full-stack Developer Intern at ICT Academy (Cyberpark Calicut)</strong>, along with professional simulations from Deloitte and Tata. Based in Kozhikode, Kerala, India.
              </p>

              {/* Quote */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem 1.25rem',
                background: '#49C5B6',
                border: '2px solid #171717',
                borderRadius: '12px',
                boxShadow: '3px 3px 0 #171717',
                transform: 'rotate(0.5deg)',
              }}>
                <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#171717', lineHeight: 1.75, fontWeight: 500 }}>
                  "Every dataset has a story to tell. My job is to clean the noise, find the patterns, and present insights that drive real business impact."
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Animated Counters */}
        <FadeIn direction="left" delay={0.1}>
          <div className="stats-row" style={{ maxWidth: '600px', marginBottom: '3.5rem' }}>
            {[
              { number: '4', suffix: '+', label: 'Projects Done', icon: <Layers size={16} /> },
              { number: '10', suffix: '+', label: 'Tools Used', icon: <Code2 size={16} /> },
              { number: '5', suffix: '', label: 'Certifications', icon: <Award size={16} /> },
              { number: '3', suffix: '+', label: 'Internships', icon: <Calendar size={16} /> },
            ].map((stat, i) => (
              <div key={i} className="stat-item">
                <div style={{ color: '#49C5B6', marginBottom: '0.3rem' }}>{stat.icon}</div>
                <div className="stat-number"><AnimatedCounter value={stat.number} suffix={stat.suffix} /></div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Core Expertise */}
        <FadeIn direction="right" delay={0.1}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: '#171717' }}>
            Core Expertise
          </h3>
        </FadeIn>
        <CoreExpertiseStack expertise={expertise} />

        {/* About grid → 1 col on mobile */}
        <style>{`
          @media (max-width: 768px) {
            .about-grid { grid-template-columns: 1fr !important; }
            .about-grid > div:first-child { justify-self: center; }
          }
        `}</style>
      </div>
    </section>
  );
};

/* =============================================
   CORE EXPERTISE — STACKING CARD REVEAL
   ============================================= */
const CoreExpertiseStack = ({ expertise }) => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
      }}>
        {expertise.map((item, idx) => (
          <FadeIn key={idx} direction={idx % 2 === 0 ? 'left' : 'right'} delay={idx * 0.07}>
            <motion.div
              className="glass-card"
              whileHover={{ y: -4, x: -2, boxShadow: '6px 6px 0 #171717' }}
              style={{
                padding: '1.5rem',
                transform: idx % 3 === 1 ? 'rotate(0.8deg)' : idx % 3 === 2 ? 'rotate(-0.5deg)' : 'rotate(0)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: 48, height: 48, minWidth: 48,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.bg,
                  border: '2px solid #171717',
                  borderRadius: '12px',
                  color: '#171717',
                  boxShadow: '2px 2px 0 #171717',
                }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem', color: '#171717' }}>{item.title}</h4>
                  <p style={{ color: '#3A3A3A', fontSize: '0.85rem', lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

/* =============================================
   TOOLS — SCROLL-DRIVEN HORIZONTAL
   ============================================= */
const ToolsMarquee = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 });
  const x1 = useTransform(smoothProgress, [0, 1], ['5%', '-45%']);
  const x2 = useTransform(smoothProgress, [0, 1], ['-45%', '5%']);

  const tools = useMemo(() => [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
    { name: 'n8n', icon: 'https://cdn.simpleicons.org/n8n/EA4B71' },
    { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
    { name: 'Scikit-Learn', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
    { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'Power BI', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg' },
    { name: 'Excel', icon: 'https://img.icons8.com/color/96/microsoft-excel-2019.png' },
    { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  ], []);

  const doubled = [...tools, ...tools];

  return (
    <section ref={sectionRef} className="dark-section section" id="tools" style={{ paddingTop: '7rem', paddingBottom: '7rem' }}>
      <div className="container">
        <SectionHeader label="Toolkit" title="Tools I Use" subtitle="Industry-standard tools and technologies powering my workflow." light={false} />
      </div>

      {/* Skill tags row */}
      <div className="container" style={{ marginBottom: '3rem' }}>
        <FadeIn>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {['Python', 'SQL', 'Machine Learning', 'FastAPI', 'n8n', 'Flutter', 'React', 'Generative AI', 'Data Science', 'Power BI', 'Pandas', 'NumPy', 'Firebase', 'Docker', 'Git', 'TypeScript'].map((skill, i) => (
              <motion.span
                key={skill}
                className="skill-tag"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300 }}
                whileHover={{ y: -3, rotate: i % 2 === 0 ? -1 : 1 }}
                style={{
                  background: i % 3 === 0 ? '#ECD06F' : i % 3 === 1 ? '#FFF8E8' : '#FF9398',
                  transform: `rotate(${i % 4 === 0 ? '-1.5' : i % 4 === 1 ? '0.8' : i % 4 === 2 ? '-0.5' : '1.2'}deg)`,
                }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </FadeIn>
      </div>

      <div className="marquee-container" style={{ marginBottom: '1.25rem' }}>
        <motion.div className="marquee-track" style={{ x: x1, animation: 'none' }}>
          {doubled.map((tool, i) => (
            <div key={i} className="marquee-item">
              <img src={tool.icon} alt={tool.name} loading="lazy" />
              <span>{tool.name}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="marquee-container">
        <motion.div className="marquee-track" style={{ x: x2, animation: 'none' }}>
          {doubled.map((tool, i) => (
            <div key={i} className="marquee-item">
              <img src={tool.icon} alt={tool.name} loading="lazy" />
              <span>{tool.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* =============================================
   PROJECTS (WITH FILTERS)
   ============================================= */
const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = useMemo(() => [
    { label: 'All Projects', value: 'all' },
    { label: 'Full-Stack & Web', value: 'fullstack' },
    { label: 'AI & ML', value: 'ai' },
    { label: 'Python & Data', value: 'python' },
    { label: 'Power BI', value: 'powerbi' },
  ], []);

  const projects = useMemo(() => [
    {
      title: 'Budget Buddy — Room Expense & Bill Splitter App',
      tag: '★ PRIORITY #1',
      description: 'Full-stack room management and expense-tracking application. Features real-time balances, equal/percentage/custom split algorithms, friend settlements, interactive expense analytics dashboard, and automated debt minimization math.',
      tools: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Vite', 'Realtime DB'],
      link: 'https://github.com/Rinshad007/room',
      liveUrl: 'http://budget-buddy4.vercel.app/',
      cardBg: '#ECD06F',
      highlights: ['Live Web App', 'Realtime DB', 'Debt Settlement Engine'],
      categories: ['fullstack', 'all'],
      rotate: '-1.5deg',
    },
    {
      title: 'Sales Analytics & AI Revenue Forecasting System',
      tag: 'AI · ML · FastAPI',
      description: 'Production-grade full-stack web application for uploading sales order datasets, analyzing performance metrics, generating AI-powered business insights via Google Gemini AI, and forecasting future revenue using Linear Regression models.',
      tools: ['Python', 'FastAPI', 'React', 'Google Gemini AI', 'Scikit-Learn', 'Pandas'],
      link: 'https://github.com/safvenn/SALES-ANALETCIS',
      cardBg: '#FF9398',
      highlights: ['Gemini AI Insights', 'Linear Regression Forecast', 'FastAPI Backend'],
      categories: ['ai', 'python', 'fullstack'],
      rotate: '1deg',
    },
    {
      title: 'Petrol Station Analytics — End-to-End Pipeline',
      tag: 'Python · Power BI',
      description: 'Complete end-to-end analytics project transforming messy petrol station datasets into business insights. Processed 150,000+ transactions covering ₹2.15B revenue and 22M+ liters. Built Operations and HR dashboards in Power BI.',
      tools: ['Python', 'Pandas', 'NumPy', 'Power BI', 'Matplotlib', 'Seaborn'],
      link: 'https://github.com/safvenn/petrol-pumb-analysis',
      cardBg: '#49C5B6',
      highlights: ['150K+ Transactions', '₹2.15B Revenue', '2 Power BI Dashboards'],
      categories: ['python', 'powerbi'],
      rotate: '-0.8deg',
    },
    {
      title: 'Hospital Doctor Utilization & Patient Cost Analysis',
      tag: 'Python · SQL · Analytics',
      description: 'Integrated 4 relational datasets into a unified analytical model. Built multi-table data pipeline, cleaned healthcare datasets, and executed 10+ SQL queries to extract KPIs and cost segments.',
      tools: ['Python', 'Pandas', 'MySQL', 'SQLAlchemy', 'Matplotlib'],
      link: 'https://github.com/safvenn/hospital_Multi_table_analysis',
      cardBg: '#FFF8E8',
      highlights: ['4 Datasets Integrated', '10+ SQL Queries', '3 Cost Segments'],
      categories: ['python'],
      rotate: '1.2deg',
    },
  ], []);

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.categories.includes(activeFilter));

  return (
    <section id="projects" className="section" style={{ background: '#FFF8E8', backgroundImage: 'radial-gradient(rgba(23,23,23,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="container">
        <SectionHeader label="Portfolio" title="Featured Projects" subtitle="End-to-end projects showcasing data analysis, AI engineering, and full-stack development." />

        {/* Filters */}
        <FadeIn>
          <div className="project-filters">
            {filters.map(f => (
              <button
                key={f.value}
                className={`project-filter-btn ${activeFilter === f.value ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <AnimatePresence mode="wait">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <TiltCard
                  className="glass-card"
                  style={{
                    padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                    transform: `rotate(${project.rotate})`,
                    background: project.cardBg,
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Tag pill */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '0.25rem 0.75rem',
                      background: '#171717',
                      color: '#ECD06F',
                      borderRadius: '9999px',
                      fontSize: '0.7rem', fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.06em',
                      marginBottom: '0.85rem',
                    }}>
                      {project.tag}
                    </div>

                    <h3 style={{
                      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                      fontWeight: 800, marginBottom: '0.85rem',
                      letterSpacing: '-0.03em', lineHeight: 1.25,
                      color: '#171717',
                    }}>{project.title}</h3>

                    <p style={{ color: '#3A3A3A', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: '700px' }}>
                      {project.description}
                    </p>

                    {/* Highlights */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {project.highlights.map((h, i) => (
                        <span key={i} style={{
                          padding: '0.3rem 0.8rem', borderRadius: '9999px',
                          background: '#FFF8E8', border: '1.5px solid #171717',
                          fontSize: '0.75rem', fontWeight: 700, color: '#171717',
                          boxShadow: '2px 2px 0 #171717',
                        }}>{h}</span>
                      ))}
                    </div>

                    {/* Tech tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem' }}>
                      {project.tools.map((t, i) => (
                        <span key={i} style={{
                          padding: '0.25rem 0.6rem', borderRadius: '6px',
                          background: 'rgba(23,23,23,0.1)', border: '1px solid rgba(23,23,23,0.2)',
                          fontSize: '0.7rem', color: '#171717', fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                        }}>{t}</span>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                      <motion.a
                        href={project.link} target="_blank" rel="noopener noreferrer"
                        whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 #171717' }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                          padding: '0.55rem 1.25rem',
                          background: '#171717', color: '#FFF8E8',
                          border: '2px solid #171717', borderRadius: '9999px',
                          fontSize: '0.8rem', fontWeight: 700,
                          boxShadow: '4px 4px 0 rgba(23,23,23,0.3)',
                          textDecoration: 'none',
                          fontFamily: 'var(--font-main)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Github size={15} /> Source Code <ExternalLink size={12} />
                      </motion.a>

                      {project.liveUrl && (
                        <motion.a
                          href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                          whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 #171717' }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.55rem 1.25rem',
                            background: '#FFF8E8', color: '#171717',
                            border: '2px solid #171717', borderRadius: '9999px',
                            fontSize: '0.8rem', fontWeight: 700,
                            boxShadow: '4px 4px 0 #171717',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-main)',
                            transition: 'all 0.2s',
                          }}
                        >
                          <Globe size={15} /> Live Demo <ArrowRight size={13} />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* =============================================
   EXPERIENCE TIMELINE
   ============================================= */
const Experience = () => {
  const experiences = useMemo(() => [
    {
      title: 'Data Science Intern',
      company: 'Luminar Technolab (Kochi)',
      type: 'Internship',
      description: 'Gaining hands-on experience in data science, machine learning models, exploratory data analysis, and Python data pipelines.',
      skills: ['Data Science', 'Machine Learning', 'Python', 'EDA', 'SQL'],
      cardBg: '#ECD06F',
    },
    {
      title: 'Flutter Developer Intern',
      company: 'CODEEDEX TECHNOLOGIES',
      type: 'Internship',
      description: 'Completed a 6-month internship focused on Flutter and Firebase. Developed customized trip planning mobile application and cloud integration.',
      skills: ['Flutter', 'Firebase', 'Mobile Apps', 'Cloud Integration'],
      cardBg: '#FF9398',
    },
    {
      title: 'Full-stack Developer Intern',
      company: 'ICT Academy (Cyberpark Calicut)',
      type: 'Internship',
      description: 'Worked as full-stack developer intern building web application modules and backend services at Cyberpark Calicut.',
      skills: ['Full-stack Development', 'Web Applications', 'Backend Services'],
      cardBg: '#49C5B6',
    },
  ], []);

  return (
    <section id="experience" className="dark-section section" style={{ paddingTop: '7rem', paddingBottom: '7rem' }}>
      <div className="container">
        <SectionHeader label="Journey" title="Experience & Simulations" subtitle="Professional internships and industry simulations shaping my career." light={false} />

        <div className="timeline">
          {experiences.map((exp, idx) => (
            <FadeIn key={idx} delay={idx * 0.12}>
              <div className={`timeline-item ${idx === 0 ? 'active' : ''}`}>
                <motion.div
                  className="glass-card"
                  style={{ background: exp.cardBg, transform: idx % 2 === 0 ? 'rotate(-0.8deg)' : 'rotate(0.8deg)' }}
                  whileHover={{ y: -4, x: -2, rotate: 0 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#171717' }}>{exp.title}</h3>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.65rem',
                      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                      background: '#171717', color: '#ECD06F',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {exp.type}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#171717', fontWeight: 700, marginBottom: '0.6rem', fontFamily: 'var(--font-mono)' }}>{exp.company}</p>
                  <p style={{ color: '#3A3A3A', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '600px' }}>{exp.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {exp.skills.map((s, i) => (
                      <span key={i} style={{
                        padding: '0.25rem 0.65rem', borderRadius: '9999px',
                        background: 'rgba(23,23,23,0.1)', border: '1.5px solid rgba(23,23,23,0.25)',
                        fontSize: '0.72rem', color: '#171717', fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                      }}>{s}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =============================================
   CERT STACK CARD — scroll-driven sticky stack
   ============================================= */
const CertStackCard = ({ cert, idx, total, onView }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Each card: scale down slightly as it's scrolled past (next card covers it)
  const scale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0.88, 1, 1, idx === total - 1 ? 1 : 0.94]
  );
  const y = useTransform(scrollYProgress, [0, 0.25], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.18], [0, 1]);

  const rotation = idx % 3 === 0 ? '-1.2deg' : idx % 3 === 1 ? '1deg' : '-0.5deg';

  return (
    <div
      ref={cardRef}
      style={{
        position: 'sticky',
        top: `${72 + idx * 18}px`,
        zIndex: idx + 1,
        marginBottom: idx === total - 1 ? '0' : '2rem',
        paddingBottom: idx === total - 1 ? '2rem' : '0',
      }}
    >
      <motion.div
        style={{ scale, y, opacity }}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      >
        <div
          className="cert-image-card"
          onClick={() => onView(cert.pdf)}
          style={{
            background: cert.cardBg,
            transform: `rotate(${rotation})`,
            cursor: 'pointer',
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap: 0,
            minHeight: 180,
          }}
        >
          {/* Left: PDF preview */}
          <div className="cert-image-wrapper" style={{ background: 'rgba(23,23,23,0.06)', borderRight: '2px solid #171717', aspectRatio: 'auto', minHeight: 180 }}>
            <iframe
              src={`${cert.pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              title={cert.title}
              loading="lazy"
            />
            <div className="cert-image-overlay">
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.4rem 0.85rem', borderRadius: '9999px',
                  background: '#ECD06F', border: '2px solid #171717',
                  color: '#171717', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '3px 3px 0 #171717',
                }}
              >
                <Eye size={13} /> View
              </motion.div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="cert-image-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.5rem 1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <span style={{
                padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.62rem',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                background: '#171717', color: '#ECD06F',
                fontFamily: 'var(--font-mono)',
              }}>
                {cert.type === 'certification' ? '🎓 Cert' : '💼 Simulation'}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(23,23,23,0.55)', fontFamily: 'var(--font-mono)' }}>{cert.year}</span>
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.35rem', lineHeight: 1.3, color: '#171717' }}>{cert.title}</h4>
            <div style={{ fontSize: '0.78rem', color: '#171717', fontWeight: 700, marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>{cert.provider}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {cert.skills.slice(0, 3).map((s, i) => (
                <span key={i} style={{
                  padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.65rem',
                  background: 'rgba(23,23,23,0.1)', border: '1px solid rgba(23,23,23,0.2)',
                  color: '#171717', fontFamily: 'var(--font-mono)', fontWeight: 600,
                }}>{s}</span>
              ))}
              {cert.skills.length > 3 && (
                <span style={{
                  padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.65rem',
                  background: 'rgba(23,23,23,0.15)', border: '1px solid rgba(23,23,23,0.2)',
                  color: '#171717', fontFamily: 'var(--font-mono)', fontWeight: 700,
                }}>+{cert.skills.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* =============================================
   CERTIFICATIONS
   ============================================= */
const Certifications = () => {
  const [lightboxPdf, setLightboxPdf] = useState(null);

  const allCerts = useMemo(() => [
    {
      title: 'Google AI Essentials Specialization',
      provider: 'Google / Coursera', year: 'July 2026', cardBg: '#ECD06F',
      pdf: './cert-coursera-wqg2pouipchs.pdf',
      skills: ['AI Tools', 'Prompt Engineering', 'Responsible AI', 'Productivity', 'AI Workflows'],
      type: 'certification'
    },
    {
      title: 'Exploratory Data Analysis with Python and Pandas',
      provider: 'Coursera', year: '2026', cardBg: '#FF9398',
      pdf: './cert-eda-coursera.pdf',
      skills: ['Data Cleaning', 'Data Transformation', 'EDA', 'Statistical Summaries'],
      type: 'certification'
    },
    {
      title: 'Databases and SQL for Data Science with Python',
      provider: 'IBM / Coursera', year: '2026', cardBg: '#49C5B6',
      pdf: './cert-sql-coursera.pdf',
      skills: ['SQL Queries', 'Database Management', 'Data Retrieval', 'Aggregations'],
      type: 'certification'
    },
    {
      title: 'Deloitte — Data Analytics Job Simulation',
      provider: 'Forage', year: 'April 2026', cardBg: '#ECD06F',
      pdf: './cert-deloitte-forage.pdf',
      skills: ['Data Analysis', 'Forensic Technology', 'Dataset Interpretation', 'Business Insight Reporting'],
      type: 'simulation'
    },
    {
      title: 'Tata — Data Visualization Job Simulation',
      provider: 'Forage', year: 'April 2026', cardBg: '#FF9398',
      pdf: './cert-tata-forage.pdf',
      skills: ['Business Scenario Framing', 'Selecting Visualization Types', 'Creating Charts', 'Communicating Insights'],
      type: 'simulation'
    },
  ], []);

  useEffect(() => {
    document.body.style.overflow = lightboxPdf ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxPdf]);

  return (
    <section id="certifications" className="section" style={{ background: '#FFF8E8', backgroundImage: 'radial-gradient(rgba(23,23,23,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="container">
        <SectionHeader label="Credentials" title="Certifications & Simulations" subtitle="Scroll through — each card stacks as you go. Click to view the full certificate." />

        {/* Scroll-stacking deck */}
        <div style={{ position: 'relative' }}>
          {allCerts.map((cert, idx) => (
            <CertStackCard
              key={idx}
              cert={cert}
              idx={idx}
              total={allCerts.length}
              onView={(pdf) => setLightboxPdf(pdf)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPdf && (
          <motion.div
            className="cert-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxPdf(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '90%', maxWidth: 900 }}
            >
              <iframe
                src={`${lightboxPdf}#toolbar=0&navpanes=0`}
                title="Certificate Preview"
                style={{ width: '100%', height: '85vh', border: 'none', borderRadius: '16px', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
              />
            </motion.div>
            <button className="cert-lightbox-close" onClick={() => setLightboxPdf(null)}>
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          #certifications .container > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

/* =============================================
   CONTACT
   ============================================= */
const Contact = ({ setIsResumeOpen }) => {
  const interests = useMemo(() => [
    'Data Analytics', 'Business Intelligence', 'Dashboard Development',
    'Data Mining', 'Artificial Intelligence', 'Predictive Analytics',
    'Data Visualization', 'Business Insights'
  ], []);

  return (
    <section id="contact" className="dark-section section" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <div className="container">
        {/* Big poster heading */}
        <FadeIn>
          <div style={{ marginBottom: '4rem' }}>
            <div className="section-label" style={{ transform: 'rotate(-1.5deg)', display: 'inline-flex', background: '#FF9398' }}>Contact</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              color: '#171717',
              marginTop: '1rem',
              marginBottom: '0.5rem',
            }}>
              LET'S
            </h2>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              color: '#ECD06F',
              WebkitTextStroke: '2px #171717',
              marginBottom: '0.5rem',
            }}>
              BUILD
            </h2>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              color: '#171717',
              marginBottom: '1.5rem',
            }}>
              SOMETHING.
            </h2>
            <p style={{ color: 'rgba(23,23,23,0.65)', maxWidth: '480px', fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 }}>
              Currently seeking entry-level Data Analyst and AI Engineer roles where data accuracy, reporting, and decision-making insights are critical.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="contact-grid glass-card" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '3rem',
            padding: 'clamp(1.75rem, 4vw, 3.5rem)',
          }}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { Icon: Mail, label: 'Email', val: 'mkdsafwan4@gmail.com' },
                  { Icon: Phone, label: 'Phone', val: '+91 8590207382' },
                  { Icon: MapPin, label: 'Location', val: 'Kozhikode, Kerala, India' }
                ].map(({ Icon, label, val }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 40, height: 40,
                      background: '#49C5B6',
                      border: '2px solid #171717',
                      borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#171717', flexShrink: 0,
                      boxShadow: '2px 2px 0 #171717',
                    }}>
                      <Icon size={17} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.68rem', color: '#666', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.1rem' }}>{label}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', wordBreak: 'break-all', color: '#171717' }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#666', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Interests</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {interests.map((interest, i) => (
                    <span key={i} className="interest-pill" style={{
                      background: i % 3 === 0 ? '#ECD06F' : i % 3 === 1 ? '#FFF8E8' : '#FF9398',
                    }}>
                      <Lightbulb size={10} /> {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', justifyContent: 'center' }}>
              <motion.button
                whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 #171717' }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '0.88rem' }}
                onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=safvankallayi7@gmail.com&su=Data Analyst Opportunity&body=Hi Safvan, I saw your portfolio and would like to connect.')}
              >
                <Send size={16} /> Send a Message
              </motion.button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <motion.a
                  whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 #171717' }}
                  whileTap={{ scale: 0.97 }}
                  href="https://linkedin.com/in/safvenn" target="_blank" rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ justifyContent: 'center' }}
                >
                  <Linkedin size={15} /> LinkedIn
                </motion.a>
                <motion.a
                  whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 #171717' }}
                  whileTap={{ scale: 0.97 }}
                  href="https://github.com/safvenn" target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ justifyContent: 'center' }}
                >
                  <Github size={15} /> GitHub
                </motion.a>
              </div>

              <motion.button
                whileHover={{ x: 2, y: 2, boxShadow: '2px 2px 0 #171717' }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.85rem', justifyContent: 'center' }}
                onClick={() => setIsResumeOpen(true)}
              >
                <Download size={15} /> View Full Resume
              </motion.button>

              <div style={{
                marginTop: '0.5rem', padding: '1.25rem',
                border: '2px solid #171717', borderRadius: '16px',
                background: '#ECD06F', boxShadow: '3px 3px 0 #171717',
                transform: 'rotate(-0.8deg)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <GraduationCap size={16} color="#171717" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717' }}>Education</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#3A3A3A', lineHeight: 1.55 }}>
                  BCA (Final Year) — Kerala, India<br />
                  <span style={{ fontSize: '0.72rem', color: '#666' }}>Expected Graduation: 2026</span>
                </p>
                <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Globe size={15} color="#171717" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717' }}>Languages</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#3A3A3A' }}>
                  English (Professional) • Malayalam (Native) • Hindi (Conversational)
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

/* =============================================
   MAIN APP
   ============================================= */
const App = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadPct(p => { if (p >= 100) { clearInterval(interval); return 100; } return Math.min(p + Math.floor(Math.random() * 30) + 15, 100); });
    }, 30);
    const timer = setTimeout(() => setIsLoading(false), 350);

    const handleOpenResume = () => setIsResumeOpen(true);
    window.addEventListener('open-resume', handleOpenResume);
    return () => { clearTimeout(timer); clearInterval(interval); window.removeEventListener('open-resume', handleOpenResume); };
  }, []);

  return (
    <div>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: '#49C5B6',
              backgroundImage: 'radial-gradient(rgba(23,23,23,0.10) 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.75rem',
            }}
          >
            <motion.div
              animate={{ rotate: ['-2deg', '2deg', '-2deg'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: '#FFF8E8', border: '2px solid #171717', borderRadius: '16px',
                padding: '0.75rem 1.5rem',
                boxShadow: '5px 5px 0 #171717',
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#49C5B6', border: '2px solid #171717', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#171717', fontFamily: 'var(--font-display)' }}>S</div>
              <span style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.04em', color: '#171717', fontFamily: 'var(--font-display)' }}>Safvan</span>
            </motion.div>
            <div>
              <div className="loader-bar">
                <motion.div
                  style={{ height: '100%', background: '#ECD06F', borderRadius: '2px' }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(loadPct, 100)}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#171717', fontWeight: 600 }}>
                {Math.min(loadPct, 100)}%
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          >
            <ScrollProgress />
            <MagneticCursor />
            <Navbar />
            <BackToTop />

            <main>
              <Hero />
              <About />
              <ToolsMarquee />
              <Projects />
              <Experience />
              <Certifications />
              <Contact setIsResumeOpen={setIsResumeOpen} />
            </main>

            <Resume isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />

            <footer className="footer">
              <div className="container footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#49C5B6', border: '2px solid #ECD06F',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.75rem', color: '#171717',
                      fontFamily: 'var(--font-display)',
                    }}>S</div>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.03em', color: '#FFF8E8', fontFamily: 'var(--font-display)' }}>Safvan Sidheeq</span>
                  </div>
                  <p style={{ color: 'rgba(255,248,232,0.5)', fontSize: '0.78rem' }}>© 2026 Safvan Sidheeq. All rights reserved.</p>
                </div>
                <div className="footer-links" style={{ display: 'flex', gap: '1rem' }}>
                  {[
                    { href: 'https://github.com/safvenn', icon: <Github size={15} />, label: 'GitHub' },
                    { href: 'https://linkedin.com/in/safvenn', icon: <Linkedin size={15} />, label: 'LinkedIn' },
                    { href: 'mailto:safvankallayi7@gmail.com', icon: <Mail size={15} />, label: 'Email' },
                  ].map(link => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.4rem 0.85rem', borderRadius: '9999px',
                        background: 'rgba(255,248,232,0.08)', border: '1px solid rgba(255,248,232,0.15)',
                        color: '#FFF8E8', fontSize: '0.8rem', fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                    >
                      {link.icon} {link.label}
                    </motion.a>
                  ))}
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
