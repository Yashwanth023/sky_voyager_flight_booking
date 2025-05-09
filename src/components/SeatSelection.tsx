
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Seat } from "@/types/booking";
import { useToast } from "@/hooks/use-toast";

// Generate mock seat data
const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = 10;
  const columns = ["A", "B", "C", "D", "E", "F"];
  
  for (let row = 1; row <= rows; row++) {
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const column = columns[colIndex];
      const type = row <= 2 ? "business" : "economy";
      
      // Randomly mark some seats as unavailable
      const isAvailable = Math.random() > 0.3;
      
      seats.push({
        id: `${row}${column}`,
        row,
        column,
        isAvailable,
        type,
      });
    }
  }
  
  return seats;
};

interface SeatSelectionProps {
  onSelect: (seat: Seat) => void;
  selectedSeatId?: string;
}

export function SeatSelection({ onSelect, selectedSeatId }: SeatSelectionProps) {
  const [seats] = useState<Seat[]>(generateSeats());
  const { toast } = useToast();

  const handleSelectSeat = (seat: Seat) => {
    if (!seat.isAvailable) {
      toast({
        title: "Seat unavailable",
        description: "This seat is already booked",
        variant: "destructive",
      });
      return;
    }
    
    onSelect(seat);
    toast({
      title: "Seat selected",
      description: `Seat ${seat.row}${seat.column} has been selected`,
    });
  };

  // Group seats by row for display
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);

  return (
    <div className="space-y-6 w-full">
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium mb-2">Select Your Seat</h3>
        <p className="text-muted-foreground text-sm">Click on an available seat to select it</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-primary/20 border border-primary rounded-sm mr-2"></div>
            <span className="text-xs">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-muted/50 border border-muted-foreground/20 rounded-sm mr-2"></div>
            <span className="text-xs">Unavailable</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-secondary/70 border border-secondary rounded-sm mr-2"></div>
            <span className="text-xs">Selected</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex justify-center">
          <div className="relative">
            {/* Airplane fuselage */}
            <div className="relative mx-auto w-[300px] rounded-t-full h-20 border-2 border-border bg-muted/20 mb-2"></div>
            
            {/* Seat grid */}
            <div className="bg-muted/10 border border-border rounded-lg p-6 max-w-md mx-auto">
              <div className="space-y-3">
                {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                  <div key={row} className="flex justify-between">
                    {rowSeats.map((seat) => {
                      const isSelected = seat.id === selectedSeatId;
                      // Add center aisle
                      const isAisle = seat.column === "C" || seat.column === "D";
                      
                      return (
                        <div 
                          key={seat.id} 
                          className={`${isAisle ? "mr-4" : "mr-1"} last:mr-0`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className={`w-8 h-8 p-0 text-xs font-medium ${
                              isSelected
                                ? "bg-secondary/70 border-secondary text-secondary-foreground"
                                : seat.isAvailable
                                ? "bg-primary/20 hover:bg-primary/30 border-primary/50"
                                : "bg-muted/50 border-muted-foreground/20 cursor-not-allowed opacity-70"
                            } ${seat.type === "business" ? "ring-1 ring-accent/50" : ""}`}
                            onClick={() => handleSelectSeat(seat)}
                            disabled={!seat.isAvailable}
                          >
                            {seat.row}{seat.column}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <div className="w-full h-10 rounded-lg bg-muted/30 border border-border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">FRONT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
