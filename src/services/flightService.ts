
// Services to handle flight data and operations

import { toast } from "sonner";
import { initializeAirportsFromApi } from "./amadeusService";

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  code: string;
  name: string;
  logo: string;
}

export interface FlightPrice {
  flightId: string;
  basePrice: number;
  currentPrice: number;
  lastViewed?: number;
  viewCount: number;
}

export interface FlightDetails {
  id: string;
  airline: Airline;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  aircraft: string;
}

export interface Flight {
  id: string;
  airline: Airline;
  departureAirport: string;
  departureCity: string;
  arrivalAirport: string;
  arrivalCity: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  basePrice: number;
  currentPrice: number;
  lastViewed?: number;
  viewCount: number;
}

export interface BookingDetails {
  id: string;
  flightId: string;
  flight: Flight;
  passengerName: string;
  passengerEmail: string;
  bookingDate: string;
  seatNumber: string;
  status: "confirmed" | "cancelled";
  pnr: string;
}

// Airlines available in the system
const airlines: Airline[] = [
  { code: "SV", name: "SkyVoyager Airlines", logo: "/logos/skyvoyager.png" },
  { code: "AS", name: "AeroSwift", logo: "/logos/aeroswift.png" },
  { code: "CC", name: "CloudCruise", logo: "/logos/cloudcruise.png" },
  { code: "ZA", name: "ZenithAir", logo: "/logos/zenithair.png" }
];

// Generate a random flight ID
const generateFlightId = () => {
  const airline = airlines[Math.floor(Math.random() * airlines.length)];
  const numbers = Math.floor(1000 + Math.random() * 9000).toString();
  return `${airline.code}${numbers}`;
};

// Generate a random time (HH:MM)
const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minutes = ['00', '15', '30', '45'][Math.floor(Math.random() * 4)];
  return `${hours}:${minutes}`;
};

// Calculate duration between two times (returns string like "2h 15m")
const calculateDuration = (departureTime: string, arrivalTime: string) => {
  const [depHours, depMinutes] = departureTime.split(':').map(Number);
  let [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
  
  // Adjust if arrival is next day
  if (arrHours < depHours || (arrHours === depHours && arrMinutes < depMinutes)) {
    arrHours += 24;
  }
  
  const durationMinutes = (arrHours - depHours) * 60 + (arrMinutes - depMinutes);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};

// Generate a random price between ₹2,000 and ₹3,000
const generateRandomPrice = () => {
  return Math.floor(2000 + Math.random() * 1000);
};

// Search flights based on criteria
export const searchFlights = (
  departureAirport: string,
  arrivalAirport: string,
  departureDate: string
): Flight[] => {
  // Get airport details
  const airportData = localStorage.getItem("airportData");
  let airports: Airport[] = [];
  if (airportData) {
    airports = JSON.parse(airportData);
  }

  const departureAirportDetails = airports.find(airport => airport.code === departureAirport);
  const arrivalAirportDetails = airports.find(airport => airport.code === arrivalAirport);

  if (!departureAirportDetails || !arrivalAirportDetails) {
    console.error("Airport details not found");
    return [];
  }

  // Check for existing flights in localStorage
  const existingFlightsData = localStorage.getItem(`flights_${departureAirport}_${arrivalAirport}_${departureDate}`);
  
  if (existingFlightsData) {
    // If we have cached flights, return them
    return updateFlightPricing(JSON.parse(existingFlightsData));
  }

  // Generate new flights if none exist
  const flights: Flight[] = [];
  
  // Generate 10 flights
  for (let i = 0; i < 10; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const departureTime = generateRandomTime();
    const arrivalTime = generateRandomTime();
    const duration = calculateDuration(departureTime, arrivalTime);
    const basePrice = generateRandomPrice();
    
    const flight: Flight = {
      id: generateFlightId(),
      airline: airline,
      departureAirport: departureAirport,
      departureCity: departureAirportDetails.city,
      arrivalAirport: arrivalAirport,
      arrivalCity: arrivalAirportDetails.city,
      departureDate,
      departureTime,
      arrivalDate: departureDate, // Assume same day for simplicity
      arrivalTime,
      duration,
      stops: Math.floor(Math.random() * 2), // 0 or 1 stops
      basePrice,
      currentPrice: basePrice,
      viewCount: 0
    };
    
    flights.push(flight);
  }

  // Sort flights by departure time
  flights.sort((a, b) => {
    return a.departureTime.localeCompare(b.departureTime);
  });

  // Save generated flights to localStorage
  localStorage.setItem(
    `flights_${departureAirport}_${arrivalAirport}_${departureDate}`,
    JSON.stringify(flights)
  );

  return flights;
};

// Update flight pricing based on views
export const updateFlightPricing = (flights: Flight[]): Flight[] => {
  return flights.map(flight => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    const tenMinutesAgo = now - 10 * 60 * 1000;
    
    // If this is the first view or it was viewed more than 10 minutes ago, reset
    if (!flight.lastViewed || flight.lastViewed < tenMinutesAgo) {
      return {
        ...flight,
        currentPrice: flight.basePrice,
        lastViewed: now,
        viewCount: 1
      };
    }
    
    // If viewed within last 5 minutes, increment view count
    if (flight.lastViewed >= fiveMinutesAgo) {
      const newViewCount = flight.viewCount + 1;
      
      // Apply 10% increase after 3 views - DYNAMIC PRICING IMPLEMENTATION
      if (newViewCount >= 3) {
        // Only show toast if price has actually increased
        if (flight.currentPrice === flight.basePrice) {
          return {
            ...flight,
            currentPrice: Math.floor(flight.basePrice * 1.1), // 10% increase
            lastViewed: now,
            viewCount: newViewCount
          };
        }
      }
      
      return {
        ...flight,
        lastViewed: now,
        viewCount: newViewCount
      };
    }
    
    // If viewed between 5 and 10 minutes ago, just update last viewed time
    return {
      ...flight,
      lastViewed: now
    };
  });
};

