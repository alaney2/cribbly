"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Shape {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  type: "circle" | "square" | "triangle";
  mass: number;
}

const createShapes = (width: number, height: number): Shape[] => {
  const shapes: Shape[] = [];
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#f97316",
    "#a3e635",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#a855f7",
    "#ec4899",
    "#f43f5e",
    "#eab308",
    "#ef4444",
  ];

  const baseShapes = 5;
  const additionalShapes = Math.floor(width / 100);
  const totalShapes = Math.max(baseShapes, baseShapes + additionalShapes);

  for (let i = 0; i < totalShapes; i++) {
    shapes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 20 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      type: ["circle", "square", "triangle"][
        Math.floor(Math.random() * 3)
      ] as Shape["type"],
      mass: Math.random() * 0.5 + 0.5,
    });
  }

  return shapes;
};

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
  hideOnSmallScreens?: boolean;
}

export function AnimatedBackground({
  children,
  className,
  hideOnSmallScreens = false,
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const newDimensions = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        };
        setDimensions(newDimensions);

        // Only create shapes if they haven't been created yet
        if (shapes.length === 0) {
          setShapes(createShapes(newDimensions.width, newDimensions.height));
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [shapes.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const drawShape = (shape: Shape) => {
      if (!ctx) return;
      ctx.fillStyle = shape.color;
      ctx.beginPath();

      switch (shape.type) {
        case "circle":
          ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
          break;
        case "square":
          ctx.rect(
            shape.x - shape.size / 2,
            shape.y - shape.size / 2,
            shape.size,
            shape.size
          );
          break;
        case "triangle":
          ctx.moveTo(shape.x, shape.y - shape.size / 2);
          ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size / 2);
          ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size / 2);
          ctx.closePath();
          break;
      }

      ctx.fill();
    };

    const checkCollision = (shape1: Shape, shape2: Shape) => {
      const dx = shape2.x - shape1.x;
      const dy = shape2.y - shape1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (shape1.size + shape2.size) / 2;
    };

    const resolveCollision = (shape1: Shape, shape2: Shape) => {
      const dx = shape2.x - shape1.x;
      const dy = shape2.y - shape1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Normal vector
      const nx = dx / distance;
      const ny = dy / distance;

      // Tangent vector
      const tx = -ny;
      const ty = nx;

      // Dot product tangent
      const dpTan1 = shape1.speedX * tx + shape1.speedY * ty;
      const dpTan2 = shape2.speedX * tx + shape2.speedY * ty;

      // Dot product normal
      const dpNorm1 = shape1.speedX * nx + shape1.speedY * ny;
      const dpNorm2 = shape2.speedX * nx + shape2.speedY * ny;

      // Conservation of momentum in 1D
      const m1 =
        (dpNorm1 * (shape1.mass - shape2.mass) + 2 * shape2.mass * dpNorm2) /
        (shape1.mass + shape2.mass);
      const m2 =
        (dpNorm2 * (shape2.mass - shape1.mass) + 2 * shape1.mass * dpNorm1) /
        (shape1.mass + shape2.mass);

      // Update velocities
      shape1.speedX = tx * dpTan1 + nx * m1;
      shape1.speedY = ty * dpTan1 + ny * m1;
      shape2.speedX = tx * dpTan2 + nx * m2;
      shape2.speedY = ty * dpTan2 + ny * m2;
    };

    let animationFrameId: number;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        shape.x += shape.speedX;
        shape.y += shape.speedY;

        // Wall collision
        if (
          shape.x - shape.size / 2 < 0 ||
          shape.x + shape.size / 2 > canvas.width
        ) {
          shape.speedX *= -1;
          shape.x = Math.max(
            shape.size / 2,
            Math.min(canvas.width - shape.size / 2, shape.x)
          );
        }
        if (
          shape.y - shape.size / 2 < 0 ||
          shape.y + shape.size / 2 > canvas.height
        ) {
          shape.speedY *= -1;
          shape.y = Math.max(
            shape.size / 2,
            Math.min(canvas.height - shape.size / 2, shape.y)
          );
        }

        // Shape collision
        for (let j = i + 1; j < shapes.length; j++) {
          if (checkCollision(shape, shapes[j])) {
            resolveCollision(shape, shapes[j]);
          }
        }

        drawShape(shape);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, shapes]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden w-full h-full", className)}
    >
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 z-0",
          hideOnSmallScreens && "hidden sm:block"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 z-10 backdrop-blur-sm bg-white/20",
          hideOnSmallScreens && "hidden sm:block"
        )}
      />{" "}
      {/* Glass effect */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
