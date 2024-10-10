import type React from "react";
import { cn } from "@/utils/cn";

export type SkeletonProps = {
	className?: string;
	input?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({
	className,
	input = false,
	...props
}: SkeletonProps) {
	return (
		<div
			className={cn(
				"rounded-md bg-zinc-200/50 dark:bg-zinc-700/70",
				input === true ? "h-11 sm:h-9 w-full" : "",
				className,
			)}
			{...props}
		/>
	);
}
