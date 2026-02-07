import React, { useState } from 'react'
import WebApp from '../../layouts/webApp'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Bed, Check } from 'lucide-react'
import BookingBar from '../../components/web/bookingBar'
import { addDays, differenceInCalendarDays } from 'date-fns'

const rooms = [
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/components/card/image-3.png',
    name: 'Standard Room',
    price: 150,
    occupancy: '2 Adults',
    bed: '1x Queen Bed',
    ammenities: [
      'Free Wifi',
      'Air Conditioning',
      '32-inch Flat-screen TV',
      'Work Desk',
      'Coffee/Tea Maker',
      'Walk-in Shower',
      'Complimentary Water',
    ],
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/components/card/image-3.png',
    name: 'Superior Room',
    price: 220,
    occupancy: '2 Adults, 1 Child',
    bed: '1x King Bed or 2x Twin Beds',
    ammenities: [
      'City View',
      'Mini Bar',
      'Soundproofing',
      'Safety Deposit Box',
      'Bathrobes & Slippers',
      'Premium Toiletries',
    ],
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/components/card/image-3.png',
    name: 'Deluxe Rooms',
    price: 300,
    occupancy: '3 Adults',
    bed: '1x Super King Bed',
    ammenities: [
      'Private Balcony',
      'Lounge Area with Sofa',
      '55-inch 4k TV (Netflix included)',
      'Rain Shower & Bathtub',
      'Espresso Machine',
      'Ironing Facilities',
      'Welcome Fruit Basket',
    ],
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/components/card/image-3.png',
    name: 'Business Class Suite',
    price: 450,
    occupancy: '2 Adults',
    bed: '1x King Bed',
    ammenities: [
      'Separate Living Room',
      'Executive Lounge Access',
      'High-Speed Dedicated Internet',
      'Office Workstation',
      'Meeting Table (4 Pax)',
      'Airport Transfer Included',
      'Shoe Shine Service',
    ],
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/components/card/image-3.png',
    name: 'First Class Suite',
    price: 750,
    occupancy: '4 Adults',
    bed: '2x King Beds',
    ammenities: [
      'Panaromic Floor-to-Ceiling Windows',
      'Dining Area (6 Pax)',
      'Kitchenette with Microwave & Fridge',
      'Jacuzzi Tub',
      'Walk-in Closet',
      'Priority Check-in/Check-out',
      'Butler Service (On Request)',
    ],
  },
  {
    image: 'https://cdn.shadcnstudio.com/ss-assets/components/card/image-3.png',
    name: 'Presidential Suite',
    price: 1500,
    occupancy: '5 Adults',
    bed: '1x Emperor Bed + 1x King Bed',
    ammenities: [
      'Private Terrace',
      'Master Bedroom with Ensuite Sauna',
      'Private Gym Area',
      'Grand Piano',
      'Personal Chef Service',
      'Private Elevator Access',
      'Chauffeur Service 24/7',
    ],
  },
]

function Dashboard() {
  // 2. STATE LIFTED: Manage date and guests here to prevent "undefined" error
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  })

  const [guests, setGuests] = useState({
    rooms: 1,
    adults: 2,
    children: 0,
  })

  // 3. HELPER FUNCTIONS
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Calculate nights safely
  const getNights = () => {
    if (!date?.from || !date?.to) return 1
    const days = differenceInCalendarDays(date.to, date.from)
    return days > 0 ? days : 1
  }

  const nights = getNights()

  return (
    <WebApp>
      <div className="flex w-full px-4 sm:px-10 lg:px-20 flex-col pb-10">
        <div className="my-10">
          <h1 className="text-3xl font-extrabold mb-2 text-[#333] font-serif">
            ROOMS
          </h1>
          <p className="text-neutral-600 font-sans">See All Available Rooms.</p>
        </div>

        <div className="flex flex-col gap-10 my-6 ">
          {/* 4. PASS PROPS: This fixes the "Cannot read properties of undefined" error */}
          <BookingBar
            date={date}
            setDate={setDate}
            guests={guests}
            setGuests={setGuests}
            onSearch={() => console.log('Rates Updated')}
          />
        </div>

        <div className="flex flex-col gap-10">
          {rooms.map((room, index) => {
            // 5. CALCULATION: Total Price logic
            const totalPrice = room.price * nights * guests.rooms

            return (
              <Card
                key={index}
                className="flex flex-col sm:flex-row w-full overflow-hidden shadow-xl border-none bg-white py-0"
              >
                {/* Image Section */}
                <div className=" w-full sm:w-[40%] h-full sm:h-auto ">
                  <img
                    src={room.image}
                    alt={room.name}
                    className=" h-full w-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  {/* Mobile Price Badge */}
                  <div className=" bg-white/90 px-3 py-1 rounded-full text-sm font-bold shadow-sm sm:hidden">
                    {formatPrice(totalPrice)}{' '}
                    <span className="text-xs font-normal">/ total</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col w-full sm:w-[60%] p-5 sm:p-8 justify-between">
                  <div className="space-y-4">
                    {/* Header & Price */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-[#333] font-serif">
                          {room.name}
                        </CardTitle>

                        {/* Details Row */}
                        <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-gray-600 font-sans">
                          <div className="flex items-center gap-1.5 bg-[#F5F5F5] px-2.5 py-1.5 rounded-md">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span>{room.occupancy}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-[#F5F5F5] px-2.5 py-1.5 rounded-md">
                            <Bed className="w-4 h-4 text-orange-500" />
                            <span className="truncate max-w-[150px]">
                              {room.bed}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Price - UPDATED TO SHOW CALCULATED TOTAL */}
                      <div className="hidden sm:block text-right">
                        <p className="text-2xl font-bold text-orange-600">
                          {formatPrice(totalPrice)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {nights} Night{nights > 1 ? 's' : ''}, {guests.rooms}{' '}
                          Room{guests.rooms > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Amenities List */}
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">
                        Key Amenities
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {room.ammenities.slice(0, 4).map((amenity, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-gray-600 font-sans"
                          >
                            <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            <span className="truncate">{amenity}</span>
                          </div>
                        ))}
                        {room.ammenities.length > 4 && (
                          <span className="text-xs text-orange-500 font-bold pt-1 font-sans">
                            + {room.ammenities.length - 4} more amenities
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer / Action */}
                  <div className="mt-8 flex justify-end">
                    <Button className="w-full sm:w-auto text-white bg-orange-500 hover:bg-orange-600 font-bold uppercase tracking-widest px-8 rounded-full">
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </WebApp>
  )
}

export default Dashboard
