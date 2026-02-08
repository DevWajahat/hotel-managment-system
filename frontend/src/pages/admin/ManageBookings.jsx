import React, { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/adminApp'
import { bookingAPI } from '../../api/bookingAPI'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { Loader2, Search, Eye, XCircle } from 'lucide-react'
import { format, isValid } from 'date-fns' // Import isValid

export default function ManageBookings() {
  const [bookings, setBookings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // --- SAFE DATE HELPER (Prevents Crash) ---
  const safeFormat = (dateStr, pattern = 'MMM dd, yyyy') => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return isValid(date) ? format(date, pattern) : 'Invalid Date'
  }

  // 1. FETCH DATA
  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getAll()
      setBookings(data)
      setFiltered(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // 2. SEARCH FILTER
  useEffect(() => {
    const lower = search.toLowerCase()
    const results = bookings.filter(
      (b) =>
        b.customer_id?.full_name?.toLowerCase().includes(lower) ||
        b._id.includes(lower),
    )
    setFiltered(results)
  }, [search, bookings])

  // 3. ADMIN ACTIONS
  const handleCancel = async (id) => {
    if (!window.confirm('Force cancel this booking?')) return
    try {
      await bookingAPI.cancel(id)
      fetchBookings() // Refresh
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8 space-y-6">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            <p className="text-gray-500">
              Manage and oversee all guest reservations.
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or Booking ID..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <Card className="shadow-md border-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                {/* <TableHead className="text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500" />
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-gray-500"
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((booking) => (
                  <TableRow key={booking._id} className="hover:bg-gray-50/50">
                    <TableCell className="font-mono text-xs text-gray-500">
                      {booking._id.slice(-6).toUpperCase()}
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">
                        {booking.customer_id?.full_name || 'Unknown'}{' '}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.customer_id?.email || 'No Email'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-100"
                      >
                        {booking.items?.length || 0} Room(s)
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {/* Using safe access (?.) to prevent crash on missing rooms */}
                        {booking.items
                          ?.map((i) => i.room_id?.room_no || 'Unassigned')
                          .join(', ')}
                      </div>
                    </TableCell>

                    <TableCell>
                      {/* --- CRASH FIX HERE --- */}
                      {safeFormat(booking.created_at)}
                    </TableCell>

                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                       ${booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                                       ${booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                       ${booking.booking_status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                   `}
                      >
                        {booking.booking_status || 'Unknown'}
                      </div>
                    </TableCell>

                    <TableCell className="font-bold text-gray-700">
                      ${(booking.total_amount || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  )
}
