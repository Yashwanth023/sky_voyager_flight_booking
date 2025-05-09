
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Booking, BookingStatus } from "@/types/booking";
import { CheckCircle2, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Sample booking requests
const initialBookingRequests: Booking[] = [
  {
    id: "booking1",
    userId: "2",
    flight: {
      id: "flight1",
      departureDestination: {
        id: "1",
        name: "John F. Kennedy International Airport",
        code: "JFK",
        city: "New York",
        country: "United States",
      },
      arrivalDestination: {
        id: "2",
        name: "Heathrow Airport",
        code: "LHR",
        city: "London",
        country: "United Kingdom",
      },
      departureTime: new Date("2025-06-01T08:30:00Z"),
      arrivalTime: new Date("2025-06-01T20:45:00Z"),
      price: 850,
      airline: "British Airways",
      flightNumber: "BA178",
    },
    passengerName: "Regular User",
    passengerEmail: "user@example.com",
    bookingDate: new Date("2025-05-01T10:15:00Z"),
    status: {
      status: "pending",
      updatedAt: new Date("2025-05-01T10:15:00Z"),
    },
    boardingPassIssued: false,
  },
];

export default function AdminBookingRequests() {
  const [bookingRequests, setBookingRequests] = useState<Booking[]>(initialBookingRequests);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusAction, setStatusAction] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleOpenApproveDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setStatusAction("approve");
    setNotes("");
    setOpenDialog(true);
  };

  const handleOpenRejectDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setStatusAction("reject");
    setNotes("");
    setOpenDialog(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedBooking || !statusAction) return;

    const newStatus: BookingStatus = {
      status: statusAction === "approve" ? "approved" : "rejected",
      updatedAt: new Date(),
      notes: notes.trim() || undefined,
    };

    const updatedBookings = bookingRequests.map((booking) =>
      booking.id === selectedBooking.id
        ? { ...booking, status: newStatus }
        : booking
    );

    setBookingRequests(updatedBookings);
    setOpenDialog(false);

    toast({
      title: `Booking ${newStatus.status}`,
      description: `The booking has been ${newStatus.status} successfully`,
      variant: statusAction === "approve" ? "default" : "destructive",
    });
  };

  const getPendingBookings = () => {
    return bookingRequests.filter((booking) => booking.status.status === "pending");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingBookings = getPendingBookings();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text">Booking Requests</h1>
          <p className="text-muted-foreground">
            Review and manage pending booking requests
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Passenger</TableHead>
                <TableHead>Flight</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.passengerName}</p>
                      <p className="text-sm text-muted-foreground">{booking.passengerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {booking.flight.departureDestination.code} → {booking.flight.arrivalDestination.code}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.flight.airline} · {booking.flight.flightNumber}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{formatDate(booking.flight.departureTime)}</p>
                      <p className="text-sm text-muted-foreground">{formatTime(booking.flight.departureTime)}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(booking.bookingDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500/30 hover:bg-green-500/10 hover:text-green-500"
                        onClick={() => handleOpenApproveDialog(booking)}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleOpenRejectDialog(booking)}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pendingBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No pending booking requests
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Approve/Reject Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusAction === "approve" ? "Approve Booking Request" : "Reject Booking Request"}
            </DialogTitle>
            <DialogDescription>
              {statusAction === "approve"
                ? "Confirm approval of the booking request."
                : "Provide a reason for rejecting the booking request."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedBooking && (
              <div className="space-y-1">
                <p className="text-sm font-semibold">Booking details:</p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Passenger:</span>{" "}
                  {selectedBooking.passengerName}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Flight:</span>{" "}
                  {selectedBooking.flight.departureDestination.code} →{" "}
                  {selectedBooking.flight.arrivalDestination.code} (
                  {selectedBooking.flight.flightNumber})
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Date:</span>{" "}
                  {formatDate(selectedBooking.flight.departureTime)}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                {statusAction === "approve" ? "Additional Notes (optional)" : "Reason for Rejection"}
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  statusAction === "approve"
                    ? "Add any additional notes (optional)"
                    : "Provide a reason for rejecting this booking"
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              variant={statusAction === "approve" ? "default" : "destructive"}
            >
              {statusAction === "approve" ? "Approve Booking" : "Reject Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
