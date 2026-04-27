# Squirkle – Frontend Documentation

---

## Az alkalmazás célja

A Squirkle egy böngészőben futó játékplatform, amely egy Unity WebGL játékot integrál egy webes felületbe.

A felhasználók:
- ellenségeket győznek le
- tárgyakat és érmét gyűjtenek
- új területeket oldanak fel
- tárgyakat kereskednek egy piactéren (auction house)

Az alkalmazás célja egy interaktív, játékos élmény biztosítása webes környezetben.

---

## Funkciók és működés

### Fő funkciók

- **Felhasználó kezelés (Authentication)**
  - Google alapú bejelentkezés
  - egyedi felhasználónév létrehozása

- **Játék (Unity WebGL)**
  - ellenségek folyamatos spawnolása
  - különböző formák (kör, négyzet, háromszög)
  - boss rendszer időszakosan

- **Inventory rendszer**
  - megszerzett tárgyak kezelése
  - equip / unequip funkciók

- **Auction House**
  - tárgyak listázása
  - vásárlás
  - törlés

- **Területek (Areas)**
  - érmék felhasználásával feloldhatóak

- **Admin felület**
  - item létrehozás
  - metadata kezelés

### Működés

A játék során:
1. Ellenségek jelennek meg
2. A játékos legyőzi őket
3. Drop: item vagy valuta
4. Inventory frissül
5. Itemek eladhatók az aukciós rendszerben

---

## Reszponzivitás

Az alkalmazás reszponzív kialakítású, különböző eszközökön is megfelelően működik.

### Desktop
- teljes layout
- külön navbar gombok
- szélesebb táblázatok

### Mobil
- hamburger menü (Dropdown)
- kisebb UI elemek
- ScrollArea használata
- vertikális elrendezés

### Tablet
- köztes layout

### Technikai megoldások
- breakpoint alapú megjelenítés (pl. max-width: 640px)
- magasság alapú optimalizálás (dialogoknál)
- Radix UI komponensek használata

---

## Adatkezelés (frontend szempontból)

A frontend REST API-n keresztül kommunikál a backenddel.

### Kezelt adatok:
- felhasználók
- itemek
- inventory
- listingek
- metadata
- területek

### Kapcsolatok (logikai szinten):
- User → Inventory (1:N)
- Item → Metadata (N:M)
- User → Listings (1:N)

A kommunikáció HTTPS-en keresztül történik.

---

## Backend kommunikáció

A frontend több REST API végpontot használ.

### Példák:

- GET /get-all-items
- GET /get-user-listings/:userId
- GET /get-all-active-listings
- POST /create-listing
- POST /buy-listing/:id
- DELETE /delete-listing/:id

### Hibakezelés

- HTTP státuszkódok használata
- toast értesítések
- try/catch és .catch() blokkok

---

## Kód

A frontend kód:

- komponens alapú (React)
- újrafelhasználható elemeket használ
- jól strukturált
- dokumentált (JSDoc)

### Használt technológiák:
- React
- React Router
- Radix UI
- Unity WebGL integráció

---

## Projekthez tartozó források

Frontend (deploy):  
https://squirkle2026.netlify.app/

Backend:  
https://github.com/hajos8/Squirkle-backend

Unity játék:  
https://github.com/KristoffRed/Squirkle-Unity