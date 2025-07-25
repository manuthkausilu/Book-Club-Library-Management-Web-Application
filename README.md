# Book Club Library Management System

A full-stack application for managing a book club library, built with React, TypeScript, Vite (FrontEnd), and Node.js, Express, MongoDB (BackEnd).

## Features

- **Readers Management:** Add, edit, delete, and view readers.
- **Books Management:** Add, edit, delete, and view books.
- **Lending Management:** Lend books to readers, mark lending as complete, delete lending records.
- **Overdue Management:** Track overdue lendings, notify readers, and view overdue statistics.
- **Authentication:** (If implemented) Secure access to admin features.

## Project Structure

```
BackEnd/
  src/
    controllers/      # Express controllers for books, readers, lending, auth
    db/               # Database connection
    errors/           # Custom error classes
    middlewares/      # Express middlewares
    models/           # Mongoose models
    routes/           # API route definitions
    service/          # Business logic (e.g., mail service)
  .env                # Environment variables
  package.json        # Backend dependencies and scripts

FrontEnd/
  src/
    components/       # React components (tables, forms, sidebar, dialogs)
    pages/            # Page-level components (Books, Readers, Lending, Overdue)
    services/         # API service functions
    types/            # TypeScript types
    assets/           # Static assets
    App.tsx           # Main app component
    router.tsx        # Routing setup
  public/             # Static files
  index.html          # HTML entry point
  package.json        # Frontend dependencies and scripts
```

## Getting Started

### Backend

1. **Install dependencies:**
   ```sh
   cd BackEnd
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and set your MongoDB URI and other variables.
3. **Run the server:**
   ```sh
   npm run dev
   ```
   - Uses Nodemon for hot-reloading.

### Frontend

1. **Install dependencies:**
   ```sh
   cd FrontEnd
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
   - Opens the app in your browser via Vite.

## Usage

- Access the admin panel via the FrontEnd app.
- Manage readers, books, and lending records.
- View overdue lendings and send notifications.

## Technologies

- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Other:** ESLint, Axios, React Hot Toast


