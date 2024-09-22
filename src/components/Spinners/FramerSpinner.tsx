import { motion } from "framer-motion";

export const FramerSpinner = () => (
	<motion.div
		animate={{ rotate: 360 }}
		transition={{
			duration: 1,
			repeat: Number.POSITIVE_INFINITY,
			ease: "linear",
		}}
		className="inline-block"
	>
		<svg
			className="w-6 h-6 text-white"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>Loading...</title>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
			/>
			<path className="opacity-75" d="M12 2v4" stroke="currentColor" />
		</svg>
	</motion.div>
);
