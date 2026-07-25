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
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 900,
            width: 44, height: 44, borderRadius: '12px',
            background: '#FFFFFF',
            border: '1px solid var(--border-light)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          }}
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
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
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);
      setIsHidden(currentScrollY > lastScrollY.current && currentScrollY > 100);
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
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ], []);

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 1000,
      padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
      background: isScrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
      borderBottom: isScrolled ? '1px solid var(--border-light)' : 'none',
      transform: isHidden && !isMenuOpen ? 'translateY(-100%)' : 'translateY(0)',
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      boxShadow: isScrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.a
          href="#"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '10px',
            background: '#FF634A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.85rem', color: '#fff'
          }}>S</div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.03em', color: 'var(--text-1)' }}>Safvan</span>
        </motion.a>

        {/* Desktop Nav */}
        <motion.div
          className="nav-desktop"
          style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -2, color: 'var(--accent)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              {link.name}
            </motion.a>
          ))}
        </motion.div>

        {/* Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.button
            className="nav-mobile-toggle"
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ cursor: 'pointer', display: 'none', background: 'none', border: 'none', color: 'var(--text-1)', padding: '8px', minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100dvh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(24px)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              gap: '0.5rem', overflow: 'hidden'
            }}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-1)', padding: '8px', cursor: 'pointer', minHeight: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Close menu"
            >
              <X size={24} />
            </motion.button>

            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-1)',
                  padding: '0.75rem 2rem', letterSpacing: '-0.02em',
                  fontFamily: 'var(--font-display)'
                }}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.button
              className="btn btn-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileTap={{ scale: 0.95 }}
              style={{ marginTop: '1.5rem', width: 'auto', padding: '0.85rem 2rem' }}
              onClick={() => { setIsMenuOpen(false); window.open('https://mail.google.com/mail/?view=cm&fs=1&to=safvankallayi7@gmail.com&su=Hiring Inquiry'); }}
            >
              Hire Me <ArrowRight size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 769px) { .nav-desktop { display: flex !important; } .nav-mobile-toggle, .nav-mobile-toggle-theme { display: none !important; } }
        @media (max-width: 768px) { .nav-desktop { display: none !important; } .nav-mobile-toggle, .nav-mobile-toggle-theme { display: flex !important; } }
      `}</style>
    </nav>
  );
};

/* =============================================
   SECTION HEADER
   ============================================= */
const SectionHeader = ({ label, title, subtitle }) => (
  <div style={{ marginBottom: '3.5rem' }}>
    <FadeIn>
      <div className="section-label">{label}</div>
    </FadeIn>
    <FadeIn delay={0.1}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', marginBottom: '1rem', fontWeight: 800 }}>
        {title}
      </h2>
    </FadeIn>
    {subtitle && (
      <FadeIn delay={0.2}>
        <p style={{ fontSize: '1rem', color: 'var(--text-2)', maxWidth: '560px', lineHeight: 1.7 }}>
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
    setTilt({ x: y * 6, y: -x * 6 });
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
        transform: isMobile ? undefined : `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'translateY(-4px)' : ''}`,
        transition: isHovered ? 'transform 0.08s ease' : 'transform 0.4s ease',
      }}
    >
      {children}
    </div>
  );
};

/* =============================================
   HERO DASHBOARD MOCKUP — ANIMATED
   ============================================= */

