import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JSX, SVGProps } from "react"


export default function Documents({ params } : { params: { property_id: string } }) {

  return (
    <>
      <div className="mb-8 lg:mb-0 text-gray-600" >
        Store important documents here to access anytime
      </div>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">All Documents</h1>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Quarterly Report</h3>
                  <Button size="icon" variant="ghost">
                    <StarIcon className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">PDF</p>
              </CardHeader>
              <CardContent>
                <p>
                  This is the quarterly financial report for the company. It includes key metrics and performance
                  indicators.
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Updated 2 days ago</p>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <DownloadIcon className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Marketing Plan</h3>
                  <Button size="icon" variant="ghost">
                    <StarIcon className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">PDF</p>
              </CardHeader>
              <CardContent>
                <p>This is the marketing plan for the upcoming year. It outlines our strategies and campaigns.</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Updated 1 week ago</p>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <DownloadIcon className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">HR Handbook</h3>
                  <Button size="icon" variant="ghost">
                    <StarIcon className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">PDF</p>
              </CardHeader>
              <CardContent>
                <p>This is the employee handbook that outlines our HR policies and procedures.</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Updated 3 weeks ago</p>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <DownloadIcon className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Product Roadmap</h3>
                  <Button size="icon" variant="ghost">
                    <StarIcon className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">PDF</p>
              </CardHeader>
              <CardContent>
                <p>
                  This is the product roadmap for the next 12 months. It outlines our planned features and releases.
                </p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Updated 5 days ago</p>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <DownloadIcon className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Operations Manual</h3>
                  <Button size="icon" variant="ghost">
                    <StarIcon className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">PDF</p>
              </CardHeader>
              <CardContent>
                <p>This is the operations manual that outlines our processes and procedures.</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Updated 2 months ago</p>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <DownloadIcon className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Sales Playbook</h3>
                  <Button size="icon" variant="ghost">
                    <StarIcon className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">PDF</p>
              </CardHeader>
              <CardContent>
                <p>This is the sales playbook that outlines our sales strategies and best practices.</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Updated 1 month ago</p>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <DownloadIcon className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </>
  )
}

function DownloadIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}


function FileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}


function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}


function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}