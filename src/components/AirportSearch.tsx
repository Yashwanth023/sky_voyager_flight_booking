
import { useState, useEffect, useRef } from "react";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// This is a mock of airport data
// In a real app, this would come from an API
const airportData = [
  { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", country: "India" },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai", country: "India" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", country: "India" },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", country: "India" },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", country: "India" },
  { code: "COK", name: "Cochin International Airport", city: "Kochi", country: "India" },
  { code: "PNQ", name: "Pune Airport", city: "Pune", country: "India" },
  { code: "GAU", name: "Lokpriya Gopinath Bordoloi International Airport", city: "Guwahati", country: "India" },
  { code: "IXC", name: "Chandigarh Airport", city: "Chandigarh", country: "India" },
  { code: "IXB", name: "Bagdogra Airport", city: "Siliguri", country: "India" },
  { code: "PAT", name: "Jay Prakash Narayan Airport", city: "Patna", country: "India" },
  { code: "IXR", name: "Birsa Munda Airport", city: "Ranchi", country: "India" },
  { code: "IXM", name: "Madurai Airport", city: "Madurai", country: "India" },
  { code: "IXZ", name: "Veer Savarkar International Airport", city: "Port Blair", country: "India" },
];

interface AirportSearchProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  excludeCode?: string;  // To exclude an airport from the results (e.g. departure airport)
}

export function AirportSearch({ 
  label, 
  value, 
  onChange, 
  placeholder = "Search airports...",
  excludeCode
}: AirportSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAirports, setFilteredAirports] = useState(airportData);
  
  // Find the selected airport details
  const selectedAirport = airportData.find(
    (airport) => airport.code === value
  );

  // Filter airports based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredAirports(airportData.filter(airport => airport.code !== excludeCode));
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = airportData.filter((airport) => 
      (airport.name.toLowerCase().includes(query) || 
       airport.city.toLowerCase().includes(query) || 
       airport.code.toLowerCase().includes(query)) &&
      airport.code !== excludeCode
    );
    
    setFilteredAirports(filtered);
  }, [searchQuery, excludeCode]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-14"
          >
            {selectedAirport ? (
              <div className="flex flex-col items-start text-left">
                <span className="font-bold">{selectedAirport.city} ({selectedAirport.code})</span>
                <span className="text-sm text-muted-foreground truncate">
                  {selectedAirport.name}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0">
          <Command>
            <CommandInput 
              placeholder={placeholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No airport found.</CommandEmpty>
              <CommandGroup>
                {filteredAirports.map((airport) => (
                  <CommandItem
                    key={airport.code}
                    value={airport.code}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">
                          {airport.city}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({airport.code})
                        </span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === airport.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground truncate">
                        {airport.name}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
