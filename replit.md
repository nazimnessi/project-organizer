# Project Hub

## Overview

Project Hub is a developer-focused project management application that allows users to track projects along with their features, bugs, and improvements. The application provides a dashboard interface where authenticated users can create projects, manage tasks across different categories (features, bugs, improvements), and view activity logs. The system uses Replit Auth for authentication and PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Routing**: Wouter for client-side routing with protected route handling
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (dark theme by default)
- **Animations**: Framer Motion for page transitions and layout animations
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with typed route definitions in shared/routes.ts
- **Build Process**: Custom build script using esbuild for server bundling and Vite for client

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: shared/schema.ts contains all table definitions
- **Migrations**: Drizzle Kit for schema management (`npm run db:push`)
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Authentication
- **Provider**: Replit Auth via OpenID Connect
- **Session Management**: Express sessions stored in PostgreSQL
- **Implementation**: Located in server/replit_integrations/auth/
- **User Storage**: Users table with profile information synced from Replit

### Project Structure
```
client/           # React frontend application
  src/
    components/   # Reusable UI components
    hooks/        # Custom React hooks
    lib/          # Utility functions and query client
    pages/        # Page components (Landing, Dashboard)
server/           # Express backend
  replit_integrations/auth/  # Replit Auth implementation
shared/           # Shared code between client and server
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod schemas
  models/         # Shared data models
```

### Key Design Patterns
- **Shared Schema Validation**: Zod schemas defined in shared/ are used for both API validation and TypeScript types
- **Query Key Conventions**: API paths used as query keys for React Query caching
- **Storage Interface**: IStorage interface in server/storage.ts abstracts database operations
- **Component Library**: shadcn/ui components in client/src/components/ui/ provide consistent styling

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via DATABASE_URL environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit Auth**: OpenID Connect authentication provider
- **Required Environment Variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `SESSION_SECRET`: Secret for session encryption
  - `ISSUER_URL`: Replit OIDC issuer (defaults to https://replit.com/oidc)
  - `REPL_ID`: Replit environment identifier

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `express-session` / `connect-pg-simple`: Session management
- `openid-client` / `passport`: Authentication
- `framer-motion`: Animations
- `date-fns`: Date formatting
- `react-markdown`: Markdown rendering for project descriptions