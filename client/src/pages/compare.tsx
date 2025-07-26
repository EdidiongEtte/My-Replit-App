import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search as SearchIcon, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Store, Product } from "@shared/schema";

interface ProductWithStore extends Product {
  store?: Store;
}

export default function Compare() {
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: stores = [] } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Group products by name for comparison
  const getProductGroups = () => {
    const groups: { [key: string]: ProductWithStore[] } = {};
    
    products.forEach(product => {
      const store = stores.find(s => s.id === product.storeId);
      const productWithStore = { ...product, store };
      
      // Normalize product names for grouping (remove common variations)
      const normalizedName = product.name
        .toLowerCase()
        .replace(/\b(organic|fresh|farm|local)\b/g, '')
        .trim();
      
      if (!groups[normalizedName]) {
        groups[normalizedName] = [];
      }
      groups[normalizedName].push(productWithStore);
    });

    // Filter out groups with only one product and apply search filter
    return Object.entries(groups)
      .filter(([name, products]) => {
        const hasMultipleStores = products.length > 1;
        const matchesSearch = searchQuery === '' || 
          name.includes(searchQuery.toLowerCase()) ||
          products.some(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.store?.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        return hasMultipleStores && matchesSearch;
      })
      .map(([name, products]) => ({
        name: products[0].name.replace(/\b(organic|fresh|farm|local)\b/gi, '').trim(),
        products: products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      }));
  };

  const productGroups = getProductGroups();

  const handleAddToCart = (product: Product) => {
    addToCart.mutate({
      productId: product.id,
      quantity: 1,
      sessionId: 'default-session'
    }, {
      onSuccess: () => {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        });
      },
      onError: () => {
        toast({
          title: "Failed to add to cart",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    });
  };

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
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">Compare Prices</h1>
            <p className="text-sm text-gray-600">Find the best deals across stores</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products to compare..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-gray-50 border-0 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {productGroups.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {searchQuery ? `No comparable products found for "${searchQuery}"` : "No comparable products found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? "Try searching with different keywords" : "Products need to be available in multiple stores to compare"}
            </p>
            <Link href="/">
              <Button>Browse Stores</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-sm text-gray-600 mb-4">
              Found {productGroups.length} products available across multiple stores
            </div>
            
            {productGroups.map((group, groupIndex) => (
              <Card key={groupIndex}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">{group.name}</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {group.products.map((product, index) => {
                      const isLowestPrice = index === 0;
                      const priceFloat = parseFloat(product.price);
                      const lowestPrice = parseFloat(group.products[0].price);
                      const savings = priceFloat - lowestPrice;
                      
                      return (
                        <div 
                          key={product.id} 
                          className={`relative border rounded-lg p-4 ${
                            isLowestPrice 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          {isLowestPrice && (
                            <div className="absolute -top-2 left-4 bg-primary text-white text-xs px-2 py-1 rounded">
                              Best Price
                            </div>
                          )}
                          
                          <div className="flex items-start space-x-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 text-sm leading-tight">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {product.store?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.description}
                              </p>
                              
                              <div className="mt-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className={`text-lg font-bold ${
                                      isLowestPrice ? 'text-primary' : 'text-gray-800'
                                    }`}>
                                      ${priceFloat.toFixed(2)}
                                    </span>
                                    {!isLowestPrice && savings > 0 && (
                                      <span className="text-xs text-red-500 block">
                                        +${savings.toFixed(2)} vs lowest
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    className="w-8 h-8 rounded-full p-0"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={addToCart.isPending || !product.inStock}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {group.products.length > 1 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Price Range: </span>
                        ${parseFloat(group.products[0].price).toFixed(2)} - ${parseFloat(group.products[group.products.length - 1].price).toFixed(2)}
                        <span className="ml-4 font-medium">Max Savings: </span>
                        ${(parseFloat(group.products[group.products.length - 1].price) - parseFloat(group.products[0].price)).toFixed(2)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}