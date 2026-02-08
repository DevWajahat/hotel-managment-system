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
import {
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Pencil,
  Search, // Imported Search Icon
  ChevronLeft, // Imported Left Arrow
  ChevronRight, // Imported Right Arrow
} from 'lucide-react'
import AdminApp from '../../layouts/adminApp'

const formSchema = z.object({
  room_no: z.string().min(1, 'Room number is required'),
  room_type: z.string().min(1, 'Room type is required'),
  room_status: z.string().min(1, 'Room status is required'),
})

// CONFIG: Items per page
const ITEMS_PER_PAGE = 5

export default function ManageRooms() {
  const [rooms, setRooms] = useState([])
  const [types, setTypes] = useState([])
  const [statuses, setStatuses] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // --- NEW STATE FOR SEARCH & PAGINATION ---
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [editingId, setEditingId] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_no: '',
      room_type: '',
      room_status: '',
    },
  })

  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => setFlashMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [flashMessage])

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

  // --- FILTER & PAGINATION LOGIC ---

  // 1. Filter Rooms based on Search Term
  const filteredRooms = rooms.filter((room) => {
    const term = searchTerm.toLowerCase()
    return (
      room.room_no.toLowerCase().includes(term) ||
      room.room_type?.type.toLowerCase().includes(term) ||
      room.room_status?.status.toLowerCase().includes(term)
    )
  })

  // 2. Calculate Pagination
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentRooms = filteredRooms.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  )

  // Reset to page 1 if search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const onSubmit = async (values) => {
    try {
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

  const handleQuickStatusChange = async (roomId, newStatusId) => {
    try {
      setRooms((prev) =>
        prev.map((r) =>
          r._id === roomId ? { ...r, room_status: { _id: newStatusId } } : r,
        ),
      )
      await roomAPI.updateRoom(roomId, { room_status: newStatusId })
      showFlash('success', 'Status updated!')
      fetchData()
    } catch (error) {
      showFlash('error', 'Failed to update status')
      fetchData()
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

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Manage Rooms</h1>

            <div className="flex gap-4 w-full md:w-auto">
              {/* --- SEARCH INPUT --- */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search rooms..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

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

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
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
          </div>

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
                ) : currentRooms.length === 0 ? (
                  // Handle No Results
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center h-24 text-gray-500"
                    >
                      No rooms found.
                    </TableCell>
                  </TableRow>
                ) : (
                  // --- MAP OVER currentRooms INSTEAD OF rooms ---
                  currentRooms.map((room) => (
                    <TableRow key={room._id}>
                      <TableCell className="font-medium">
                        {room.room_no}
                      </TableCell>
                      <TableCell>{room.room_type?.type || 'N/A'}</TableCell>
                      <TableCell>${room.room_type?.price || 0}</TableCell>

                      <TableCell>
                        <Select
                          disabled={room.room_status?.status === 'Occupied'}
                          defaultValue={
                            room.room_status?._id || room.room_status
                          }
                          onValueChange={(val) =>
                            handleQuickStatusChange(room._id, val)
                          }
                        >
                          <SelectTrigger className="w-[140px] h-8">
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

                        {room.room_status?.status === 'Occupied' && (
                          <span className="text-[10px] text-red-500 block mt-1">
                            Currently Booked
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(room)}
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>

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

          {/* --- PAGINATION CONTROLS --- */}
          {!isLoading && filteredRooms.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </AdminApp>
    </>
  )
}
