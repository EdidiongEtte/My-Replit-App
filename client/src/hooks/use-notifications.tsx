import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@shared/schema";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "delivery" | "promo" | "system";
  timestamp: Date;
  read: boolean;
  orderId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  isOpen: boolean;
  togglePanel: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Fetch orders to generate notifications
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    refetchInterval: 30000, // Check for updates every 30 seconds
  });

  // Initialize with sample notifications
  useEffect(() => {
    if (!initialized) {
      const sampleNotifications: Notification[] = [
        {
          id: "welcome-1",
          title: "Welcome to Paiko!",
          message: "Start exploring our stores and get free delivery on your first order over $30.",
          type: "promo",
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          read: false,
        },
        {
          id: "stores-available",
          title: "Two Stores Available",
          message: "FreshMart Grocery and QuickStop Market are now delivering in your area.",
          type: "system",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
        },
      ];

      // Add order notifications if orders exist
      if (orders && orders.length > 0) {
        const orderNotifications: Notification[] = orders.map(order => {
          let message = "";
          let type: Notification["type"] = "order";
          
          switch (order.status) {
            case "confirmed":
              message = `Your order from ${order.storeName} has been confirmed!`;
              break;
            case "preparing":
              message = `Your order from ${order.storeName} is being prepared.`;
              break;
            case "in_transit":
              message = `Your order from ${order.storeName} is on the way!`;
              type = "delivery";
              break;
            case "delivered":
              message = `Your order from ${order.storeName} has been delivered.`;
              type = "delivery";
              break;
            default:
              message = `Order update: ${order.status}`;
          }

          return {
            id: `order-${order.id}`,
            title: "Order Update",
            message,
            type,
            timestamp: new Date(order.createdAt || Date.now()),
            read: false,
            orderId: order.id,
          };
        });

        sampleNotifications.unshift(...orderNotifications);
      }

      // Sort and limit notifications
      const sortedNotifications = sampleNotifications
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);

      setNotifications(sortedNotifications);
      setInitialized(true);
    }
  }, [orders, initialized]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      isOpen,
      togglePanel,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}