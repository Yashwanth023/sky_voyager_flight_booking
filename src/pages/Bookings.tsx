
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { getBookings, BookingDetails } from "@/services/flightService";
import { BookingCard } from "@/components/BookingCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    setLoading(true);
    // Short delay to simulate API call
    setTimeout(() => {
      const fetchedBookings = getBookings();
      setBookings(fetchedBookings);
      setLoading(false);
    }, 500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage all your flight bookings
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-6 border border-border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-8 w-56 rounded-md" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Skeleton className="h-16 w-full rounded-md" />
                  <Skeleton className="h-16 w-full rounded-md" />
                  <Skeleton className="h-16 w-full rounded-md" />
                  <Skeleton className="h-16 w-full rounded-md" />
                </div>
                <div className="flex justify-between items-center border-t pt-4 mt-4">
                  <Skeleton className="h-10 w-24 rounded-md" />
                  <Skeleton className="h-10 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {bookings.length > 0 ? (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancelled={loadBookings}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-lg border border-border">
                <h2 className="text-2xl font-semibold mb-2">No bookings yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't made any flight bookings yet. Search for flights to
                  get started on your journey!
                </p>
                <Button onClick={() => navigate("/")} size="lg">
                  Search Flights
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Bookings;
