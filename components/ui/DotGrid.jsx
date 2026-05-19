'use client';
import { useEffect, useRef } from 'react';
import styles from './DotGrid.module.css';

// ── Stitch-exact constants ──────────────────────────────────────────
const S = 16;             // grid spacing (px)
const C = 1;              // dot radius (px)
const W = 725;            // repel radius (px)
const T = 28;             // max displacement (px)
const E = 0.035;          // lerp factor — low = more lag/float
const D = 6;              // Perlin noise amplitude on displaced dots
const O = 0.04;           // Perlin noise frequency
const K = 8e-4;           // Perlin noise time speed

// KJAH brand colours: base grey → cyan ↔ amber near cursor
const BASE  = [51,  51,  51 ];
const COL_A = [77,  223, 240];   // --kjah-cyan
const COL_B = [253, 208, 60 ];   // --kjah-amber

// ── Perlin noise (ported 1:1 from Stitch source) ───────────────────
const GRAD = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
const PERM  = new Uint8Array(512);
{
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (i * 2654435761 >>> 0) % (i + 1);
    const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}
function fade(t)       { return t * t * t * (t * (t * 6 - 15) + 10); }
function mix(a, b, t)  { return a + t * (b - a); }
function grad(h, x, y) { const g = GRAD[h & 7]; return g[0]*x + g[1]*y; }
function noise(x, y) {
  const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x),   yf = y - Math.floor(y);
  const u  = fade(xf), v = fade(yf);
  const a  = PERM[PERM[xi]   + yi],   b  = PERM[PERM[xi]   + yi+1];
  const aa = PERM[PERM[xi+1] + yi],   bb = PERM[PERM[xi+1] + yi+1];
  return mix(
    mix(grad(a,  xf,   yf),   grad(aa, xf-1, yf),   u),
    mix(grad(b,  xf,   yf-1), grad(bb, xf-1, yf-1), u),
    v
  );
}

export default function DotGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    // Each dot: { gx, gy } grid origin + { dx, dy } lerped displacement
    let dots  = [];
    let mouse = null;
    let rafId = null;
    let VW = 0, VH = 0;

    function buildDots(w, h) {
      VW = w; VH = h;
      const cols = Math.ceil(w / S) + 1;
      const rows = Math.ceil(h / S) + 1;
      // Reuse existing dots array so lerp state survives resize
      const needed = cols * rows;
      while (dots.length < needed) dots.push({ gx: 0, gy: 0, dx: 0, dy: 0 });
      dots.length = needed;
      let i = 0;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          dots[i].gx = c * S;
          dots[i].gy = r * S;
          i++;
        }
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w   = window.innerWidth;
      const h   = window.innerHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      buildDots(w, h);
    }

    function draw() {
      ctx.clearRect(0, 0, VW, VH);

      const wSq    = W * W;
      const phaseY = window.scrollY % S;
      const time   = performance.now() * K;

      for (const dot of dots) {
        // Viewport-space origin (page-anchored via scroll phase)
        const ox = dot.gx;
        const oy = dot.gy - phaseY;

        // Target displacement (zero = rest at grid origin)
        let tdx = 0, tdy = 0, proximity = 0;

        if (mouse) {
          const diffX  = ox - mouse.x;
          const diffY  = oy - mouse.y;
          const distSq = diffX * diffX + diffY * diffY;

          if (distSq < wSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            proximity  = 1 - dist / W;
            const disp = proximity * proximity * proximity * T;  // cubic easing
            tdx = (diffX / dist) * disp;
            tdy = (diffY / dist) * disp;

            // Perlin noise for organic jitter on displaced dots
            const nx  = noise(dot.gx * O,       dot.gy * O       + time);
            const ny  = noise(dot.gx * O + 100, dot.gy * O + 100 + time);
            const amp = proximity * proximity * D;
            tdx += nx * amp;
            tdy += ny * amp;
          }
        }

        // Lerp displacement toward target — this is Stitch's exact physics
        dot.dx += (tdx - dot.dx) * E;
        dot.dy += (tdy - dot.dy) * E;

        const px = ox + dot.dx;
        const py = oy + dot.dy;

        // Opacity: fade near bottom + fade near cursor
        let alpha = 1;
        const fadeStart = VH * 0.75;
        if (oy > fadeStart) alpha *= 1 - (oy - fadeStart) / (VH - fadeStart);
        if (proximity > 0) alpha *= 1 - proximity * proximity * 0.85;

        // Colour: shift from grey toward cyan/amber near cursor
        let cr = BASE[0], cg = BASE[1], cb = BASE[2];
        if (proximity > 0) {
          const angle = Math.atan2(oy - mouse.y, ox - mouse.x);
          const t     = (Math.sin(angle * 2 + time * 3) + 1) * 0.5;
          const prox2 = proximity * proximity;
          cr = Math.round(mix(BASE[0], mix(COL_A[0], COL_B[0], t), prox2));
          cg = Math.round(mix(BASE[1], mix(COL_A[1], COL_B[1], t), prox2));
          cb = Math.round(mix(BASE[2], mix(COL_A[2], COL_B[2], t), prox2));
        }

        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, C, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    const onMove  = (e) => { mouse = { x: e.clientX, y: e.clientY }; };
    const onLeave = ()  => { mouse = null; };

    window.addEventListener('resize',    resize);
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    resize();
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
