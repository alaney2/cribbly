"use client";
import { useState } from "react";
import { Button } from "@/components/catalyst/button";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/catalyst/dialog";
import { Input } from "@/components/catalyst/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/catalyst/table";
import {
	Description,
	Field,
	FieldGroup,
	Fieldset,
	Label,
	Legend,
} from "@/components/catalyst/fieldset";
import { Select } from "@/components/catalyst/select";
import { Text } from "@/components/catalyst/text";
import { Textarea } from "@/components/catalyst/textarea";
import { Radio, RadioField, RadioGroup } from "@/components/catalyst/radio";
import { Heading, Subheading } from "@/components/catalyst/heading";
import { createTask, deleteTask } from "@/utils/supabase/actions";
import { toast } from "sonner";
import { NewTaskDialog } from "@/components/dialogs/NewTaskDialog";

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

export function MaintenanceTable({
	tasks,
	bento = false,
	userId,
}: {
	tasks: Request[];
	bento?: boolean;
	userId?: string;
}) {
	const [requests, setRequests] = useState<Request[]>(tasks);
	const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
		setIsEditDialogOpen(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteTask(id);
			setRequests(requests.filter((req) => req.id !== id));
			setIsEditDialogOpen(false);
			toast.success("Task deleted successfully");
		} catch (error) {
			console.error("Error deleting task:", error);
			toast.error("An error occurred while deleting the task");
		}
	};

	return (
		<div className="">
			<div className="mx-2 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
				{!bento && (
					<Heading className="mb-4 text-left">Maintenance Requests</Heading>
				)}
				{!bento && requests.length > 0 && (
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
							setIsNewDialogOpen(true);
						}}
						className="mb-4"
						color="blue"
					>
						New Task
					</Button>
				)}
			</div>

			{requests.length > 0 ? (
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
						{requests.map((request) => (
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
									setIsNewDialogOpen(true);
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
				isOpen={isNewDialogOpen || isEditDialogOpen}
				title={
					currentRequest.id === "0"
						? "New Maintenance Request"
						: isCurrentUserRequest
							? "Edit Maintenance Request"
							: "View Maintenance Request"
				}
				onClose={() => {
					setIsNewDialogOpen(false);
					setIsEditDialogOpen(false);
				}}
				dialogBody={
					<form
						className="mt-6"
						action={async (formData) => {
							toast.promise(
								new Promise((resolve, reject) => {
									createTask(formData)
										.then((data) => {
											if (currentRequest.id === "0") {
												// New request
												setRequests([
													{
														...currentRequest,
														id: data.id,
														updated_at: data.updated_at,
														status: data.status,
													},
													...requests,
												]);
											} else {
												// Edit existing request
												setRequests(
													requests.map((req) =>
														req.id === currentRequest.id ? currentRequest : req,
													),
												);
											}
											setIsNewDialogOpen(false);
											setIsEditDialogOpen(false);
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
									loading: "Adding...",
									success: "Task added!",
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
										setIsNewDialogOpen(false);
										setIsEditDialogOpen(false);
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
											setIsNewDialogOpen(false);
											setIsEditDialogOpen(false);
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
