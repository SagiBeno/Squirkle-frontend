# Squirkle – Frontend Documentation

---

## Application Purpose

Squirkle is a browser-based gaming platform that integrates a Unity WebGL game into a modern web interface.

Users can:
- defeat enemies
- collect items and in-game currency
- unlock new areas
- trade items through an auction system

The goal of the application is to provide an interactive and engaging gameplay experience within a web environment.

---

## Features and Functionality

### Main Features

- **User Management (Authentication)**
  - Google-based login
  - username creation

- **Game (Unity WebGL)**
  - continuous enemy spawning
  - different shapes (circle, square, triangle)
  - periodic boss encounters

- **Inventory System**
  - item management
  - equip / unequip functionality

- **Auction House**
  - listing items
  - buying items
  - deleting listings

- **Areas**
  - unlockable using in-game currency

- **Admin Interface**
  - item creation
  - metadata management

### System Flow

During gameplay:
1. Enemies appear continuously
2. The player defeats them
3. Drops include items or currency
4. The inventory is updated
5. Items can be traded through the auction system

---

## Responsiveness

The application is responsive and works across different devices.

### Desktop
- full layout
- separate navigation buttons
- wider tables and panels

### Mobile
- hamburger menu (dropdown)
- smaller UI elements
- usage of ScrollArea
- vertical layout

### Tablet
- intermediate layout

### Technical Implementation
- breakpoint-based rendering (e.g. max-width: 640px)
- height-based optimizations for dialogs
- Radix UI components

---

## Data Handling (Frontend Perspective)

The frontend communicates with the backend via REST API.

### Managed Data:
- users
- items
- inventory
- listings
- metadata
- areas

### Logical Relationships:
- User → Inventory (1:N)
- Item → Metadata (N:M)
- User → Listings (1:N)

Communication is performed over HTTPS.

---

## Backend Communication

The frontend interacts with multiple REST API endpoints.

### Examples:

- GET /get-all-items
- GET /get-user-listings/:userId
- GET /get-all-active-listings
- POST /create-listing
- POST /buy-listing/:id
- DELETE /delete-listing/:id

### Error Handling

- usage of HTTP status codes
- toast notifications
- try/catch and .catch() handling

---

## Code

The frontend codebase:

- is component-based (React)
- uses reusable UI elements
- is well-structured
- includes documentation (JSDoc)

### Technologies Used:
- React
- React Router
- Radix UI
- Unity WebGL integration

---

## Project Resources

Frontend (deploy):  
https://squirkle2026.netlify.app/

Backend:  
https://github.com/hajos8/Squirkle-backend

Unity game:  
https://github.com/KristoffRed/Squirkle-Unity