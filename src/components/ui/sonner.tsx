"use client";

// import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			className="toaster group"
			toastOptions={{
				classNames: {
					title:
						"group-[.toaster]:text-foreground group-[.toaster]:dark:text-zinc-100",
					toast:
						"group toast group-[.toaster]:bg-background group-[.toaster]:border-border group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-zinc-950 dark:group-[.toaster]:border-zinc-700",
					description:
						"group-[.toast]:text-muted-foreground group-[.toast]:dark:text-zinc-300",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
					success: "text-blue-600 dark:text-blue-400",
					error: "text-red-600 dark:text-red-400",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
