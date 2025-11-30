import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zipCode: string;
  accuracy?: number;
  locationType?: 'gps' | 'ip' | 'manual' | 'default';
}

interface LocationContextType {
  currentLocation: Location;
  isLocationModalOpen: boolean;
  availableLocations: Location[];
  isDetecting: boolean;
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
  const [isDetecting, setIsDetecting] = useState(false);

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
    setIsDetecting(true);
    
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
        setIsDetecting(false);
        resolve(null);
        return;
      }

      // Check if geolocation permission is available
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
          if (permission.state === 'denied') {
            console.warn('Geolocation permission denied');
            setIsDetecting(false);
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
          setIsDetecting(false);
          resolve(ipLocation);
        } catch (error) {
          // Final fallback to UK location
          const fallbackLocation: Location = {
            address: "Detected Location (Approximate)",
            latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
            longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
            city: "London",
            state: "England",
            zipCode: "SW1A 1AA",
            locationType: 'default'
          };
          setIsDetecting(false);
          resolve(fallbackLocation);
        }
      }, 10000); // Give more time for high accuracy GPS

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          const { latitude, longitude, accuracy } = position.coords;
          
          // Use reverse geocoding to get actual address from coordinates
          try {
            const geocodedLocation = await reverseGeocode(latitude, longitude, accuracy);
            setIsDetecting(false);
            resolve(geocodedLocation);
          } catch (error) {
            console.warn('Reverse geocoding failed, using coordinates only');
            const gpsLocation: Location = {
              address: `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
              latitude,
              longitude,
              city: "Unknown",
              state: "Unknown",
              zipCode: "Unknown",
              accuracy: accuracy,
              locationType: 'gps'
            };
            setIsDetecting(false);
            resolve(gpsLocation);
          }
        },
        async (error) => {
          clearTimeout(timeoutId);
          console.warn('Geolocation error, using IP-based fallback:', error.message || 'Unknown error');
          
          // Try IP-based geolocation as fallback
          try {
            const ipLocation = await getLocationFromIP();
            setIsDetecting(false);
            resolve(ipLocation);
          } catch (ipError) {
            // Final fallback location
            const fallbackLocation: Location = {
              address: "Default Location (GPS Unavailable)",
              latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
              longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
              city: "London",
              state: "England",
              zipCode: "SW1A 1AA",
              locationType: 'default'
            };
            setIsDetecting(false);
            resolve(fallbackLocation);
          }
        },
        {
          enableHighAccuracy: true, // Use high accuracy GPS for best results
          timeout: 10000, // Allow more time for accurate GPS fix
          maximumAge: 60000 // 1 minute cache for fresh location
        }
      );
    });
  };

  return (
    <LocationContext.Provider value={{
      currentLocation,
      isLocationModalOpen,
      availableLocations,
      isDetecting,
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

// Reverse geocoding using OpenStreetMap Nominatim (free service)
async function reverseGeocode(latitude: number, longitude: number, accuracy?: number): Promise<Location> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Paiko-Grocery-App/1.0'
        }
      }
    );
    
    if (!response.ok) throw new Error('Reverse geocoding failed');
    
    const data = await response.json();
    const address = data.address || {};
    
    // Build a readable address from components
    const streetNumber = address.house_number || '';
    const street = address.road || address.street || address.pedestrian || '';
    const neighbourhood = address.neighbourhood || address.suburb || '';
    const city = address.city || address.town || address.village || address.municipality || 'Unknown';
    const state = address.state || address.county || address.region || 'Unknown';
    const postcode = address.postcode || 'Unknown';
    const country = address.country || '';
    
    // Create a friendly address string
    let addressString = '';
    if (streetNumber && street) {
      addressString = `${streetNumber} ${street}`;
    } else if (street) {
      addressString = street;
    } else if (neighbourhood) {
      addressString = neighbourhood;
    } else {
      addressString = `${city} Area`;
    }
    
    return {
      address: addressString,
      latitude,
      longitude,
      city,
      state,
      zipCode: postcode,
      accuracy: accuracy,
      locationType: 'gps'
    };
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    throw error;
  }
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
      zipCode: data.postal || 'Unknown',
      locationType: 'ip'
    };
  } catch (error) {
    console.warn('IP geolocation failed:', error);
    throw error;
  }
}