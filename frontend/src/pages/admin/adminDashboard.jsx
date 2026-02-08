import { useEffect, useState } from 'react'
import AdminApp from '../../layouts/adminApp'
import { roomAPI } from '../../api/roomAPI'
import { staffAPI } from '../../api/staffAPI' // Import Staff API
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Activity,
  Users,
  BedDouble,
  CheckCircle2,
  ShieldAlert,
  Briefcase,
} from 'lucide-react'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)

  // State for Real Stats
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    totalStaff: 0,
    totalAdmins: 0,
  })

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true)

        // 1. Fetch EVERYTHING in parallel (Rooms + Staff)
        const [roomsRes, staffRes] = await Promise.all([
          roomAPI.getAllRooms(),
          staffAPI.getAll(),
        ])

        const rooms = roomsRes.data
        const staff = staffRes.data

        // 2. Calculate Room Stats
        const totalRooms = rooms.length

        // Note: We use .toLowerCase() to be safe against "Available" vs "available"
        const availableRooms = rooms.filter(
          (r) =>
            r.room_status?.status?.toLowerCase() === 'available' ||
            r.room_status?.status?.toLowerCase() === 'clean',
        ).length

        const occupiedRooms = rooms.filter(
          (r) =>
            r.room_status?.status?.toLowerCase() === 'occupied' ||
            r.room_status?.status?.toLowerCase() === 'booked',
        ).length

        // Any room not available or occupied is considered "Maintenance/Other"
        const maintenanceRooms = totalRooms - availableRooms - occupiedRooms

        // 3. Calculate Staff Stats
        const totalStaffMembers = staff.length
        const totalAdmins = staff.filter((u) => u.role === 'admin').length

        // 4. Update State
        setStats({
          totalRooms,
          availableRooms,
          occupiedRooms,
          maintenanceRooms,
          totalStaff: totalStaffMembers,
          totalAdmins,
        })
      } catch (error) {
        console.error('Failed to load dashboard data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRealData()
  }, [])

  return (
    <AdminApp>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h2>
        </div>

        {/* --- DYNAMIC STATS CARDS --- */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Rooms */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <BedDouble className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.totalRooms}
              </div>
              <p className="text-xs text-muted-foreground">
                Physical rooms in hotel
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Available Rooms */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Now
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.availableRooms}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for check-in
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Occupied Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupied / Booked
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.occupiedRooms}
              </div>
              <p className="text-xs text-muted-foreground">Currently in use</p>
            </CardContent>
          </Card>

          {/* Card 4: Staff Count (Replaced Revenue) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Staff
              </CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.totalStaff}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalAdmins} Admins,{' '}
                {stats.totalStaff - stats.totalAdmins} Staff
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- DETAILED BREAKDOWN --- */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Room Status Overview */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Room Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="space-y-4 p-4">
                {/* Available */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Available</p>
                      <p className="text-xs text-gray-500">Clean & Ready</p>
                    </div>
                  </div>
                  <span className="font-bold text-xl text-green-600">
                    {stats.availableRooms}
                  </span>
                </div>

                {/* Occupied */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Occupied</p>
                      <p className="text-xs text-gray-500">
                        Guests currently checked in
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xl text-blue-600">
                    {stats.occupiedRooms}
                  </span>
                </div>

                {/* Maintenance */}
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Maintenance / Cleaning</p>
                      <p className="text-xs text-gray-500">
                        Not available for booking
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xl text-orange-600">
                    {stats.maintenanceRooms}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Staff Overview */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Admin Stat */}
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                    <ShieldAlert className="h-5 w-5 text-purple-700" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Administrators
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Full system access
                    </p>
                  </div>
                  <div className="ml-auto font-bold text-lg">
                    {stats.totalAdmins}
                  </div>
                </div>

                {/* Staff Stat */}
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                    <Briefcase className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      General Staff
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reception & Services
                    </p>
                  </div>
                  <div className="ml-auto font-bold text-lg">
                    {stats.totalStaff - stats.totalAdmins}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-center text-gray-400">
                    Booking & Revenue stats will appear here once the booking
                    module is active.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminApp>
  )
}

export default AdminDashboard
