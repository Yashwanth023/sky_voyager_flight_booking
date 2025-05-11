
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Flight, bookFlight } from "@/services/flightService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAirportDetails } from "@/services/amadeusService";
import { useState as useReactState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const bookingFormSchema = z.object({
  passengerName: z.string().min(3, "Name must be at least 3 characters"),
  passengerEmail: z.string().email("Please enter a valid email address"),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  flight: Flight;
}

export function BookingForm({ flight }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [airportDetails, setAirportDetails] = useReactState({
    departure: { name: flight.departureAirport, city: flight.departureCity },
    arrival: { name: flight.arrivalAirport, city: flight.arrivalCity }
  });
  const [loadingAirport, setLoadingAirport] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch detailed airport information from Amadeus API
  useEffect(() => {
    const fetchAirportDetails = async () => {
      setLoadingAirport(true);
      try {
        const departureDetails = await getAirportDetails(flight.departureAirport);
        const arrivalDetails = await getAirportDetails(flight.arrivalAirport);

        if (departureDetails && arrivalDetails) {
          setAirportDetails({
            departure: { 
              name: departureDetails.name, 
              city: departureDetails.cityName 
            },
            arrival: { 
              name: arrivalDetails.name, 
              city: arrivalDetails.cityName 
            }
          });
        }
      } catch (error) {
        console.error("Error fetching airport details:", error);
      } finally {
        setLoadingAirport(false);
      }
    };

    fetchAirportDetails();
  }, [flight.departureAirport, flight.arrivalAirport]);

  // Format price in Indian Rupees
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      passengerName: "",
      passengerEmail: "",
    },
  });

  const onSubmit = (values: BookingFormValues) => {
    console.log("Form submitted with values:", values);
    setIsSubmitting(true);
    
    try {
      // Book the flight
      const booking = bookFlight(
        flight,
        values.passengerName,
        values.passengerEmail
      );

      // Show success message
      toast({
        title: "Booking confirmed!",
        description: `Your booking has been confirmed. PNR: ${booking.pnr}`,
      });

      // Navigate to the booking details page
      setTimeout(() => {
        navigate(`/booking/${booking.id}`);
      }, 1000);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Calculate price difference for display
  const priceIncrease = flight.currentPrice > flight.basePrice;
  const priceDiff = priceIncrease
    ? Math.round(((flight.currentPrice - flight.basePrice) / flight.basePrice) * 100)
    : 0;

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg shadow-lg border border-border">
      <div>
        <h3 className="text-lg font-semibold mb-2">Flight Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Flight</p>
            <p className="font-medium">
              {flight.airline.name} ({flight.id})
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{flight.departureDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">From</p>
            <div className="flex flex-col">
              <p className="font-medium">
                {loadingAirport ? "Loading..." : airportDetails.departure.city} ({flight.departureAirport})
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {loadingAirport ? "Loading airport details..." : airportDetails.departure.name}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">To</p>
            <div className="flex flex-col">
              <p className="font-medium">
                {loadingAirport ? "Loading..." : airportDetails.arrival.city} ({flight.arrivalAirport})
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {loadingAirport ? "Loading airport details..." : airportDetails.arrival.name}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Departure</p>
            <p className="font-medium">{flight.departureTime}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Arrival</p>
            <p className="font-medium">{flight.arrivalTime}</p>
          </div>
        </div>
        <div className="border-t border-border pt-4">
          <div className="flex justify-between">
            <span className="font-medium">Price:</span>
            <div className="text-right">
              <span className="font-bold text-primary">
                {formatCurrency(flight.currentPrice)}
              </span>
              {priceIncrease && (
                <div className="text-xs text-destructive">
                  +{priceDiff}% increased due to high demand
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Passenger Information</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="passengerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        {...field} 
                        className="focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passengerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                        className="focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Amount
              </p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(flight.currentPrice)}
              </p>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
