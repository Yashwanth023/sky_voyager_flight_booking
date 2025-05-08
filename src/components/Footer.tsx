
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-full bg-primary"></div>
                <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                SkyVoyager
              </span>
            </Link>
            <p className="text-muted-foreground">
              Book flights easily with our dynamic pricing platform. Travel smart, travel with SkyVoyager.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-muted-foreground hover:text-primary transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Airlines</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">SkyVoyager Airlines</li>
              <li className="text-muted-foreground">AeroSwift</li>
              <li className="text-muted-foreground">CloudCruise</li>
              <li className="text-muted-foreground">ZenithAir</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">support@skyvoyager.com</li>
              <li className="text-muted-foreground">+91 12345 67890</li>
              <li className="text-muted-foreground">
                123 Aviation Blvd, Mumbai, India
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} SkyVoyager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
