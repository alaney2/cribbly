"use client"
import { useRef, useState, useEffect, useTransition, JSX, SVGProps } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/catalyst/button"
import { Heading, Subheading } from '@/components/catalyst/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/catalyst/table'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Field, Label } from '@/components/catalyst/fieldset'
import { Select } from '@/components/catalyst/select'
import { Text } from '@/components/catalyst/text'
import { fetchDocuments, viewDocument, uploadDocument, downloadDocument } from "@/utils/r2/actions"
import { Dropdown, DropdownButton, DropdownLabel, DropdownItem, DropdownMenu } from '@/components/catalyst/dropdown'
import { EllipsisHorizontalIcon, EyeIcon, PlusIcon, ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/16/solid'
import { toast } from 'sonner'

type Document = {
  key: string | undefined
  name: string | undefined
  date: Date | undefined
}

export default function Documents() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const years = ["2024"]
  const [taxDocuments, setTaxDocuments] = useState<Document[]>([])
  const [viewingDocument, setViewingDocument] = useState<string | null>(null)
  const [otherDocuments, setOtherDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    loadDocuments()
  }, [])

  const handleViewDocument = async (key: string) => {
    try {
      const url = await viewDocument(key)
      setViewingDocument(url)
    } catch (error) {
      console.error("Error viewing document:", error)
      toast.error("Failed to view document")
    }
  }

  const loadDocuments = async () => {
    setIsLoading(true)
    try {
      const documents = await fetchDocuments()
      if (!documents) return
      setTaxDocuments(documents.filter(doc => doc.key && doc.key.toLowerCase().includes('tax')))
      setOtherDocuments(documents.filter(doc => doc.key && !doc.key.toLowerCase().includes('tax')))
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error("Failed to load documents")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadDocument = async (key: string) => {
    try {
      const url = await downloadDocument(key)
      const link = document.createElement('a')
      link.href = url
      link.target = '_self'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error viewing document:", error)
      toast.error("Failed to view document")
    }
  }

  const handleUpload = async (formData: FormData) => {
    const file = formData.get('file') as File
    if (!file) {
      toast.error("No file selected")
      return
    }
    const uploadToastId = toast.loading(`Uploading ${file.name}...`)
    try {
      await uploadDocument(formData)
      toast.success(`${file.name} uploaded successfully`, { id: uploadToastId })
      startTransition(() => {
        loadDocuments()
        router.refresh()
      })
    } catch (error) {
      console.error("Error uploading document:", error)
      toast.error(`Failed to upload ${file.name}`, { id: uploadToastId })
    }
  }

  return (
    <>
      <main className=" mx-auto">
        <Heading className="mb-6">All Documents</Heading>
        <div className="bg-white border border-zinc-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <Subheading className="mb-4">Tax Documents</Subheading>
            <Field className="mb-4">
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
          {taxDocuments.length === 0 && <Text>
            Your 1040 tax forms should be located here by January 31.
          </Text>}
          {taxDocuments.length > 0 && <Table>
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
              {taxDocuments && taxDocuments.map((doc) => (
                <TableRow key={doc.key}>
                  <TableCell className="font-medium w-1/2">{doc.name}</TableCell>
                  <TableCell className="w-1/4">{doc?.date?.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownButton plain aria-label="More options">
                        <EllipsisHorizontalIcon />
                      </DropdownButton>
                      <DropdownMenu anchor="bottom end">
                        <DropdownItem onClick={() => {
                          doc.key && handleViewDocument(doc.key)
                        }}>
                          <EyeIcon />
                          <DropdownLabel>View</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem onClick={() => {
                          doc.key && handleDownloadDocument(doc.key)
                        }}>
                          <ArrowDownTrayIcon />
                          <DropdownLabel>Download</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem>
                          <TrashIcon />
                          <DropdownLabel>Delete</DropdownLabel>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>}
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <div className="mb-6 flex items-center justify-between">
            <Subheading>Property Documents</Subheading>
            <form action={handleUpload}>
              <label htmlFor="upload-document">
                <Button disabled={isPending} color="blue" onClick={() => {
                  fileInputRef?.current?.click()
                }}>
                  <PlusIcon className="mr-0 h-4 w-4" />
                  <span className="sm:hidden">Upload</span>
                  <span className="hidden sm:inline">Upload document</span>
                </Button>
                <input
                  ref={fileInputRef}
                  id="upload-document"
                  name="file"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.form) {
                      e.target.form.requestSubmit()
                    }
                  }}
                />
              </label>
            </form>
          </div>
          {otherDocuments.length > 0 && <Table>
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
              {otherDocuments && otherDocuments.map((doc) => (
                <TableRow key={doc.key}>
                  <TableCell className="font-medium w-1/2">
                    <div className="flex items-center">
                      <DocumentIcon className="mr-2 h-4 w-4" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell className="w-1/4">{doc?.date?.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Dropdown>
                      <DropdownButton plain aria-label="More options">
                        <EllipsisHorizontalIcon />
                      </DropdownButton>
                      <DropdownMenu anchor="bottom end">
                        <DropdownItem onClick={() => {
                          doc.key && handleViewDocument(doc.key)
                        }}>
                          <EyeIcon />
                          <DropdownLabel>View</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem onClick={() => {
                          doc.key && handleDownloadDocument(doc.key)
                        }}>
                          <ArrowDownTrayIcon />
                          <DropdownLabel>Download</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem>
                          <TrashIcon />
                          <DropdownLabel>Delete</DropdownLabel>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>}
        </div>
      </main>
      <Dialog size="4xl" open={!!viewingDocument} onClose={() => setViewingDocument(null)}>
        <DialogTitle>Document Viewer</DialogTitle>
        {/* <DialogDescription>
          You can view the document below. Close this dialog to return to the document list.
        </DialogDescription> */}
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
      </Dialog>
    </>
  )
}

const DocumentIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)
