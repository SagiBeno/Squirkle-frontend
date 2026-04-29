# Squirkle – Frontend Documentation

---

## Application Purpose

Squirkle is a browser-based gaming platform that integrates a Unity WebGL game into a web interface.

Users can:
- defeat enemies
- collect items and coins
- unlock new areas
- trade items through an auction system (auction house)

The goal of the application is to provide an interactive and engaging gameplay experience within a web environment.

---

## Features and Functionality

### Main Features

- **User Management (Authentication)**
  - Google-based login
  - unique username creation

- **Game (Unity WebGL)**
  - continuous enemy spawning
  - different shapes (circle, square, triangle)
  - periodic boss system

- **Inventory System**
  - management of collected items
  - equip / unequip functionality

- **Auction House**
  - listing items
  - purchasing items
  - deleting listings

- **Areas**
  - unlockable using coins

- **Admin Interface**
  - item creation
  - metadata management

### System Flow

During gameplay:
1. Enemies appear
2. The player defeats them
3. Drops include items or currency
4. The inventory is updated
5. Items can be sold through the auction system

#### Gameplay Flow Diagram

![Gameplay Flow](Screenshots/Gameplay_Flow_Diagram.png)

---

## Responsiveness

The application is responsive and works properly across different devices.

```
Homepage layout on large screens
```
![Homepage layout on large screens #1](Screenshots/HomePage.png)
![Homepage layout on large screens #2](Screenshots/HomePage_02.png)

```
Homepage layout on small screens
```
| ![Homepage layout on small screens #1](Screenshots/HomePage_Mobile_01.png) | ![Homepage layout on small screens #2](Screenshots/HomePage_Mobile_02.png) |


```
Navigation bar on large screens
```
![Navigation bar on large screens #1](Screenshots/GamePage_01.png)

```
Navigation bar on small screens
```
![Navigation bar on small screens #1](Screenshots/GamePage_Mobile_01.png)

```
Item details dialog on large screens
```
![Item details dialog on large screens #1](Screenshots/ItemDetails_01.png)

```
Item details dialog on small screens
```
| ![Item details dialog on small screens #1](Screenshots/ItemDetails_Mobile_01.png) | ![Item details dialog on small screens #2](Screenshots/ItemDetails_Mobile_02.png) |

### Desktop
- full layout
- separate navbar buttons
- wider tables

### Mobile
- hamburger menu (Dropdown)
- smaller UI elements
- usage of ScrollArea
- vertical layout

### Tablet
- intermediate layout

### Technical Solutions
- breakpoint-based rendering (e.g. max-width: 640px)
- height-based optimization (for dialogs)
- usage of Radix UI components

---

## System Architecture

The following diagram shows the overall structure of the application and how different components interact with each other.

![System Architecture](Screenshots/Architecture.png)

### Game Loading and Auto-Updating
Squirkle uses a fairly complicated system for handling the game loading.

The game files are hosted on Netlify which acts as a free CDN with pretty large storage and bandwith limits. A few additional files are also stored alongside the automatically compressed (zipped) game files.

CORS is disabled in a `_headers` file. This allows anyone from anywhere to download the game files without any problems. Netlify would block this process by default, but this bypasses the limitation.

The game's version is stored in a separate `version.json` file, which contains the following data:
```json
{
	"buildDate": "dd/mm/yyyy hh:mm:ss"
}
```

This json is automatically updated upon building the Unity project. 

Links to the game files hosted on netlify:
- [game.zip](https://squirkle.netlify.app/game.zip)
- [version.json](https://squirkle.netlify.app/version.json)

Here are the steps for loading in the game:
1. Get the locally and externally stored version build date.
2. Compare the local and external versions. If the local version doesn't exist, or the external version is newer, download the new game files and store them in the browser's IndexedDB as a blob.
3. Unzip the game in runtime using JS Zip.
4. Create a virtual URL for these newly created files in memory.
5. Find the `framework`, `loader`, `data` and `code` URLs, and store them so that the Unity player can load them in.
6. Indicate to the game that loading is done and the game is ready to load.  

We use [React Unity WebGL](https://react-unity-webgl.dev/) to embed a browser game made with Unity. This framework allows us to communicate with the Unity instance directly from the frontend and vice-versa.

Once the game is loaded, the frontend sends an initialization message to the game instance.
This message contains:
1. The server-side game time used to syncronize bossfights across all players
2. The player's current equipped weapon and armor
3. The user's userID

After this happens successfully, the game is fully ready to be played.

---

## Data Handling (Frontend Perspective)

The frontend communicates with the backend through a REST API.

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

The frontend uses multiple REST API endpoints.

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

The frontend code:

- is component-based (React)
- uses reusable elements
- is well-structured
- is documented (JSDoc)

### Technologies Used:
- React
- React Router
- Radix UI
- Unity React WebGL
- JSZip
- IndexedDB
- Localstorage

---

## Testing

### Item Details Dialog Component

An automated test has been created for the `ItemDetailsDialog.jsx` component.

The test verifies:
- item stats are displayed correctly
- the item title, description, and image are rendered properly
- metadata title, description, background color, and text color are displayed correctly
- the equip / unequip button appears correctly in inventory context
- seller, price, and buy button are displayed in buying context
- inactive listings cannot be purchased
- the selected listing price is displayed correctly in create inspection context

The test run was successful: 1 test file and 11 test cases passed.

#### Item Details Dialog Component Test Results
![Item Details Dialog Component Test Results](Screenshots/ItemDetailsTest.png)

---

## Project Resources

Frontend (deploy):  
https://squirkle2026.netlify.app/

Backend:  
https://github.com/hajos8/Squirkle-backend

Unity game:  
https://github.com/KristoffRed/Squirkle-Unity