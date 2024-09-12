"use client";
import { useEffect, useRef, useState } from "react";

interface Shape {
	x: number;
	y: number;
	size: number;
	color: string;
	speedX: number;
	speedY: number;
	type: "circle" | "square" | "triangle";
}

const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				setDimensions({
					width: containerRef.current.offsetWidth,
					height: containerRef.current.offsetHeight,
				});
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);

		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = dimensions.width;
		canvas.height = dimensions.height;

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
		const additionalShapes = Math.floor(dimensions.width / 100); // Add one shape per 100px width
		const totalShapes = Math.max(baseShapes, baseShapes + additionalShapes);

		// Create initial shapes
		for (let i = 0; i < totalShapes; i++) {
			shapes.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 20 + 20,
				color: colors[Math.floor(Math.random() * colors.length)],
				speedX: (Math.random() - 0.5) * 1.5,
				speedY: (Math.random() - 0.5) * 1.5,
				type: ["circle", "square", "triangle"][
					Math.floor(Math.random() * 3)
				] as Shape["type"],
			});
		}

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
						shape.size,
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

		const animate = () => {
			if (!ctx || !canvas) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (const shape of shapes) {
				shape.x += shape.speedX;
				shape.y += shape.speedY;

				// Improved bouncing logic
				if (
					shape.x - shape.size / 2 < 0 ||
					shape.x + shape.size / 2 > canvas.width
				) {
					shape.speedX *= -1;
					shape.x = Math.max(
						shape.size / 2,
						Math.min(canvas.width - shape.size / 2, shape.x),
					);
				}
				if (
					shape.y - shape.size / 2 < 0 ||
					shape.y + shape.size / 2 > canvas.height
				) {
					shape.speedY *= -1;
					shape.y = Math.max(
						shape.size / 2,
						Math.min(canvas.height - shape.size / 2, shape.y),
					);
				}

				drawShape(shape);
			}

			requestAnimationFrame(animate);
		};

		animate();
	}, [dimensions]);

	return (
		<div ref={containerRef} className="relative overflow-hidden">
			<canvas ref={canvasRef} className="absolute inset-0 z-0" />
			<div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/20" />{" "}
			{/* Glass effect */}
			<div className="relative z-20">{children}</div>
		</div>
	);
};

export { AnimatedBackground };