// Save flight updates to localStorage
export const saveFlightUpdates = (
  departureAirport: string,
  arrivalAirport: string,
  departureDate: string,
  flights: Flight[]
) => {
  localStorage.setItem(
    `flights_${departureAirport}_${arrivalAirport}_${departureDate}`,
    JSON.stringify(flights)
  );
};

// Get flight details by ID
export const getFlightById = (
  departureAirport: string,
  arrivalAirport: string,
  departureDate: string,
  flightId: string
): Flight | null => {
  const flightsData = localStorage.getItem(`flights_${departureAirport}_${arrivalAirport}_${departureDate}`);
  
  if (!flightsData) {
    return null;
  }
  
  const flights = JSON.parse(flightsData);
  const flight = flights.find((f: Flight) => f.id === flightId);
  
  if (!flight) {
    return null;
  }
  
  // Update view count and pricing
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  const tenMinutesAgo = now - 10 * 60 * 1000;
  
  let updatedFlight = { ...flight };
  
  // If this is the first view or it was viewed more than 10 minutes ago, reset
  if (!flight.lastViewed || flight.lastViewed < tenMinutesAgo) {
    updatedFlight = {
      ...flight,
      currentPrice: flight.basePrice,
      lastViewed: now,
      viewCount: 1
    };
  } 
  // If viewed within last 5 minutes, increment view count
  else if (flight.lastViewed >= fiveMinutesAgo) {
    const newViewCount = flight.viewCount + 1;
    
    // Apply 10% increase after 3 views - DYNAMIC PRICING IMPLEMENTATION
    if (newViewCount >= 3 && updatedFlight.currentPrice === updatedFlight.basePrice) {
      updatedFlight = {
        ...flight,
        currentPrice: Math.floor(flight.basePrice * 1.1), // Exact 10% increase
        lastViewed: now,
        viewCount: newViewCount
      };
      // Notify user about price increase
      toast(`Price increased by 10% due to high demand!`, {
        description: `This flight has been viewed multiple times recently.`,
      });
    } else {
      updatedFlight = {
        ...flight,
        lastViewed: now,
        viewCount: newViewCount
      };
    }
  } 
  // If viewed between 5 and 10 minutes ago, just update last viewed time
  else {
    updatedFlight = {
      ...flight,
      lastViewed: now
    };
  }
  
  // Update flight in localStorage
  const updatedFlights = flights.map((f: Flight) => 
    f.id === flightId ? updatedFlight : f
  );
  
  localStorage.setItem(
    `flights_${departureAirport}_${arrivalAirport}_${departureDate}`,
    JSON.stringify(updatedFlights)
  );
  
  return updatedFlight;
};

