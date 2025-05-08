
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Flight } from "@/services/flightService";

interface FlightCardProps {
  flight: Flight;
  onSelect: () => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  // Calculate price difference percentage if there is a price increase
  const priceIncrease = flight.currentPrice > flight.basePrice;
  const priceDiff = priceIncrease
    ? Math.round(((flight.currentPrice - flight.basePrice) / flight.basePrice) * 100)
    : 0;

  // Format price in Indian Rupees
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden border border-border">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4">
          {/* Airline */}
          <div className="flex items-center space-x-3 md:col-span-1">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <div className="text-lg font-bold text-primary">
                {flight.airline.code}
              </div>
            </div>
            <div>
              <p className="font-medium text-sm">{flight.airline.name}</p>
              <p className="text-xs text-muted-foreground">{flight.id}</p>
            </div>
          </div>

          {/* Departure */}
          <div className="md:col-span-1 text-center md:text-left">
            <p className="text-lg font-bold">{flight.departureTime}</p>
            <p className="text-sm truncate">{flight.departureCity}</p>
            <p className="text-xs text-muted-foreground">{flight.departureAirport}</p>
          </div>

          {/* Flight Duration */}
          <div className="md:col-span-1 flex items-center justify-center flex-col">
            <p className="text-xs text-muted-foreground">{flight.duration}</p>
            <div className="w-full flex items-center my-1">
              <div className="h-0.5 flex-grow bg-border rounded-full"></div>
              <div className="mx-1">
                {flight.stops === 0 ? (
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                    Direct
                  </span>
                ) : (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {flight.stops} stop
                  </span>
                )}
              </div>
              <div className="h-0.5 flex-grow bg-border rounded-full"></div>
            </div>
          </div>

          {/* Arrival */}
          <div className="md:col-span-1 text-center md:text-left">
            <p className="text-lg font-bold">{flight.arrivalTime}</p>
            <p className="text-sm truncate">{flight.arrivalCity}</p>
            <p className="text-xs text-muted-foreground">{flight.arrivalAirport}</p>
          </div>

          {/* Price */}
          <div className="md:col-span-1 flex flex-col items-center md:items-end">
            <p className="text-lg font-bold text-primary">
              {formatCurrency(flight.currentPrice)}
            </p>
            {priceIncrease && (
              <p className="text-xs text-destructive">
                +{priceDiff}% increase
              </p>
            )}
            <p className="text-xs text-muted-foreground">per passenger</p>
          </div>

          {/* Book Button */}
          <div className="md:col-span-1 flex items-center justify-center md:justify-end">
            <Button onClick={onSelect} className="w-full md:w-auto">
              Select
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
