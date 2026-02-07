'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { roomAPI } from '../../api/roomAPI'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// Added CheckCircle2, XCircle, Pencil
import {
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Pencil,
} from 'lucide-react'
import AdminApp from '../../layouts/adminApp'

// --- 1. Zod Schema (Removed Image) ---
const formSchema = z.object({
  room_no: z.string().min(1, 'Room number is required'),
  room_type: z.string().min(1, 'Room type is required'),
  room_status: z.string().min(1, 'Room status is required'),
})

export default function ManageRooms() {
  const [rooms, setRooms] = useState([])
  const [types, setTypes] = useState([])
  const [statuses, setStatuses] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Edit & Flash States
  const [editingId, setEditingId] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)

  // --- 2. Initialize Form ---
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_no: '',
      room_type: '',
      room_status: '',
    },
  })

  // Auto-hide flash message
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => setFlashMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [flashMessage])

  // --- 3. Fetch Data ---
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [roomsRes, typesRes, statusRes] = await Promise.all([
        roomAPI.getAllRooms(),
        roomAPI.getTypes(),
        roomAPI.getStatuses(),
      ])
      setRooms(roomsRes.data)
      setTypes(typesRes.data)
      setStatuses(statusRes.data)
    } catch (error) {
      console.error('Failed to load data', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- 4. Handle Submit (Create OR Update) ---
  const onSubmit = async (values) => {
    try {
      // NOTE: We send JSON 'values' directly now (No FormData needed without files)

      if (editingId) {
        await roomAPI.updateRoom(editingId, values)
        showFlash('success', 'Room updated successfully!')
      } else {
        await roomAPI.createRoom(values)
        showFlash('success', 'Room created successfully!')
      }

      handleClose()
      fetchData()
    } catch (error) {
      console.error(error)
      showFlash('error', error.response?.data?.message || 'Operation failed')
    }
  }

  // --- 5. Quick Status Update (Directly in Table) ---
  const handleQuickStatusChange = async (roomId, newStatusId) => {
    try {
      // Optimistic UI Update (Optional, but feels faster)
      setRooms((prev) =>
        prev.map((r) =>
          r._id === roomId ? { ...r, room_status: { _id: newStatusId } } : r,
        ),
      )

      // Call API
      await roomAPI.updateRoom(roomId, { room_status: newStatusId })
      showFlash('success', 'Status updated!')

      // Refresh to ensure data consistency
      fetchData()
    } catch (error) {
      showFlash('error', 'Failed to update status')
      fetchData() // Revert on error
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this room?')) {
      try {
        await roomAPI.deleteRoom(id)
        showFlash('success', 'Room deleted')
        fetchData()
      } catch (error) {
        showFlash('error', 'Delete failed')
      }
    }
  }

  const handleEdit = (room) => {
    setEditingId(room._id)
    form.reset({
      room_no: room.room_no,
      room_type: room.room_type?._id || '',
      room_status: room.room_status?._id || '',
    })
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingId(null)
    form.reset({ room_no: '', room_type: '', room_status: '' })
  }

  const showFlash = (type, text) => {
    setFlashMessage({ type, text })
  }

  return (
    <>
      <AdminApp>
        <div className="p-8 space-y-6 relative">
          {/* FLASH MESSAGE TOAST */}
          {flashMessage && (
            <div
              className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2 animate-in slide-in-from-top-2 duration-300 ${
                flashMessage.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {flashMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <p className="font-medium text-sm">{flashMessage.text}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Manage Rooms</h1>

            <Dialog
              open={isDialogOpen}
              onOpenChange={(val) => !val && handleClose()}
            >
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? 'Edit Room' : 'Add New Room'}
                  </DialogTitle>
                </DialogHeader>

                {/* --- Form --- */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    {/* Room Number */}
                    <FormField
                      control={form.control}
                      name="room_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Number</FormLabel>
                          <FormControl>
                            <Input placeholder="101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Room Type Select */}
                    <FormField
                      control={form.control}
                      name="room_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {types.map((t) => (
                                <SelectItem key={t._id} value={t._id}>
                                  {t.type} (${t.price})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Room Status Select (In Modal) */}
                    <FormField
                      control={form.control}
                      name="room_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Initial Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statuses.map((s) => (
                                <SelectItem key={s._id} value={s._id}>
                                  {s.status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : editingId ? (
                        'Update Room'
                      ) : (
                        'Create Room'
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* --- Rooms Table --- */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room No</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status (Quick Update)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  rooms.map((room) => (
                    <TableRow key={room._id}>
                      <TableCell className="font-medium">
                        {room.room_no}
                      </TableCell>
                      <TableCell>{room.room_type?.type || 'N/A'}</TableCell>
                      <TableCell>${room.room_type?.price || 0}</TableCell>

                      {/* --- QUICK STATUS UPDATE DROPDOWN --- */}
                      <TableCell>
                        <Select
                          // Ensure we handle cases where status might be null/populated object
                          defaultValue={
                            room.room_status?._id || room.room_status
                          }
                          onValueChange={(val) =>
                            handleQuickStatusChange(room._id, val)
                          }
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            {/* Display current status color-coded nicely */}
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((s) => (
                              <SelectItem key={s._id} value={s._id}>
                                {s.status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="text-right space-x-2">
                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(room)}
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(room._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AdminApp>
    </>
  )
}
