import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zipCode: string;
}

interface LocationContextType {
  currentLocation: Location;
  isLocationModalOpen: boolean;
  availableLocations: Location[];
  setLocation: (location: Location) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  getCurrentPosition: () => Promise<Location | null>;
}

const defaultLocation: Location = {
  address: "123 Main St",
  latitude: 40.7128,
  longitude: -74.0060,
  city: "New York",
  state: "NY",
  zipCode: "10001"
};

const availableLocations: Location[] = [
  {
    address: "123 Main St",
    latitude: 40.7128,
    longitude: -74.0060,
    city: "New York",
    state: "NY",
    zipCode: "10001"
  },
  {
    address: "456 Oak Avenue",
    latitude: 40.7282,
    longitude: -73.9942,
    city: "New York",
    state: "NY", 
    zipCode: "10002"
  },
  {
    address: "789 Elm Street",
    latitude: 40.7505,
    longitude: -73.9934,
    city: "New York",
    state: "NY",
    zipCode: "10003"
  },
  {
    address: "321 Pine Road",
    latitude: 40.7589,
    longitude: -73.9851,
    city: "New York", 
    state: "NY",
    zipCode: "10021"
  }
];

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<Location>(defaultLocation);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('paiko-location');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setCurrentLocation(location);
      } catch (error) {
        console.error('Failed to parse saved location:', error);
      }
    }
  }, []);

  const setLocation = (location: Location) => {
    setCurrentLocation(location);
    localStorage.setItem('paiko-location', JSON.stringify(location));
    setIsLocationModalOpen(false);
  };

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  const getCurrentPosition = async (): Promise<Location | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
        resolve(null);
        return;
      }

      // Check if geolocation permission is available
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
          if (permission.state === 'denied') {
            console.warn('Geolocation permission denied');
            resolve(null);
            return;
          }
        }).catch(() => {
          // Permissions API not supported, continue anyway
        });
      }

      const timeoutId = setTimeout(() => {
        console.warn('Geolocation timeout - using approximate location');
        // Return a simulated NYC location as fallback
        const fallbackLocation: Location = {
          address: "Detected Location (Approximate)",
          latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
          city: "New York",
          state: "NY",
          zipCode: "10001"
        };
        resolve(fallbackLocation);
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          const { latitude, longitude } = position.coords;
          
          // For demo purposes, we'll simulate reverse geocoding
          // In a real app, you'd use a geocoding service like Google Maps API
          const simulatedLocation: Location = {
            address: "Current GPS Location",
            latitude,
            longitude,
            city: "Detected City",
            state: "Detected State",
            zipCode: "00000"
          };
          
          resolve(simulatedLocation);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.warn('Geolocation error, using fallback:', error.message || 'Unknown error');
          
          // Provide a helpful fallback location
          const fallbackLocation: Location = {
            address: "Default Location (GPS Unavailable)",
            latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
            longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
            city: "New York",
            state: "NY",
            zipCode: "10001"
          };
          resolve(fallbackLocation);
        },
        {
          enableHighAccuracy: false, // Use less accuracy for better compatibility
          timeout: 5000, // Shorter timeout
          maximumAge: 600000 // 10 minutes cache
        }
      );
    });
  };

  return (
    <LocationContext.Provider value={{
      currentLocation,
      isLocationModalOpen,
      availableLocations,
      setLocation,
      openLocationModal,
      closeLocationModal,
      getCurrentPosition,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}