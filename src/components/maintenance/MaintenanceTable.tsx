'use client'
import React, { useState } from 'react'
import { Button } from '@/components/catalyst/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/catalyst/dialog'
import { Input } from '@/components/catalyst/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/catalyst/table'
import {
  Description,
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from '@/components/catalyst/fieldset'
import { Select } from '@/components/catalyst/select'
import { Text } from '@/components/catalyst/text'
import { Textarea } from '@/components/catalyst/textarea'
import { Radio, RadioField, RadioGroup } from '@/components/catalyst/radio'
import { Heading, Subheading } from '@/components/catalyst/heading'
import {
  Checkbox,
  CheckboxField,
  CheckboxGroup,
} from '@/components/catalyst/checkbox'
import {
  Listbox,
  ListboxLabel,
  ListboxOption,
} from '@/components/catalyst/listbox'
import { createTask } from '@/utils/supabase/actions'
import { toast } from 'sonner'
// const initialRequests = [
//   { id: 1, date: '2024-08-18', title: 'Leaky Faucet', description: 'The kitchen faucet is leaking', status: 'Pending', priority: 'Medium' },
//   { id: 2, date: '2024-08-17', title: 'Broken Window', description: 'Living room window is cracked', status: 'In Progress', priority: 'High' },
//   { id: 3, date: '2024-08-16', title: 'HVAC Maintenance', description: 'Annual HVAC system check', status: 'Completed', priority: 'Low' },
// ];
type Request = {
  id: number
  property_id?: string
  user_id?: string
  created_at?: Date
  updated_at: Date
  title: string
  description: string
  status: string
  priority: string
  notify: boolean
}

export function MaintenanceTable({ tasks }: { tasks: Request[] }) {
  const [requests, setRequests] = useState<Request[]>(tasks)
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentRequest, setCurrentRequest] = useState({
    id: 0,
    updated_at: new Date(),
    title: '',
    description: '',
    status: '',
    priority: '',
    notify: false,
  })

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setCurrentRequest((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    // e.preventDefault();
    if (currentRequest.id === 0) {
      // New request
      const newId = requests.length + 1
      const currentDate = new Date()
      setRequests([
        ...requests,
        {
          ...currentRequest,
          id: newId,
          updated_at: currentDate,
          status: 'Pending',
        },
      ])
    } else {
      // Edit existing request
      setRequests(
        requests.map((req) =>
          req.id === currentRequest.id ? currentRequest : req,
        ),
      )
    }
    setIsNewDialogOpen(false)
    setIsEditDialogOpen(false)
    setCurrentRequest({
      id: 0,
      updated_at: new Date(),
      title: '',
      description: '',
      status: '',
      priority: '',
      notify: false,
    })
  }

  const handleRowClick = (request: Request) => {
    setCurrentRequest(request)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="p-4">
      <Heading className="mb-4">Maintenance Requests</Heading>
      <Button
        onClick={() => {
          setCurrentRequest({
            id: 0,
            updated_at: new Date(),
            title: '',
            description: '',
            status: '',
            priority: 'Medium',
            notify: false,
          })
          setIsNewDialogOpen(true)
        }}
        className="mb-4"
        color="blue"
      >
        New Request
      </Button>

      <Table bleed grid>
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Title</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Priority</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.id}
              onClick={() => handleRowClick(request)}
              className="cursor-default hover:bg-gray-50"
            >
              <TableCell>{String(request.created_at)}</TableCell>
              <TableCell>{request.title}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>{request.priority}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={isNewDialogOpen || isEditDialogOpen}
        onClose={() => {
          setIsNewDialogOpen(false)
          setIsEditDialogOpen(false)
        }}
      >
        <DialogTitle>
          {currentRequest.id === 0
            ? 'New Maintenance Request'
            : 'Edit Maintenance Request'}
        </DialogTitle>
        <DialogBody>
          <form
            action={async (formData) => {
              toast.promise(
                new Promise(async (resolve, reject) => {
                  try {
                    const data = await createTask(formData)
                    resolve('Success')
                  } catch (error) {
                    reject(error)
                  } finally {
                    handleSubmit()
                  }
                }),
                {
                  loading: 'Adding...',
                  success: 'Task added!',
                  error:
                    'An error occurred, please check the form and try again.',
                },
              )
            }}
          >
            <FieldGroup>
              <Field>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentRequest.title}
                  onChange={handleInputChange}
                  required
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
                />
              </Field>

              <Field>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  id="priority"
                  name="priority"
                  value={currentRequest.priority}
                  onChange={handleInputChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </Field>

              {currentRequest.id !== 0 ? (
                <Field>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    name="status"
                    value={currentRequest.status}
                    onChange={handleInputChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Select>
                </Field>
              ) : (
                <Field>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    name="status"
                    defaultValue={'Pending'}
                    onChange={handleInputChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Select>
                </Field>
              )}
              {currentRequest.id === 0 && (
                <CheckboxField>
                  <Checkbox name="notify" />
                  <Label>Notify tenant(s)</Label>
                  <Description>An email notification will be sent.</Description>
                </CheckboxField>
              )}
            </FieldGroup>
            <DialogActions>
              <Button
                type="button"
                onClick={() => {
                  setIsNewDialogOpen(false)
                  setIsEditDialogOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" color="blue">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogBody>
      </Dialog>
    </div>
  )
}
