import { useEffect, useState } from 'react'
import { roomAPI } from '../../api/roomAPI'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
// 1. Import Loader2 for the spinner and Check/XCircle for messages
import {
  Trash2,
  Pencil,
  ImagePlus,
  Loader2,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react'
import AdminApp from '../../layouts/adminApp'

export default function ManageRoomTypes() {
  const [types, setTypes] = useState([])

  // 2. Add Loading State
  const [isLoading, setIsLoading] = useState(false)

  // 3. Add Flash Message State
  const [flashMessage, setFlashMessage] = useState(null) // { type: 'success'|'error', text: '' }

  const [formData, setFormData] = useState({
    type: '',
    price: '',
    max_adults: 2,
    max_children: 0,
    description: '',
    imageFile: null,
  })

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    loadTypes()
  }, [])

  // Auto-hide flash message after 3 seconds
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => setFlashMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [flashMessage])

  const loadTypes = async () => {
    try {
      const { data } = await roomAPI.getTypes()
      setTypes(data)
    } catch (error) {
      console.error('Error loading types:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true) // Start Loading
    setFlashMessage(null) // Clear previous messages

    const data = new FormData()
    data.append('type', formData.type)
    data.append('price', formData.price)
    data.append('max_adults', formData.max_adults)
    data.append('max_children', formData.max_children)
    data.append('description', formData.description)

    if (formData.imageFile) {
      data.append('image', formData.imageFile)
    }

    try {
      if (editingId) {
        await roomAPI.updateType(editingId, data)
        showFlash('success', 'Room Type updated successfully!')
      } else {
        await roomAPI.createType(data)
        showFlash('success', 'New Room Type created!')
      }
      handleClose()
      loadTypes()
    } catch (error) {
      console.error(error)
      showFlash('error', 'Failed to save. Please try again.')
    } finally {
      setIsLoading(false) // Stop Loading (Always runs)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this type?')) {
      try {
        await roomAPI.deleteType(id)
        showFlash('success', 'Room Type deleted.')
        loadTypes()
      } catch (error) {
        showFlash('error', 'Could not delete type.')
      }
    }
  }

  const showFlash = (type, text) => {
    setFlashMessage({ type, text })
  }

  const handleEdit = (type) => {
    setFormData({
      type: type.type,
      price: type.price,
      max_adults: type.max_adults,
      max_children: type.max_children,
      description: type.description || '',
      imageFile: null,
    })
    setEditingId(type._id)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingId(null)
    setFormData({
      type: '',
      price: '',
      max_adults: 2,
      max_children: 0,
      description: '',
      imageFile: null,
    })
  }

  return (
    <AdminApp>
      <div className="p-6 relative">
        {/* --- CUSTOM FLASH MESSAGE COMPONENT --- */}
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

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Room Types</h2>

          <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Edit Room Type' : 'Add Room Type'}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                    placeholder="e.g. Deluxe Suite"
                  />
                </div>

                <div>
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    placeholder="100"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Room description..."
                  />
                </div>

                <div className="flex gap-2">
                  <div className="w-1/2">
                    <Label>Max Adults</Label>
                    <Input
                      type="number"
                      value={formData.max_adults}
                      onChange={(e) =>
                        setFormData({ ...formData, max_adults: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-1/2">
                    <Label>Max Children</Label>
                    <Input
                      type="number"
                      value={formData.max_children}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_children: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Room Image</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          imageFile: e.target.files[0],
                        })
                      }
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                {/* --- 4. BUTTON WITH LOADING STATE --- */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingId ? 'Updating...' : 'Saving...'}
                    </>
                  ) : editingId ? (
                    'Update'
                  ) : (
                    'Save'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Same table body as before... */}
            {types.map((t) => (
              <TableRow key={t._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.type}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border text-gray-400">
                        <ImagePlus className="w-6 h-6" />
                      </div>
                    )}
                    <span className="font-medium">{t.type}</span>
                  </div>
                </TableCell>
                <TableCell>${t.price}</TableCell>
                <TableCell>
                  {t.max_adults} Adults, {t.max_children} Children
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(t)}
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(t._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminApp>
  )
}
