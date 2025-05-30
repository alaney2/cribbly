"use client";
import { useRef, useState, type JSX, type SVGProps } from "react";
import { Button } from "@/components/catalyst/button";
import { Heading, Subheading } from "@/components/catalyst/heading";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/catalyst/table";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/catalyst/dialog";
import { Field, Label } from "@/components/catalyst/fieldset";
import { Select } from "@/components/catalyst/select";
import { Text } from "@/components/catalyst/text";
import {
	fetchDocuments,
	viewDocument,
	uploadDocument,
	downloadDocument,
	deleteDocument,
} from "@/utils/r2/actions";
import {
	Dropdown,
	DropdownButton,
	DropdownLabel,
	DropdownItem,
	DropdownMenu,
} from "@/components/catalyst/dropdown";
import {
	EllipsisHorizontalIcon,
	EyeIcon,
	PlusIcon,
	ArrowDownTrayIcon,
	TrashIcon,
} from "@heroicons/react/16/solid";
import { toast } from "sonner";
import { FileUpload } from "@/components/aceternity/file-upload";
import { useCurrentProperty } from "@/contexts/CurrentPropertyContext";
import useSWR from "swr";
import { Skeleton } from "@/components/catalyst/skeleton";
import { ViewDocumentDialog } from "@/components/dialogs/ViewDocumentDialog";
import { DeleteDocumentDialog } from "@/components/dialogs/DeleteDocumentDialog";

type Document = {
	key: string | undefined;
	name: string | undefined;
	date: Date | undefined;
};

