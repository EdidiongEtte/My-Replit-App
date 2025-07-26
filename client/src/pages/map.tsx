import Header from "@/components/header";
import MapView from "@/components/map-view";
import { Button } from "@/components/ui/button";
import { Navigation, Search, MapPin } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { useState } from "react";

export default function Map() {
  const { openLocationModal } = useLocation();
  const [selectedStore, setSelectedStore] = useState<string>();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="p-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Store Locations</h1>
          <p className="text-gray-600">Find stores near you and check delivery areas</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={openLocationModal}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Change Location
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Stores
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Current GPS
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <MapView 
            showStores={true} 
            selectedStore={selectedStore}
          />
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Map Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-800">Your Location</h4>
                <p className="text-sm text-gray-600">Current delivery address</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-white border border-primary rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-800">Store Locations</h4>
                <p className="text-sm text-gray-600">Available for delivery</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-800">Delivery Zone</h4>
                <p className="text-sm text-gray-600">Free delivery area</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-gray-800">Express Zone</h4>
                <p className="text-sm text-gray-600">15-minute delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}