
import { Link } from "react-router-dom";
import { BookingDetails, cancelBooking } from "@/services/flightService";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BookingCardProps {
  booking: BookingDetails;
  onCancelled?: () => void;
}

export function BookingCard({ booking, onCancelled }: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };
  
  const handleCancel = () => {
    if (booking.status === "cancelled") return;
    
    setIsCancelling(true);
    
    try {
      const cancelled = cancelBooking(booking.id);
      
      if (cancelled) {
        toast({
          title: "Booking cancelled",
          description: "Your booking has been cancelled and a refund has been processed.",
        });
        
        if (onCancelled) {
          onCancelled();
        }
      } else {
        toast({
          title: "Cancellation failed",
          description: "There was an error cancelling your booking. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description: "There was an error cancelling your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">
              {booking.flight.departureCity} to {booking.flight.arrivalCity}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(booking.flight.departureDate)}
            </p>
          </div>
          <Badge variant={booking.status === "confirmed" ? "default" : "destructive"}>
            {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Flight</p>
            <p className="font-medium">
              {booking.flight.airline.name} ({booking.flight.id})
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">PNR</p>
            <p className="font-medium">{booking.pnr}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Departure</p>
            <p className="font-medium">
              {booking.flight.departureTime} • {booking.flight.departureAirport}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Arrival</p>
            <p className="font-medium">
              {booking.flight.arrivalTime} • {booking.flight.arrivalAirport}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Passenger</p>
            <p className="font-medium">{booking.passengerName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Seat</p>
            <p className="font-medium">{booking.seatNumber}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between">
            <span className="font-medium">Amount Paid:</span>
            <span className="font-bold text-primary">
              {formatCurrency(booking.flight.currentPrice)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 p-4 flex justify-between">
        <Link to={`/booking/${booking.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        {booking.status === "confirmed" && (
          <Button 
            variant="destructive" 
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? "Processing..." : "Cancel Booking"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
