'use client';

import { useEffect, useRef } from 'react';

type Line = {
  x: number;
  y: number;
  length: number;
  speed: number;
  color: [number, number, number];
  opacity: number;
  thickness: number;
};

const RED: [number, number, number] = [220, 38, 38];
const WHITE: [number, number, number] = [255, 255, 255];
const BLACK: [number, number, number] = [23, 23, 23];

const ANGLE = 55 * Math.PI / 180; // 55 degrees
const COS_A = Math.cos(ANGLE);
const SIN_A = Math.sin(ANGLE);

export default function FloatingLines3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lines = useRef<Line[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const randomColor = (): [number, number, number] => {
      const r = Math.random();
      if (r < 0.5) return WHITE;     // 50% white
      if (r < 0.75) return RED;      // 25% red
      return BLACK;                  // 25% black
    };

    const createLine = (randomPosition = false): Line => {
      const length = 60 + Math.random() * 140;
      const speed = 0.3 + Math.random() * 0.9; // Smooth, premium movement
      const color = randomColor();
      const thickness = 1 + Math.random() * 1.5;
      
      let opacity = 0.2 + Math.random() * 0.6;
      if (color === WHITE) {
        opacity = 0.3 + Math.random() * 0.6;
      } else if (color === BLACK) {
        opacity = 0.15 + Math.random() * 0.45;
      }

      let x = 0;
      let y = 0;

      if (randomPosition) {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      } else {
        // Spawning from bottom or left to flow up-right
        if (Math.random() < 0.6) {
          // Bottom edge
          y = canvas.height + 20;
          x = Math.random() * (canvas.width + 150) - 150;
        } else {
          // Left edge
          x = -20;
          y = Math.random() * (canvas.height + 100) - 50;
        }
      }

      return {
        x,
        y,
        length,
        speed,
        color,
        opacity,
        thickness,
      };
    };

    const initLines = () => {
      lines.current = Array.from({ length: 45 }, () => createLine(true));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (lines.current.length === 0) initLines();
    };
    resize();
    window.addEventListener('resize', resize);

    const drawGrid = (w: number, h: number) => {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      
      ctx.beginPath();
      for (let x = 0; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw Grid
      drawGrid(w, h);

      // 2. Draw Lines
      for (let i = 0; i < lines.current.length; i++) {
        const line = lines.current[i];

        // Update positions (moving diagonally up-right)
        line.x += line.speed * COS_A;
        line.y -= line.speed * SIN_A;

        const dx = line.length * COS_A;
        const dy = -line.length * SIN_A;
        const tailX = line.x - dx;
        const tailY = line.y - dy;

        // Reset if completely off screen (top or right)
        if (tailY < -20 || tailX > w + 20) {
          lines.current[i] = createLine(false);
          continue;
        }

        // Draw line with gradient from tail to head
        const grad = ctx.createLinearGradient(line.x - dx, line.y - dy, line.x, line.y);
        grad.addColorStop(0, `rgba(${line.color[0]},${line.color[1]},${line.color[2]},0)`);
        grad.addColorStop(0.3, `rgba(${line.color[0]},${line.color[1]},${line.color[2]},${line.opacity * 0.25})`);
        grad.addColorStop(1, `rgba(${line.color[0]},${line.color[1]},${line.color[2]},${line.opacity})`);

        ctx.beginPath();
        ctx.moveTo(line.x - dx, line.y - dy);
        ctx.lineTo(line.x, line.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = line.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw glowing head dot
        const dotRadius = Math.max(1.8, line.thickness * 1.5);
        ctx.save();
        if (line.color === RED) {
          ctx.shadowColor = `rgba(${RED[0]},${RED[1]},${RED[2]},0.75)`;
          ctx.shadowBlur = 8;
        } else if (line.color === WHITE) {
          ctx.shadowColor = 'rgba(255,255,255,0.7)';
          ctx.shadowBlur = 6;
        }
        ctx.beginPath();
        ctx.arc(line.x, line.y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${line.color[0]},${line.color[1]},${line.color[2]},${line.opacity})`;
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(draw);
    };

    let animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
