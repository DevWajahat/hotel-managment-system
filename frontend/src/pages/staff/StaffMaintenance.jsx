import { useState } from 'react'
import WebApp from '../../layouts/webApp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Wrench, Plus, History, CheckCircle2, Clock } from 'lucide-react'

// Mock Data for demonstration
const MOCK_HISTORY = [
  {
    id: 1,
    room: '102',
    issue: 'AC making loud noise',
    status: 'Pending',
    date: '2024-02-10',
  },
  {
    id: 2,
    room: '205',
    issue: 'Shower handle loose',
    status: 'Fixed',
    date: '2024-02-08',
  },
]

export default function StaffMaintenance() {
  const [history, setHistory] = useState(MOCK_HISTORY)
  const [formData, setFormData] = useState({
    room: '',
    priority: '',
    description: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would call maintenanceAPI.createTicket(formData)
    const newTicket = {
      id: Date.now(),
      room: formData.room,
      issue: formData.description,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    }
    setHistory([newTicket, ...history])
    setFormData({ room: '', priority: '', description: '' }) // Reset
    alert('Maintenance Ticket Created!')
  }

  return (
    <WebApp>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex items-center gap-4">
          <div className="bg-orange-600 p-3 rounded-xl text-white">
            <Wrench size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Maintenance Requests
            </h1>
            <p className="text-gray-500">
              Report broken items or facility issues immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle>Report New Issue</CardTitle>
              <CardDescription>
                Fill in details for the maintenance team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Room Number</label>
                    <Input
                      placeholder="e.g. 304"
                      required
                      value={formData.room}
                      onChange={(e) =>
                        setFormData({ ...formData, room: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      onValueChange={(val) =>
                        setFormData({ ...formData, priority: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Cosmetic)</SelectItem>
                        <SelectItem value="medium">
                          Medium (Standard)
                        </SelectItem>
                        <SelectItem value="high">High (Urgent)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    className="h-32"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" className="w-full bg-gray-900 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* RIGHT: History Log */}
          <Card className="bg-gray-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History size={18} /> Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">
                          Room {ticket.room}
                        </span>
                        <span className="text-xs text-gray-400">
                          • {ticket.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{ticket.issue}</p>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                    ${
                                      ticket.status === 'Fixed'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                    >
                      {ticket.status === 'Fixed' ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {ticket.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </WebApp>
  )
}
