import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
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

  const priceFloat = parseFloat(product.price);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-3">
        <h3 className="font-medium text-gray-800 text-sm">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">${priceFloat.toFixed(2)}</span>
          <Button
            size="sm"
            className="w-6 h-6 rounded-full p-0"
            onClick={handleAddToCart}
            disabled={addToCart.isPending || !product.inStock}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
