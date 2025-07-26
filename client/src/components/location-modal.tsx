import { useState } from "react";
import { X, MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, type Location } from "@/hooks/use-location";
import { useToast } from "@/hooks/use-toast";

export default function LocationModal() {
  const { 
    currentLocation, 
    isLocationModalOpen, 
    availableLocations, 
    setLocation, 
    closeLocationModal, 
    getCurrentPosition 
  } = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  if (!isLocationModalOpen) return null;

  const filteredLocations = availableLocations.filter(location =>
    location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.zipCode.includes(searchQuery)
  );

  const handleUseCurrentLocation = async () => {
    setIsLoadingPosition(true);
    try {
      const position = await getCurrentPosition();
      if (position) {
        setLocation(position);
        toast({
          title: "Location Updated",
          description: "Using your current location for delivery",
        });
      } else {
        toast({
          title: "Location Error",
          description: "Unable to access your location. Please select from available addresses.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Location Error", 
        description: "Failed to get current location",
        variant: "destructive",
      });
    }
    setIsLoadingPosition(false);
  };

  const handleSelectLocation = (location: Location) => {
    setLocation(location);
    toast({
      title: "Delivery Address Updated",
      description: `Now delivering to ${location.address}, ${location.city}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Select Delivery Location</h3>
            <Button variant="ghost" size="sm" onClick={closeLocationModal}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search address, city, or zip code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleUseCurrentLocation}
              disabled={isLoadingPosition}
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isLoadingPosition ? "Getting location..." : "Use Current Location"}
            </Button>
          </div>
        </div>

        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Available Delivery Areas</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredLocations.map((location, index) => (
              <button
                key={index}
                onClick={() => handleSelectLocation(location)}
                className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-gray-50 ${
                  currentLocation.address === location.address && currentLocation.city === location.city
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <MapPin className={`h-4 w-4 mt-1 ${
                    currentLocation.address === location.address && currentLocation.city === location.city
                      ? 'text-primary' 
                      : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{location.address}</p>
                    <p className="text-sm text-gray-600">{location.city}, {location.state} {location.zipCode}</p>
                    {currentLocation.address === location.address && currentLocation.city === location.city && (
                      <p className="text-xs text-primary font-medium mt-1">Current location</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {filteredLocations.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">No locations found</h4>
              <p className="text-gray-600">Try searching with a different address or zip code.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Don't see your address? Contact support to check if we deliver to your area.
          </p>
        </div>
      </div>
    </div>
  );
}