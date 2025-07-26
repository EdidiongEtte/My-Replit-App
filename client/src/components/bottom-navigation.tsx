import { Home, Search, Receipt, User, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: BarChart3, label: "Compare", path: "/compare" },
    { icon: Receipt, label: "Orders", path: "/orders" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <button className={`flex flex-col items-center py-2 ${
                isActive ? "text-primary" : "text-gray-400"
              }`}>
                <item.icon className="text-lg mb-1 h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
