import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext' // Import Context
import { bookingAPI } from '../../api/bookingAPI'
import WebApp from '../../layouts/webApp'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Loader2, Calendar } from 'lucide-react'
import { differenceInCalendarDays, format } from 'date-fns'

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, bookingParams, removeFromCart, clearCart } = useCart()
  const [submitting, setSubmitting] = useState(false)

  // Redirect if empty
  if (cartItems.length === 0) {
    return (
      <div className="p-20 text-center">
        Your cart is empty.{' '}
        <Button onClick={() => navigate('/guests/dashboard')}>Go Back</Button>
      </div>
    )
  }

  // Calculate Totals
  const nights =
    differenceInCalendarDays(
      new Date(bookingParams.to),
      new Date(bookingParams.from),
    ) || 1
  const cartTotalPerNight = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )
  const grandTotal = cartTotalPerNight * nights

  const handleBooking = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // 1. DEFINE AND BUILD THE PAYLOAD (Do not delete this part!)
      let roomsPayload = []

      // Loop through cart items and expand them based on quantity
      cartItems.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          roomsPayload.push({
            room_type_id: item._id,
            check_in: bookingParams.from,
            check_out: bookingParams.to,
            // Simple logic: 2 adults per room default (or use your custom logic)
            adults: 2,
            children: 0,
          })
        }
      })

      console.log('Sending Payload:', roomsPayload) // Debugging check

      // 2. SEND TO BACKEND
      const { data } = await bookingAPI.create({
        rooms_data: roomsPayload,
        payment_info: { provider: 'stripe' },
      })

      // 3. REDIRECT TO STRIPE URL
      if (data.url) {
        window.location.href = data.url
      } else {
        // Fallback for non-stripe bookings (if any)
        alert('Booking Successful!')
        navigate('/guests/dashboard')
      }
    } catch (error) {
      console.error(error)
      alert(
        'Booking Failed: ' + (error.response?.data?.message || error.message),
      )
      setSubmitting(false) // Only stop loading on error
    }
  }
  return (
    <WebApp>
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT: Cart Summary */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold font-serif">Review Your Booking</h1>

          {/* Dates Card */}
          <Card className="bg-orange-50 border-orange-100">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Calendar className="text-orange-600" />
                <div>
                  <p className="font-bold text-gray-800">
                    {format(new Date(bookingParams.from), 'MMM dd')} -{' '}
                    {format(new Date(bookingParams.to), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">{nights} Nights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          {cartItems.map((item) => (
            <Card key={item._id} className="flex flex-row overflow-hidden">
              <img src={item.image} className="w-32 object-cover" />
              <div className="p-4 flex-1 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{item.type}</h3>
                  <p className="text-gray-500">
                    ${item.price} x {item.quantity} room(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    ${item.price * item.quantity * nights}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} /> Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* RIGHT: Total & Pay */}
        <div className="md:col-span-1">
          <Card className="sticky top-4 shadow-xl border-0">
            <CardHeader className="bg-gray-900 text-white">
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal (per night)</span>
                <span>${cartTotalPerNight}</span>
              </div>
              <div className="flex justify-between">
                <span>Nights</span>
                <span>{nights}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-xl">
                <span>Total Due</span>
                <span className="text-orange-600">${grandTotal}</span>
              </div>

              <Button
                onClick={handleBooking}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 text-lg"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Confirm & Pay'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </WebApp>
  )
}
