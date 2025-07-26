import { MapPin, Bell, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useNotifications } from "@/hooks/use-notifications";
import { useLocation } from "@/hooks/use-location";

export default function Header() {
  const { items, toggleCart } = useCart();
  const { unreadCount, togglePanel } = useNotifications();
  const { currentLocation, openLocationModal } = useLocation();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={openLocationModal}
          >
            <MapPin className="text-primary text-lg" />
            <div className="text-left">
              <h1 className="font-bold text-gray-700">Deliver to</h1>
              <p className="text-sm text-gray-600">{currentLocation.address}, {currentLocation.city}</p>
            </div>
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-primary font-bold text-lg">Paiko</div>
            <Button variant="ghost" size="sm" className="relative" onClick={togglePanel}>
              <Bell className="text-gray-600 h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="relative" onClick={toggleCart}>
              <ShoppingCart className="text-gray-600 h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
