
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { BookingDetails as BookingType, getBookingById, cancelBooking } from "@/services/flightService";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdfGenerator";
import { Ticket } from "lucide-react";

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    // Short delay to simulate API call
    setTimeout(() => {
      const fetchedBooking = getBookingById(id);
      
      if (!fetchedBooking) {
        toast({
          title: "Error",
          description: "Could not find booking details",
          variant: "destructive",
        });
        navigate("/bookings");
        return;
      }
      
      setBooking(fetchedBooking);
      setLoading(false);
    }, 500);
  }, [id, navigate, toast]);

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

  const handleCancelBooking = () => {
    if (!booking || booking.status === "cancelled") return;
    
    setIsCancelling(true);
    
    try {
      const cancelled = cancelBooking(booking.id);
      
      if (cancelled) {
        toast({
          title: "Booking cancelled",
          description: "Your booking has been cancelled and a refund has been processed.",
        });
        
        // Refresh booking details
        const updatedBooking = getBookingById(booking.id);
        if (updatedBooking) {
          setBooking(updatedBooking);
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

  const handleDownloadTicket = async () => {
    if (!booking || booking.status !== "confirmed") return;
    
    try {
      await generatePDF(booking.id, "ticket-container");
      
      toast({
        title: "Success",
        description: "Your ticket has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            className="mb-4"
            onClick={() => navigate("/bookings")}
          >
            &larr; Back to My Bookings
          </Button>
          <h1 className="text-3xl font-bold">Booking Details</h1>
        </div>

        {loading ? (
          <div className="max-w-3xl mx-auto rounded-lg border border-border p-6 space-y-6">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-48 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
            <Skeleton className="h-32 w-full rounded-md" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        ) : booking ? (
          <>
            <div className="max-w-3xl mx-auto rounded-lg border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {booking.flight.departureCity} to {booking.flight.arrivalCity}
                    </h2>
                    <p className="text-muted-foreground">
                      {formatDate(booking.flight.departureDate)}
                    </p>
                  </div>
                  <Badge variant={booking.status === "confirmed" ? "default" : "destructive"} className="text-sm">
                    {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                    <p className="font-medium">{booking.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">PNR</p>
                    <p className="font-medium">{booking.pnr}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Booking Date</p>
                    <p className="font-medium">{formatDate(booking.bookingDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Flight</p>
                    <p className="font-medium">
                      {booking.flight.airline.name} ({booking.flight.id})
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-3">Flight Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex space-x-3">
                      <div className="min-w-[60px] text-center">
                        <p className="font-bold">{booking.flight.departureTime}</p>
                        <p className="text-xs text-muted-foreground">{booking.flight.departureDate}</p>
                      </div>
                      <div>
                        <p className="font-medium">{booking.flight.departureCity}</p>
                        <p className="text-sm text-muted-foreground">{booking.flight.departureAirport}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <div className="min-w-[60px] text-center">
                        <p className="font-bold">{booking.flight.arrivalTime}</p>
                        <p className="text-xs text-muted-foreground">{booking.flight.arrivalDate}</p>
                      </div>
                      <div>
                        <p className="font-medium">{booking.flight.arrivalCity}</p>
                        <p className="text-sm text-muted-foreground">{booking.flight.arrivalAirport}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-medium">{booking.flight.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Stops</p>
                      <p className="font-medium">
                        {booking.flight.stops === 0 ? "Direct" : `${booking.flight.stops} stop`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-3">Passenger Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Name</p>
                      <p className="font-medium">{booking.passengerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Seat</p>
                      <p className="font-medium">{booking.seatNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium">{booking.passengerEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(booking.flight.currentPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-muted/20 border-t border-border flex flex-wrap gap-3 justify-end">
                {booking.status === "confirmed" && (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleDownloadTicket}
                    >
                      <Ticket className="h-4 w-4" />
                      Download Ticket
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleCancelBooking} 
                      disabled={isCancelling}
                    >
                      {isCancelling ? "Processing..." : "Cancel Booking"}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Hidden ticket template for PDF generation */}
            <div className="hidden">
              <div id="ticket-container" ref={ticketRef} className="p-8 bg-white">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                      <span className="font-bold">SV</span>
                    </div>
                    <h1 className="text-2xl font-bold text-primary">SkyVoyager</h1>
                  </div>
                  <div>
                    <p className="text-xl">E-Ticket / Boarding Pass</p>
                    <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">
                      {booking.flight.departureCity} to {booking.flight.arrivalCity}
                    </h2>
                    <div>
                      <p className="font-bold text-primary">PNR: {booking.pnr}</p>
                      <p>Status: {booking.status.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <h3 className="font-bold mb-2 border-b pb-2">Flight Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Airline</p>
                        <p className="font-bold">{booking.flight.airline.name}</p>
                        <p className="text-sm">{booking.flight.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-bold">{formatDate(booking.flight.departureDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Departure</p>
                        <p className="font-bold">{booking.flight.departureTime}</p>
                        <p className="text-sm">{booking.flight.departureAirport}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Arrival</p>
                        <p className="font-bold">{booking.flight.arrivalTime}</p>
                        <p className="text-sm">{booking.flight.arrivalAirport}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-bold">{booking.flight.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Stops</p>
                        <p className="font-bold">
                          {booking.flight.stops === 0 ? "Direct" : `${booking.flight.stops} stop`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-bold mb-2 border-b pb-2">Passenger Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-bold">{booking.passengerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Seat</p>
                        <p className="font-bold">{booking.seatNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-bold">{booking.passengerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Booking Date</p>
                        <p className="font-bold">{formatDate(booking.bookingDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid:</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(booking.flight.currentPrice)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Thank you for flying with SkyVoyager!</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">Booking not found</h2>
            <p className="text-muted-foreground mb-6">
              Sorry, we couldn't find the booking you're looking for.
            </p>
            <Button onClick={() => navigate("/bookings")}>View All Bookings</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingDetails;
