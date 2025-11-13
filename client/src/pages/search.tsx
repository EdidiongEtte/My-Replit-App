import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search as SearchIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/product-card";
import StoreCard from "@/components/store-card";
import { Link } from "wouter";
import type { Store, Product } from "@shared/schema";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"stores" | "products">("products");

  const { data: stores, isLoading: storesLoading } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (data) => searchQuery 
      ? data.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : data,
  });

  const filteredStores = stores?.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center space-x-3">
          <Link href="/">
            <Button size="sm" variant="ghost">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for stores, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-gray-50 border-0 focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="px-6 pb-4">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "products"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("stores")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "stores"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Stores
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {activeTab === "products" ? (
          <div>
            {productsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-32 md:h-40 lg:h-48 bg-gray-200"></div>
                    <div className="p-3">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                  {searchQuery ? `Results for "${searchQuery}"` : "All Products"} ({products.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ) : searchQuery ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No products found for "{searchQuery}"
                </h3>
                <p className="text-gray-600">Try searching with different keywords</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            {storesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-40 md:h-48 lg:h-56 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredStores.length > 0 ? (
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                  {searchQuery ? `Stores for "${searchQuery}"` : "All Stores"} ({filteredStores.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredStores.map((store) => (
                    <Link key={store.id} href={`/store/${store.id}`}>
                      <StoreCard store={store} />
                    </Link>
                  ))}
                </div>
              </div>
            ) : searchQuery ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No stores found for "{searchQuery}"
                </h3>
                <p className="text-gray-600">Try searching with different keywords</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
