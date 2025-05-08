
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BookingDetails } from "@/services/flightService";

export const generatePDF = async (
  bookingId: string,
  elementId: string
): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error("Element not found");
      return;
    }
    
    // Create canvas from element
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff"
    });
    
    const imageData = canvas.toDataURL("image/png");
    
    // Initialize PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imageData, "PNG", 0, 0, imgWidth, imgHeight);
    
    // Download the PDF
    pdf.save(`flight-ticket-${bookingId}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

export const getBookingTicketHtml = (booking: BookingDetails): string => {
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
  
  return `
    <div class="ticket-container" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: white;">
      <div class="ticket-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">
        <div style="display: flex; align-items: center;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background-color: #7c3aed; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
            <span style="color: white; font-weight: bold;">SV</span>
          </div>
          <h1 style="margin: 0; font-size: 24px; color: #7c3aed;">SkyVoyager</h1>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 18px;">E-Ticket / Boarding Pass</p>
          <p style="margin: 0; font-size: 14px; color: #666;">Booking ID: ${booking.id}</p>
        </div>
      </div>

      <div class="ticket-body" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 20px;">${booking.flight.departureCity} to ${booking.flight.arrivalCity}</h2>
            <p style="margin: 0; color: #666;">${formatDate(booking.flight.departureDate)}</p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin: 0; font-size: 18px; color: #7c3aed;">PNR: ${booking.pnr}</h3>
            <p style="margin: 0; color: #666;">Status: ${booking.status.toUpperCase()}</p>
          </div>
        </div>

        <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Flight Details</h3>
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div style="min-width: 150px; margin-bottom: 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">Airline</p>
              <p style="margin: 0; font-weight: bold;">${booking.flight.airline.name}</p>
              <p style="margin: 0; font-size: 12px;">${booking.flight.id}</p>
            </div>
            <div style="min-width: 150px; margin-bottom: 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">Departure</p>
              <p style="margin: 0; font-weight: bold;">${booking.flight.departureTime}</p>
              <p style="margin: 0; font-size: 12px;">${booking.flight.departureAirport}</p>
            </div>
            <div style="min-width: 150px; margin-bottom: 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">Duration</p>
              <p style="margin: 0; font-weight: bold;">${booking.flight.duration}</p>
              <p style="margin: 0; font-size: 12px;">${booking.flight.stops === 0 ? 'Direct' : booking.flight.stops + ' stop'}</p>
            </div>
            <div style="min-width: 150px; margin-bottom: 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">Arrival</p>
              <p style="margin: 0; font-weight: bold;">${booking.flight.arrivalTime}</p>
              <p style="margin: 0; font-size: 12px;">${booking.flight.arrivalAirport}</p>
            </div>
          </div>
        </div>

        <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Passenger Information</h3>
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
            <div style="min-width: 150px; margin-bottom: 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">Passenger Name</p>
              <p style="margin: 0; font-weight: bold;">${booking.passengerName}</p>
            </div>
            <div style="min-width: 150px; margin-bottom: 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">Email</p>
              <p style="margin: 0; font-weight: bold;">${booking.passengerEmail}</p>
            </div>
            <div style="min-width: 150px; margin-bottom: 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">Seat Number</p>
              <p style="margin: 0; font-weight: bold;">${booking.seatNumber}</p>
            </div>
            <div style="min-width: 150px; margin-bottom: 10px;">
              <p style="margin: 0; color: #666; font-size: 12px;">Booking Date</p>
              <p style="margin: 0; font-weight: bold;">${formatDate(booking.bookingDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="ticket-footer" style="border-top: 1px solid #ddd; padding-top: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p style="margin: 0; color: #666; font-size: 12px;">Amount Paid:</p>
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #7c3aed;">${formatCurrency(booking.flight.currentPrice)}</p>
          </div>
          <div>
            <img src="data:image/png;base64,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" alt="QR Code" style="width: 100px; height: 100px;" />
          </div>
        </div>
      </div>
    </div>
  `;
};
