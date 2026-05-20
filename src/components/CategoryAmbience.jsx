import React, { useEffect, useRef } from 'react';

/**
 * Category-specific ambient animations rendered on a canvas overlay.
 * Each category gets a unique, themed visual effect in the blank areas.
 */
export default function CategoryAmbience({ ambience, themeColor }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    function resize() {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || 600;
    }
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // ═══ SMOKE (Death) ═══
    if (ambience === 'smoke') {
      class Smoke {
        constructor() { this.reset(); }
        reset() {
          this.x = Math.random() * W();
          this.y = H() + 20;
          this.size = Math.random() * 40 + 20;
          this.speed = Math.random() * 0.5 + 0.2;
          this.opacity = Math.random() * 0.14 + 0.04;
          this.drift = (Math.random() - 0.5) * 0.3;
        }
        update() {
          this.y -= this.speed;
          this.x += this.drift + Math.sin(this.y * 0.01) * 0.3;
          this.opacity *= 0.999;
          this.size += 0.1;
          if (this.y < -50 || this.opacity < 0.005) this.reset();
        }
        draw() {
          ctx.beginPath();
          const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
          g.addColorStop(0, `rgba(145,145,150,${this.opacity})`);
          g.addColorStop(0.45, `rgba(76,76,84,${this.opacity * 0.55})`);
          g.addColorStop(1, 'rgba(28,28,32,0)');
          ctx.fillStyle = g;
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      particles = Array.from({ length: 25 }, () => new Smoke());
    }

    // ═══ PLANETS (Space) ═══
    else if (ambience === 'planets') {
      const planets = [
        { cx: W() * 0.15, cy: H() * 0.3, r: 12, orbitR: 60, speed: 0.003, color: '#a78bfa', ring: true },
        { cx: W() * 0.85, cy: H() * 0.25, r: 8, orbitR: 40, speed: -0.005, color: '#60a5fa', ring: false },
        { cx: W() * 0.5, cy: H() * 0.8, r: 16, orbitR: 80, speed: 0.002, color: '#c084fc', ring: true },
      ];
      let stars = Array.from({ length: 50 }, () => ({
        x: Math.random() * W(), y: Math.random() * H(),
        s: Math.random() * 1.5 + 0.3, tw: Math.random() * Math.PI * 2,
      }));
      let t = 0;
      particles = { planets, stars, t };
    }

    // ═══ LEAVES (Environment) ═══
    else if (ambience === 'leaves') {
      class Leaf {
        constructor() { this.reset(); }
        reset() {
          this.x = Math.random() * W();
          this.y = -20 - Math.random() * 100;
          this.size = Math.random() * 8 + 4;
          this.speedY = Math.random() * 0.8 + 0.3;
          this.speedX = (Math.random() - 0.5) * 0.5;
          this.rotation = Math.random() * Math.PI * 2;
          this.rotSpeed = (Math.random() - 0.5) * 0.03;
          this.opacity = Math.random() * 0.34 + 0.14;
          this.hue = 100 + Math.random() * 40;
          this.flower = Math.random() > 0.72;
        }
        update() {
          this.y += this.speedY;
          this.x += this.speedX + Math.sin(this.y * 0.02) * 0.5;
          this.rotation += this.rotSpeed;
          if (this.y > H() + 20) this.reset();
        }
        draw() {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          if (this.flower) {
            for (let i = 0; i < 5; i++) {
              ctx.rotate((Math.PI * 2) / 5);
              ctx.beginPath();
              ctx.ellipse(this.size * 0.45, 0, this.size * 0.45, this.size * 0.22, 0, 0, Math.PI * 2);
              ctx.fillStyle = `hsla(${45 + this.hue * 0.2}, 85%, 62%, ${this.opacity * 0.85})`;
              ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(36, 85%, 48%, ${this.opacity})`;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 60%, 45%, ${this.opacity})`;
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.75, 0);
            ctx.lineTo(this.size * 0.75, 0);
            ctx.strokeStyle = `hsla(${this.hue + 18}, 55%, 30%, ${this.opacity * 0.65})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      particles = Array.from({ length: 20 }, () => new Leaf());
    }

    // ═══ MATRIX (Technology) ═══
    else if (ambience === 'matrix') {
      const cols = Math.floor(W() / 20);
      const drops = Array.from({ length: cols }, () => Math.random() * -100);
      const chars = '01'.split('');
      particles = { drops, chars };
    }

    // ═══ RAIN (Weather) ═══
    else if (ambience === 'rain') {
      class Drop {
        constructor() { this.reset(); }
        reset() {
          this.x = Math.random() * W();
          this.y = Math.random() * -H();
          this.len = Math.random() * 15 + 8;
          this.speed = Math.random() * 4 + 3;
          this.opacity = Math.random() * 0.15 + 0.05;
        }
        update() {
          this.y += this.speed;
          if (this.y > H()) this.reset();
        }
        draw() {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x - 1, this.y + this.len);
          ctx.strokeStyle = `rgba(100, 180, 255, ${this.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      particles = Array.from({ length: 40 }, () => new Drop());
    }

    // ═══ BUBBLES (Food) ═══
    else if (ambience === 'bubbles') {
      class Bubble {
        constructor() { this.reset(); }
        reset() {
          this.x = Math.random() * W();
          this.y = H() + 20;
          this.r = Math.random() * 6 + 2;
          this.speed = Math.random() * 0.6 + 0.2;
          this.opacity = Math.random() * 0.15 + 0.05;
          this.wobble = Math.random() * Math.PI * 2;
        }
        update() {
          this.y -= this.speed;
          this.x += Math.sin(this.wobble) * 0.3;
          this.wobble += 0.02;
          if (this.y < -20) this.reset();
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(217, 119, 6, ${this.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      particles = Array.from({ length: 18 }, () => new Bubble());
    }

    // ═══ CHARTS (Economy) ═══
    else if (ambience === 'charts') {
      let t = 0;
      particles = { t };
    }

    // ═══ PULSE (Health) ═══
    else if (ambience === 'pulse') {
      let t = 0;
      particles = { t };
    }

    // ═══ SPOTLIGHT (Movies) ═══
    else if (ambience === 'spotlight') {
      let t = 0;
      particles = { t };
    }

    // ═══ GENERIC (formulas, network, scanlines) ═══
    else {
      class Dot {
        constructor() { this.reset(); }
        reset() {
          this.x = Math.random() * W();
          this.y = Math.random() * H();
          this.vx = (Math.random() - 0.5) * 0.3;
          this.vy = (Math.random() - 0.5) * 0.3;
          this.opacity = Math.random() * 0.2 + 0.05;
        }
        update() {
          this.x += this.vx; this.y += this.vy;
          if (this.x < 0 || this.x > W()) this.vx *= -1;
          if (this.y < 0 || this.y > H()) this.vy *= -1;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hexToRgb(themeColor)}, ${this.opacity})`;
          ctx.fill();
        }
      }
      particles = Array.from({ length: 15 }, () => new Dot());
    }

    function animate() {
      ctx.clearRect(0, 0, W(), H());

      // Planets (space)
      if (ambience === 'planets' && particles.planets) {
        particles.t = (particles.t || 0) + 1;
        const t = particles.t;
        // Stars
        particles.stars.forEach(s => {
          const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.02 + s.tw));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 200, 255, ${0.15 * twinkle})`;
          ctx.fill();
        });
        // Planets with orbits
        particles.planets.forEach(p => {
          const angle = t * p.speed;
          const px = p.cx + Math.cos(angle) * p.orbitR;
          const py = p.cy + Math.sin(angle) * p.orbitR * 0.4;
          // Orbit path
          ctx.beginPath();
          ctx.ellipse(p.cx, p.cy, p.orbitR, p.orbitR * 0.4, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(167, 139, 250, 0.06)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          // Planet
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          const grd = ctx.createRadialGradient(px - p.r * 0.3, py - p.r * 0.3, 0, px, py, p.r);
          grd.addColorStop(0, p.color + '60');
          grd.addColorStop(1, p.color + '20');
          ctx.fillStyle = grd;
          ctx.fill();
          // Ring
          if (p.ring) {
            ctx.beginPath();
            ctx.ellipse(px, py, p.r * 1.8, p.r * 0.4, Math.PI * 0.1, 0, Math.PI * 2);
            ctx.strokeStyle = p.color + '30';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });
      }

      // Matrix (technology)
      else if (ambience === 'matrix' && particles.drops) {
        ctx.font = '12px monospace';
        particles.drops.forEach((y, i) => {
          const ch = particles.chars[Math.floor(Math.random() * particles.chars.length)];
          ctx.fillStyle = `rgba(6, 182, 212, 0.08)`;
          ctx.fillText(ch, i * 20, y * 20);
          if (y * 20 > H() && Math.random() > 0.98) particles.drops[i] = 0;
          else particles.drops[i] = y + 0.3;
        });
      }

      // Charts (economy) - animated sine waves
      else if (ambience === 'charts' && particles.t !== undefined) {
        particles.t += 0.02;
        for (let line = 0; line < 3; line++) {
          ctx.beginPath();
          for (let x = 0; x < W(); x += 2) {
            const y = H() * (0.3 + line * 0.2) +
              Math.sin(x * 0.01 + particles.t + line) * 30 +
              Math.cos(x * 0.007 + particles.t * 0.5 + line * 2) * 20;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(5, 150, 105, ${0.06 - line * 0.015})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Pulse (health) - ECG-like line
      else if (ambience === 'pulse' && particles.t !== undefined) {
        particles.t += 2;
        ctx.beginPath();
        const cy = H() * 0.5;
        for (let x = 0; x < W(); x += 2) {
          const pos = (x + particles.t) % 200;
          let y = cy;
          if (pos > 80 && pos < 90) y = cy - 40;
          else if (pos > 90 && pos < 100) y = cy + 25;
          else if (pos > 100 && pos < 110) y = cy - 15;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(220, 38, 38, 0.08)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Spotlight (movies) - sweeping light
      else if (ambience === 'spotlight' && particles.t !== undefined) {
        particles.t += 0.008;
        const cx = W() * 0.5 + Math.cos(particles.t) * W() * 0.3;
        const g = ctx.createRadialGradient(cx, 0, 0, cx, 0, H() * 0.8);
        g.addColorStop(0, `rgba(219, 39, 119, 0.06)`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W(), H());
      }

      // Simple particle types (smoke, leaves, rain, bubbles, generic)
      else if (Array.isArray(particles)) {
        particles.forEach(p => { p.update(); p.draw(); });
      }

      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [ambience, themeColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
