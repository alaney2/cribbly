"use client";
import { useState } from "react";
import { Button } from "@/components/catalyst/button";
import { DialogActions } from "@/components/catalyst/dialog";
import { Input } from "@/components/catalyst/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/catalyst/table";
import { Field, FieldGroup, Label } from "@/components/catalyst/fieldset";
import { Select } from "@/components/catalyst/select";
import { Text } from "@/components/catalyst/text";
import { Textarea } from "@/components/catalyst/textarea";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { createTask, deleteTask } from "@/utils/supabase/actions";
import { toast } from "sonner";
import { NewTaskDialog } from "@/components/dialogs/NewTaskDialog";
import useSWR, { mutate } from "swr";
import { getTasks } from "@/utils/supabase/actions";
import { Skeleton } from "@/components/catalyst/skeleton";
import { createClient } from "@/utils/supabase/client";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";

type Request = {
	id: string;
	property_id?: string;
	user_id?: string;
	created_at?: Date;
	updated_at: Date;
	title: string;
	description: string;
	status: string;
	priority: string;
};

const tasksFetcher = async (currentPropertyId: string) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("maintenance")
		.select("*")
		.order("created_at", { ascending: false })
		.eq("property_id", currentPropertyId);
	if (error) throw error;
	return data;
};

export function MaintenanceTable({
	bento = false,
	userId,
}: {
	bento?: boolean;
	userId?: string;
}) {
	const { currentPropertyId } = useCurrentProperty();
	const { data: tasks, isLoading } = useSWR(["tasks", currentPropertyId], () =>
		tasksFetcher(currentPropertyId),
	);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<"new" | "edit">("new");

	const [currentRequest, setCurrentRequest] = useState({
		id: "0",
		created_at: new Date(),
		updated_at: new Date(),
		title: "",
		description: "",
		status: "Pending",
		priority: "Medium",
		user_id: userId,
	});
	// const [isCurrentUserRequest, setIsCurrentUserRequest] = useState(true);
	const isCurrentUserRequest =
		currentRequest.id === "0" || currentRequest.user_id === userId;

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setCurrentRequest((prev) => ({ ...prev, [name]: value }));
	};

	const handleRowClick = (request: Request) => {
		if (bento) return;
		setCurrentRequest({
			id: request.id,
			created_at: request.created_at || new Date(),
			updated_at: request.updated_at,
			title: request.title,
			description: request.description,
			status: request.status,
			priority: request.priority,
			user_id: request.user_id || "",
		});
		setDialogMode("edit");
		setIsDialogOpen(true);
	};

	const handleDelete = async (id: string) => {
		const loading = toast.loading("Deleting task...");
		try {
			await deleteTask(id);
			await mutate(
				"tasks",
				async (currentTasks: any[] | undefined) => {
					return currentTasks?.filter((task) => task.id !== id) ?? [];
				},
				{ revalidate: false },
			);
			setIsDialogOpen(false);
			toast.dismiss(loading);
			toast.success("Task deleted successfully");
		} catch (error) {
			console.error("Error deleting task:", error);
			toast.dismiss(loading);
			toast.error("An error occurred while deleting the task");
		}
	};

	return (
		<div className="">
			<div className="mx-2 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
				{!bento && (
					<Heading className="mb-4 text-left">Maintenance Requests</Heading>
				)}
				{!bento && (isLoading || (tasks && tasks.length > 0)) && (
					<Button
						onClick={() => {
							setCurrentRequest({
								id: "0",
								created_at: new Date(),
								updated_at: new Date(),
								title: "",
								description: "",
								status: "Pending",
								priority: "Medium",
								user_id: userId,
							});
							setDialogMode("new");
							setIsDialogOpen(true);
						}}
						disabled={isLoading}
						className="mb-4"
						color="blue"
					>
						New Task
					</Button>
				)}
			</div>
			{isLoading ? (
				<div className="space-y-4">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
					{/* <Skeleton className="h-8 w-full" /> */}
				</div>
			) : tasks && tasks.length > 0 ? (
				<Table bleed grid>
					<TableHead>
						<TableRow>
							{/* <TableHeader>Date created</TableHeader> */}
							<TableHeader>Date Updated</TableHeader>
							<TableHeader>Title</TableHeader>
							<TableHeader>Status</TableHeader>
							<TableHeader>Priority</TableHeader>
							{!bento && <TableHeader>Created by</TableHeader>}
						</TableRow>
					</TableHead>
					<TableBody>
						{tasks.map((request) => (
							<TableRow
								key={request.id}
								onClick={() => handleRowClick(request)}
								className="cursor-default hover:bg-gray-50 dark:hover:bg-black"
							>
								{/* <TableCell>
									{new Date(
										request.created_at ?? Date.now(),
									).toLocaleDateString()}
								</TableCell> */}
								<TableCell>
									{new Date(request.updated_at).toLocaleDateString()}
								</TableCell>
								<TableCell>{request.title}</TableCell>
								<TableCell>{request.status || "Pending"}</TableCell>
								<TableCell>{request.priority || "Medium"}</TableCell>
								{!bento && (
									<TableCell>
										{request.user_id === userId ? "You" : "Other"}
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<>
					<Table bleed grid>
						<TableHead>
							<TableRow>
								<TableHeader>Date</TableHeader>
								<TableHeader>Title</TableHeader>
								<TableHeader>Status</TableHeader>
								<TableHeader>Priority</TableHeader>
							</TableRow>
						</TableHead>
					</Table>
					<div className="flex flex-col items-center justify-center py-12">
						<Text className="mb-4 text-gray-600">
							No maintenance requests found.
						</Text>
						{!bento && (
							<Button
								onClick={() => {
									setCurrentRequest({
										id: "0",
										created_at: new Date(),
										updated_at: new Date(),
										title: "",
										description: "",
										status: "Pending",
										priority: "Medium",
										user_id: userId,
									});
									setDialogMode("new");
									setIsDialogOpen(true);
								}}
								color="blue"
							>
								Create New Task
							</Button>
						)}
					</div>
				</>
			)}
			<NewTaskDialog
				isOpen={isDialogOpen}
				title={
					dialogMode === "new"
						? "New Maintenance Request"
						: isCurrentUserRequest
							? "Edit Maintenance Request"
							: "View Maintenance Request"
				}
				onClose={() => {
					setIsDialogOpen(false);
				}}
				dialogBody={
					<form
						className="mt-6"
						action={async (formData) => {
							toast.promise(
								new Promise((resolve, reject) => {
									createTask(formData)
										.then((data) => {
											if (dialogMode === "new") {
												mutate(
													"tasks",
													(currentTasks: any) => {
														return [data, ...(currentTasks || [])];
													},
													false,
												);
											} else {
												mutate("tasks", (currentTasks: any[] | undefined) => {
													return (
														currentTasks?.map((task) =>
															task.id === data.id ? data : task,
														) ?? []
													);
												});
											}
											setIsDialogOpen(false);
											setCurrentRequest({
												id: "0",
												created_at: new Date(),
												updated_at: new Date(),
												title: "",
												description: "",
												status: "Pending",
												priority: "Medium",
												user_id: userId,
											});
											resolve("Success");
										})
										.catch((error) => {
											reject(error);
										});
								}),
								{
									loading: dialogMode === "new" ? "Adding..." : "Updating...",
									success:
										dialogMode === "new" ? "Task added!" : "Task updated!",
									error:
										"An error occurred, please check the form and try again.",
								},
							);
						}}
					>
						<input hidden value={currentRequest.id} name="id" />
						<FieldGroup>
							<Field>
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									name="title"
									value={currentRequest.title}
									onChange={handleInputChange}
									required
									disabled={!isCurrentUserRequest}
								/>
							</Field>
							<Field>
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									name="description"
									value={currentRequest.description}
									onChange={handleInputChange}
									required
									disabled={!isCurrentUserRequest}
								/>
							</Field>

							<Field>
								<Label htmlFor="priority">Priority</Label>
								<Select
									id="priority"
									name="priority"
									value={currentRequest.priority}
									onChange={handleInputChange}
									disabled={!isCurrentUserRequest}
								>
									<option value="Low">Low</option>
									<option value="Medium">Medium</option>
									<option value="High">High</option>
								</Select>
							</Field>

							<Field>
								<Label htmlFor="status">Status</Label>
								<Select
									id="status"
									name="status"
									value={currentRequest.status}
									onChange={handleInputChange}
									disabled={currentRequest.id === "0"}
								>
									<option value="Pending">Pending</option>
									<option value="In Progress">In Progress</option>
									<option value="Completed">Completed</option>
								</Select>
							</Field>
						</FieldGroup>
						{currentRequest.id === "0" ? (
							<DialogActions className="">
								<Button
									type="button"
									plain
									onClick={() => {
										setIsDialogOpen(false);
									}}
								>
									Cancel
								</Button>
								<Button type="submit" color="blue">
									Submit
								</Button>
							</DialogActions>
						) : (
							<div className="flex flex-col sm:flex-row w-full items-center sm:justify-between gap-y-2 sm:gap-y-0 mt-8">
								<div className="flex flex-col sm:flex-row gap-4 sm:gap-x-2 w-full sm:w-auto">
									<Button
										type="submit"
										color="blue"
										className="w-full sm:w-auto order-first sm:order-last"
									>
										Submit
									</Button>
									<Button
										type="button"
										plain
										onClick={() => {
											setIsDialogOpen(false);
										}}
										className="w-full sm:w-auto hidden sm:block"
									>
										Cancel
									</Button>
								</div>
								<Button
									type="button"
									color="red"
									onClick={() => handleDelete(currentRequest.id)}
									disabled={!isCurrentUserRequest}
									className="w-full sm:w-auto order-last"
								>
									Delete
								</Button>
							</div>
						)}
					</form>
				}
			/>
		</div>
	);
}
