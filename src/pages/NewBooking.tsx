
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Flight, getFlightById } from "@/services/flightService";
import { BookingForm } from "@/components/BookingForm";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
    // Short delay to simulate API call
    setTimeout(() => {
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
      setLoading(false);
    }, 500);
  }, [from, to, date, flightId, navigate, toast]);

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
            <BookingForm flight={flight} />
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
