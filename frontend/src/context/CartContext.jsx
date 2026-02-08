import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  // 1. State for Cart Items
  const [cartItems, setCartItems] = useState([])

  // 2. State for Booking Details (Dates & Guests)
  // We store this here so it persists across pages
  const [bookingParams, setBookingParams] = useState({
    from: null,
    to: null,
    adults: 1,
    children: 0,
  })

  // Load cart from localStorage on mount (Optional persistence)
  useEffect(() => {
    const savedCart = localStorage.getItem('hotel_cart')
    if (savedCart) setCartItems(JSON.parse(savedCart))
  }, [])

  useEffect(() => {
    localStorage.setItem('hotel_cart', JSON.stringify(cartItems))
  }, [cartItems])

  // --- ACTIONS ---

  const addToCart = (roomType, quantity, currentParams) => {
    // Check if dates match existing cart (Simple validation)
    if (
      cartItems.length > 0 &&
      bookingParams.from &&
      new Date(currentParams.from).getTime() !==
        new Date(bookingParams.from).getTime()
    ) {
      if (
        !window.confirm(
          'Changing dates will clear your current cart. Continue?',
        )
      )
        return
      clearCart()
    }

    setBookingParams(currentParams)

    setCartItems((prev) => {
      // Check if item already exists, just update quantity
      const existing = prev.find((item) => item._id === roomType._id)
      if (existing) {
        return prev.map((item) =>
          item._id === roomType._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      // Add new item
      return [...prev, { ...roomType, quantity }]
    })
  }

  const removeFromCart = (roomId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== roomId))
  }

  const clearCart = () => {
    setCartItems([])
    setBookingParams({ from: null, to: null, adults: 1, children: 0 })
  }

  const totalRooms = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  ) // Base price (per night calc happens in checkout)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        bookingParams,
        addToCart,
        removeFromCart,
        clearCart,
        totalRooms,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
