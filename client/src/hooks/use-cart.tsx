import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Product, CartItem } from "@shared/schema";

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

interface CartContextType {
  items: CartItemWithProduct[];
  isOpen: boolean;
  toggleCart: () => void;
  addToCart: any;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  getTotalPrice: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const sessionId = 'default-session';

  const { data: cartItems = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (!response.ok) {
        console.warn('Cart API failed, returning empty cart');
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    refetchOnWindowFocus: true,
  });

  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: string; quantity: number; sessionId: string }) =>
      apiRequest("POST", `/api/cart?sessionId=${sessionId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      apiRequest("PATCH", `/api/cart/${id}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cart/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/cart?sessionId=${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    },
  });

  const toggleCart = () => setIsOpen(!isOpen);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCartMutation.mutate(id);
    } else {
      updateQuantityMutation.mutate({ id, quantity });
    }
  };

  const removeFromCart = (id: string) => {
    removeFromCartMutation.mutate(id);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.product?.price || "0");
      return total + (price * item.quantity);
    }, 0);
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  return (
    <CartContext.Provider value={{
      items: cartItems,
      isOpen,
      toggleCart,
      addToCart: addToCartMutation,
      updateQuantity,
      removeFromCart,
      getTotalPrice,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
