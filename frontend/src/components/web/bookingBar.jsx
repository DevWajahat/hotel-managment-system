import React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Users, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// Accepts props now to control the state from the parent
export default function BookingBar({
  date,
  setDate,
  guests,
  setGuests,
  onSearch,
}) {
  const updateGuests = (type, operation) => {
    setGuests((prev) => {
      const newValue = operation === 'inc' ? prev[type] + 1 : prev[type] - 1

      // Prevent going below 1 for rooms and adults
      if (type === 'rooms' && newValue < 1) return prev
      if (type === 'adults' && newValue < 1) return prev
      // Prevent going below 0 for children
      if (newValue < 0) return prev

      return { ...prev, [type]: newValue }
    })
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-xl p-4 flex flex-col md:flex-row items-center gap-4 border border-gray-100">
        {/* Date Picker Section */}
        <div className="flex-1 w-full">
          <label className="block text-xs font-sans font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
            Check in - Check out
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-sans h-12 rounded-md border-gray-300 hover:bg-gray-50 focus:border-[#5c4d42]',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-[#5c4d42]" />
                {date?.from ? (
                  date.to ? (
                    <span className="text-[#333] font-medium">
                      {format(date.from, 'dd/MM/yyyy')} -{' '}
                      {format(date.to, 'dd/MM/yyyy')}
                    </span>
                  ) : (
                    format(date.from, 'dd/MM/yyyy')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                className="bg-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests & Rooms Section */}
        <div className="flex-1 w-full">
          <label className="block text-xs font-sans font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
            Guests and Rooms
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-sans h-12 rounded-md border-gray-300 hover:bg-gray-50 focus:border-[#5c4d42]"
              >
                <Users className="mr-2 h-4 w-4 text-[#5c4d42]" />
                <span className="text-[#333] font-medium">
                  {guests.rooms} Room{guests.rooms > 1 && 's'}, {guests.adults}{' '}
                  Adult{guests.adults > 1 && 's'}, {guests.children} Child
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 bg-white" align="start">
              <div className="space-y-4">
                {/* Rooms Counter */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans font-medium text-[#333]">Rooms</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-gray-300"
                      onClick={() => updateGuests('rooms', 'dec')}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-4 text-center font-mono">
                      {guests.rooms}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-gray-300"
                      onClick={() => updateGuests('rooms', 'inc')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Adults Counter */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans font-medium text-[#333]">Adults</p>
                    <p className="text-xs text-gray-500">Ages 13 or above</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-gray-300"
                      onClick={() => updateGuests('adults', 'dec')}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-4 text-center font-mono">
                      {guests.adults}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-gray-300"
                      onClick={() => updateGuests('adults', 'inc')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Children Counter */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans font-medium text-[#333]">
                      Children
                    </p>
                    <p className="text-xs text-gray-500">Ages 0-12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-gray-300"
                      onClick={() => updateGuests('children', 'dec')}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-4 text-center font-mono">
                      {guests.children}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-gray-300"
                      onClick={() => updateGuests('children', 'inc')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button - EXACT COLOR bg-orange-500 */}
        <div className="mt-6 md:mt-6">
          <Button
            onClick={onSearch}
            className="bg-orange-500 text-white rounded-full uppercase tracking-widest font-bold h-12 px-8 shadow-md transition-all"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
