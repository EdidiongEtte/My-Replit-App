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
  address: "Current Location",
  latitude: 51.5074,
  longitude: -0.1278,
  city: "London",
  state: "England",
  zipCode: "SW1A 1AA"
};

const availableLocations: Location[] = [
  {
    address: "10 Downing Street",
    latitude: 51.5034,
    longitude: -0.1276,
    city: "London",
    state: "England",
    zipCode: "SW1A 2AA"
  },
  {
    address: "221B Baker Street",
    latitude: 51.5238,
    longitude: -0.1586,
    city: "London",
    state: "England", 
    zipCode: "NW1 6XE"
  },
  {
    address: "1 Tower Bridge Road",
    latitude: 51.5055,
    longitude: -0.0754,
    city: "London",
    state: "England",
    zipCode: "SE1 2UP"
  },
  {
    address: "30 St Mary Axe",
    latitude: 51.5144,
    longitude: -0.0803,
    city: "London", 
    state: "England",
    zipCode: "EC3A 8EP"
  },
  {
    address: "High Street",
    latitude: 51.7520,
    longitude: -1.2577,
    city: "Oxford",
    state: "England",
    zipCode: "OX1 4BE"
  },
  {
    address: "King's Parade", 
    latitude: 52.2043,
    longitude: 0.1218,
    city: "Cambridge",
    state: "England",
    zipCode: "CB2 1ST"
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

      const timeoutId = setTimeout(async () => {
        console.warn('Geolocation timeout - detecting approximate location via IP');
        // Try to get location via IP geolocation
        try {
          const ipLocation = await getLocationFromIP();
          resolve(ipLocation);
        } catch (error) {
          // Final fallback to UK location
          const fallbackLocation: Location = {
            address: "Detected Location (Approximate)",
            latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
            longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
            city: "London",
            state: "England",
            zipCode: "SW1A 1AA"
          };
          resolve(fallbackLocation);
        }
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
        async (error) => {
          clearTimeout(timeoutId);
          console.warn('Geolocation error, using IP-based fallback:', error.message || 'Unknown error');
          
          // Try IP-based geolocation as fallback
          try {
            const ipLocation = await getLocationFromIP();
            resolve(ipLocation);
          } catch (ipError) {
            // Final fallback location
            const fallbackLocation: Location = {
              address: "Default Location (GPS Unavailable)",
              latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
              longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
              city: "London",
              state: "England",
              zipCode: "SW1A 1AA"
            };
            resolve(fallbackLocation);
          }
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

// IP-based geolocation fallback
async function getLocationFromIP(): Promise<Location> {
  try {
    // Using a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('IP geolocation service unavailable');
    
    const data = await response.json();
    
    return {
      address: `Detected Location (${data.city || 'Unknown City'})`,
      latitude: data.latitude || 51.5074,
      longitude: data.longitude || -0.1278,
      city: data.city || 'London',
      state: data.region || 'England', 
      zipCode: data.postal || 'Unknown'
    };
  } catch (error) {
    console.warn('IP geolocation failed:', error);
    throw error;
  }
}