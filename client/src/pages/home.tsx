import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import StoreCard from "@/components/store-card";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, Leaf, DollarSign, Star } from "lucide-react";
import { Link } from "wouter";
import type { Store, Product, Order } from "@shared/schema";

const categories = [
  {
    name: "Fresh Produce",
    description: "Fruits & Vegetables",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120"
  },
  {
    name: "Dairy & Eggs",
    description: "Milk, Cheese & More",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120"
  },
  {
    name: "Bakery",
    description: "Fresh Bread & Pastries",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120"
  },
  {
    name: "Pantry",
    description: "Canned & Dry Goods",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120"
  }
];

export default function Home() {
  const { data: stores, isLoading: storesLoading } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const popularProducts = products?.slice(0, 4) || [];
  const recentOrders = orders?.slice(0, 2) || [];

  return (
    <div className="pb-20">
      <Header />
      
      {/* Search Bar */}
      <div className="px-6 py-4 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search stores and products..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="px-6 py-2">
        <div className="flex space-x-3 overflow-x-auto">
          <Button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            <Clock className="w-3 h-3 mr-1" />
            Fast Delivery
          </Button>
          <Button variant="outline" className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            <Leaf className="w-3 h-3 mr-1" />
            Organic
          </Button>
          <Button variant="outline" className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            <DollarSign className="w-3 h-3 mr-1" />
            Best Price
          </Button>
          <Button variant="outline" className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
            <Star className="w-3 h-3 mr-1" />
            Top Rated
          </Button>
        </div>
      </div>

      <main>
        {/* Featured Stores */}
        <section className="px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Featured Stores Near You</h2>
          <div className="space-y-4">
            {storesLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              stores?.map((store) => (
                <Link key={store.id} href={`/store/${store.id}`}>
                  <a>
                    <StoreCard store={store} />
                  </a>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Category Grid */}
        <section className="px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <div key={category.name} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-center">
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-20 object-cover rounded-lg mb-3"
                />
                <h3 className="font-medium text-gray-800">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Orders */}
        <section className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <Link href="/orders">
              <Button variant="ghost" className="text-primary font-medium text-sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              recentOrders.map((order) => {
                const items = JSON.parse(order.items);
                const statusColor = {
                  delivered: "bg-success text-white",
                  in_transit: "bg-warning text-white",
                  preparing: "bg-blue-500 text-white",
                  confirmed: "bg-blue-500 text-white",
                  pending: "bg-gray-500 text-white",
                  cancelled: "bg-destructive text-white"
                }[order.status] || "bg-gray-500 text-white";

                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800">{order.storeName}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
                        {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {items.map((item: any) => item.name).join(", ")} • {items.length} items
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <Button variant="ghost" className="text-primary text-sm font-medium h-auto p-0">
                        {order.status === 'delivered' ? 'Reorder' : 'Track Order'}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Popular Products */}
        <section className="px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Right Now</h2>
          <div className="grid grid-cols-2 gap-4">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </section>

        {/* Delivery Promo */}
        <section className="px-6 py-4">
          <div className="bg-gradient-to-r from-primary to-green-600 rounded-lg p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Free Delivery Weekend!</h3>
              <p className="text-sm mb-4 opacity-90">Get free delivery on orders over $25. Valid until Sunday.</p>
              <Button className="bg-white text-primary font-medium px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
                Shop Now
              </Button>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120"
              alt="Food delivery person on bicycle with groceries"
              className="absolute right-4 top-4 w-16 h-16 object-cover rounded-lg opacity-20"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
