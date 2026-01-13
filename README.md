# Project Hub

Project Hub is a developer-focused project management application designed to track personal projects, features, bugs, and improvements.

## Features

- **Project Tracking**: Manage multiple projects with descriptions, links, and environment variables.
- **Task Management**: Track Features, Improvements, and Bugs for each project.
- **Priority Ranking**: Rank tasks to prioritize important work.
- **Tagging System**: Categorize tasks using a multi-select autocomplete tag selector.
- **Activity Log**: View a chronological history of all changes made to your projects.
- **Authentication**: Secure login using Replit Auth.

## Getting Started

Follow these steps to get the project up and running in your Replit environment.

### Prerequisites

- A Replit account.
- A PostgreSQL database (provisioned automatically by Replit).

### Setup Instructions

1. **Environment Variables**:
   Ensure the following environment variables are set in your Replit Secrets:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `SESSION_SECRET`: A secure string for session encryption.

2. **Install Dependencies**:
   The project uses Node.js. Dependencies are managed via npm.
   ```bash
   npm install
   ```

3. **Database Schema**:
   Push the Drizzle schema to your PostgreSQL database:
   ```bash
   npm run db:push
   ```

4. **Running the Application**:
   Start the development server (Express backend and Vite frontend):
   ```bash
   npm run dev
   ```
   The application will be available on port 5000.

### Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the frontend and backend for production.
- `npm run start`: Starts the production server.
- `npm run db:push`: Syncs the database schema with Drizzle.
- `npm run db:studio`: Opens Drizzle Studio to explore your database.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, TanStack Query.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL with Drizzle ORM.
- **Authentication**: Replit Auth.
