import clsx from "clsx";

export function Divider({
	soft = false,
	strong = false,
	className,
	...props
}: {
	soft?: boolean;
	strong?: boolean;
} & React.ComponentPropsWithoutRef<"hr">) {
	return (
		<hr
			{...props}
			className={clsx(
				"w-full border-t",
				soft && "border-zinc-950/5 dark:border-white/5",
				strong && "border-zinc-950/30 dark:border-white/30",
				!soft && !strong && "border-zinc-950/10 dark:border-white/10",
				className,
			)}
		/>
	);
}
