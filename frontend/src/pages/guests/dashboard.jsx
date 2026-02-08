import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom' // 1. Added useSearchParams
import WebApp from '../../layouts/webApp'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Bed, Check, Loader2, ShoppingCart } from 'lucide-react'
import BookingBar from '../../components/web/bookingBar'
import { addDays, differenceInCalendarDays } from 'date-fns'
import { roomAPI } from '../../api/roomAPI'
import { useCart } from '../../context/CartContext'

function Dashboard() {
  const navigate = useNavigate()
  const { addToCart, cartItems, totalRooms } = useCart()

  // 2. Search Params Hook
  const [searchParams] = useSearchParams()

  // Search State
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  })
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 })

  const [results, setResults] = useState([]) // Raw API Data
  const [filteredResults, setFilteredResults] = useState([]) // 3. Filtered Data for Display

  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Fetch logic
  const handleSearch = async () => {
    setLoading(true)
    setHasSearched(true)
    try {
      const params = {
        from: date.from.toISOString(),
        to: date.to.toISOString(),
        adults: guests.adults,
        children: guests.children,
        rooms_count: guests.rooms,
      }
      const { data } = await roomAPI.search(params)
      setResults(data)
      setFilteredResults(data) // Initially show all results
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

  // 4. THE FILTER LOGIC (Listens to URL ?search=...)
  useEffect(() => {
    const query = searchParams.get('search') // Get query from URL

    if (query && results.length > 0) {
      const lowerQuery = query.toLowerCase()

      const filtered = results.filter(
        (room) =>
          // Filter by Type, Description, or Price
          room.type.toLowerCase().includes(lowerQuery) ||
          room.description?.toLowerCase().includes(lowerQuery) ||
          room.price.toString().includes(lowerQuery),
      )

      setFilteredResults(filtered)
    } else {
      // If no search query, reset to full list
      setFilteredResults(results)
    }
  }, [searchParams, results]) // Run when URL changes or new Data arrives

  // Helper
  const nights = differenceInCalendarDays(date.to, date.from) || 1
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <WebApp>
      <div className="flex w-full px-4 sm:px-10 lg:px-20 flex-col pb-24">
        {' '}
        {/* Extra padding for footer */}
        <div className="my-10">
          <h1 className="text-3xl font-extrabold mb-2 text-[#333] font-serif">
            AVAILABLE ROOMS
          </h1>
          <p className="text-neutral-600 font-sans">
            Staying for{' '}
            <span className="font-bold text-orange-600">
              {nights} Night{nights > 1 ? 's' : ''}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-10 my-6 ">
          <BookingBar
            date={date}
            setDate={setDate}
            guests={guests}
            setGuests={setGuests}
            onSearch={handleSearch}
          />
        </div>
        <div className="flex flex-col gap-10 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-orange-500">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
            </div>
          ) : filteredResults.length === 0 && hasSearched ? (
            // 5. Updated "No Results" message to reflect search
            <div className="text-center py-20 text-gray-500">
              {searchParams.get('search')
                ? `No rooms match "${searchParams.get('search')}"`
                : 'No rooms available for these dates'}
            </div>
          ) : (
            // 6. Map over filteredResults instead of results
            filteredResults.map((roomType) => {
              const totalPrice = roomType.price * nights * guests.rooms

              return (
                <Card
                  key={roomType._id}
                  className="flex flex-col sm:flex-row w-full overflow-hidden shadow-xl border-none bg-white py-0 group"
                >
                  <div className="w-full sm:w-[40%] relative overflow-hidden">
                    <img
                      src={
                        roomType.image || 'https://via.placeholder.com/600x400'
                      }
                      className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-700"
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-[60%] p-5 sm:p-8 justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-2xl font-bold text-[#333] font-serif">
                          {roomType.type}
                        </CardTitle>
                        <div className="hidden sm:block text-right">
                          <p className="text-2xl font-bold text-orange-600">
                            {formatPrice(totalPrice)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Total for {nights} Night{nights > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {roomType.description}
                      </p>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={() => {
                          addToCart(roomType, 1, {
                            from: date.from,
                            to: date.to,
                            adults: guests.adults,
                            children: guests.children,
                          })
                        }}
                        className="w-full sm:w-auto text-white bg-orange-500 hover:bg-orange-600 font-bold uppercase tracking-widest px-8 rounded-full shadow-lg"
                      >
                        Add to Booking
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
        {/* Sticky Footer */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 px-8 z-50 flex justify-between items-center animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full text-orange-600 relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalRooms}
                </span>
              </div>
              <div>
                <p className="font-bold text-gray-800">
                  {totalRooms} Room(s) Selected
                </p>
                <p
                  className="text-sm text-gray-500 cursor-pointer hover:underline"
                  onClick={() => navigate('/guests/checkout')}
                >
                  Review Booking
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/guests/checkout')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-6 text-lg rounded-full shadow-lg"
            >
              Checkout Now
            </Button>
          </div>
        )}
      </div>
    </WebApp>
  )
}

export default Dashboard
