import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { addDays, differenceInCalendarDays } from 'date-fns'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import BookingBar from './bookingBar'
import { RoomLists } from './RoomData' // Assuming data is in separate file, or paste array here

const Rooms = () => {
  // 1. State lifted to parent
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 3),
  })

  const [guests, setGuests] = useState({
    rooms: 1,
    adults: 2,
    children: 0,
  })

  // 2. Format Currency helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  // 3. Calculate Nights
  const getNights = () => {
    if (!date?.from || !date?.to) return 1
    const days = differenceInCalendarDays(date.to, date.from)
    return days > 0 ? days : 1
  }

  const nights = getNights()

  return (
    <>
      <div className="w-full px-20 py-20 bg-white flex justify-center items-center flex-col ">
        <div className="w-full flex flex-col justify-center items-start gap-2 mb-20">
          <h2 className="font-sans text-2xl md:text-4xl font-bold text-black">
            Room Types & Rates
          </h2>
          <p className="text-neutral-700 text-center leading-relaxed text-lg md:text-xl">
            All rooms include complimentary Bed & Breakfast.
          </p>
        </div>

        <div className="flex flex-col gap-10 my-6 ">
          {/* 4. Pass props to BookingBar */}
          <BookingBar
            date={date}
            setDate={setDate}
            guests={guests}
            setGuests={setGuests}
            onSearch={() => console.log('Searching...')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RoomLists.map((item, index) => {
            // 5. Calculate Total Price dynamically
            const totalPrice = item.price * nights * guests.rooms

            return (
              <Card
                key={index}
                className=" mx-auto w-full max-w-sm pt-0 outline-none border-none shadow-none "
              >
                <div className="border-none outline-none " />
                <img
                  src={item.image}
                  alt={item.name}
                  className=" aspect-video w-full object-cover rounded-2xl "
                />
                <CardHeader>
                  <CardAction>
                    {/* Display Total Price */}
                    <Badge variant="secondary">{formatPrice(totalPrice)}</Badge>
                  </CardAction>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.speciality}</CardDescription>
                  {/* Optional: Add pricing breakdown details text if desired */}
                  <div className="text-xs text-gray-500 font-sans mt-2">
                    {nights} night{nights > 1 ? 's' : ''}, {guests.rooms} room
                    {guests.rooms > 1 ? 's' : ''}
                  </div>
                </CardHeader>
                <CardFooter>
                  {/* EXACT COLOR bg-amber-600 */}
                  <Button className="w-full bg-amber-600 hover:bg-amber-500 text-black text-white ">
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Rooms
