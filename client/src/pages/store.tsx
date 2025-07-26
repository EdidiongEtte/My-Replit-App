import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ArrowLeft, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { Link } from "wouter";
import type { Store, Product } from "@shared/schema";

export default function Store() {
  const [match, params] = useRoute("/store/:id");
  const storeId = params?.id;

  const { data: store, isLoading: storeLoading } = useQuery<Store>({
    queryKey: ["/api/stores", storeId],
    enabled: !!storeId,
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (data) => data.filter(product => product.storeId === storeId),
    enabled: !!storeId,
  });

  if (storeLoading) {
    return (
      <div className="pb-20">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="pb-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Store not found</h2>
          <Link href="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFeeFloat = parseFloat(store.deliveryFee);
  const freeDeliveryMin = store.freeDeliveryMinimum ? parseFloat(store.freeDeliveryMinimum) : null;

  return (
    <div className="pb-20">
      {/* Store Header */}
      <div className="relative">
        <img 
          src={store.image}
          alt={store.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button size="sm" variant="secondary" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <div className="bg-success text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {store.deliveryTime}
          </div>
          <div className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <Star className="w-3 h-3 mr-1 text-warning fill-current" />
            {store.rating}
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-white p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{store.name}</h1>
        <p className="text-gray-600 mb-4">{store.description}</p>
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

      {/* Products */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Products</h2>
        {productsLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No products available at this store.</p>
          </div>
        )}
      </div>
    </div>
  );
}
