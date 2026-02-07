import { LayoutDashboard, Users, Calendar, Settings, Hotel } from 'lucide-react'

export const adminNav = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Manage Rooms',
    url: '/admin/rooms',
    icon: Hotel,
  },
  {
    title: 'All Bookings',
    url: '/admin/bookings',
    icon: Calendar,
  },
  {
    title: 'Manage Staff',
    url: '/admin/staffs',
    icon: Users,
  },
]

export const guestNav = [
  {
    title: 'My Dashboard',
    url: '/guests/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Bookings',
    url: '/guests/bookings',
    icon: Calendar,
  },
  {
    title: 'Profile Settings',
    url: '/guests/settings',
    icon: Settings,
  },
]
