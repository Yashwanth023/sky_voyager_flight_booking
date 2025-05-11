
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { BookingDetails as BookingDetailsType, getBookingById, cancelBooking } from "@/services/flightService";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, FilePdf } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { generatePDF, getBookingTicketHtml } from "@/utils/pdfGenerator";
import { getAirportDetails } from "@/services/amadeusService";

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [airportDetails, setAirportDetails] = useState({
    departure: { name: "", city: "" },
    arrival: { name: "", city: "" }
  });

  useEffect(() => {
    if (!id) {
      navigate("/bookings");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const bookingData = getBookingById(id);
      if (!bookingData) {
        toast({
          title: "Error",
          description: "Booking not found",
          variant: "destructive",
        });
        navigate("/bookings");
        return;
      }

      setBooking(bookingData);

      // Fetch detailed airport information
      const fetchAirportDetails = async () => {
        try {
          const departureDetails = await getAirportDetails(bookingData.flight.departureAirport);
          const arrivalDetails = await getAirportDetails(bookingData.flight.arrivalAirport);

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
        }
      };

      fetchAirportDetails();
      setLoading(false);
    }, 500);
  }, [id, navigate, toast]);

  const handleCancel = () => {
    if (!booking || booking.status === "cancelled") return;

    setCancelling(true);
    setTimeout(() => {
      const success = cancelBooking(booking.id);
      
      if (success) {
        // Update the local booking state
        setBooking({
          ...booking,
          status: "cancelled"
        });
        
        toast({
          title: "Booking cancelled",
          description: "A refund of 70% has been issued to your wallet",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to cancel booking. Please try again.",
          variant: "destructive",
        });
      }
      
      setCancelling(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleDownloadTicket = async () => {
    if (!booking) return;
    
    // Create a temporary div to render the boarding pass
    const tempDiv = document.createElement("div");
    tempDiv.id = "ticket-pdf";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);
    
    // Set the HTML content of the div
    tempDiv.innerHTML = getBookingTicketHtml(booking);
    
    // Generate PDF from the div
    try {
      await generatePDF(booking.id, "ticket-pdf");
      toast({
        title: "Success",
        description: "Boarding pass downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download boarding pass. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clean up the temporary div
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/bookings" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Link>
          <h1 className="text-3xl font-bold">Booking Details</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : booking ? (
          <div className="space-y-8">
            {/* Booking Status */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-card rounded-lg p-4 border border-border">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">Booking Status:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    booking.status === "confirmed" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }`}>
                    {booking.status === "confirmed" ? "Confirmed" : "Cancelled"}
                  </span>
                </div>
                <p className="text-muted-foreground">PNR: {booking.pnr}</p>
              </div>

              {booking.status === "confirmed" && (
                <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadTicket}
                    className="flex items-center gap-2"
                  >
                    <FilePdf className="h-4 w-4" />
                    Download E-Ticket
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleCancel}
                    disabled={cancelling}
                  >
                    {cancelling ? "Cancelling..." : "Cancel Booking"}
                  </Button>
                </div>
              )}
            </div>

            {/* Flight Details */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="border-b border-border p-4">
                <h2 className="text-xl font-semibold">Flight Details</h2>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {booking.flight.airline.code}
                    </div>
                    <div>
                      <p className="font-medium">{booking.flight.airline.name}</p>
                      <p className="text-sm text-muted-foreground">Flight {booking.flight.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4 md:mt-0">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formatDate(booking.flight.departureDate)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Departure */}
                  <div>
                    <p className="text-sm text-muted-foreground">Departure</p>
                    <p className="text-2xl font-bold">{booking.flight.departureTime}</p>
                    <p className="font-medium">{airportDetails.departure.city || booking.flight.departureCity}</p>
                    <p className="text-sm text-muted-foreground">{airportDetails.departure.name || booking.flight.departureAirport}</p>
                  </div>
                  
                  {/* Flight Info */}
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground mb-2">Duration</p>
                    <p className="font-medium">{booking.flight.duration}</p>
                    <div className="w-full flex items-center my-2">
                      <div className="h-0.5 flex-grow bg-border rounded-full"></div>
                      <div className="mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plane">
                          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
                        </svg>
                      </div>
                      <div className="h-0.5 flex-grow bg-border rounded-full"></div>
                    </div>
                    {booking.flight.stops === 0 ? (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full">
                        Direct Flight
                      </span>
                    ) : (
                      <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 px-2 py-1 rounded-full">
                        {booking.flight.stops} Stop
                      </span>
                    )}
                  </div>
                  
                  {/* Arrival */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Arrival</p>
                    <p className="text-2xl font-bold">{booking.flight.arrivalTime}</p>
                    <p className="font-medium">{airportDetails.arrival.city || booking.flight.arrivalCity}</p>
                    <p className="text-sm text-muted-foreground">{airportDetails.arrival.name || booking.flight.arrivalAirport}</p>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking Price</span>
                    <span>{formatCurrency(booking.flight.currentPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Passenger Info */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="border-b border-border p-4">
                <h2 className="text-xl font-semibold">Passenger Information</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Passenger Name</p>
                    <p className="font-medium">{booking.passengerName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{booking.passengerEmail}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Seat Number</p>
                    <p className="font-medium">{booking.seatNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Date</p>
                    <p className="font-medium">{formatDate(booking.bookingDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
