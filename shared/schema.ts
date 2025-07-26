import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stores = pgTable("stores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  deliveryTime: text("delivery_time").notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 4, scale: 2 }).notNull(),
  freeDeliveryMinimum: decimal("free_delivery_minimum", { precision: 4, scale: 2 }),
  isOpen: boolean("is_open").notNull().default(true),
  category: text("category").notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storeId: varchar("store_id").references(() => stores.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  price: decimal("price", { precision: 6, scale: 2 }).notNull(),
  category: text("category").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storeId: varchar("store_id").references(() => stores.id).notNull(),
  storeName: text("store_name").notNull(),
  items: text("items").notNull(), // JSON string
  total: decimal("total", { precision: 8, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'pending', 'confirmed', 'preparing', 'in_transit', 'delivered', 'cancelled'
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  sessionId: text("session_id").notNull(), // For session-based cart
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export type Store = typeof stores.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
