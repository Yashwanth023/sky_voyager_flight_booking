
# SkyVoyager - Flight Booking Platform

SkyVoyager is a comprehensive flight booking application designed specifically for the Indian market. The platform offers dynamic pricing, secure booking, and an intuitive user interface for both customers and administrators.

## Features

### User Features
- **Account Management**: User registration and login with role-based access control
- **Flight Search**: Powerful search functionality with origin, destination, and date filters
- **Dynamic Pricing**: Real-time pricing based on demand and availability
- **Seat Selection**: Interactive seat map for selecting preferred seating
- **Booking Management**: View, modify, and cancel bookings
- **Digital Boarding Pass**: Generate and download boarding passes with QR codes
- **Wallet System**: Securely manage payments and transactions within the app

### Admin Features
- **User Management**: Create, view, and manage user accounts
- **Destination Management**: Add, edit, and remove destinations from the system
- **Booking Approval**: Review and approve booking requests from users
- **Analytics Dashboard**: Track bookings, revenue, and popular routes (coming soon)

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router
- **State Management**: React Query, Context API
- **PDF Generation**: jsPDF for boarding passes and tickets
- **QR Code Generation**: React QR Code

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

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

For testing purposes, you can use the following demo accounts:

- **Admin Access**
  - Email: admin@skyvoyager.com
  - Password: Any password will work (for demo purposes)

- **User Access**
  - Email: user@example.com
  - Password: Any password will work (for demo purposes)

## Project Structure

```
src/
├── components/      # Reusable UI components
├── context/         # React Context for state management
├── hooks/           # Custom React hooks
├── pages/           # Page components
│   ├── admin/       # Admin-specific pages
│   └── ...          # User-facing pages
├── services/        # API and business logic
├── types/           # TypeScript interfaces and types
└── utils/           # Utility functions
```

## Future Enhancements

- Integration with real payment gateways
- Email notifications for booking confirmations
- Flight status updates and notifications
- Mobile app versions
- Integration with loyalty programs
- Multi-language support


## License

This project is licensed under the MIT License - see the LICENSE file for details.