// Book a flight
export const bookFlight = (
  flight: Flight,
  passengerName: string,
  passengerEmail: string
): BookingDetails => {
  // Generate PNR
  const pnr = Array.from(
    { length: 6 },
    () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
  ).join("");
  
  // Generate seat number
  const row = Math.floor(1 + Math.random() * 30);
  const seat = "ABCDEF"[Math.floor(Math.random() * 6)];
  const seatNumber = `${row}${seat}`;
  
  const booking: BookingDetails = {
    id: `BKG-${Date.now()}`,
    flightId: flight.id,
    flight,
    passengerName,
    passengerEmail,
    bookingDate: new Date().toISOString(),
    seatNumber,
    status: "confirmed",
    pnr
  };
  
  // Update wallet balance
  updateWalletBalance(-flight.currentPrice, `Flight booking: ${flight.departureCity} to ${flight.arrivalCity}`);
  
  // Save booking
  const bookingsData = localStorage.getItem("bookings");
  const bookings = bookingsData ? JSON.parse(bookingsData) : [];
  
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  
  return booking;
};

// Get all bookings
export const getBookings = (): BookingDetails[] => {
  const bookingsData = localStorage.getItem("bookings");
  return bookingsData ? JSON.parse(bookingsData) : [];
};

// Get booking by ID
export const getBookingById = (bookingId: string): BookingDetails | null => {
  const bookingsData = localStorage.getItem("bookings");
  const bookings: BookingDetails[] = bookingsData ? JSON.parse(bookingsData) : [];
  
  return bookings.find(booking => booking.id === bookingId) || null;
};

// Cancel booking
export const cancelBooking = (bookingId: string): boolean => {
  const bookingsData = localStorage.getItem("bookings");
  if (!bookingsData) return false;
  
  const bookings: BookingDetails[] = JSON.parse(bookingsData);
  const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
  
  if (bookingIndex === -1) return false;
  
  // Update booking status
  bookings[bookingIndex].status = "cancelled";
  
  // Refund 70% of the flight price
  const booking = bookings[bookingIndex];
  const refundAmount = Math.floor(booking.flight.currentPrice * 0.7);
  
  updateWalletBalance(refundAmount, `Refund for cancelled booking: ${booking.flight.departureCity} to ${booking.flight.arrivalCity}`);
  
  // Update bookings in localStorage
  localStorage.setItem("bookings", JSON.stringify(bookings));
  
  return true;
};

// Update wallet balance
export const updateWalletBalance = (amount: number, description: string) => {
  const walletData = localStorage.getItem("wallet");
  const wallet = walletData ? JSON.parse(walletData) : { balance: 50000, transactions: [] };
  
  wallet.balance += amount;
  
  // Add transaction
  wallet.transactions = [
    {
      amount: Math.abs(amount),
      type: amount < 0 ? "debit" : "credit",
      description,
      date: new Date().toISOString()
    },
    ...wallet.transactions
  ];
  
  localStorage.setItem("wallet", JSON.stringify(wallet));
};

// Initialize airport data if not already in localStorage
export const initializeAirportData = async () => {
  if (!localStorage.getItem("airportData")) {
    try {
      // Try to initialize from Amadeus API first
      const airports = await initializeAirportsFromApi();
      if (airports && airports.length > 0) {
        return airports;
      }
    } catch (error) {
      console.error("Error initializing from Amadeus API, using fallback data:", error);
    }
    
    // Fallback to static data if API fails
    const airports: Airport[] = [
      { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", country: "India" },
      { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India" },
      { code: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India" },
      { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", country: "India" },
      { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", country: "India" },
      { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India" },
      { code: "COK", name: "Cochin International Airport", city: "Kochi", country: "India" },
      { code: "PNQ", name: "Pune Airport", city: "Pune", country: "India" },
      { code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati", country: "India" },
      { code: "IXC", name: "Chandigarh Airport", city: "Chandigarh", country: "India" },
      { code: "IXB", name: "Bagdogra Airport", city: "Siliguri", country: "India" },
      { code: "PAT", name: "Jay Prakash Narayan Airport", city: "Patna", country: "India" },
      { code: "IXR", name: "Birsa Munda Airport", city: "Ranchi", country: "India" },
      { code: "IXM", name: "Madurai Airport", city: "Madurai", country: "India" },
      { code: "IXZ", name: "Veer Savarkar International Airport", city: "Port Blair", country: "India" },
    ];
    
    localStorage.setItem("airportData", JSON.stringify(airports));
    return airports;
  }
  
  return JSON.parse(localStorage.getItem("airportData") || "[]");
};
