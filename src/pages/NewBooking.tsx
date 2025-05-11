
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Flight, getFlightById } from "@/services/flightService";
import { BookingForm } from "@/components/BookingForm";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FilePdf } from "lucide-react";

const NewBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const flightId = searchParams.get("flightId") || "";

  useEffect(() => {
    if (!from || !to || !date || !flightId) {
      toast({
        title: "Error",
        description: "Invalid booking parameters",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setLoading(true);
    console.log("Fetching flight data:", { from, to, date, flightId });
    
    // Short delay to simulate API call
    setTimeout(() => {
      try {
        const selectedFlight = getFlightById(from, to, date, flightId);
        
        if (!selectedFlight) {
          toast({
            title: "Error",
            description: "Could not find the selected flight",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
        
        setFlight(selectedFlight);
      } catch (error) {
        console.error("Error fetching flight:", error);
        toast({
          title: "Error",
          description: "Failed to load flight information",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [from, to, date, flightId, navigate, toast]);

  const handleDownloadSample = () => {
    if (!flight) return;
    
    // Create sample booking for demonstration
    const sampleBooking = {
      id: "SAMPLE-BOOKING",
      flightId: flight.id,
      flight: flight,
      passengerName: "Sample Passenger",
      passengerEmail: "sample@example.com",
      bookingDate: new Date().toISOString(),
      seatNumber: "12A",
      status: "confirmed" as const,
      pnr: "ABC123"
    };
    
    // Create a temporary div to render the boarding pass
    const tempDiv = document.createElement("div");
    tempDiv.id = "sample-ticket";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);
    
    // Import the PDF generator dynamically to avoid circular dependencies
    import("@/utils/pdfGenerator").then(({ generatePDF, getBookingTicketHtml }) => {
      // Set the HTML content of the div
      tempDiv.innerHTML = getBookingTicketHtml(sampleBooking);
      
      // Generate PDF from the div
      generatePDF("SAMPLE", "sample-ticket").then(() => {
        // Clean up the temporary div
        document.body.removeChild(tempDiv);
      });
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Flight</h1>
          <p className="text-muted-foreground">Complete the form below to confirm your booking</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="rounded-lg border border-border p-6 space-y-6">
              <Skeleton className="h-8 w-48 rounded-md" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
              </div>
              <Skeleton className="h-32 w-full rounded-md" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </div>
          ) : flight ? (
            <>
              <BookingForm flight={flight} />
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleDownloadSample}
                  className="flex items-center gap-2"
                >
                  <FilePdf className="h-4 w-4" />
                  <span>Sample Ticket Preview</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">Flight not found</h2>
              <p className="text-muted-foreground mb-6">
                Sorry, we couldn't find the flight you're looking for.
              </p>
              <Button onClick={() => navigate("/")}>Search Flights</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewBooking;
