# Paiko - Grocery Delivery Platform

## Overview

Paiko is a full-stack grocery delivery platform built with React, Express.js, and PostgreSQL. The app features a modern mobile-first UI with shadcn/ui components, session-based cart management, real-time order tracking, and comprehensive store/product management. The application follows a monorepo structure with shared TypeScript schemas and uses Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and custom React context for cart management
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful endpoints for stores, products, orders, and cart management
- **Session Management**: Session-based cart storage without user authentication
- **Development Setup**: Hot reload with Vite integration in development mode

### Database Design
- **Primary Database**: PostgreSQL (configured via Drizzle)
- **Backup Storage**: In-memory storage implementation for development/testing
- **Schema Management**: Shared TypeScript schemas with Zod validation
- **Tables**: stores, products, orders, cart_items with proper foreign key relationships

## Key Components

### Database Schema (shared/schema.ts)
- **Stores**: Store information with ratings, delivery details, and operating status
- **Products**: Product catalog linked to stores with pricing and availability
- **Orders**: Order management with JSON-stored items and status tracking
- **Cart Items**: Session-based cart with product references and quantities

### API Endpoints (server/routes.ts)
- **Store Management**: GET /api/stores, GET /api/stores/:id
- **Product Catalog**: GET /api/products with filtering by store and search
- **Order Processing**: GET /api/orders, POST /api/orders, PATCH /api/orders/:id
- **Cart Operations**: GET /api/cart, POST /api/cart, PATCH /api/cart/:id, DELETE /api/cart/:id

### Frontend Pages
- **Home**: Store directory, popular products, recent orders, and category browsing
- **Store**: Individual store pages with product listings
- **Search**: Universal search across stores and products
- **Compare**: Price comparison across stores for similar products
- **Orders**: Order history and status tracking
- **Profile**: User account management (UI only)

### UI Components
- **Store Cards**: Display store information with ratings and delivery details
- **Product Cards**: Product listings with add-to-cart functionality
- **Cart Modal**: Sliding cart interface with quantity management and checkout
- **Bottom Navigation**: Mobile-optimized navigation between main sections
- **Price Comparison**: Side-by-side product comparison with best price highlighting
- **Header**: Top navigation with Paiko branding, location, and cart access

## Data Flow

### Cart Management
1. Items added to session-based cart via API
2. Cart state managed through React Query with automatic invalidation
3. Real-time updates reflected in cart modal and navigation badges
4. Checkout converts cart items to orders and clears cart

### Order Processing
1. Orders created from cart items with store and pricing information
2. Order status tracked through predefined states (pending → confirmed → preparing → in_transit → delivered)
3. Order history displayed with formatted status indicators

### Product Discovery
1. Stores and products loaded via separate API endpoints
2. Search functionality filters across both stores and products
3. Category-based browsing supported through product categories
4. Store-specific product listings with filtering capabilities

## External Dependencies

### UI and Styling
- **shadcn/ui**: Complete component library with Radix UI primitives
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe variant handling for components

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching and background updates
- **React Hook Form**: Form handling with Zod schema validation
- **Wouter**: Lightweight routing without React Router overhead

### Backend and Database
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Zod**: Runtime type validation for API inputs and database schemas

### Development Tools
- **Vite**: Fast development server with Hot Module Replacement
- **ESBuild**: Production bundling for server-side code
- **TypeScript**: End-to-end type safety across frontend, backend, and database

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with proxy to Express backend
- Express server with hot reload via tsx
- Database migrations managed through Drizzle Kit
- Replit-specific development tools and banner integration

### Production Build
- Frontend assets built to dist/public via Vite
- Backend code bundled with ESBuild for Node.js runtime
- Static file serving through Express in production mode
- Database schema deployment via Drizzle migrations

### Environment Configuration
- Database connection via DATABASE_URL environment variable
- Conditional development vs production behavior
- Replit-specific cartographer integration for development
- Error handling with custom error modal overlay