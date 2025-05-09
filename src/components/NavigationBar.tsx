
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { WalletDisplay } from "./WalletDisplay";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, LogOut, Settings, Users } from "lucide-react";

export function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full bg-primary animate-pulse"></div>
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active-nav-link" : ""}`}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/bookings"
                className={`nav-link ${
                  isActive("/bookings") ? "active-nav-link" : ""
                }`}
              >
                My Bookings
              </Link>
            )}
            
            {/* Admin Links */}
            {isAuthenticated && user?.role === "admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="nav-link">
                    Admin <span className="ml-1">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card shadow-lg border-border">
                  <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Manage Users</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/destinations")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>Destinations</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/booking-requests")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M16 12h6M8 12h2M3 12h1" />
                        <path d="M16 6h6M8 6h2M3 6h1" />
                        <path d="M16 18h6M8 18h2M3 18h1" />
                      </svg>
                      <span>Booking Requests</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <div className="flex items-center space-x-4">
              <WalletDisplay />
              <ThemeToggle />
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-sidebar-accent/50 hover:bg-sidebar-accent rounded-full">
                      <CircleUserRound className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-card shadow-lg border-border">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="default" size="sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active-nav-link" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/bookings"
                  className={`nav-link ${
                    isActive("/bookings") ? "active-nav-link" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}
              
              {/* Admin Links for Mobile */}
              {isAuthenticated && user?.role === "admin" && (
                <>
                  <div className="text-sm font-medium text-muted-foreground pb-1 pt-2 border-t border-border">
                    Admin Panel
                  </div>
                  <Link
                    to="/admin/users"
                    className="nav-link flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Manage Users</span>
                  </Link>
                  <Link
                    to="/admin/destinations"
                    className="nav-link flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Destinations</span>
                  </Link>
                  <Link
                    to="/admin/booking-requests"
                    className="nav-link flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M16 12h6M8 12h2M3 12h1" />
                      <path d="M16 6h6M8 6h2M3 6h1" />
                      <path d="M16 18h6M8 18h2M3 18h1" />
                    </svg>
                    <span>Booking Requests</span>
                  </Link>
                </>
              )}
              
              <hr className="border-border" />
              
              <div className="flex items-center justify-between">
                <WalletDisplay />
                <ThemeToggle />
              </div>
              
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={() => navigate("/login")} className="w-full">
                  Login
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
