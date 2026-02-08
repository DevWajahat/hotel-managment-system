import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { Link, useLocation } from 'react-router-dom'
import { adminNav, guestNav } from '../../config/navItems'
import {
  LogOut,
  Hotel,
  User,
  Sparkles,
  Wrench,
  Search,
  CalendarClock,
} from 'lucide-react' // Added Sparkles for Staff Icon

// --- 1. Define Staff Navigation Here (or move to config/navItems) ---
const staffNav = [
  {
    title: 'Housekeeping',
    url: '/staff/dashboard',
    icon: Sparkles,
  },
  {
    title: 'Maintenance',
    url: '/staff/maintenance',
    icon: Wrench,
  },
  {
    title: 'Lost & Found',
    url: '/staff/lost-found', // Placeholder for now
    icon: Search,
  },
]

export function AppSidebar() {
  const location = useLocation()

  // 2. Get User Data
  const user = JSON.parse(localStorage.getItem('user'))
  const role = user?.role || 'guest'

  // --- 3. FIX: Select Logic for 3 Roles ---
  let items = guestNav // Default
  let groupLabel = 'Guest Portal'

  if (role === 'admin') {
    items = adminNav
    groupLabel = 'Admin Dashboard'
  } else if (role === 'staff') {
    items = staffNav
    groupLabel = 'Staff Portal'
  }

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <Sidebar className="border-r border-gray-100 bg-white">
      {/* HEADER */}
      <SidebarHeader className="p-6 pb-2">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-orange-600 text-white p-2.5 rounded-xl shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform duration-300">
            <Hotel size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl tracking-tight text-gray-900 leading-none">
              Luxury Stay
            </h2>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1">
              Hotel & Resort
            </p>
          </div>
        </Link>
      </SidebarHeader>

      {/* MENU ITEMS */}
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          {/* Dynamic Label based on role */}
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">
            {groupLabel}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {items.map((item) => {
                const isActive = location.pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        h-12 w-full justify-start gap-4 px-4 rounded-xl transition-all duration-200
                        ${
                          isActive
                            ? 'bg-orange-50 text-orange-700 font-semibold shadow-sm border border-orange-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                        }
                      `}
                    >
                      <Link to={item.url}>
                        <item.icon
                          className={
                            isActive ? 'h-5 w-5' : 'h-5 w-5 opacity-70'
                          }
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-4 border-t border-gray-50">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-gray-100/80 transition-colors">
          <div className="h-10 w-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">
              {user?.name || user?.full_name || 'User'}
            </p>
            <p className="text-[11px] font-medium text-gray-400 truncate capitalize">
              {role} Account
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-400 hover:bg-white hover:text-red-600 hover:shadow-sm transition-all"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
