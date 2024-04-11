"use client"

import * as React from "react"
import { tasks, type Task } from "@/db/schema"
import type { DataTableFilterField } from "@/types"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
// import toast from "react-hot-toast"

import { getErrorMessage } from "@/lib/handle-error"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

import { updateTask } from "../_lib/actions"
import { DeleteTasksDialog } from "./delete-tasks-dialog"
import { UpdateTaskSheet } from "./update-task-sheet"

export const filterFields: DataTableFilterField<Task>[] = [
  {
    label: "Title",
    value: "title",
    placeholder: "Filter titles...",
  },
  {
    label: "Status",
    value: "status",
    options: tasks.status.enumValues.map((status) => ({
      label: status[0]?.toUpperCase() + status.slice(1),
      value: status,
    })),
  },
  {
    label: "Priority",
    value: "priority",
    options: tasks.priority.enumValues.map((priority) => ({
      label: priority[0]?.toUpperCase() + priority.slice(1),
      value: priority,
    })),
  },
]

export function getColumns(): ColumnDef<Task>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "code",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Task" />
    //   ),
    //   cell: ({ row }) => <div className="w-20">{row.getValue("code")}</div>,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Task" />
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Details" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = tasks.status.enumValues.find(
          (status) => status === row.original.status
        )

        if (!status) return null

        return (
          <div className="flex w-[6.25rem] items-center">
            {status === "canceled" ? (
              <CrossCircledIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : status === "done" ? (
              <CheckCircledIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : status === "in-progress" ? (
              <StopwatchIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : status === "todo" ? (
              <QuestionMarkCircledIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : (
              <CircleIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <span className="capitalize">{status}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priority = tasks.priority.enumValues.find(
          (priority) => priority === row.original.priority
        )

        if (!priority) return null

        return (
          <div className="flex items-center">
            {priority === "low" ? (
              <ArrowDownIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : priority === "medium" ? (
              <ArrowRightIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : priority === "high" ? (
              <ArrowUpIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            ) : (
              <CircleIcon
                className="mr-2 size-4 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            <span className="capitalize">{priority}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "cost",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cost" />
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] = React.useState(false)
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] = React.useState(false)

        return (
          <>
            <UpdateTaskSheet
              open={showUpdateTaskSheet}
              onOpenChange={setShowUpdateTaskSheet}
              task={row.original}
            />
            <DeleteTasksDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              tasks={[row]}
              showTrigger={false}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
                  Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteTaskDialog(true)}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ]
}
