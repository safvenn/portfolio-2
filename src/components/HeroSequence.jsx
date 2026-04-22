import React, { useRef, useEffect, useState } from 'react';

// Import all image frames dynamically
// Vite supports import.meta.glob to fetch all files in a folder
// We use eager with query: '?url' to just get the paths without loading the modules
const assetExports = import.meta.glob('../assets/ezgif-2b494890c1c4e753-png-split/*.png', { eager: true, query: '?url', import: 'default' });

// Fallback in case import.meta.glob syntax fails on some Vite versions
const fallbackExports = import.meta.glob('../assets/ezgif-2b494890c1c4e753-png-split/*.png', { eager: true, as: 'url' });

const extractedUrls = Object.keys(assetExports).length > 0 ? assetExports : fallbackExports;
const frameUrls = Object.keys(extractedUrls).sort().map(key => extractedUrls[key]);

const HeroSequence = () => {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [loaded, setLoaded] = useState(false);

  // 1. Preload images
  useEffect(() => {
    let loadedCount = 0;
    const tempImages = new Array(frameUrls.length).fill(null);

    frameUrls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        tempImages[i] = img;
        loadedCount++;
        
        // Initial render when first frame is loaded
        if (i === 0) {
          drawFrame(0);
        }
        
        if (loadedCount === frameUrls.length) {
          setLoaded(true);
        }
      };
    });
    
    imagesRef.current = tempImages;
  }, []);

  // 2. Draw function
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const img = imagesRef.current[index];
    if (!img) return; // If frame isn't loaded yet

    // Emulate background-size: cover
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let scale;
    if (canvasRatio > imgRatio) {
      scale = canvas.width / img.width;
    } else {
      scale = canvas.height / img.height;
    }
    
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the scaled image
    ctx.drawImage(img, x, y, w, h);
  };

  // 3. Handle Scroll & Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let currentFrame = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * window.devicePixelRatio;
        canvas.height = parent.clientHeight * window.devicePixelRatio;
        drawFrame(currentFrame);
      }
    };

    const handleScroll = () => {
      // Map scroll progress to frames
      // The section is 600vh tall, so the maximum scroll distance inside it is 500vh (5 * innerHeight)
      const maxScroll = window.innerHeight * 5;
      let fraction = window.scrollY / maxScroll;
      
      if (fraction > 1) fraction = 1;
      if (fraction < 0) fraction = 0;

      const frameIndex = Math.min(
        frameUrls.length - 1,
        Math.floor(fraction * frameUrls.length)
      );

      if (frameIndex !== currentFrame) {
        currentFrame = frameIndex;
        requestAnimationFrame(() => drawFrame(currentFrame));
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial setup
    resize();
    handleScroll();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas 
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'contain'
        }}
      />
      
      {/* Optional fade out overlay to blend it slightly into the dark background */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, transparent 30%, var(--bg) 80%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default HeroSequence;
