"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface BoxRevealProps {
	children: JSX.Element;
	width?: "fit-content" | "100%";
	boxColor?: string;
	duration?: number;
	inline?: boolean;
	className?: string;
	delay?: number;
}

export const BoxReveal = ({
	children,
	width = "fit-content",
	boxColor,
	duration,
	inline = false,
	className,
	delay = 0,
}: BoxRevealProps) => {
	const mainControls = useAnimation();
	const slideControls = useAnimation();

	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	useEffect(() => {
		if (isInView) {
			slideControls.start("visible");
			mainControls.start("visible");
		} else {
			slideControls.start("hidden");
			mainControls.start("hidden");
		}
	}, [isInView, mainControls, slideControls]);

	return (
		<div
			ref={ref}
			style={{
				position: "relative",
				width,
				overflow: "hidden",
				display: inline ? "inline-block" : "block",
				verticalAlign: "top",
			}}
			className={className}
		>
			<motion.div
				variants={{
					hidden: { opacity: 0, y: 75 },
					visible: { opacity: 1, y: 0 },
				}}
				initial="hidden"
				animate={mainControls}
				transition={{
					duration: duration ? duration : 0.5,
					delay: delay + 0.25,
				}}
			>
				{children}
			</motion.div>

			<motion.div
				variants={{
					hidden: { left: 0 },
					visible: { left: "100%" },
				}}
				initial="hidden"
				animate={slideControls}
				transition={{
					duration: duration ? duration : 0.5,
					delay,
					ease: "easeIn",
				}}
				style={{
					position: "absolute",
					top: 4,
					bottom: 4,
					left: 0,
					right: 0,
					zIndex: 20,
					background: boxColor ? boxColor : "#5046e6",
				}}
			/>
		</div>
	);
};
