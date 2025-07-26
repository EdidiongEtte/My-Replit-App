import { MapPin, Store, Clock, Star } from "lucide-react";
import { useLocation } from "@/hooks/use-location";
import { useQuery } from "@tanstack/react-query";
import type { Store as StoreType } from "@shared/schema";

interface MapViewProps {
  showStores?: boolean;
  selectedStore?: string;
}

export default function MapView({ showStores = true, selectedStore }: MapViewProps) {
  const { currentLocation } = useLocation();
  
  const { data: stores = [] } = useQuery<StoreType[]>({
    queryKey: ["/api/stores"],
    enabled: showStores,
  });

  // Simulate store locations near user's location
  const storeLocations = stores.map((store, index) => ({
    ...store,
    latitude: currentLocation.latitude + (index * 0.01 - 0.005),
    longitude: currentLocation.longitude + (index * 0.01 - 0.005),
    distance: `${(Math.random() * 3 + 0.5).toFixed(1)} mi`,
  }));

  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      {/* Simple map representation */}
      <div 
        className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 relative"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #e5f3ff 25%, transparent 25%), 
            linear-gradient(-45deg, #e5f3ff 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #e5f3ff 75%), 
            linear-gradient(-45deg, transparent 75%, #e5f3ff 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}
      >
        {/* User location marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute -inset-2 bg-blue-500 rounded-full opacity-25 animate-ping"></div>
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-white px-2 py-1 rounded text-xs font-medium shadow-md">
              Your Location
            </div>
          </div>
        </div>

        {/* Store markers */}
        {showStores && storeLocations.map((store, index) => (
          <div 
            key={store.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
              selectedStore === store.id ? 'z-20' : 'z-10'
            }`}
            style={{
              top: `${50 + (index * 15 - 7.5)}%`,
              left: `${50 + (index * 20 - 10)}%`,
            }}
          >
            <div className={`relative cursor-pointer group ${
              selectedStore === store.id ? 'scale-110' : ''
            }`}>
              <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                selectedStore === store.id 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-primary'
              }`}>
                <Store className="h-3 w-3" />
              </div>
              
              {/* Store info popup */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-white p-3 rounded-lg shadow-lg border min-w-48">
                  <div className="text-sm font-medium text-gray-800">{store.name}</div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{store.deliveryTime}</span>
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{store.rating}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{store.distance} away</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
            {showStores && (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-white border border-primary rounded-full flex items-center justify-center">
                  <Store className="h-2 w-2 text-primary" />
                </div>
                <span>Stores</span>
              </div>
            )}
          </div>
        </div>

        {/* Location info */}
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md max-w-48">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-800">Delivering to</div>
              <div className="text-xs text-gray-600">{currentLocation.address}</div>
              <div className="text-xs text-gray-500">{currentLocation.city}, {currentLocation.state}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Store list */}
      {showStores && (
        <div className="p-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Nearby Stores</h4>
          <div className="space-y-2">
            {storeLocations.map((store) => (
              <div 
                key={store.id}
                className={`p-2 rounded border cursor-pointer transition-colors ${
                  selectedStore === store.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{store.name}</div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{store.deliveryTime}</span>
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{store.rating}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{store.distance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}