import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { bookingAPI } from '../../api/bookingAPI' // Ensure verifyPayment is in here
import { useCart } from '../../context/CartContext'
import WebApp from '../../layouts/webApp'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Success() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { clearCart } = useCart()

  const bookingId = searchParams.get('booking_id')
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    if (!bookingId || !sessionId) {
      setStatus('error')
      return
    }

    const verify = async () => {
      try {
        await bookingAPI.verify({
          booking_id: bookingId,
          session_id: sessionId,
        })
        setStatus('success')
        clearCart() // Payment success, clear the cart
      } catch (error) {
        console.error(error)
        setStatus('error')
      }
    }
    verify()
  }, [])

  return (
    <WebApp>
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="p-10 text-center max-w-md w-full shadow-2xl">
          {status === 'verifying' && (
            <>
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-700">
                Booking Confirmed!
              </h2>
              <p className="text-gray-500 mb-8">Your payment was successful.</p>
              <Button
                onClick={() => navigate('/guests/dashboard')}
                className="w-full bg-orange-600"
              >
                Go to Dashboard
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-red-700">
                Verification Failed
              </h2>
              <p className="text-gray-500 mb-8">
                Contact support if you were charged.
              </p>
              <Button
                onClick={() => navigate('/guests/dashboard')}
                variant="outline"
                className="w-full"
              >
                Return Home
              </Button>
            </>
          )}
        </Card>
      </div>
    </WebApp>
  )
}
