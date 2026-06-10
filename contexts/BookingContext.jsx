'use client';
import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <BookingContext.Provider value={{
      isOpen,
      openBooking: () => setIsOpen(true),
      closeBooking: () => setIsOpen(false),
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
