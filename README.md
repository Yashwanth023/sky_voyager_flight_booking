# SkyVoyager - Flight Booking Platform

SkyVoyager is a comprehensive flight booking application designed for the Indian market. The platform offers dynamic pricing, secure booking, and an intuitive user interface for customers.

![SkyVoyager Screenshot](https://i.ibb.co/5KSJPH4/skyvoyager-screenshot.jpg)

## Features

### Core Features
- **Dynamic Flight Search**: Find flights between cities with intuitive search functionality
- **Real-time Dynamic Pricing**: Flight prices increase by 10% based on demand (view count)
- **Secure Booking System**: Complete booking flow with passenger information
- **Digital Boarding Passes**: Generate and download PDF tickets with flight details
- **Booking Management**: View and manage all your bookings in one place
- **Virtual Wallet**: Track expenses with an integrated wallet system
- **Amadeus Airport API Integration**: Real airport data through Amadeus API (simulated)

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Choose your preferred viewing experience
- **Real-time Notifications**: Get updates on bookings and price changes
- **Flight Details**: Comprehensive information including duration, stops, and more

## Technical Implementation

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: React Router v6 for navigation
- **State Management**: React hooks and context for local state
- **UI Components**: Shadcn UI component library with Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Toast notifications using Sonner

### Data Management
- **Storage**: LocalStorage for persistent data (simulated backend)
- **PDF Generation**: Client-side PDF generation using jsPDF and HTML2Canvas
- **QR Codes**: Boarding pass QR codes with React QR Code

### Features Implementation
1. **Dynamic Pricing Algorithm**
   - Price increases by 10% when a flight is viewed multiple times
   - Simulates real-world demand-based pricing
   - Resets after certain time periods

2. **Amadeus API Integration**
   - Fetches airport information (simulated)
   - Provides detailed airport and city information
   - Cached for performance optimization

3. **PDF Ticket Generation**
   - Generates professional-looking e-tickets
   - Includes flight details, passenger information, and QR code
   - Downloadable for offline access

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd skyvoyager

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Demo Accounts

For testing purposes, you can use the following demo login:

- **Admin Access**
  - Email: admin@skyvoyager.com
  - Password: Any password will work (for demo purposes)

- **User Access**
  - Email: user@example.com
  - Password: Any password will work (for demo purposes)

## User Guide

### Booking a Flight
1. On the homepage, select departure and destination airports
2. Choose your travel date
3. Click "Search Flights" to see available options
4. Browse the results and select your preferred flight
5. Enter passenger details and confirm booking
6. Download your e-ticket as PDF

### Managing Bookings
1. Navigate to "My Bookings" in the navigation menu
2. View all your current and past bookings
3. Access e-tickets for confirmed bookings
4. Cancel bookings if needed (70% refund policy applies)

### Wallet System
- Initial balance: ₹50,000 (demo)
- Flight bookings automatically deduct from wallet
- Cancelled bookings refund 70% of the ticket price
- Transaction history available in the wallet section

## Future Enhancements

- **Live Flight Tracking**: Real-time updates on flight status
- **Seat Selection**: Interactive seat map for choosing seats
- **Multi-city Booking**: Support for complex itineraries
- **Frequent Flyer Program**: Loyalty rewards system
- **Mobile App**: Native mobile applications for iOS and Android
- **Payment Gateway Integration**: Support for multiple payment methods
- **Email Notifications**: Automated email confirmations and updates

## Technical Architecture

The application follows a component-based architecture with the following structure:

```
src/
├── components/      # Reusable UI components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API and data services
├── types/           # TypeScript interfaces
└── utils/           # Utility functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Icons from Lucide React
- UI components from shadcn/ui
- PDF generation with jsPDF
