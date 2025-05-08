
import { Layout } from "@/components/Layout";
import { FlightSearchForm } from "@/components/FlightSearchForm";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { initializeAirportData } from "@/services/flightService";

const Index = () => {
  // Initialize airport data on component mount
  useEffect(() => {
    initializeAirportData();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
              height: "70vh",
            }}
          ></div>

          <div className="relative h-[70vh] flex items-center justify-center text-white px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                Book Your Flight with SkyVoyager
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto animate-slide-in">
                Find the best deals on flights across India with our dynamic pricing system
              </p>
            </div>
          </div>

          <div className="relative -mt-32 px-4 container max-w-6xl mx-auto">
            <div className="bg-background/95 backdrop-blur-md rounded-xl p-4 md:p-8 shadow-xl border border-border animate-slide-in">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Search for Flights
              </h2>
              <FlightSearchForm />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose SkyVoyager?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card border border-border p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Dynamic Pricing</h3>
                <p className="text-muted-foreground">
                  Our unique dynamic pricing model ensures you get the best rates
                  based on real-time demand. Book early for the best deals!
                </p>
              </div>

              <div className="bg-card border border-border p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
                <p className="text-muted-foreground">
                  Book your flight with just a few clicks and get instant
                  confirmation. Download your e-ticket right away!
                </p>
              </div>

              <div className="bg-card border border-border p-6 rounded-lg shadow-md">
                <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Your transactions are secure with our integrated wallet system.
                  Track all your bookings and expenses in one place.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="px-8 bg-primary hover:bg-primary/90"
                asChild
              >
                <a href="#top">Book Now</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Popular Destinations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  city: "New Delhi",
                  image:
                    "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  code: "DEL",
                },
                {
                  city: "Mumbai",
                  image:
                    "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  code: "BOM",
                },
                {
                  city: "Bangalore",
                  image:
                    "https://images.unsplash.com/photo-1590892451707-fc9a0b0ec6a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  code: "BLR",
                },
                {
                  city: "Kolkata",
                  image:
                    "https://images.unsplash.com/photo-1558431382-27e303142255?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                  code: "CCU",
                },
              ].map((destination, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg shadow-lg h-64 group"
                >
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-bold mb-1">
                      {destination.city}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {destination.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
