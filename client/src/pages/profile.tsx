import { ArrowLeft, MapPin, User, Settings, CreditCard, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Profile() {
  const profileSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Personal Information", description: "Update your name, email, and phone" },
        { icon: MapPin, label: "Addresses", description: "Manage your delivery addresses" },
        { icon: CreditCard, label: "Payment Methods", description: "Add or update payment options" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Settings, label: "App Settings", description: "Notifications, language, and more" },
        { icon: HelpCircle, label: "Help & Support", description: "FAQ, contact us, and feedback" },
      ]
    }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center">
          <Link href="/">
            <Button size="sm" variant="ghost" className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Profile</h1>
        </div>
      </div>

      <div className="p-6">
        {/* User Info Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">John Doe</h2>
                <p className="text-gray-600">john.doe@example.com</p>
                <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center">
              <MapPin className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">123 Main St, City, State 12345</span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Sections */}
        <div className="space-y-6">
          {profileSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-bold text-gray-800 mb-3">{section.title}</h3>
              <Card>
                <CardContent className="p-0">
                  {section.items.map((item, index) => (
                    <button
                      key={item.label}
                      className={`w-full flex items-center p-4 text-left hover:bg-gray-50 transition-colors ${
                        index !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <item.icon className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-[-45deg]"></div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive hover:text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">FreshCart v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">© 2024 FreshCart. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
