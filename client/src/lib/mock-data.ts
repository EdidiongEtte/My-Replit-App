// This file is intentionally minimal as we're using real API data from the backend
// Any additional mock data can be added here if needed

export const DELIVERY_LOCATIONS = [
  "123 Main St, City",
  "456 Oak Ave, Town", 
  "789 Elm St, Village"
];

export const FILTER_OPTIONS = {
  deliveryTime: ["Fast Delivery", "Standard", "Scheduled"],
  priceRange: ["Under $25", "$25-$50", "Over $50"],
  dietary: ["Organic", "Gluten-Free", "Vegan", "Keto"],
  rating: ["4+ Stars", "3+ Stars", "All Ratings"]
};
