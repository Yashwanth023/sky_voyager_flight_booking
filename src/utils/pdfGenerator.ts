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
    
    console.log("Generating PDF for element:", elementId);
    
    // Create canvas from element
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: true,
      useCORS: true,
      backgroundColor: "#ffffff"
    });
    
    const imageData = canvas.toDataURL("image/png");
    console.log("Canvas generated successfully");
    
    // Initialize PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imageData, "PNG", 0, 0, imgWidth, imgHeight);
    console.log("PDF created successfully, preparing download");
    
    // Download the PDF
    pdf.save(`flight-ticket-${bookingId}.pdf`);
    console.log("PDF saved successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
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
  
  const formatTime = (timeString: string) => {
    return timeString;
  };
  
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };
  
  return `
    <div class="ticket-container" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: white;">
      <!-- Header Section -->
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
          <p style="margin: 0; font-size: 12px; color: #666;">Generated on: ${getCurrentDate()}</p>
        </div>
      </div>

      <!-- Status Banner -->
      <div style="background-color: ${booking.status === 'confirmed' ? '#dcfce7' : '#fee2e2'}; color: ${booking.status === 'confirmed' ? '#166534' : '#991b1b'}; padding: 10px 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; text-transform: uppercase; text-align: center;">
        ${booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'} - PNR: ${booking.pnr}
      </div>

      <!-- Flight Information Section -->
      <div class="ticket-body" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 20px; color: #7c3aed;">${booking.flight.departureCity} to ${booking.flight.arrivalCity}</h2>
            <p style="margin: 0; color: #666;">${formatDate(booking.flight.departureDate)}</p>
          </div>
        </div>

        <!-- Flight Route Visualization -->
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 25px 15px; margin-bottom: 20px; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: center; position: relative;">
            <div style="text-align: center; width: 30%;">
              <div style="font-size: 22px; font-weight: bold;">${booking.flight.departureTime}</div>
              <div style="color: #666; font-size: 14px;">${booking.flight.departureAirport}</div>
              <div style="font-weight: bold;">${booking.flight.departureCity}</div>
            </div>
            
            <div style="flex-grow: 1; position: relative; margin: 0 20px;">
              <div style="border-top: 2px dashed #7c3aed; position: relative;">
                <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%);">
                  <div style="background-color: white; border: 2px solid #7c3aed; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div style="text-align: center; margin-top: 15px;">
                <div style="font-weight: bold;">${booking.flight.duration}</div>
                <div style="color: #666; font-size: 12px;">${booking.flight.stops === 0 ? 'Direct Flight' : booking.flight.stops + ' Stop'}</div>
              </div>
            </div>
            
            <div style="text-align: center; width: 30%;">
              <div style="font-size: 22px; font-weight: bold;">${booking.flight.arrivalTime}</div>
              <div style="color: #666; font-size: 14px;">${booking.flight.arrivalAirport}</div>
              <div style="font-weight: bold;">${booking.flight.arrivalCity}</div>
            </div>
          </div>
        </div>

        <!-- Flight Details Box -->
        <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #7c3aed;">Flight Details</h3>
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

        <!-- Passenger Information Box -->
        <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #7c3aed;">Passenger Information</h3>
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

      <!-- Boarding Pass Section -->
      <div style="background-color: #f1f5f9; border: 1px dashed #7c3aed; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; margin-bottom: 10px; color: #7c3aed; text-align: center;">BOARDING PASS</h3>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <div>
            <p style="margin: 0; color: #666; font-size: 12px;">Passenger</p>
            <p style="margin: 0; font-weight: bold;">${booking.passengerName}</p>
          </div>
          <div>
            <p style="margin: 0; color: #666; font-size: 12px;">Flight</p>
            <p style="margin: 0; font-weight: bold;">${booking.flight.id}</p>
          </div>
          <div>
            <p style="margin: 0; color: #666; font-size: 12px;">Seat</p>
            <p style="margin: 0; font-weight: bold;">${booking.seatNumber}</p>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <div>
            <p style="margin: 0; color: #666; font-size: 12px;">Gate</p>
            <p style="margin: 0; font-weight: bold;">B22</p>
          </div>
          <div>
            <p style="margin: 0; color: #666; font-size: 12px;">Boarding</p>
            <p style="margin: 0; font-weight: bold;">30 mins before departure</p>
          </div>
          <div>
            <p style="margin: 0; color: #666; font-size: 12px;">Class</p>
            <p style="margin: 0; font-weight: bold;">Economy</p>
          </div>
        </div>
        
        <div style="border-top: 1px dashed #ccc; padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p style="margin: 0; color: #666; font-size: 12px;">Boarding Time</p>
            <p style="margin: 0; font-weight: bold; color: #7c3aed;">Please be at the gate 30 minutes before departure</p>
          </div>
          <div style="text-align: right;">
            <img src="data:image/png;base64,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" alt="QR Code" style="width: 100px; height: 100px;" />
          </div>
        </div>
      </div>

      <!-- Price Summary -->
      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #7c3aed;">Price Summary</h3>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-weight: bold;">Total Amount Paid</span>
          <span style="font-weight: bold; color: #7c3aed; font-size: 18px;">${formatCurrency(booking.flight.currentPrice)}</span>
        </div>
      </div>

      <!-- Important Information -->
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; margin-bottom: 10px; color: #7c3aed;">Important Information</h3>
        <ul style="padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 8px;">Please arrive at the airport at least 2 hours before the scheduled departure time.</li>
          <li style="margin-bottom: 8px;">Valid photo identification is required for all passengers.</li>
          <li style="margin-bottom: 8px;">For international flights, please ensure your passport is valid for at least 6 months from the date of travel.</li>
          <li style="margin-bottom: 8px;">Baggage allowance: 1 check-in bag (up to 23kg) and 1 carry-on bag (up to 7kg).</li>
          <li>For any assistance, contact SkyVoyager customer service at +91 12345 67890 or support@skyvoyager.com.</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #ddd; padding-top: 15px; text-align: center;">
        <p style="margin: 0 0 8px 0; color: #7c3aed; font-weight: bold;">SkyVoyager - Your Journey, Our Priority</p>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">123 Aviation Boulevard, Mumbai, India | +91 12345 67890 | support@skyvoyager.com</p>
        <p style="margin: 0; font-size: 12px; color: #666;">&copy; ${new Date().getFullYear()} SkyVoyager. All rights reserved.</p>
      </div>
    </div>
  `;
};
