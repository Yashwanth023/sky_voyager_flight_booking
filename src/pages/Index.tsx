
import { Layout } from "@/components/Layout";
import { FlightSearchForm } from "@/components/FlightSearchForm";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { initializeAirportData } from "@/services/flightService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Plane, Shield, Star, Wallet } from "lucide-react";

const Index = () => {
  // Initialize airport data on component mount
  useEffect(() => {
    initializeAirportData();
  }, []);

  // Testimonials data
  const testimonials = [
    {
      name: "Priya Singh",
      role: "Frequent Traveler",
      comment: "SkyVoyager has transformed my travel experience! The dynamic pricing helped me save money on my trips.",
      rating: 5,
    },
    {
      name: "Rahul Sharma",
      role: "Business Traveler",
      comment: "The booking process is quick and the PDF tickets are so convenient for my business trips.",
      rating: 4,
    },
    {
      name: "Ananya Patel",
      role: "Family Vacation",
      comment: "Booking flights for my entire family was a breeze. Great service and amazing deals!",
      rating: 5,
    },
  ];

  // Popular destinations with better images
  const popularDestinations = [
    {
      city: "New Delhi",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      code: "DEL",
      description: "Explore the historical capital",
    },
    {
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      code: "BOM",
      description: "The city that never sleeps",
    },
    {
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1590892451707-fc9a0b0ec6a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      code: "BLR",
      description: "India's tech capital",
    },
    {
      city: "Kolkata",
      image: "https://images.unsplash.com/photo-1558431382-27e303142255?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      code: "CCU",
      description: "Cultural hub of the east",
    },
    {
      city: "Chennai",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      code: "MAA",
      description: "Gateway to South India",
    },
    {
      city: "Jaipur",
      image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      code: "JAI",
      description: "The Pink City",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Enhanced Hero Section with improved animations and overlay */}
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1576811040780-f0e9d6dfa244?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
              height: "80vh",
            }}
          ></div>

          <div className="relative h-[80vh] flex items-center justify-center text-white px-4">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full text-primary-foreground mb-4 animate-fade-in">
                #1 Flight Booking Platform in India
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                Discover India with <span className="text-primary animate-pulse">SkyVoyager</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto animate-slide-in">
                Find the best deals on flights across India with our dynamic pricing system
                and enjoy a seamless booking experience
              </p>
              <div className="flex flex-wrap justify-center gap-4 animate-slide-in">
                <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Book Now <ChevronRight className="h-4 w-4 animate-pulse" />
                </Button>
                <Button size="lg" variant="outline" className="bg-background/20 backdrop-blur-sm border-white text-white hover:bg-white hover:text-foreground transition-colors hover:scale-105">
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          <div className="relative -mt-32 px-4 container max-w-6xl mx-auto">
            <div className="bg-background/95 backdrop-blur-md rounded-xl p-4 md:p-8 shadow-xl border border-border animate-slide-in hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Search for Flights
              </h2>
              <FlightSearchForm />
            </div>
          </div>
        </section>

        {/* Features Section - Improved with animations and hover effects */}
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <span className="text-primary font-semibold">WHY CHOOSE US</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                The SkyVoyager Advantage
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card border border-border p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Plane className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dynamic Pricing</h3>
                <p className="text-muted-foreground">
                  Our unique dynamic pricing model ensures you get the best rates
                  based on real-time demand. Book early for the best deals!
                </p>
              </div>

              <div className="bg-card border border-border p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Your transactions are secure with our integrated wallet system.
                  Track all your bookings and expenses in one place.
                </p>
              </div>

              <div className="bg-card border border-border p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
                <p className="text-muted-foreground">
                  Our dedicated support team is available 24/7 to assist you with any queries
                  regarding your bookings or travel plans.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="px-8 bg-primary hover:bg-primary/90 hover:shadow-lg transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href="#destinations">Explore Destinations</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Popular Destinations - Enhanced Carousel */}
        <section id="destinations" className="py-24 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <span className="text-primary font-semibold">EXPLORE INDIA</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                Popular Destinations
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the most sought-after destinations across India and book your next adventure with SkyVoyager's exclusive deals.
              </p>
            </div>

            <div className="max-w-5xl mx-auto animate-slide-in">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {popularDestinations.map((destination, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="relative h-60 overflow-hidden">
                            <img
                              src={destination.image}
                              alt={destination.city}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                              <span className="bg-primary/80 text-primary-foreground text-xs font-medium py-1 px-2 rounded-full w-fit mb-2">
                                {destination.code}
                              </span>
                              <h3 className="text-white text-xl font-bold mb-1">
                                {destination.city}
                              </h3>
                              <p className="text-white/80 text-sm">
                                {destination.description}
                              </p>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <Button variant="outline" className="w-full hover:bg-primary hover:text-white transition-colors">
                              Explore Flights
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-4 gap-2">
                  <CarouselPrevious className="relative inset-0 translate-y-0 hover:scale-110 transition-transform" />
                  <CarouselNext className="relative inset-0 translate-y-0 hover:scale-110 transition-transform" />
                </div>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Enhanced with animations */}
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <span className="text-primary font-semibold">TESTIMONIALS</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                What Our Customers Say
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating
                              ? "text-yellow-500 fill-yellow-500 animate-pulse"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="italic text-muted-foreground flex-grow">"{testimonial.comment}"</p>
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section - Enhanced with animation */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto bg-primary/10 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-in">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none animate-pulse"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Get Exclusive Flight Deals
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Subscribe to our newsletter and be the first to know about special offers, new destinations and travel tips.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
