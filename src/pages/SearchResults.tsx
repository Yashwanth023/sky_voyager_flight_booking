
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { FlightCard } from "@/components/FlightCard";
import { Flight, searchFlights, saveFlightUpdates } from "@/services/flightService";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (!from || !to || !date) {
      navigate("/");
      return;
    }

    setLoading(true);
    // Short delay to simulate API call
    setTimeout(() => {
      const searchResults = searchFlights(from, to, date);
      setFlights(searchResults);
      setLoading(false);
      
      // Save updated flight pricing
      saveFlightUpdates(from, to, date, searchResults);
    }, 1000);
  }, [from, to, date, navigate]);

  const handleSelectFlight = (flightId: string) => {
    navigate(`/booking/new?from=${from}&to=${to}&date=${date}&flightId=${flightId}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Flight Search Results</h1>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(date)} · {from} to {to}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-card rounded-lg p-6 border border-border">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Skeleton className="h-12 w-24 rounded-md" />
                  <Skeleton className="h-8 w-32 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                  <Skeleton className="h-8 w-32 rounded-md" />
                  <Skeleton className="h-10 w-24 rounded-md ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {flights.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-2">No flights found</h2>
                <p className="text-muted-foreground mb-6">
                  Sorry, we couldn't find any flights matching your search criteria.
                </p>
                <Button onClick={() => navigate("/")}>Search Again</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {flights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onSelect={() => handleSelectFlight(flight.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;
