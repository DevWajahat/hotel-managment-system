import React from 'react'
import { useNavigate } from 'react-router-dom'
import WebApp from '../../layouts/webApp'
import { Card } from '@/components/ui/card'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Cancel() {
  const navigate = useNavigate()

  return (
    <WebApp>
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="p-10 text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-700">
            Payment Cancelled
          </h2>
          <p className="text-gray-500 mb-8">
            You have not been charged. Your booking process was stopped.
          </p>
          <Button
            onClick={() => navigate('/guests/dashboard')}
            className="w-full bg-orange-600"
          >
            Try Again
          </Button>
        </Card>
      </div>
    </WebApp>
  )
}
