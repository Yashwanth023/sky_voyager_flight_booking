
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Destination } from "@/types/booking";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, MapPin, Plus, Trash2 } from "lucide-react";

// Sample destinations data
const initialDestinations: Destination[] = [
  {
    id: "1",
    name: "John F. Kennedy International Airport",
    code: "JFK",
    city: "New York",
    country: "United States",
    description: "One of the busiest international airports in the United States",
    image: "https://images.unsplash.com/photo-1606768666853-403c90a981ad?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "Heathrow Airport",
    code: "LHR",
    city: "London",
    country: "United Kingdom",
    description: "The busiest airport in the United Kingdom",
    image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "Tokyo International Airport",
    code: "HND",
    city: "Tokyo",
    country: "Japan",
    description: "Also known as Haneda Airport, one of the two primary airports serving Tokyo",
    image: "https://images.unsplash.com/photo-1589552606417-2d438d21ff1f?q=80&w=1974&auto=format&fit=crop"
  }
];

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [newDestination, setNewDestination] = useState<Partial<Destination>>({
    name: "",
    code: "",
    city: "",
    country: "",
    description: "",
    image: ""
  });
  const { toast } = useToast();

  const handleAddDestination = () => {
    if (!newDestination.name || !newDestination.code || !newDestination.city || !newDestination.country) {
      toast({
        title: "Invalid input",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const destination: Destination = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDestination.name,
      code: newDestination.code,
      city: newDestination.city,
      country: newDestination.country,
      description: newDestination.description,
      image: newDestination.image
    };

    setDestinations([...destinations, destination]);
    setNewDestination({
      name: "",
      code: "",
      city: "",
      country: "",
      description: "",
      image: ""
    });
    setOpenAddDialog(false);

    toast({
      title: "Destination added",
      description: `${destination.name} (${destination.code}) has been added successfully`,
    });
  };

  const handleEditDestination = () => {
    if (!currentDestination) return;

    setDestinations(destinations.map(dest => 
      dest.id === currentDestination.id ? currentDestination : dest
    ));
    setOpenEditDialog(false);

    toast({
      title: "Destination updated",
      description: `${currentDestination.name} (${currentDestination.code}) has been updated successfully`,
    });
  };

  const handleDeleteDestination = (id: string) => {
    setDestinations(destinations.filter(dest => dest.id !== id));
    
    toast({
      title: "Destination deleted",
      description: "The destination has been deleted successfully",
    });
  };

  const openEdit = (destination: Destination) => {
    setCurrentDestination({ ...destination });
    setOpenEditDialog(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold gradient-text">Manage Destinations</h1>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Destination
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Destination</DialogTitle>
                <DialogDescription>
                  Add a new airport destination to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Airport Name
                    </label>
                    <Input
                      id="name"
                      value={newDestination.name}
                      onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                      placeholder="JFK International Airport"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="code" className="text-sm font-medium">
                      Airport Code
                    </label>
                    <Input
                      id="code"
                      value={newDestination.code}
                      onChange={(e) => setNewDestination({ ...newDestination, code: e.target.value.toUpperCase() })}
                      placeholder="JFK"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium">
                      City
                    </label>
                    <Input
                      id="city"
                      value={newDestination.city}
                      onChange={(e) => setNewDestination({ ...newDestination, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="country" className="text-sm font-medium">
                      Country
                    </label>
                    <Input
                      id="country"
                      value={newDestination.country}
                      onChange={(e) => setNewDestination({ ...newDestination, country: e.target.value })}
                      placeholder="United States"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="description"
                    value={newDestination.description}
                    onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                    placeholder="Brief description of the airport"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    Image URL
                  </label>
                  <Input
                    id="image"
                    value={newDestination.image}
                    onChange={(e) => setNewDestination({ ...newDestination, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddDestination}>
                  Add Destination
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Airport</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {destinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell className="font-medium">{destination.name}</TableCell>
                  <TableCell>{destination.code}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {destination.city}, {destination.country}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(destination)}
                      >
                        <Edit className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDestination(destination.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {destinations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No destinations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Destination Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Destination</DialogTitle>
            <DialogDescription>
              Update destination information
            </DialogDescription>
          </DialogHeader>
          {currentDestination && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">
                    Airport Name
                  </label>
                  <Input
                    id="edit-name"
                    value={currentDestination.name}
                    onChange={(e) => setCurrentDestination({ ...currentDestination, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-code" className="text-sm font-medium">
                    Airport Code
                  </label>
                  <Input
                    id="edit-code"
                    value={currentDestination.code}
                    onChange={(e) => setCurrentDestination({ ...currentDestination, code: e.target.value.toUpperCase() })}
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-city" className="text-sm font-medium">
                    City
                  </label>
                  <Input
                    id="edit-city"
                    value={currentDestination.city}
                    onChange={(e) => setCurrentDestination({ ...currentDestination, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-country" className="text-sm font-medium">
                    Country
                  </label>
                  <Input
                    id="edit-country"
                    value={currentDestination.country}
                    onChange={(e) => setCurrentDestination({ ...currentDestination, country: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="edit-description"
                  value={currentDestination.description || ""}
                  onChange={(e) => setCurrentDestination({ ...currentDestination, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-image" className="text-sm font-medium">
                  Image URL
                </label>
                <Input
                  id="edit-image"
                  value={currentDestination.image || ""}
                  onChange={(e) => setCurrentDestination({ ...currentDestination, image: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenEditDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEditDestination}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
