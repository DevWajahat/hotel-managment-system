import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Bell, Search, HelpCircle, CalendarCheck, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SiteHeader() {
  const location = useLocation()
  const navigate = useNavigate()

  // --- STATE ---
  const [notifications, setNotifications] = useState(3) // Mock count
  const [searchValue, setSearchValue] = useState('')

  // Check if Admin based on URL (Fastest way for UI)
  const isAdmin = location.pathname.includes('/admin')

  // 1. DYNAMIC TITLE LOGIC
  // We use a dictionary object for cleaner lookups than multiple 'if' statements
  const getPageTitle = (path) => {
    const routeMap = {
      '/admin/dashboard': 'Dashboard Overview',
      '/admin/rooms': 'Room Management',
      '/admin/staffs': 'Staff Directory',
      '/admin/bookings': 'Booking Requests',
      '/guests/dashboard': 'Welcome Back',
      '/guests/my-bookings': 'My Reservations',
      '/guests/profile': 'Account Settings',
    }
    // Check for exact match or return default
    return routeMap[path] || (isAdmin ? 'Admin Portal' : 'Guest Portal')
  }

  const title = getPageTitle(location.pathname)

  // 2. DYNAMIC SEARCH FUNCTION
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      // If Admin: Maybe filter the current table? (Complex)
      // If Guest: Send them to the booking/search page
      if (!isAdmin) {
        navigate(`/guests/dashboard?search=${searchValue}`)
      } else {
        console.log('Admin searching for:', searchValue)
        // You could add a global admin search logic here later
      }
    }
  }

  // 3. LOGOUT FUNCTION (For Dropdown)
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <header className="flex  shrink-0 items-center gap-2 border-b bg-white/50 backdrop-blur-sm px-4 py-3  lg:px-6 sticky top-0 z-10">
      {/* --- LEFT: Trigger & Dynamic Title --- */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-gray-500 hover:text-gray-900" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-sm font-semibold text-gray-800 tracking-tight">
          {title}
        </h1>
      </div>

      {/* --- CENTER: Functional Search Bar --- */}
      <div className="ml-auto hidden md:flex items-center relative max-w-md w-full px-6">
        <Search className="absolute left-9 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={
            isAdmin ? 'Search reservations...' : 'Search for rooms...'
          }
          className="pl-10 h-9 bg-gray-50 border-transparent focus:bg-white focus:border-orange-100 transition-all w-full text-sm rounded-full"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* --- RIGHT: Action Icons --- */}
      <div className="ml-auto flex items-center gap-2">
        {/* Dynamic Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-orange-600 relative"
            >
              <Bell className="h-4 w-4" />
              {notifications > 0 && (
                <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications > 0 ? (
              <>
                <DropdownMenuItem>New booking request #102</DropdownMenuItem>
                <DropdownMenuItem>Room 004 needs cleaning</DropdownMenuItem>
                <DropdownMenuItem>System update completed</DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem className="text-gray-500">
                No new alerts
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xs text-center cursor-pointer justify-center"
              onClick={() => setNotifications(0)}
            >
              Mark all as read
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dynamic Book Now Button (Guest Only) */}
        {!isAdmin && (
          <Button
            asChild // Renders as a Link instead of a Button tag
            size="sm"
            className="ml-2 bg-gray-900 text-white hover:bg-gray-800 h-8 px-4 text-xs font-medium rounded-full shadow-md transition-transform active:scale-95"
          >
            {/* <Link to="/search-rooms"> */}
            {/*   <CalendarCheck className="mr-2 h-3 w-3" /> */}
            {/*   Book Now */}
            {/* </Link> */}
          </Button>
        )}
      </div>
    </header>
  )
}
