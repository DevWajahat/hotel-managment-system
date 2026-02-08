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
import { Trash2 } from 'lucide-react'
import AdminApp from '../../layouts/adminApp'

export default function ManageStatuses() {
  const [statuses, setStatuses] = useState([])
  const [statusName, setStatusName] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadStatuses()
  }, [])

  const loadStatuses = async () => {
    const { data } = await roomAPI.getStatuses()
    setStatuses(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await roomAPI.createStatus({ status: statusName })
    setOpen(false)
    loadStatuses()
  }

  const handleDelete = async (id) => {
    await roomAPI.deleteStatus(id) // Ensure deleteStatus exists in your API
    loadStatuses()
  }

  return (
    <AdminApp>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Room Statuses</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Status</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Status</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  onChange={(e) => setStatusName(e.target.value)}
                  required
                  placeholder="e.g. Cleaning, Occupied"
                />
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statuses.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.status}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleDelete(s._id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminApp>
  )
}
