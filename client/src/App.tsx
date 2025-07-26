import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Store from "@/pages/store";
import Orders from "@/pages/orders";
import Search from "@/pages/search";
import Profile from "@/pages/profile";
import Compare from "@/pages/compare";
import BottomNavigation from "@/components/bottom-navigation";
import CartModal from "@/components/cart-modal";
import { CartProvider } from "@/hooks/use-cart";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/store/:id" component={Store} />
        <Route path="/orders" component={Orders} />
        <Route path="/search" component={Search} />
        <Route path="/compare" component={Compare} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      
      <BottomNavigation />
      <CartModal />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
