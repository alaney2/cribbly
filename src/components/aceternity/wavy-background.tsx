"use client";
import { cn } from "@/utils/cn";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { on } from "events";
import { debounce } from 'lodash';

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.005;
      case "fast":
        return 0.0007;
      default:
        return 0.001;
    }
  };

  let animationId: number = 0;

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = function () {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "rgb(59 130 246)",
    // "rgb(37 99 235)",
    "#c084fc",
    // "#e879f9",
    // "#22d3ee",
  ];


  const drawWave = (n: number, waveOffset=100) => {
    nt += getSpeed();
    for (let i = 0; i < n; i++) {
      const wavePath = new Path2D();
      const stepSize = 5;
      for (let x = 0; x < w; x += stepSize) {
        const y = noise(x / 800, 0.3 * i, nt) * 160;
        if (x === 0) {
          wavePath.moveTo(x, y + h * 0.5 + waveOffset);
        } else {
          wavePath.lineTo(x, y + h * 0.5 + waveOffset);
        }
      }
      ctx.lineWidth = waveWidth || 100;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      ctx.stroke(wavePath);
    }
  };

  
  const render = () => {
    if (!ctx) return;
    ctx.fillStyle = backgroundFill || "rgb(249 250 251)";
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(6);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = debounce(() => {
      setDimensions({ width: canvas.clientWidth, height: canvas.clientHeight });
    }, 100);
    window.addEventListener('resize', handleResize);

    init();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={cn("relative", containerClassName)} style={{ position: 'relative', zIndex: 0 }}>
      <canvas
        className="absolute top-0 left-0 w-full h-full z-0"
        ref={canvasRef}
        id="canvas"
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
