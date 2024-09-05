"use client";

import * as React from "react";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import {
	DayPicker,
	useDayPicker,
	useDayRender,
	useNavigation,
	type DayPickerRangeProps,
	type DayPickerSingleProps,
	type DayProps,
	type Matcher,
} from "react-day-picker";
import { addYears, format, isSameMonth } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;
interface NavigationButtonProps
	extends React.HTMLAttributes<HTMLButtonElement> {
	onClick: () => void;
	icon: React.ElementType;
	disabled?: boolean;
}

const NavigationButton = React.forwardRef<
	HTMLButtonElement,
	NavigationButtonProps
>(
	(
		{ onClick, icon, disabled, ...props }: NavigationButtonProps,
		forwardedRef,
	) => {
		const Icon = icon;
		return (
			<button
				ref={forwardedRef}
				type="button"
				disabled={disabled}
				className={cn(
					"flex size-8 shrink-0 select-none items-center justify-center rounded border p-1 outline-none transition sm:size-[30px]",
					// text color
					"text-gray-600 hover:text-gray-800",
					"dark:text-gray-400 hover:dark:text-gray-200",
					// border color
					"border-gray-300 dark:border-gray-700",
					// background color
					"hover:bg-gray-50 active:bg-gray-100",
					"hover:dark:bg-gray-900 active:dark:bg-gray-800",
					// disabled
					"disabled:pointer-events-none",
					"disabled:border-gray-200 disabled:dark:border-gray-800",
					"disabled:text-gray-400 disabled:dark:text-gray-600",
				)}
				onClick={onClick}
				{...props}
			>
				<Icon className="size-full shrink-0" />
			</button>
		);
	},
);

NavigationButton.displayName = "NavigationButton";

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4",
				caption: "flex justify-center pt-1 relative items-center",
				caption_label: "text-sm font-medium",
				nav: "space-x-1 flex items-center",
				nav_button: cn(
					buttonVariants({ variant: "outline" }),
					"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				),
				nav_button_previous: "absolute left-1",
				nav_button_next: "absolute right-1",
				table: "w-full border-collapse space-y-1",
				head_row: "flex",
				head_cell:
					"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
				row: "flex w-full mt-2",
				cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
				day: cn(
					buttonVariants({ variant: "ghost" }),
					"h-9 w-9 p-0 font-normal aria-selected:opacity-100",
				),
				day_range_end: "day-range-end",
				day_selected:
					"bg-blue-600 text-primary-foreground hover:bg-blue-400 hover:text-primary-foreground focus:bg-blue-500 focus:text-primary-foreground",
				day_today: "bg-accent text-accent-foreground",
				day_outside:
					"day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
				day_disabled: "text-muted-foreground opacity-50",
				day_range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
				IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
				Caption: ({ ...props }) => {
					const {
						goToMonth,
						nextMonth,
						previousMonth,
						currentMonth,
						displayMonths,
					} = useNavigation();
					const { numberOfMonths, fromDate, toDate } = useDayPicker();

					const displayIndex = displayMonths.findIndex((month) =>
						isSameMonth(props.displayMonth, month),
					);
					const isFirst = displayIndex === 0;
					const isLast = displayIndex === displayMonths.length - 1;

					const hideNextButton = numberOfMonths > 1 && (isFirst || !isLast);
					const hidePreviousButton = numberOfMonths > 1 && (isLast || !isFirst);

					const goToPreviousYear = () => {
						const targetMonth = addYears(currentMonth, -1);
						if (
							previousMonth &&
							(!fromDate || targetMonth.getTime() >= fromDate.getTime())
						) {
							goToMonth(targetMonth);
						}
					};

					const goToNextYear = () => {
						const targetMonth = addYears(currentMonth, 1);
						if (
							nextMonth &&
							(!toDate || targetMonth.getTime() <= toDate.getTime())
						) {
							goToMonth(targetMonth);
						}
					};

					return (
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1">
								{!hidePreviousButton && (
									<NavigationButton
										disabled={
											!previousMonth ||
											(fromDate &&
												addYears(currentMonth, -1).getTime() <
													fromDate.getTime())
										}
										aria-label="Go to previous year"
										onClick={goToPreviousYear}
										icon={ChevronsLeft}
									/>
								)}
								{!hidePreviousButton && (
									<NavigationButton
										disabled={!previousMonth}
										aria-label="Go to previous month"
										onClick={() => previousMonth && goToMonth(previousMonth)}
										icon={ChevronLeft}
									/>
								)}
							</div>

							<div
								role="presentation"
								aria-live="polite"
								className="text-sm font-medium capitalize tabular-nums bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-50"
							>
								{format(props.displayMonth, "LLLL yyy")}
							</div>

							<div className="flex items-center gap-1">
								{!hideNextButton && (
									<NavigationButton
										disabled={!nextMonth}
										aria-label="Go to next month"
										onClick={() => nextMonth && goToMonth(nextMonth)}
										icon={ChevronRight}
									/>
								)}
								{!hideNextButton && (
									<NavigationButton
										disabled={
											!nextMonth ||
											(toDate &&
												addYears(currentMonth, 1).getTime() > toDate.getTime())
										}
										aria-label="Go to next year"
										onClick={goToNextYear}
										icon={ChevronsRight}
									/>
								)}
							</div>
						</div>
					);
				},
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
