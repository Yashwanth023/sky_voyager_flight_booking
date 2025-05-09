
import QRCode from "react-qr-code";
import { Booking } from "@/types/booking";

interface BoardingPassProps {
  booking: Booking;
}

export function BoardingPass({ booking }: BoardingPassProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-md mx-auto bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="p-6 relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Boarding Pass</h3>
              <p className="text-muted-foreground text-sm">{booking.flight.airline}</p>
            </div>
            <div className="h-10 w-10 relative">
              <div className="absolute inset-0 rounded-full bg-primary animate-pulse"></div>
              <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-primary"
                >
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-baseline">
            <div>
              <p className="text-3xl font-bold">
                {booking.flight.departureDestination.code}
              </p>
              <p className="text-sm text-muted-foreground">
                {booking.flight.departureDestination.city}
              </p>
            </div>
            <div className="flex-1 mx-4 flex flex-col items-center">
              <div className="w-full border-t border-dashed border-border"></div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatDate(booking.flight.departureTime)}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {booking.flight.arrivalDestination.code}
              </p>
              <p className="text-sm text-muted-foreground">
                {booking.flight.arrivalDestination.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-border"></div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Passenger</p>
            <p className="font-medium">{booking.passengerName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Flight</p>
            <p className="font-medium">{booking.flight.flightNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Seat</p>
            <p className="font-medium">{booking.seat ? `${booking.seat.row}${booking.seat.column}` : "---"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Boarding Time</p>
            <p className="font-medium">{formatTime(new Date(booking.flight.departureTime.getTime() - 30 * 60000))}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Departure</p>
            <p className="font-medium">{formatTime(booking.flight.departureTime)}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-border"></div>

      <div className="p-6 flex justify-between items-center bg-muted/30">
        <div>
          <p className="text-xs text-muted-foreground">Booking Reference</p>
          <p className="font-bold">{booking.id.toUpperCase().substring(0, 6)}</p>
        </div>
        <div className="bg-white p-2 rounded">
          <QRCode
            size={80}
            style={{ height: "auto", maxWidth: "100%", width: "80px" }}
            value={`SKYV-${booking.id}-${booking.passengerName}`}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>
    </div>
  );
}
