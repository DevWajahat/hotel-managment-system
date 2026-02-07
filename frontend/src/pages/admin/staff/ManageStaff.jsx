'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { staffAPI } from '../../../api/staffAPI' // Import the API
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
  ShieldAlert,
} from 'lucide-react'
import AdminApp from '../../../layouts/adminApp'

// --- 1. Zod Schema ---
const formSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Role is required'),
  // Password is optional in schema (we handle validation logic in onSubmit)
  // This allows us to leave it empty during "Edit" to keep existing password
  password: z.string().optional(),
})

export default function ManageStaff() {
  const [staff, setStaff] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Edit & Flash States
  const [editingId, setEditingId] = useState(null)
  const [flashMessage, setFlashMessage] = useState(null)

  // --- 2. Initialize Form ---
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      email: '',
      role: 'staff', // Default role
      password: '',
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
      const { data } = await staffAPI.getAll()
      setStaff(data)
    } catch (error) {
      console.error('Failed to load staff', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- 4. Handle Submit ---
  const onSubmit = async (values) => {
    // Custom Validation: Password is required ONLY when creating new user
    if (!editingId && (!values.password || values.password.length < 6)) {
      form.setError('password', {
        type: 'manual',
        message: 'Password (min 6 chars) is required for new users',
      })
      return
    }

    try {
      if (editingId) {
        await staffAPI.update(editingId, values)
        showFlash('success', 'Staff member updated!')
      } else {
        await staffAPI.create(values)
        showFlash('success', 'New staff member created!')
      }

      handleClose()
      fetchData()
    } catch (error) {
      console.error(error)
      showFlash('error', error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure? This action cannot be undone.')) {
      try {
        await staffAPI.delete(id)
        showFlash('success', 'Staff member removed')
        fetchData()
      } catch (error) {
        showFlash('error', error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const handleEdit = (user) => {
    setEditingId(user._id)
    form.reset({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      password: '', // Reset password field (empty means don't change)
    })
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingId(null)
    form.reset({ full_name: '', email: '', role: 'staff', password: '' })
  }

  const showFlash = (type, text) => {
    setFlashMessage({ type, text })
  }

  return (
    <AdminApp>
      <div className="p-8 space-y-6 relative">
        {/* FLASH MESSAGE */}
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
          <h1 className="text-3xl font-bold tracking-tight">Manage Staff</h1>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(val) => !val && handleClose()}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Staff Details' : 'Add New Staff'}
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="staff@hotel.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Role Selection */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="staff">
                              Staff (Reception/Service)
                            </SelectItem>
                            <SelectItem value="admin">
                              Admin (Full Access)
                            </SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {editingId ? 'New Password (Optional)' : 'Password'}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={
                              editingId
                                ? 'Leave blank to keep current'
                                : 'Secret123'
                            }
                            {...field}
                          />
                        </FormControl>
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
                      'Update Staff'
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* --- Staff Table --- */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                staff.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {user.full_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role === 'admin' && (
                          <ShieldAlert className="w-3 h-3 mr-1" />
                        )}
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user._id)}
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
  )
}
