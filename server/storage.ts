import { type Store, type Product, type Order, type CartItem, type InsertStore, type InsertProduct, type InsertOrder, type InsertCartItem } from "@shared/schema";
import { stores, products, orders, cartItems } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Stores
  getStores(): Promise<Store[]>;
  getStore(id: string): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductsByStore(storeId: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private stores: Map<string, Store>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.stores = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.cartItems = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed stores
    const storeData = [
      {
        id: "store-1",
        name: "FreshMart Grocery",
        description: "Fresh produce, pantry essentials & more",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
        rating: "4.8",
        deliveryTime: "15-25 min",
        deliveryFee: "3.99",
        freeDeliveryMinimum: "35.00",
        isOpen: true,
        category: "grocery"
      },
      {
        id: "store-2", 
        name: "QuickStop Market",
        description: "Convenience store essentials & snacks",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
        rating: "4.6",
        deliveryTime: "25-35 min",
        deliveryFee: "2.99",
        freeDeliveryMinimum: null,
        isOpen: true,
        category: "convenience"
      },
      {
        id: "store-3",
        name: "Naija Foods Market",
        description: "Authentic Nigerian groceries & snacks",
        image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
        rating: "4.9",
        deliveryTime: "20-30 min",
        deliveryFee: "3.49",
        freeDeliveryMinimum: "40.00",
        isOpen: true,
        category: "african"
      }
    ];

    storeData.forEach(store => {
      const storeRecord: Store = {
        ...store,
        freeDeliveryMinimum: store.freeDeliveryMinimum || null,
        isOpen: store.isOpen ?? true
      };
      this.stores.set(store.id, storeRecord);
    });

    // Seed products
    const productData = [
      // FreshMart Grocery products
      {
        id: "product-1",
        storeId: "store-1",
        name: "Organic Bananas",
        description: "1 bunch (6-8 pieces)",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "2.99",
        category: "produce",
        inStock: true
      },
      {
        id: "product-2",
        storeId: "store-1",
        name: "Whole Milk",
        description: "1 gallon",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "4.49",
        category: "dairy",
        inStock: true
      },
      {
        id: "product-3",
        storeId: "store-1",
        name: "Whole Grain Bread",
        description: "1 loaf",
        image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "3.79",
        category: "bakery",
        inStock: true
      },
      {
        id: "product-4",
        storeId: "store-1",
        name: "Farm Fresh Eggs",
        description: "12 count",
        image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "5.99",
        category: "dairy",
        inStock: true
      },
      {
        id: "product-5",
        storeId: "store-1",
        name: "Fresh Apples",
        description: "1 lb bag",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "3.49",
        category: "produce",
        inStock: true
      },
      // QuickStop Market products (similar items with different prices)
      {
        id: "product-6",
        storeId: "store-2",
        name: "Bananas",
        description: "1 bunch (6-8 pieces)",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "3.29",
        category: "produce",
        inStock: true
      },
      {
        id: "product-7",
        storeId: "store-2",
        name: "Milk",
        description: "1 gallon",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "4.79",
        category: "dairy",
        inStock: true
      },
      {
        id: "product-8",
        storeId: "store-2",
        name: "White Bread",
        description: "1 loaf",
        image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "2.99",
        category: "bakery",
        inStock: true
      },
      {
        id: "product-9",
        storeId: "store-2",
        name: "Large Eggs",
        description: "12 count",
        image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "5.49",
        category: "dairy",
        inStock: true
      },
      {
        id: "product-10",
        storeId: "store-2",
        name: "Red Apples",
        description: "1 lb bag",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "3.99",
        category: "produce",
        inStock: true
      },
      {
        id: "product-11",
        storeId: "store-2",
        name: "Instant Coffee",
        description: "8 oz jar",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "6.99",
        category: "pantry",
        inStock: true
      },
      {
        id: "product-12",
        storeId: "store-2",
        name: "Potato Chips",
        description: "Family size bag",
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "4.29",
        category: "snacks",
        inStock: true
      },
      // Naija Foods Market products
      {
        id: "product-13",
        storeId: "store-3",
        name: "Indomie Noodles",
        description: "Pack of 5 - Chicken flavor",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "4.99",
        category: "pantry",
        inStock: true
      },
      {
        id: "product-14",
        storeId: "store-3",
        name: "Nigerian Meat Pies",
        description: "4 pieces - Freshly baked",
        image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "7.99",
        category: "snacks",
        inStock: true
      },
      {
        id: "product-15",
        storeId: "store-3",
        name: "Maggi Seasoning Cubes",
        description: "50 cubes pack",
        image: "https://images.unsplash.com/photo-1596040033229-a0b3b9333a3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "5.49",
        category: "pantry",
        inStock: true
      },
      {
        id: "product-16",
        storeId: "store-3",
        name: "Jollof Rice Mix",
        description: "500g - Authentic blend",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "6.99",
        category: "pantry",
        inStock: true
      },
      {
        id: "product-17",
        storeId: "store-3",
        name: "Plantain Chips",
        description: "250g bag - Spicy",
        image: "https://images.unsplash.com/photo-1628773822990-202e9de55607?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "3.99",
        category: "snacks",
        inStock: true
      },
      {
        id: "product-18",
        storeId: "store-3",
        name: "Suya Spice Mix",
        description: "100g - Premium blend",
        image: "https://images.unsplash.com/photo-1596040033229-a0b3b9333a3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "4.49",
        category: "pantry",
        inStock: true
      },
      {
        id: "product-19",
        storeId: "store-3",
        name: "Chin Chin Snacks",
        description: "300g - Crunchy & sweet",
        image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "5.99",
        category: "snacks",
        inStock: true
      },
      {
        id: "product-20",
        storeId: "store-3",
        name: "Palm Oil",
        description: "1 liter - Authentic red palm oil",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "8.99",
        category: "pantry",
        inStock: true
      },
      {
        id: "product-21",
        storeId: "store-3",
        name: "Garri (White)",
        description: "2kg - Premium quality",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "9.99",
        category: "pantry",
        inStock: true
      },
      {
        id: "product-22",
        storeId: "store-3",
        name: "Zobo Drink (Hibiscus)",
        description: "1 liter - Refreshing",
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=160",
        price: "4.99",
        category: "beverages",
        inStock: true
      }
    ];

    productData.forEach(product => {
      const productRecord: Product = {
        ...product,
        inStock: product.inStock ?? true
      };
      this.products.set(product.id, productRecord);
    });

    // Seed sample orders
    const orderData = [
      {
        id: "order-1",
        storeId: "store-1",
        storeName: "FreshMart Grocery",
        items: JSON.stringify([
          { name: "Bananas", quantity: 1, price: 2.99 },
          { name: "Milk", quantity: 1, price: 4.49 },
          { name: "Bread", quantity: 1, price: 3.79 },
          { name: "Eggs", quantity: 1, price: 5.99 }
        ]),
        total: "21.25",
        status: "delivered",
        deliveryAddress: "123 Main St, City",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        id: "order-2",
        storeId: "store-2",
        storeName: "QuickStop Market",
        items: JSON.stringify([
          { name: "Coffee", quantity: 1, price: 3.99 },
          { name: "Chips", quantity: 1, price: 2.49 },
          { name: "Sandwich", quantity: 1, price: 6.99 }
        ]),
        total: "16.46",
        status: "in_transit",
        deliveryAddress: "123 Main St, City",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ];

    orderData.forEach(order => this.orders.set(order.id, order as Order));
  }

  // Store methods
  async getStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }

  async getStore(id: string): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const id = randomUUID();
    const store: Store = { 
      ...insertStore, 
      id,
      freeDeliveryMinimum: insertStore.freeDeliveryMinimum || null,
      isOpen: insertStore.isOpen ?? true
    };
    this.stores.set(id, store);
    return store;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByStore(storeId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.storeId === storeId);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) || 
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      inStock: insertProduct.inStock ?? true
    };
    this.products.set(id, product);
    return product;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.productId === insertCartItem.productId && item.sessionId === insertCartItem.sessionId
    );

    if (existingItem) {
      // Update quantity
      const updatedItem = { ...existingItem, quantity: existingItem.quantity + (insertCartItem.quantity || 1) };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    } else {
      // Create new cart item
      const id = randomUUID();
      const cartItem: CartItem = { 
        ...insertCartItem, 
        id,
        quantity: insertCartItem.quantity || 1
      };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (cartItem) {
      if (quantity <= 0) {
        this.cartItems.delete(id);
        return undefined;
      }
      const updatedItem = { ...cartItem, quantity };
      this.cartItems.set(id, updatedItem);
      return updatedItem;
    }
    return undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const cartItems = await this.getCartItems(sessionId);
    cartItems.forEach(item => this.cartItems.delete(item.id));
    return true;
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async getStore(id: string): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store || undefined;
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db
      .insert(stores)
      .values(insertStore)
      .returning();
    return store;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByStore(storeId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.storeId, storeId));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const allProducts = await db.select().from(products);
    const lowercaseQuery = query.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) || 
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async getOrders(): Promise<Order[]> {
    const orderList = await db.select().from(orders);
    return orderList.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItems = await db
      .select()
      .from(cartItems)
      .where(and(
        eq(cartItems.productId, insertCartItem.productId),
        eq(cartItems.sessionId, insertCartItem.sessionId)
      ));

    if (existingItems.length > 0) {
      // Update quantity
      const existingItem = existingItems[0];
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + (insertCartItem.quantity || 1) })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Create new cart item
      const [cartItem] = await db
        .insert(cartItems)
        .values({
          ...insertCartItem,
          quantity: insertCartItem.quantity || 1
        })
        .returning();
      return cartItem;
    }
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    if (quantity <= 0) {
      await db.delete(cartItems).where(eq(cartItems.id, id));
      return undefined;
    }
    
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem || undefined;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return (result.rowCount || 0) >= 0;
  }
}

// Initialize storage - temporarily use MemStorage due to database connection issues
export const storage = new MemStorage();

// Keep DatabaseStorage available when database is fixed
export const dbStorage = new DatabaseStorage();
