import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { authAPI } from '../../api/userAuth'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

const VerifyEmail = () => {
  const { token } = useParams()
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error')
        setMessage('No token provided')
        return
      }

      try {
        await authAPI.verifyEmail(token)
        setStatus('success')
      } catch (error) {
        console.error(error)
        setStatus('error')
        // Backend usually sends error.response.data.message
        setMessage(
          error.response?.data?.message ||
            'Verification failed. Link might be expired.',
        )
      }
    }

    verify()
  }, [token])

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        {/* 1. LOADING STATE */}
        {status === 'verifying' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
            <h2 className="text-2xl font-bold">Verifying your email...</h2>
            <p className="text-gray-500">
              Please wait while we confirm your account.
            </p>
          </div>
        )}

        {/* 2. SUCCESS STATE */}
        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Email Verified!
            </h2>
            <p className="text-gray-500">
              Your account has been successfully verified. You can now access
              all features.
            </p>
            <Button asChild className="w-full mt-4">
              <Link to="/login">Go to Login</Link>
            </Button>
          </div>
        )}

        {/* 3. ERROR STATE */}
        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verification Failed
            </h2>
            <p className="text-red-500 font-medium">{message}</p>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link to="/register">Back to Register</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
