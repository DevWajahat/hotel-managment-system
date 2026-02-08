import React, { useEffect, useState } from 'react'
import WebApp from '../../layouts/webApp'
import { bookingAPI } from '../../api/bookingAPI'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Download, XCircle, BedDouble } from 'lucide-react'
import { format, isValid } from 'date-fns' // Import isValid
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // --- SAFE DATE HELPER (Prevents Crash) ---
  const safeFormat = (dateStr, pattern = 'MMM dd, yyyy') => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return isValid(date) ? format(date, pattern) : 'Invalid Date'
  }

  // 1. FETCH DATA
  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getMyBookings()
      setBookings(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // 2. CANCEL FUNCTION
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel?')) return
    try {
      await bookingAPI.cancel(id)
      alert('Booking cancelled.')
      fetchBookings()
    } catch (error) {
      alert('Failed to cancel: ' + error.message)
    }
  }

  // 3. INVOICE GENERATOR
  const downloadInvoice = (booking) => {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text('LUXURY STAY HOTEL', 14, 22)
    doc.setFontSize(10)
    doc.text('123 Ocean Drive, Miami, FL', 14, 28)
    doc.text('invoice@luxurystay.com', 14, 33)

    // Invoice Info
    doc.setFontSize(12)
    doc.text(`INVOICE #${booking._id.slice(-6).toUpperCase()}`, 140, 22)
    // Use Safe Date here too
    doc.text(`Date: ${safeFormat(booking.created_at)}`, 140, 28)
    doc.text(
      `Status: ${booking.payment_status?.toUpperCase() || 'N/A'}`,
      140,
      34,
    )

    // Table Data
    const tableRows = booking.items.map((item, index) => {
      const nights =
        item.check_in && item.check_out
          ? Math.ceil(
              Math.abs(new Date(item.check_out) - new Date(item.check_in)) /
                (1000 * 60 * 60 * 24),
            )
          : 1

      return [
        index + 1,
        `Room ${item.room_id?.room_no || 'N/A'} - ${item.room_id?.room_type?.type || 'Standard'}`,
        safeFormat(item.check_in, 'MMM dd'),
        safeFormat(item.check_out, 'MMM dd'),
        `$${item.price_per_night || 0}`,
        `$${(item.price_per_night || 0) * nights}`,
      ]
    })

    autoTable(doc, {
      startY: 45,
      head: [
        ['#', 'Room Details', 'Check In', 'Check Out', 'Price/Night', 'Total'],
      ],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [234, 88, 12] },
    })

    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFontSize(14)
    doc.text(`GRAND TOTAL: $${booking.total_amount || 0}`, 14, finalY)
    doc.save(`Invoice_${booking._id}.pdf`)
  }

  return (
    <WebApp>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-serif font-bold mb-8 text-gray-800">
          My Bookings
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-orange-500" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              You haven't made any bookings yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card
                key={booking._id}
                className="overflow-hidden border-0 shadow-md"
              >
                {/* Header Section */}
                <div className="bg-gray-50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Booking ID:{' '}
                      <span className="font-mono text-gray-700">
                        {booking._id}
                      </span>
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`
                                        ${booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                                        ${booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : ''}
                                        ${booking.booking_status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' : ''}
                                    `}
                      >
                        {booking.booking_status?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Booked on {safeFormat(booking.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-2xl font-bold text-orange-600">
                      ${booking.total_amount}
                    </p>
                  </div>
                </div>

                {/* Rooms List Section */}
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <BedDouble size={20} /> Room Details
                  </h3>

                  {/* IF NO ROOMS (e.g. Cancelled) */}
                  {booking.items && booking.items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 border-b">
                          <tr>
                            <th className="py-2">Room Type</th>
                            <th className="py-2">Room No</th>
                            <th className="py-2">Dates</th>
                            <th className="py-2">Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {booking.items.map((room, idx) => (
                            <tr key={idx}>
                              <td className="py-3 font-medium">
                                {room.room_id?.room_type?.type ||
                                  'Standard Room'}
                              </td>
                              <td className="py-3">
                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
                                  {room.room_id?.room_no || 'Unassigned'}
                                </span>
                              </td>
                              <td className="py-3">
                                {/* --- THIS IS WHERE IT WAS CRASHING --- */}
                                {safeFormat(room.check_in, 'MMM dd')} -{' '}
                                {safeFormat(room.check_out, 'MMM dd')}
                              </td>
                              <td className="py-3">
                                ${room.price_per_night}/night
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">
                      No room details available (Booking might be cancelled).
                    </p>
                  )}

                  {/* Actions Footer */}
                  <div className="mt-8 flex flex-wrap gap-4 justify-end pt-4 border-t">
                    {booking.booking_status !== 'cancelled' && (
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleCancel(booking._id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Cancel Booking
                      </Button>
                    )}
                    <Button
                      className="bg-gray-900 text-white hover:bg-gray-800"
                      onClick={() => downloadInvoice(booking)}
                    >
                      <Download className="w-4 h-4 mr-2" /> Download Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </WebApp>
  )
}
