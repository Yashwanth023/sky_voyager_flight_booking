
interface AmadeusAirport {
  iataCode: string;
  name: string;
  detailedName: string;
  cityCode: string;
  cityName: string;
  countryCode: string;
  countryName: string;
}

// Cache for airport data to avoid unnecessary API calls
let airportCache: Record<string, AmadeusAirport> = {};

// This is a mock implementation that simulates Amadeus API
// In a production app, you would replace this with actual API calls
export const getAirportDetails = async (airportCode: string): Promise<AmadeusAirport | null> => {
  // Check cache first
  if (airportCache[airportCode]) {
    console.log("Using cached airport data for", airportCode);
    return airportCache[airportCode];
  }

  console.log("Fetching airport details for", airportCode);
  
  // In a real implementation, this would be an API call to Amadeus
  // For demo purposes, we'll use a simulated response with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Demo data mapping (simulating Amadeus API response)
      const airportsData: Record<string, AmadeusAirport> = {
        "DEL": {
          iataCode: "DEL",
          name: "Indira Gandhi International Airport",
          detailedName: "Delhi, India (DEL)",
          cityCode: "DEL",
          cityName: "New Delhi",
          countryCode: "IN",
          countryName: "India"
        },
        "BOM": {
          iataCode: "BOM",
          name: "Chhatrapati Shivaji Maharaj International Airport",
          detailedName: "Mumbai, India (BOM)",
          cityCode: "BOM",
          cityName: "Mumbai",
          countryCode: "IN",
          countryName: "India"
        },
        "MAA": {
          iataCode: "MAA",
          name: "Chennai International Airport",
          detailedName: "Chennai, India (MAA)",
          cityCode: "MAA",
          cityName: "Chennai",
          countryCode: "IN",
          countryName: "India"
        },
        "CCU": {
          iataCode: "CCU",
          name: "Netaji Subhas Chandra Bose International Airport",
          detailedName: "Kolkata, India (CCU)",
          cityCode: "CCU",
          cityName: "Kolkata",
          countryCode: "IN",
          countryName: "India"
        },
        "BLR": {
          iataCode: "BLR",
          name: "Kempegowda International Airport",
          detailedName: "Bengaluru, India (BLR)",
          cityCode: "BLR",
          cityName: "Bangalore",
          countryCode: "IN",
          countryName: "India"
        },
        "HYD": {
          iataCode: "HYD",
          name: "Rajiv Gandhi International Airport",
          detailedName: "Hyderabad, India (HYD)",
          cityCode: "HYD",
          cityName: "Hyderabad",
          countryCode: "IN",
          countryName: "India"
        },
        // Add more airports as needed
      };

      const result = airportsData[airportCode] || null;
      
      // Cache the result
      if (result) {
        airportCache[airportCode] = result;
      }
      
      resolve(result);
    }, 300); // Simulate network delay
  });
};

// Initialize airport data from API
export const initializeAirportsFromApi = async () => {
  const airportCodes = ["DEL", "BOM", "MAA", "CCU", "BLR", "HYD", "COK", "PNQ", "GAU", "IXC"];
  
  console.log("Initializing airport data from Amadeus API");
  
  const airportPromises = airportCodes.map(code => getAirportDetails(code));
  const airports = await Promise.all(airportPromises);
  
  // Convert to format expected by the app
  const airportData = airports
    .filter(airport => airport !== null)
    .map(airport => ({
      code: airport!.iataCode,
      name: airport!.name,
      city: airport!.cityName,
      country: airport!.countryName
    }));
  
  // Store in localStorage for use throughout the app
  localStorage.setItem("airportData", JSON.stringify(airportData));
  
  console.log("Airport data initialized:", airportData);
  
  return airportData;
};
