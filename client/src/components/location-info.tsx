import { MapPin, Navigation, Wifi, WifiOff } from "lucide-react";
import { useLocation } from "@/hooks/use-location";

export default function LocationInfo() {
  const { currentLocation } = useLocation();
  
  const getLocationStatus = () => {
    if (currentLocation.address.includes("GPS")) {
      return {
        icon: Navigation,
        status: "GPS Location",
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Precise location detected"
      };
    } else if (currentLocation.address.includes("Approximate") || currentLocation.address.includes("Default")) {
      return {
        icon: WifiOff,
        status: "Approximate Location", 
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: "Location estimated"
      };
    } else {
      return {
        icon: MapPin,
        status: "Set Location",
        color: "text-blue-600", 
        bgColor: "bg-blue-50",
        description: "Manually selected"
      };
    }
  };

  const locationStatus = getLocationStatus();

  return (
    <div className={`p-3 rounded-lg border ${locationStatus.bgColor}`}>
      <div className="flex items-start space-x-3">
        <locationStatus.icon className={`h-4 w-4 mt-0.5 ${locationStatus.color}`} />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${locationStatus.color}`}>
              {locationStatus.status}
            </span>
            <span className="text-xs text-gray-500">
              {locationStatus.description}
            </span>
          </div>
          <div className="text-sm text-gray-700 mt-1">
            {currentLocation.address}, {currentLocation.city}
          </div>
        </div>
      </div>
    </div>
  );
}