// Mini animated line-chart SVG
const MiniLineChart = ({ color = '#FF634A', delay = 0 }) => {
  const points = '0,55 20,42 40,50 60,28 80,35 100,18 120,25 140,10 160,20 180,8';
  return (
    <svg width="100%" height="60" viewBox="0 0 180 60" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad-${delay}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={`0,55 ${points} 180,55`}
        fill={`url(#grad-${delay})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.8 }}
      />
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 1.2, ease: 'easeOut' }}
      />
      {[[140, 10], [180, 8]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="3" fill={color}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: delay + 1.2 + i * 0.1, type: 'spring', stiffness: 300 }}
        />
      ))}
    </svg>
  );
};

// Mini animated bar chart
const MiniBarChart = ({ delay = 0 }) => {
  const bars = [
    { h: 45, color: '#FF634A' },
    { h: 62, color: '#FF8B76' },
    { h: 38, color: '#FF634A' },
    { h: 75, color: '#FF8B76' },
    { h: 55, color: '#FF634A' },
    { h: 80, color: '#FF8B76' },
    { h: 60, color: '#FF634A' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: 80 }}>
      {bars.map((b, i) => (
        <motion.div key={i}
          initial={{ height: 0 }}
          animate={{ height: b.h }}
          transition={{ delay: delay + 0.1 * i, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ flex: 1, background: b.color, borderRadius: '4px 4px 0 0', opacity: 0.85 }}
        />
      ))}
    </div>
  );
};

// Animated donut ring
const DonutRing = ({ pct = 75, color = '#FF634A', size = 64, delay = 0 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E7E7E7" strokeWidth="7" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
        transition={{ delay, duration: 1.4, ease: 'easeOut' }}
        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
      />
    </svg>
  );
};

// Animated progress bar
const AnimatedBar = ({ pct, color, delay }) => (
  <div style={{ height: 5, background: '#E7E7E7', borderRadius: 99, overflow: 'hidden' }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ delay, duration: 1, ease: 'easeOut' }}
      style={{ height: '100%', background: color, borderRadius: 99 }}
    />
  </div>
);

// Floating notification card
const FloatingCard = ({ children, style, delay = 0, floatDuration = 4, floatAmount = 8 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
    style={{
      position: 'absolute',
      background: '#FFFFFF',
      border: '1px solid #E7E7E7',
      borderRadius: 16,
      padding: '14px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      backdropFilter: 'blur(12px)',
      zIndex: 10,
      ...style,
    }}
  >
    <motion.div
      animate={{ y: [0, -floatAmount, 0] }}
      transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
    >
      {children}
    </motion.div>
  </motion.div>
);

// Main dashboard mockup
const HeroDashboard = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), { stiffness: 100, damping: 30 });
  const dashRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = dashRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const tasks = [
    { label: 'EDA Pipeline', pct: 88, color: '#FF634A' },
    { label: 'SQL Queries', pct: 72, color: '#3B82F6' },
    { label: 'Power BI Report', pct: 95, color: '#22C55E' },
  ];

  return (
    <div
      ref={dashRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', width: '100%', height: 560, perspective: 900 }}
    >
      {/* Main dashboard card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 120, damping: 20 }}
        style={{
          rotateX, rotateY,
          background: '#FFFFFF',
          border: '1px solid #E7E7E7',
          borderRadius: 24,
          padding: '20px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.05)',
          position: 'relative',
          zIndex: 5,
          transformStyle: 'preserve-3d',
          marginTop: 40,
        }}
      >
        {/* Dashboard header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#FF634A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={14} color="#fff" />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1B1B1B' }}>Analytics Dashboard</span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#FF5F57','#FFBD2E','#28C840'].map(c => (
              <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Revenue', value: '₹2.15B', change: '+12%', icon: <TrendingUp size={12} color="#22C55E" />, color: '#22C55E' },
            { label: 'Records', value: '150K+', change: '+8%', icon: <Database size={12} color="#3B82F6" />, color: '#3B82F6' },
            { label: 'Insights', value: '94', change: '+24%', icon: <Zap size={12} color="#FF634A" />, color: '#FF634A' },
          ].map((kpi, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              style={{ background: '#F4F4F6', borderRadius: 12, padding: '10px 12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '0.62rem', color: '#8A8A8A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{kpi.label}</span>
                {kpi.icon}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1B1B1B', letterSpacing: '-0.03em' }}>{kpi.value}</div>
              <div style={{ fontSize: '0.6rem', color: kpi.color, fontWeight: 700, marginTop: 2 }}>{kpi.change} this month</div>
            </motion.div>
          ))}
        </div>

        {/* Line chart area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ marginBottom: 16 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1B1B1B' }}>Revenue Trend</span>
            <span style={{ fontSize: '0.6rem', color: '#8A8A8A', background: '#F4F4F6', padding: '2px 8px', borderRadius: 99 }}>Last 6 months</span>
          </div>
          <MiniLineChart color="#FF634A" delay={0.5} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => (
              <span key={m} style={{ fontSize: '0.55rem', color: '#8A8A8A' }}>{m}</span>
            ))}
          </div>
        </motion.div>

        {/* Tasks / progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1B1B1B', marginBottom: 8 }}>Project Progress</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tasks.map((t, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.65rem', color: '#666' }}>{t.label}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: t.color }}>{t.pct}%</span>
                </div>
                <AnimatedBar pct={t.pct} color={t.color} delay={1.4 + i * 0.15} />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating card — AI Widget */}
      <FloatingCard
        delay={0.8}
        floatDuration={5}
        floatAmount={7}
        style={{ top: -10, right: -24, width: 170 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, #FF634A, #FF8B76)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={13} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#1B1B1B' }}>AI Insight</div>
            <div style={{ fontSize: '0.55rem', color: '#8A8A8A' }}>Just now</div>
          </div>
        </div>
        <p style={{ fontSize: '0.62rem', color: '#666', lineHeight: 1.5, margin: 0 }}>
          Revenue up <strong style={{ color: '#FF634A' }}>+12%</strong> — Q2 target achievable
        </p>
        <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
          {[0.9, 0.7, 0.85].map((o, i) => (
            <motion.div key={i}
              animate={{ scaleY: [1, 1.8, 1] }}
              transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 3, height: 12, background: '#FF634A', borderRadius: 99, opacity: o, transformOrigin: 'center' }}
            />
          ))}
          <span style={{ fontSize: '0.55rem', color: '#8A8A8A', alignSelf: 'center', marginLeft: 4 }}>Analyzing…</span>
        </div>
      </FloatingCard>

      {/* Floating card — Notification */}
      <FloatingCard
        delay={1.0}
        floatDuration={6}
        floatAmount={6}
        style={{ bottom: 80, right: -28, width: 190 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F4F4F6', border: '2px solid #E7E7E7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bell size={14} color="#FF634A" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1B1B1B' }}>Report Ready</div>
            <div style={{ fontSize: '0.58rem', color: '#8A8A8A' }}>Sales Q2 Dashboard exported</div>
          </div>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
        </div>
      </FloatingCard>

      {/* Floating card — Stats bubble */}
      <FloatingCard
        delay={1.2}
        floatDuration={7}
        floatAmount={10}
        style={{ bottom: 30, left: -20, width: 148 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DonutRing pct={82} color="#FF634A" size={52} delay={1.5} />
          <div>
            <div style={{ fontSize: '0.62rem', color: '#8A8A8A', marginBottom: 2 }}>Accuracy</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1B1B1B' }}>82%</div>
            <div style={{ fontSize: '0.55rem', color: '#22C55E', fontWeight: 600 }}>↑ High</div>
          </div>
        </div>
      </FloatingCard>

      {/* Floating card — Mini bar chart */}
      <FloatingCard
        delay={0.6}
        floatDuration={5.5}
        floatAmount={5}
        style={{ top: 120, left: -30, width: 160 }}
      >
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1B1B1B', marginBottom: 8 }}>Weekly Queries</div>
        <MiniBarChart delay={0.8} />
      </FloatingCard>

      {/* Floating card — Users */}
      <FloatingCard
        delay={1.4}
        floatDuration={4.5}
        floatAmount={6}
        style={{ top: 320, left: -40, width: 160 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Users size={13} color="#FF634A" />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1B1B1B' }}>Active Now</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: -6 }}>
          {['#FF634A','#3B82F6','#22C55E','#F59E0B'].map((c, i) => (
            <div key={i} style={{
              width: 24, height: 24, borderRadius: '50%',
              background: c, border: '2px solid #fff',
              marginLeft: i > 0 ? -8 : 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.55rem', fontWeight: 700, color: '#fff'
            }}>{['S','A','M','R'][i]}</div>
          ))}
          <span style={{ fontSize: '0.6rem', color: '#8A8A8A', marginLeft: 8 }}>+12 more</span>
        </div>
      </FloatingCard>
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

  const trustItems = [
    { icon: <CheckCircle2 size={13} />, label: 'Trusted by Recruiters' },
    { icon: <Zap size={13} />, label: 'AI Powered Insights' },
    { icon: <Star size={13} />, label: 'Top Certified' },
  ];

  return (
    <section className="hero-section" id="hero">
      <div className="animated-grid" />
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />
      <div className="hero-glow hero-glow-3" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-content">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 1.2rem', borderRadius: '9999px',
                border: '1px solid rgba(255, 99, 74, 0.25)',
                background: 'var(--accent-dim)',
                fontSize: '0.75rem', color: 'var(--accent)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
                marginBottom: '2rem'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }}
              />
              Available for opportunities
            </motion.div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              marginBottom: '1rem',
              color: '#1B1B1B',
            }}>
              Architecting Intelligent<br />
              <span className="gradient-text">AI Systems & ML Solutions</span>
            </h1>

            {/* Rotating role */}
            <div style={{ height: '2.2rem', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={roleIndex}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -28, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Safvan Sidheeq — {roles[roleIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: 'clamp(0.88rem, 1.8vw, 1rem)',
                color: 'var(--text-2)',
                maxWidth: '480px',
                lineHeight: 1.8,
                marginBottom: '2rem',
              }}
            >
              Aspiring AI Engineer specializing in Machine Learning, Generative AI, FastAPI backend engineering, and Data Analytics. Building intelligent applications and data pipelines.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="hero-cta-row"
              style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}
            >
              <motion.a
                whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(255,99,74,0.35)' }}
                whileTap={{ scale: 0.97 }}
                href="#projects"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0 1.75rem', height: 52, borderRadius: 9999,
                  background: '#FF634A', color: '#fff',
                  fontSize: '0.85rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer', textDecoration: 'none',
                  transition: 'all 0.25s',
                  boxShadow: '0 4px 20px rgba(255,99,74,0.3)',
                }}
              >
                <BarChart3 size={16} /> View Projects
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.04, background: '#fff', borderColor: '#D2D2D4' }}
                whileTap={{ scale: 0.97 }}
                href="#contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0 1.75rem', height: 52, borderRadius: 9999,
                  background: 'transparent', color: '#1B1B1B',
                  fontSize: '0.85rem', fontWeight: 700,
                  border: '1.5px solid #D2D2D4', cursor: 'pointer', textDecoration: 'none',
                  transition: 'all 0.25s',
                }}
              >
                <Download size={16} /> Download CV
              </motion.a>
            </motion.div>

            {/* Trust items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}
            >
              {trustItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#666', fontSize: '0.78rem', fontWeight: 500 }}>
                  <span style={{ color: '#FF634A' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="stats-row"
              style={{ marginTop: '2rem', maxWidth: '480px' }}
            >
              {[
                { number: '4', suffix: '+', label: 'Projects' },
                { number: '3', suffix: '+', label: 'Internships' },
                { number: '10', suffix: '+', label: 'Tech Tools' },
                { number: '5', suffix: '', label: 'Certifications' },
              ].map((stat, i) => (
                <motion.div key={i} className="stat-item" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <div className="stat-number gradient-text">
                    <AnimatedCounter value={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard mockup */}
          <div className="hero-dashboard-wrapper">
            <HeroDashboard />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} color="var(--text-3)" />
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
    { icon: <Table2 size={20} />, title: 'Data Cleaning', desc: 'Transforming messy datasets into structured, analysis-ready data.', color: '#FF634A' },
    { icon: <Database size={20} />, title: 'SQL & Data Modeling', desc: 'Building multi-table data models and executing complex queries.', color: '#3B82F6' },
    { icon: <BarChart3 size={20} />, title: 'Dashboard Creation', desc: 'Designing interactive Power BI and Excel dashboards.', color: '#8B5CF6' },
    { icon: <TrendingUp size={20} />, title: 'Statistical Analysis', desc: 'Identifying patterns and trends for data-driven decisions.', color: '#F59E0B' },
    { icon: <BrainCircuit size={20} />, title: 'EDA & Insights', desc: 'Conducting exploratory analysis to uncover business insights.', color: '#22C55E' },
    { icon: <Target size={20} />, title: 'Business Intelligence', desc: 'Translating data into actionable business recommendations.', color: '#EF4444' },
  ], []);

  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeader label="About Me" title="Who I Am" subtitle="A detail-oriented aspiring Data Analyst passionate about turning data into decisions." />

        <div className="about-grid">
          {/* Left: Image */}
          <FadeIn direction="left">
            <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <img
                src="/memoji.png"
                alt="Safvan Sidheeq"
                style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '20px', margin: '0 auto' }}
                loading="lazy"
              />
              <div style={{ marginTop: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-1)' }}>Safvan Sidheeq</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', fontWeight: 600 }}>DATA ANALYST</p>
              </div>
            </div>
          </FadeIn>

          {/* Right: Text */}
          <FadeIn direction="right">
            <div className="glass-card" style={{ padding: '2rem' }}>
              <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.85, marginBottom: '1.25rem' }}>
                I am an aspiring <span style={{ color: 'var(--accent)', fontWeight: 600 }}>AI Engineer</span> with strong skills in Artificial Intelligence, Machine Learning, FastAPI backend engineering, and Data Analytics (SQL, Python, Power BI, Excel). I enjoy building intelligent applications, prompt engineering, and processing data to extract actionable insights.
              </p>
              <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.85 }}>
                My experience spans internships as a <strong style={{ color: 'var(--text-1)' }}>Data Science Intern at Luminar Technolab</strong>, <strong style={{ color: 'var(--text-1)' }}>Flutter Intern at CODEEDEX TECHNOLOGIES</strong>, and <strong style={{ color: 'var(--text-1)' }}>Full-stack Developer Intern at ICT Academy (Cyberpark Calicut)</strong>, along with professional simulations from Deloitte and Tata. Based in Kozhikode, Kerala, India.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Animated Counters — slide from left */}
        <FadeIn direction="left" delay={0.1}>
          <div className="stats-row" style={{ maxWidth: '600px', marginBottom: '3rem' }}>
            {[
              { number: '4', suffix: '+', label: 'Projects Done', icon: <Layers size={16} /> },
              { number: '10', suffix: '+', label: 'Tools Used', icon: <Code2 size={16} /> },
              { number: '5', suffix: '', label: 'Certifications', icon: <Award size={16} /> },
              { number: '3', suffix: '+', label: 'Internships', icon: <Calendar size={16} /> },
            ].map((stat, i) => (
              <div key={i} className="stat-item">
                <div style={{ color: 'var(--accent)', marginBottom: '0.3rem' }}>{stat.icon}</div>
                <div className="stat-number gradient-text"><AnimatedCounter value={stat.number} suffix={stat.suffix} /></div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Core Expertise — stacking card reveal */}
        <FadeIn direction="right" delay={0.1}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Core Expertise
          </h3>
        </FadeIn>
        <CoreExpertiseStack expertise={expertise} />

        {/* Quote — slide from left */}
        <FadeIn direction="left" delay={0.1}>
          <blockquote style={{ marginTop: '3rem', padding: '1.5rem 1.75rem', borderLeft: '2px solid var(--accent)', background: 'var(--accent-dim)', borderRadius: '0 12px 12px 0' }}>
            <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-2)', lineHeight: 1.8 }}>
              "I believe every dataset has a story to tell. My job is to clean the noise, find the patterns, and present insights that drive real business impact."
            </p>
          </blockquote>
        </FadeIn>

        {/* About grid → 1 column on mobile */}
        <style>{`
          @media (max-width: 768px) {
            #about .container > div:first-of-type { grid-template-columns: 1fr !important; }
            #about .container > div:first-of-type > div:first-child { justify-self: center; }
          }
        `}</style>
      </div>
    </section>
  );
};

/* =============================================
   CORE EXPERTISE — STACKING CARD REVEAL
   Cards reveal one at a time, previous ones stack
   ============================================= */
const CoreExpertiseStack = ({ expertise }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {expertise.map((item, idx) => {
          const direction = idx % 2 === 0 ? 'left' : 'right';
          return (
            <FadeIn key={idx} direction={direction} delay={idx * 0.08}>
              <div className="glass-card" style={{
                padding: '1.5rem',
                position: 'sticky',
                top: `${100 + idx * 20}px`,
                zIndex: idx + 1,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: 44, height: 44, minWidth: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${item.color}12`, border: `1px solid ${item.color}22`,
                    borderRadius: '12px', color: item.color,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>{item.title}</h4>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};

/* =============================================
   TOOLS — SCROLL-DRIVEN HORIZONTAL (DARK SECTION)
   Only moves when user scrolls the page
   ============================================= */
const ToolsMarquee = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 });
  const x1 = useTransform(smoothProgress, [0, 1], ['5%', '-45%']);
  const x2 = useTransform(smoothProgress, [0, 1], ['-45%', '5%']);

  const tools = useMemo(() => [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
    { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'Power BI', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg' },
    { name: 'Excel', icon: 'https://img.icons8.com/color/96/microsoft-excel-2019.png' },
    { name: 'Matplotlib', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg' },
    { name: 'Jupyter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg' },
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Kaggle', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kaggle/kaggle-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  ], []);

  const doubled = [...tools, ...tools];

  return (
    <section ref={sectionRef} className="dark-section section" id="tools" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <div className="container">
        <SectionHeader label="Toolkit" title="Tools I Use" subtitle="Industry-standard tools and technologies powering my workflow." />
      </div>

      <div className="marquee-container" style={{ marginBottom: '1.5rem' }}>
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
    { label: 'All', value: 'all' },
    { label: 'Python', value: 'python' },
    { label: 'Power BI', value: 'powerbi' },
    { label: 'SQL', value: 'sql' },
  ], []);

  const projects = useMemo(() => [
    {
      title: 'Petrol Station Analytics — End-to-End Python → Power BI',
      tag: 'Python · Power BI · Full Pipeline',
      description: 'Complete end-to-end analytics project transforming messy petrol station datasets into business insights. Processed 150,000+ transactions covering ₹2.15B revenue and 22M+ liters. Built Operations and HR dashboards in Power BI.',
      tools: ['Python', 'Pandas', 'NumPy', 'Power BI', 'Matplotlib', 'Seaborn'],
      link: 'https://github.com/safvenn/petrol-pumb-analysis',
      accent: '#F59E0B',
      highlights: ['150K+ Transactions', '₹2.15B Revenue', '2 Dashboards'],
      categories: ['python', 'powerbi'],
    },
    {
      title: 'Hospital Doctor Utilization & Patient Cost Analysis',
      tag: 'Python · SQL · Full Pipeline',
      description: 'Integrated 4 relational datasets into a unified analytical model. Built multi-table data pipeline, cleaned healthcare datasets, and executed 10+ SQL queries to extract KPIs.',
      tools: ['Python', 'Pandas', 'MySQL', 'SQLAlchemy', 'Matplotlib', 'Seaborn', 'Excel'],
      link: 'https://github.com/safvenn/hospital_Multi_table_analysis',
      accent: '#3B82F6',
      highlights: ['4 Datasets Integrated', '10+ SQL Queries', '3 Segments'],
      categories: ['python', 'sql'],
    },
    {
      title: 'Netflix Dataset — Data Cleaning & Content Segmentation',
      tag: 'Python · Power BI · EDA',
      description: 'Cleaned 8,000+ dataset records by removing nulls, standardizing text, and fixing date formats. Performed genre distribution and actor frequency analysis.',
      tools: ['Python', 'Pandas', 'Excel', 'Power BI'],
      link: 'https://github.com/safvenn',
      accent: '#06B6D4',
      highlights: ['8K+ Records', 'Top 20 Actors', 'Power BI Dashboard'],
      categories: ['python', 'powerbi'],
    },
    {
      title: 'Sales Performance Dashboard',
      tag: 'Power BI · Excel · KPI',
      description: 'Interactive sales dashboard tracking 6 KPIs with monthly sales analysis, top-product reports, automated Excel summaries, and drill-through analysis.',
      tools: ['Power BI', 'Excel'],
      link: 'https://github.com/safvenn',
      accent: '#8B5CF6',
      highlights: ['6 KPIs Tracked', 'Interactive Slicers', 'Drill-through'],
      categories: ['powerbi'],
    }
  ], []);

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.categories.includes(activeFilter));

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeader label="Portfolio" title="Featured Projects" subtitle="End-to-end data analysis projects showcasing cleaning, modeling, and visualization." />

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnimatePresence mode="wait">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <TiltCard className="glass-card" style={{ padding: 'clamp(1.25rem, 3vw, 2.5rem)' }}>
                  <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: `radial-gradient(circle, ${project.accent}12 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <span className="tag-label" style={{ color: project.accent, marginBottom: '0.5rem', display: 'inline-block' }}>{project.tag}</span>
                    <h3 style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.3rem)', fontWeight: 700, marginBottom: '0.85rem', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{project.title}</h3>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.25rem', maxWidth: '700px' }}>{project.description}</p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {project.highlights.map((h, i) => (
                        <span key={i} style={{
                          padding: '0.3rem 0.7rem', borderRadius: '6px',
                          background: `${project.accent}10`, border: `1px solid ${project.accent}25`,
                          fontSize: '0.72rem', fontWeight: 600, color: project.accent,
                          fontFamily: 'var(--font-mono)'
                        }}>{h}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {project.tools.map((t, i) => (
                        <span key={i} style={{
                          padding: '0.2rem 0.5rem', borderRadius: '6px',
                          background: 'var(--accent-dim)', border: '1px solid var(--border)',
                          fontSize: '0.68rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)'
                        }}>{t}</span>
                      ))}
                    </div>

                    <motion.a
                      href={project.link} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline"
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      style={{ padding: '0.45rem 1rem', fontSize: '0.76rem', color: project.accent, borderColor: `${project.accent}30`, width: 'auto' }}
                    >
                      <Github size={14} /> View on GitHub <ExternalLink size={12} />
                    </motion.a>
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
   EXPERIENCE TIMELINE (DARK SECTION)
   ============================================= */
const Experience = () => {
  const experiences = useMemo(() => [
    {
      title: 'Data Science Intern',
      company: 'Luminar Technolab (Kochi)',
      type: 'Internship',
      description: 'Gaining hands-on experience in data science, machine learning models, exploratory data analysis, and Python data pipelines.',
      skills: ['Data Science', 'Machine Learning', 'Python', 'EDA', 'SQL'],
      color: '#FF634A',
    },
    {
      title: 'Flutter Developer Intern',
      company: 'CODEEDEX TECHNOLOGIES',
      type: 'Internship',
      description: 'Completed a 6-month internship focused on Flutter and Firebase. Developed customized trip planning mobile application and cloud integration.',
      skills: ['Flutter', 'Firebase', 'Mobile Apps', 'Cloud Integration'],
      color: '#3B82F6',
    },
    {
      title: 'Full-stack Developer Intern',
      company: 'ICT Academy (Cyberpark Calicut)',
      type: 'Internship',
      description: 'Worked as full-stack developer intern building web application modules and backend services at Cyberpark Calicut.',
      skills: ['Full-stack Development', 'Web Applications', 'Backend Services'],
      color: '#22C55E',
    },
    {
      title: 'Deloitte — Data Analytics Simulation',
      company: 'Forage',
      type: 'Job Simulation',
      description: 'Applied data analysis techniques to real business scenarios. Performed forensic technology analysis and generated business insight reports.',
      skills: ['Data Analysis', 'Forensic Technology', 'Business Reporting'],
      color: '#7C3AED',
    },
    {
      title: 'Tata — Data Visualization Simulation',
      company: 'Forage',
      type: 'Job Simulation',
      description: 'Framed business scenarios with data, selected visualization types, created business charts, and communicated data-driven insights to stakeholders.',
      skills: ['Data Visualization', 'Business Charts', 'Insight Communication'],
      color: '#F59E0B',
    },
  ], []);

  return (
    <section id="experience" className="dark-section section" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <div className="container">
        <SectionHeader label="Journey" title="Experience & Simulations" subtitle="Professional internships and industry simulations shaping my career." />

        <div className="timeline">
          {experiences.map((exp, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className={`timeline-item ${idx === 0 ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-1)' }}>{exp.title}</h3>
                  <span style={{
                    padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem',
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                    background: `${exp.color}15`, color: exp.color,
                    border: `1px solid ${exp.color}30`,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {exp.type}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.6rem', fontFamily: 'var(--font-mono)' }}>{exp.company}</p>
                <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '600px' }}>{exp.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {exp.skills.map((s, i) => (
                    <span key={i} style={{
                      padding: '0.2rem 0.55rem', borderRadius: '6px',
                      background: 'var(--bg)', border: '1px solid var(--border-light)',
                      fontSize: '0.68rem', color: 'var(--text-2)', fontFamily: 'var(--font-mono)'
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
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
      provider: 'Google / Coursera', year: 'July 2026', color: '#EA4335',
      pdf: './cert-coursera-wqg2pouipchs.pdf',
      skills: ['AI Tools', 'Prompt Engineering', 'Responsible AI', 'Productivity', 'AI Workflows'],
      type: 'certification'
    },
    {
      title: 'Exploratory Data Analysis with Python and Pandas',
      provider: 'Coursera', year: '2026', color: '#3B82F6',
      pdf: './cert-eda-coursera.pdf',
      skills: ['Data Cleaning', 'Data Transformation', 'EDA', 'Statistical Summaries'],
      type: 'certification'
    },
    {
      title: 'Databases and SQL for Data Science with Python',
      provider: 'IBM / Coursera', year: '2026', color: '#7C3AED',
      pdf: './cert-sql-coursera.pdf',
      skills: ['SQL Queries', 'Database Management', 'Data Retrieval', 'Aggregations'],
      type: 'certification'
    },
    {
      title: 'Deloitte — Data Analytics Job Simulation',
      provider: 'Forage', year: 'April 2026', color: '#3B82F6',
      pdf: './cert-deloitte-forage.pdf',
      skills: ['Data Analysis', 'Forensic Technology', 'Dataset Interpretation', 'Business Insight Reporting'],
      type: 'simulation'
    },
    {
      title: 'Tata — Data Visualization Job Simulation',
      provider: 'Forage', year: 'April 2026', color: '#F59E0B',
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
    <section id="certifications" className="section">
      <div className="container">
        <SectionHeader label="Credentials" title="Certifications & Simulations" subtitle="Industry-recognized certifications and professional job simulations — click to view." />

        <motion.div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
        >
          {allCerts.map((cert, idx) => (
            <motion.div
              key={idx}
              variants={staggerItem}
              className="cert-image-card"
              onClick={() => setLightboxPdf(cert.pdf)}
            >
              <div className="cert-image-wrapper">
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
                      padding: '0.4rem 0.85rem', borderRadius: '8px',
                      background: 'rgba(255, 99, 74, 0.85)', backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 99, 74, 0.6)',
                      color: '#fff', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    <Eye size={13} /> View Certificate
                  </motion.div>
                </div>
              </div>
              <div className="cert-image-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.6rem',
                    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                    background: cert.type === 'certification' ? 'var(--accent-dim)' : 'rgba(139,92,246,0.1)',
                    color: cert.type === 'certification' ? 'var(--accent)' : '#8B5CF6',
                    border: `1px solid ${cert.type === 'certification' ? 'rgba(255,99,74,0.2)' : 'rgba(139,92,246,0.2)'}`,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {cert.type === 'certification' ? '🎓 Certification' : '💼 Simulation'}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.3rem', lineHeight: 1.3 }}>{cert.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: cert.color, fontWeight: 600 }}>{cert.provider}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-3)' }}>• {cert.year}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {cert.skills.map((s, i) => (
                    <span key={i} style={{
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem',
                      background: 'var(--accent-dim)', border: '1px solid var(--border)',
                      color: 'var(--text-2)', fontFamily: 'var(--font-mono)'
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
                style={{ width: '100%', height: '85vh', border: 'none', borderRadius: '12px', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
              />
            </motion.div>
            <button className="cert-lightbox-close" onClick={() => setLightboxPdf(null)}>
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cert grid responsive */}
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
    <section id="contact" className="section">
      <div className="container">
        <SectionHeader label="Contact" title="Let's Connect" subtitle="Open to Data Analyst roles and analytical project collaborations." />
        <FadeIn>
          <div className="glass-card contact-grid" style={{ padding: 'clamp(1.5rem, 4vw, 3.5rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(255, 99, 74, 0.06) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
                Let's Turn Data<br /><span className="gradient-text">Into Decisions.</span>
              </h2>
              <p style={{ color: 'var(--text-2)', marginBottom: '2rem', fontSize: '0.92rem', lineHeight: 1.75 }}>
                Currently seeking entry-level Data Analyst roles where data accuracy, reporting, and decision-making insights are critical.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { Icon: Mail, label: 'Email', val: 'mkdsafwan4@gmail.com' },
                  { Icon: Phone, label: 'Phone', val: '+91 8590207382' },
                  { Icon: MapPin, label: 'Location', val: 'Kozhikode, Kerala, India' }
                ].map(({ Icon, label, val }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 36, height: 36, background: 'var(--accent-dim)', border: '1px solid rgba(255, 99, 74, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.1rem' }}>{label}</div>
                      <div style={{ fontWeight: 500, fontSize: '0.88rem', wordBreak: 'break-all' }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Interests</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {interests.map((interest, i) => (
                    <span key={i} className="interest-pill">
                      <Lightbulb size={10} color="var(--accent)" /> {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem', justifyContent: 'center' }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="btn btn-primary" style={{ width: '100%', padding: '1rem', justifyContent: 'center', fontSize: '0.82rem' }}
                onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=safvankallayi7@gmail.com&su=Data Analyst Opportunity&body=Hi Safvan, I saw your portfolio and would like to connect.')}>
                <Send size={15} /> Send a Message
              </motion.button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  href="https://linkedin.com/in/safvenn" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                  <Linkedin size={15} /> LinkedIn
                </motion.a>
                <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  href="https://github.com/safvenn" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                  <Github size={15} /> GitHub
                </motion.a>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="btn btn-outline" style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', borderColor: 'rgba(255, 99, 74, 0.3)', color: 'var(--accent)' }}
                onClick={() => setIsResumeOpen(true)}>
                <Download size={15} /> View Full Resume
              </motion.button>

              <div style={{ marginTop: '0.5rem', padding: '1.15rem', border: '1px solid var(--border)', borderRadius: '16px', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <GraduationCap size={15} color="var(--accent)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Education</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                  BCA (Final Year) — Kerala, India<br />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>Expected Graduation: 2026</span>
                </p>
                <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Globe size={15} color="var(--accent)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Languages</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
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
    // Light theme — no dark-mode attribute needed
    document.documentElement.removeAttribute('data-theme');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadPct(p => { if (p >= 100) { clearInterval(interval); return 100; } return Math.min(p + Math.floor(Math.random() * 30) + 15, 100); });
    }, 30);
    const timer = setTimeout(() => setIsLoading(false), 300);

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
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#F4F4F6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#FF634A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>S</div>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.04em', color: '#1B1B1B', fontFamily: 'var(--font-display)' }}>Safvan</span>
            </motion.div>
            <div>
              <div className="loader-bar">
                <motion.div
                  style={{ height: '100%', background: '#FF634A', borderRadius: '2px' }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(loadPct, 100)}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <div style={{ textAlign: 'center', marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-3)' }}>
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
                    <div style={{ width: 22, height: 22, borderRadius: '6px', background: '#FF634A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.65rem', color: '#fff' }}>S</div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.03em', color: 'var(--text-1)' }}>Safvan</span>
                  </div>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.78rem' }}>© 2026 Safvan Sidheeq. All rights reserved.</p>
                </div>
                <div className="footer-links" style={{ display: 'flex', gap: '1.5rem' }}>
                  {[
                    { href: 'https://github.com/safvenn', icon: <Github size={14} />, label: 'GitHub' },
                    { href: 'https://linkedin.com/in/safvenn', icon: <Linkedin size={14} />, label: 'LinkedIn' },
                    { href: 'mailto:safvankallayi7@gmail.com', icon: <Mail size={14} />, label: 'Email' },
                  ].map(link => (
                    <motion.a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      whileHover={{ y: -2, color: 'var(--accent)' }}
                      style={{ color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
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
