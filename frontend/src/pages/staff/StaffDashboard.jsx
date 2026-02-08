import { useEffect, useState } from 'react'
import { housekeepingAPI } from '../../api/houseKeepingAPI' // Updated to use the correct API
import WebApp from '../../layouts/webApp' // Or you can create a 'StaffApp' layout if you prefer
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Loader2,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  LogOut,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function StaffDashboard() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const navigate = useNavigate()

  // 1. Fetch Data (Using housekeepingAPI)
  const fetchData = async () => {
    setLoading(true)
    try {
      const { data } = await housekeepingAPI.getTasks()
      setRooms(data)
    } catch (error) {
      console.error('Failed to load tasks', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 2. Mark as Cleaned Logic
  const markAsAvailable = async (roomId) => {
    try {
      setProcessingId(roomId)
      await housekeepingAPI.completeTask(roomId)
      await fetchData() // Refresh list
    } catch (error) {
      alert('Failed to update status')
    } finally {
      setProcessingId(null)
    }
  }

  // 3. Logout Helper
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading && rooms.length === 0)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    )

  return (
    <WebApp>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Housekeeping Portal
              </h1>
              <p className="text-gray-500 font-medium">
                {rooms.length} Room(s) require cleaning
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchData}
              className="gap-2 bg-white hover:bg-gray-50"
            >
              <RefreshCw size={16} /> Refresh
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>

        {/* Room Grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-2">
              No rooms currently need cleaning. Great job!
            </p>
            <Button variant="outline" onClick={fetchData} className="mt-6">
              Check Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card
                key={room._id}
                className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-lg transition-all duration-300 group bg-white"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-4xl font-extrabold text-gray-800 tracking-tight">
                      {room.room_no}
                    </CardTitle>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase rounded-full tracking-wider shadow-sm">
                      To Clean
                    </span>
                  </div>
                  <CardDescription className="text-base font-medium text-gray-600 pt-1">
                    {room.room_type?.type}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="text-sm text-gray-500 flex gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    Status:{' '}
                    <span className="font-semibold text-gray-700">
                      Cleaning in Progress
                    </span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg shadow-md hover:shadow-lg transition-all active:scale-95"
                    onClick={() => markAsAvailable(room._id)}
                    disabled={!!processingId}
                  >
                    {processingId === room._id ? (
                      <>
                        <Loader2 className="animate-spin mr-2" /> Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2" /> Mark as Cleaned
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </WebApp>
  )
}