export function DocumentsClient() {
	const { currentPropertyId: propertyId } = useCurrentProperty();
	if (!propertyId) return null;
	const [selectedYear, setSelectedYear] = useState("2024");
	const years = ["2024"];
	const [viewingDocument, setViewingDocument] = useState<string | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
		null,
	);

	const {
		data: documents,
		error,
		isLoading,
		mutate,
	} = useSWR(["documents", propertyId], () => fetchDocuments(propertyId));

	const handleViewDocument = async (key: string) => {
		try {
			const url = await viewDocument(propertyId, key);
			setViewingDocument(url);
		} catch (error) {
			console.error("Error viewing document:", error);
			toast.error("Failed to view document");
		}
	};

	const handleDeleteDocument = async (doc: Document) => {
		setDocumentToDelete(doc);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!documentToDelete || !documentToDelete.key) return;

		const deleteToastId = toast.loading(`Deleting ${documentToDelete.name}...`);
		try {
			await deleteDocument(propertyId, documentToDelete.key);
			toast.success(`${documentToDelete.name} deleted successfully`, {
				id: deleteToastId,
			});
		} catch (error) {
			console.error("Error deleting document:", error);
			toast.error(`Failed to delete ${documentToDelete.name}`, {
				id: deleteToastId,
			});
		} finally {
			setIsDeleteDialogOpen(false);
			setDocumentToDelete(null);
			mutate();
		}
	};

	const handleDownloadDocument = async (key: string) => {
		try {
			const url = await downloadDocument(propertyId, key);
			const link = document.createElement("a");
			link.href = url;
			link.target = "_self";
			link.rel = "noopener noreferrer";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error viewing document:", error);
			toast.error("Failed to view document");
		}
	};

	const handleFileUpload = async (uploadedFiles: File[]) => {
		for (const file of uploadedFiles) {
			const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
			if (!allowedTypes.includes(file.type)) {
				toast.error("Only images (JPEG, PNG) and PDF files are allowed");
				return;
			}

			const uploadToastId = toast.loading(`Uploading ${file.name}...`);
			const formData = new FormData();
			formData.append("file", file);

			try {
				await uploadDocument(propertyId, formData);
				toast.success(`${file.name} uploaded successfully`, {
					id: uploadToastId,
				});
			} catch (error) {
				console.error("Error uploading document:", error);
				toast.error(`Failed to upload ${file.name}`, { id: uploadToastId });
			} finally {
				mutate();
			}
		}
	};

	const TaxDocumentsTable = ({ documents }: { documents: Document[] }) => (
		<div className="bg-white dark:bg-black ring-1 dark:ring-2 ring-inset ring-gray-200 dark:ring-gray-600 rounded-lg p-6 mb-6">
			<div className="flex justify-between items-center mb-4">
				<Subheading>Tax Documents</Subheading>
				<Field>
					<Select
						id="year"
						value={selectedYear}
						onChange={(e) => setSelectedYear(e.target.value)}
					>
						{years.map((year) => (
							<option key={year} value={year}>
								{year}
							</option>
						))}
					</Select>
				</Field>
			</div>
			{documents.length === 0 ? (
				<Text>Your 1040 tax forms should be located here by January 31.</Text>
			) : (
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader className="w-1/2">Document Name</TableHeader>
							<TableHeader className="w-1/4">Date</TableHeader>
							<TableHeader className="relative w-0">
								<span className="sr-only">Actions</span>
							</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{documents.map((doc) => (
							<TableRow key={doc.key}>
								<TableCell className="font-medium w-full md:w-3/4">
									{doc.name}
								</TableCell>
								<TableCell className="w-full md:w-1/2">
									{doc?.date?.toLocaleDateString()}
								</TableCell>
								<TableCell className="text-right w-full md:w-1/4">
									<Dropdown>
										<DropdownButton plain aria-label="More options">
											<EllipsisHorizontalIcon />
										</DropdownButton>
										<DropdownMenu anchor="bottom end">
											<DropdownItem
												onClick={() => doc.key && handleViewDocument(doc.key)}
											>
												<EyeIcon />
												<DropdownLabel>View</DropdownLabel>
											</DropdownItem>
											<DropdownItem
												onClick={() =>
													doc.key && handleDownloadDocument(doc.key)
												}
											>
												<ArrowDownTrayIcon />
												<DropdownLabel>Download</DropdownLabel>
											</DropdownItem>
											<DropdownItem onClick={() => handleDeleteDocument(doc)}>
												<TrashIcon />
												<DropdownLabel>Delete</DropdownLabel>
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);

	const PropertyDocumentsTable = ({ documents }: { documents: Document[] }) => (
		<div className="bg-white dark:bg-black ring-1 dark:ring-2 ring-inset ring-gray-200 dark:ring-gray-600 rounded-lg p-6">
			<div className="mb-6 flex flex-col">
				<Subheading className="text-left mb-4">Property Documents</Subheading>
				<div className="w-full mx-auto min-h-72 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
					<FileUpload onChange={handleFileUpload} />
				</div>
			</div>
			{isLoading ? (
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader className="w-1/2">Document Name</TableHeader>
							<TableHeader className="w-1/4">Date</TableHeader>
							<TableHeader className="relative w-0">
								<span className="sr-only">Actions</span>
							</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{[...Array(2)].map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<TableRow key={index}>
								<TableCell>
									<Skeleton className="h-4 w-3/4" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-1/2" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-1/4 ml-auto" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : documents.length === 0 ? (
				<Text>No property documents found.</Text>
			) : (
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader className="w-1/2">Document Name</TableHeader>
							<TableHeader className="w-1/4">Date</TableHeader>
							<TableHeader className="relative w-0">
								<span className="sr-only">Actions</span>
							</TableHeader>
						</TableRow>
					</TableHead>
					<TableBody>
						{documents.map((doc) => (
							<TableRow key={doc.key}>
								<TableCell className="font-medium w-1/2">
									<div className="flex items-center">
										<DocumentIcon className="mr-2 h-4 w-4" />
										{doc.name}
									</div>
								</TableCell>
								<TableCell className="w-1/4">
									{doc?.date?.toLocaleDateString()}
								</TableCell>
								<TableCell className="text-right">
									<Dropdown>
										<DropdownButton plain aria-label="More options">
											<EllipsisHorizontalIcon />
										</DropdownButton>
										<DropdownMenu anchor="bottom end">
											{doc.name?.endsWith(".pdf") && (
												<DropdownItem
													onClick={() => doc.key && handleViewDocument(doc.key)}
												>
													<EyeIcon />
													<DropdownLabel>View</DropdownLabel>
												</DropdownItem>
											)}
											<DropdownItem
												onClick={() =>
													doc.key && handleDownloadDocument(doc.key)
												}
											>
												<ArrowDownTrayIcon />
												<DropdownLabel>Download</DropdownLabel>
											</DropdownItem>
											<DropdownItem onClick={() => handleDeleteDocument(doc)}>
												<TrashIcon />
												<DropdownLabel>Delete</DropdownLabel>
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);

	return (
		<>
			<main className=" mx-auto">
				<Heading className="mb-6">All Documents</Heading>
				<TaxDocumentsTable documents={[]} />
				<PropertyDocumentsTable
					documents={
						documents?.filter(
							(doc) => doc.name && !doc.name.toLowerCase().includes("tax"),
						) || []
					}
				/>
			</main>

			<ViewDocumentDialog
				isOpen={!!viewingDocument}
				onClose={() => setViewingDocument(null)}
				dialogBody={
					<div className="mt-4" style={{ height: "80vh" }}>
						{viewingDocument && (
							<iframe
								src={`${viewingDocument}#toolbar=1&view=FitH`}
								width="100%"
								height="100%"
								style={{ border: "none" }}
								title="Document Viewer"
							/>
						)}
					</div>
				}
				dialogActions={
					<Button outline onClick={() => setViewingDocument(null)}>
						Close
					</Button>
				}
			/>

			<DeleteDocumentDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				documentName={documentToDelete?.name}
				dialogActions={
					<>
						<Button outline onClick={() => setIsDeleteDialogOpen(false)}>
							Cancel
						</Button>
						<Button color="red" onClick={confirmDelete}>
							Delete
						</Button>
					</>
				}
			/>
			{/* <Dialog
				size="4xl"
				open={!!viewingDocument}
				onClose={() => setViewingDocument(null)}
			>
				<DialogTitle>Document Viewer</DialogTitle>
				<DialogBody className="sm:max-w-[900px]">
					<div className="mt-4" style={{ height: "70vh" }}>
						{viewingDocument && (
							<iframe
								src={`${viewingDocument}#toolbar=1&view=FitH`}
								width="100%"
								height="100%"
								style={{ border: "none" }}
								title="Document Viewer"
							/>
						)}
					</div>
				</DialogBody>
				<DialogActions>
					<Button outline onClick={() => setViewingDocument(null)}>
						Close
					</Button>
				</DialogActions>
			</Dialog> */}

			{/* <Dialog
				open={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
			>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogDescription>
					Are you sure you want to delete the document &quot;
					{documentToDelete?.name}&quot;? This action cannot be undone.
				</DialogDescription>
				<DialogActions>
					<Button outline onClick={() => setIsDeleteDialogOpen(false)}>
						Cancel
					</Button>
					<Button color="red" onClick={confirmDelete}>
						Delete
					</Button>
				</DialogActions>
			</Dialog> */}
		</>
	);
}

const DocumentIcon = (
	props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
	<svg
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<title>Document Icon</title>
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
		<polyline points="14 2 14 8 20 8" />
		<line x1="16" y1="13" x2="8" y2="13" />
		<line x1="16" y1="17" x2="8" y2="17" />
		<polyline points="10 9 9 9 8 9" />
	</svg>
);
