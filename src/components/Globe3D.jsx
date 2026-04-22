import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* =============================================
   SCROLL-DRIVEN WIREFRAME GLOBE
   Pure geometric globe that rotates based on
   scroll position — no auto-animation.
   ============================================= */
const GlobeMesh = ({ scrollRef }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      const scrollProgress = scrollRef.current;
      meshRef.current.rotation.y = scrollProgress * 3;
      meshRef.current.rotation.x = scrollProgress * 0.8 + 0.15;
    }
  });

  return (
    <group>
      {/* Main wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.2, 2]} />
        <meshBasicMaterial color="#2563EB" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[2.15, 32, 32]} />
        <meshBasicMaterial color="#2563EB" transparent opacity={0.018} side={THREE.BackSide} />
      </mesh>

      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[2.7, 32, 32]} />
        <meshBasicMaterial color="#2563EB" transparent opacity={0.008} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

/* =============================================
   ORBIT RINGS (decoration only)
   ============================================= */
const OrbitRing = ({ radius, inclination = 0, scrollRef, speedFactor = 1 }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      const scrollProgress = scrollRef.current;
      ref.current.rotation.z = scrollProgress * 1.5 * speedFactor;
    }
  });

  return (
    <mesh ref={ref} rotation={[inclination, 0, 0]}>
      <torusGeometry args={[radius, 0.004, 8, 128]} />
      <meshBasicMaterial color="#2563EB" transparent opacity={0.06} />
    </mesh>
  );
};

/* =============================================
   SMALL PARTICLE DOTS ON RINGS
   ============================================= */
const RingDot = ({ radius, inclination = 0, angle, color, scrollRef, speedFactor = 1 }) => {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      const scrollProgress = scrollRef.current;
      const adjustedAngle = angle + scrollProgress * 2 * speedFactor;
      const x = Math.cos(adjustedAngle) * radius;
      const baseZ = Math.sin(adjustedAngle) * radius;
      const y = baseZ * Math.sin(inclination);
      const z = baseZ * Math.cos(inclination);
      ref.current.position.set(x, y, z);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

/* =============================================
   3D CANVAS (DESKTOP)
   ============================================= */
const Globe3DCanvas = () => {
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const innerDots = [
    { angle: 0, color: '#3B82F6' },
    { angle: Math.PI * 0.5, color: '#F59E0B' },
    { angle: Math.PI, color: '#22C55E' },
    { angle: Math.PI * 1.5, color: '#EAB308' },
  ];

  const outerDots = [
    { angle: 0.4, color: '#A855F7' },
    { angle: Math.PI * 0.7 + 0.4, color: '#06B6D4' },
    { angle: Math.PI * 1.4 + 0.4, color: '#10B981' },
    { angle: Math.PI * 1.9 + 0.4, color: '#38BDF8' },
  ];

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#2563EB" distance={12} />
      <pointLight position={[5, 5, 5]} intensity={0.15} />

      <GlobeMesh scrollRef={scrollRef} />
      <OrbitRing radius={3.2} inclination={0.35} scrollRef={scrollRef} speedFactor={1} />
      <OrbitRing radius={4.0} inclination={-0.4} scrollRef={scrollRef} speedFactor={-0.7} />

      {innerDots.map((dot, i) => (
        <RingDot key={`inner-${i}`} radius={3.2} inclination={0.35} angle={dot.angle} color={dot.color} scrollRef={scrollRef} speedFactor={1} />
      ))}
      {outerDots.map((dot, i) => (
        <RingDot key={`outer-${i}`} radius={4.0} inclination={-0.4} angle={dot.angle} color={dot.color} scrollRef={scrollRef} speedFactor={-0.7} />
      ))}
    </Canvas>
  );
};

/* =============================================
   2D CSS FALLBACK (MOBILE) — no labels
   ============================================= */
const Globe2DFallback = () => {
  const innerDots = [
    { color: '#3B82F6' },
    { color: '#F59E0B' },
    { color: '#22C55E' },
    { color: '#EAB308' },
  ];
  const outerDots = [
    { color: '#A855F7' },
    { color: '#06B6D4' },
    { color: '#10B981' },
    { color: '#38BDF8' },
  ];

  return (
    <div className="globe-2d-container">
      <div className="globe-2d-core">
        <div className="globe-2d-pulse" />
        <div className="globe-2d-pulse globe-2d-pulse-2" />
      </div>
      <div className="globe-2d-ring globe-2d-ring-1">
        {innerDots.map((t, i) => (
          <div key={i} className="globe-2d-node" style={{ '--angle': `${i * 90}deg`, '--color': t.color }}>
            <span className="globe-2d-dot" />
          </div>
        ))}
      </div>
      <div className="globe-2d-ring globe-2d-ring-2">
        {outerDots.map((t, i) => (
          <div key={i} className="globe-2d-node" style={{ '--angle': `${i * 90 + 45}deg`, '--color': t.color }}>
            <span className="globe-2d-dot" />
          </div>
        ))}
      </div>
    </div>
  );
};

/* =============================================
   EXPORTED COMPONENT
   ============================================= */
const Globe3D = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || window.matchMedia('(hover: none)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) return <Globe2DFallback />;
  return <Globe3DCanvas />;
};

export default Globe3D;
