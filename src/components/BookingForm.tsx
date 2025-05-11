
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
  const navigate = useNavigate();
  const { toast } = useToast();

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
            <p className="font-medium">
              {flight.departureCity} ({flight.departureAirport})
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">To</p>
            <p className="font-medium">
              {flight.arrivalCity} ({flight.arrivalAirport})
            </p>
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
            <span className="font-bold text-primary">
              {formatCurrency(flight.currentPrice)}
            </span>
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
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
