import { X, Bell, Package, Truck, Gift, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications, type Notification } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";

const NotificationIcon = ({ type }: { type: Notification["type"] }) => {
  const iconClass = "h-4 w-4";
  
  switch (type) {
    case "order":
      return <Package className={`${iconClass} text-blue-500`} />;
    case "delivery":
      return <Truck className={`${iconClass} text-green-500`} />;
    case "promo":
      return <Gift className={`${iconClass} text-purple-500`} />;
    case "system":
      return <Info className={`${iconClass} text-gray-500`} />;
    default:
      return <Bell className={`${iconClass} text-gray-500`} />;
  }
};

export default function NotificationPanel() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isOpen, togglePanel } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-sm h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
            <Button variant="ghost" size="sm" onClick={togglePanel}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {unreadCount} unread
            </span>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">No notifications</h4>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <NotificationIcon type={notification.type} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`text-sm ${
                      !notification.read ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}