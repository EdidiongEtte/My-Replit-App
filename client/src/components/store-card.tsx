import { Star, Clock } from "lucide-react";
import type { Store } from "@shared/schema";

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  const deliveryFeeFloat = parseFloat(store.deliveryFee);
  const freeDeliveryMin = store.freeDeliveryMinimum ? parseFloat(store.freeDeliveryMinimum) : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-40 md:h-48 lg:h-56 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-success text-white px-2 py-1 rounded text-xs font-medium flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {store.deliveryTime}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white text-gray-700 px-2 py-1 rounded text-xs font-medium flex items-center">
            <Star className="w-3 h-3 mr-1 text-warning fill-current" />
            {store.rating}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{store.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{store.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            ${deliveryFeeFloat.toFixed(2)} delivery fee
          </span>
          {freeDeliveryMin && (
            <span className="text-sm text-primary font-medium">
              Free delivery on ${freeDeliveryMin.toFixed(0)}+
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
