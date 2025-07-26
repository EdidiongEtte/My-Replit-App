import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Order } from "@shared/schema";

export default function Orders() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const getStatusColor = (status: string) => {
    const colors = {
      delivered: "bg-success text-white",
      in_transit: "bg-warning text-white",
      preparing: "bg-blue-500 text-white",
      confirmed: "bg-blue-500 text-white",
      pending: "bg-gray-500 text-white",
      cancelled: "bg-destructive text-white"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center">
          <Link href="/">
            <Button size="sm" variant="ghost" className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = JSON.parse(order.items);
              const totalFloat = parseFloat(order.total);
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{order.storeName}</h3>
                      <p className="text-sm text-gray-500">
                        Order #{order.id.slice(-8)}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Items:</p>
                    <div className="space-y-1">
                      {items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-gray-500">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">Total</span>
                      <span className="font-bold text-gray-800">
                        ${totalFloat.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <div className="space-x-2">
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        )}
                        {(order.status === 'in_transit' || order.status === 'preparing') && (
                          <Button variant="outline" size="sm">
                            Track Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
