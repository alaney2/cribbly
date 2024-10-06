"use client";
import { OTPInput, type SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

type NewOtpProps = {
	onComplete: any;
	isDisabled: boolean;
	value: string;
	onChange: (value: string) => void;
};

export type NewOtpRef = {
	focusLastInput: () => void;
};

export function NewOtp({
	onComplete,
	isDisabled,
	value,
	onChange,
}: NewOtpProps) {
	return (
		<OTPInput
			autoFocus
			disabled={isDisabled}
			maxLength={6}
			onComplete={onComplete}
			value={value}
			onChange={onChange}
			containerClassName="group flex items-center has-[:disabled]:opacity-30"
			render={({ slots }) => (
				<>
					<div className="flex">
						{slots.slice(0, 3).map((slot, idx) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<Slot key={idx} {...slot} />
						))}
					</div>
					<FakeDash />
					<div className="flex">
						{slots.slice(3).map((slot, idx) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<Slot key={idx} {...slot} />
						))}
					</div>
				</>
			)}
		/>
	);
}

function Slot(props: SlotProps) {
	return (
		<div
			className={cn(
				"relative w-12 h-14 text-[1.75rem] text-zinc-700 dark:text-zinc-200",
				"flex items-center justify-center",
				// "transition-colors duration-300",
				"border-y border-r first:border-l first:rounded-l-md last:rounded-r-md border-gray-500",
				"group-hover:border-gray-500 group-focus-within:border-gray-500",
				"overflow-hidden",
				props.isActive && props.hasFakeCaret
					? "ring-2 ring-inset ring-blue-500"
					: "ring-0 ring-transparent",
			)}
		>
			{props.char !== null && <div>{props.char}</div>}
			{props.hasFakeCaret && <FakeCaret />}
		</div>
	);
}

function FakeCaret() {
	return (
		<div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
			<div className="w-px h-7 dark:bg-zinc-200 bg-zinc-800" />
		</div>
	);
}

function FakeDash() {
	return (
		<div className="flex w-10 justify-center items-center">
			<div className="w-3 h-1 rounded-full bg-gray-400" />
		</div>
	);
}
