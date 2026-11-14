# RushX - Free Fire Tournament Esports Web Platform & PWA

**RushX** is a high-performance, fully-responsive esports tournament registration and wallet management web application for Free Fire players, complete with an independent, dedicated Admin Control Panel.

---

## 🚀 Recent Updates & Enhancements

1. **🔒 Strict Room ID & Password Protection (Registered Players Only)**:
   - When the admin generates or inputs the Custom Room ID & Password, **ONLY** players who have registered for that specific tournament can view and copy the credentials.
   - For all unregistered users, visitors, or non-participating players, the credentials remain completely hidden and locked (`🔒 Room ID & Pass Locked`).
   - The public tournament listing API never exposes room credentials under any circumstance.

2. **🎲 1-Click Generate Random Room ID & Password (Admin Panel)**:
   - Added a **"🎲 1-Click Generate Random Room"** button in `/admin/tournaments/:id`.
   - Generates a verified 7-digit Room ID and 4-digit Password with a single click and automatically switches status to `ONGOING`.

3. **💰 Instant Money & Player Stats Update in Backend**:
   - When the admin updates kills or marks match winners:
     - Winnings (`kills * perKill` for BR, or win pool for CS/LW) are automatically deposited straight into the player's **Winning Balance** (which can be withdrawn).
     - Official credit transactions with transaction IDs are recorded.
     - The player's backend profile statistics (`totalKills`, `totalEarning`, `matchesPlayed`) are updated permanently in real-time.

4. **🗺️ Map Exclusively Set to BERMUDA**:
   - All default presets, tournament listings, and creation forms now enforce **BERMUDA** (or `BERMUDA CS`) exclusively.

5. **🎯 CS Headshot & 🐺 Lone Wolf Headshot Categories**:
   - Replaced Solo Survival with **CS HEADSHOT TOURNAMENT** (Only Headshots allowed, body kill penalty!).
   - Added **LONE WOLF HEADSHOT** (1v1 & 2v2 Solo/Duo showmatches).
   - Filter chips on the tournament page for 1-click filtering: `All Bermuda`, `BR Full Map`, `🎯 CS Headshot`, `🐺 LW Headshot`, `CS Normal`.

6. **💳 Payment Gateway Ready Architecture (`server/gateway.js`)**:
   - Includes order generation (`POST /api/payment/create-order`) and instant webhook verification (`POST /api/payment/webhook`).
   - Plug-and-play ready for Razorpay, Cashfree, Paytm, or PhonePe PG integration whenever you want to plug in your gateway API keys!

---

## 🎮 Key Features

### 1. Multi-Page Mobile-First & Web App Experience
- Designed to replicate competitive esports tournament apps with 100% responsiveness on mobile, tablet, and desktop screens.
- **PWA (Progressive Web App)** ready with `manifest.json`, mobile meta tags, standalone app display, and home-screen installability.
- Multi-page navigation matching the provided reference designs:
  - **Home Screen (`/`)**: High-energy featured banners, announcement marquee ticker, quick "My Matches" filters (Ongoing, Upcoming, Completed), and esports categories (BR Full Map, Clash Squad 1v1/2v2, CS Headshot, Lone Wolf Headshot).
  - **Tournament Contests (`/tournaments`)**: Filterable by `Ongoing`, `Upcoming`, and `Resulted`. Cards feature detailed rule overlays, ban alerts (Double Vector, M79, Ryden), prize pool, entry fee, per-kill bounty, spots progress bar (`Only X spots left`), and instant Join/Room modal buttons.
  - **Wallet (`/wallet`)**: Dedicated wallet screen featuring `Total Balance`, `Deposit Balance`, and `Win Balance`. Displays full transaction history with credit/debit badges, transaction IDs, date/time, and match descriptions.
  - **Refer & Earn (`/refer`)**: Referral card with 1-click code copying and direct share integrations for WhatsApp, Telegram, and Facebook.
  - **Profile / Menu (`/profile`)**: Circular gamer avatar, username, Matches Played, Total Kills, Total Earnings counters, profile details editor (FF IGN & UID), support links, and notification switches.
  - **Leaderboard (`/leaderboard`)**: Top players podium (#1, #2, #3) and global rankings based on total kills and winnings.
  - **My Matches (`/my-matches`)**: Dedicated dashboard for registered matches with instant Room ID & Password access.

---

### 2. Strict Business Rules & Tournament Economy (As Requested)
- **BR (Battle Royale) Matches (Bermuda)**:
  - **Entry ₹25**: Solo & Duo matches with **₹20 Per Kill**.
  - **Entry ₹50**: Solo & Duo matches with **₹40 Per Kill**.
- **CS & Lone Wolf Matches (Bermuda)**:
  - **Entry ₹50 per person**:
    - Solo (1v1): Winner receives **₹80**.
    - Duo (2v2): Winning team receives **₹180**.
  - **Entry ₹100 per person**:
    - Solo (1v1): Winner receives **₹180**.
    - Duo (2v2): Winning team receives **₹360**.
- **Wallet & Deposits**:
  - **Minimum Deposit**: **₹50** strictly enforced.
  - Supports UPI QR code, UPI ID copying, 12-digit UTR input, and payment screenshot proof.
- **Withdrawals**:
  - **Only Winning Balance is withdrawable** (Deposit balance cannot be withdrawn).
  - **Minimum Withdrawal**: **₹100** strictly enforced.
  - **Daily Limit**: **Maximum 2 withdrawals per day** strictly enforced.

---

### 3. Separate Dedicated Admin Control Panel (`/admin`)
Accessible via `/admin` (completely isolated from the regular user application):
- **Admin Login (`/admin/login`)**:
  - **Username**: `admin`
  - **Password**: `admin123`
- **Dashboard (`/admin`)**: Live counts of registered users, active matches, pending deposits, pending withdrawals, and total prize pool.
- **Tournaments Manager (`/admin/tournaments`)**:
  - 1-Click creation using the pre-configured presets (BR ₹25/₹20-kill, BR ₹50/₹40-kill, CS Headshot ₹50->₹80, CS Headshot ₹100->₹360, LW Headshot ₹50->₹80, LW Headshot ₹100->₹360).
  - 1-Click Room ID & Password generator.
  - **Player Kill & Winner Settlement Tool**: Input kills per player to auto-calculate and distribute kill earnings directly into player Win Balances; select CS match winners for instant payout distribution.
- **Deposits Verification (`/admin/deposits`)**: Review submitted 12-digit UTRs and payment receipts; 1-click approve (credits user deposit balance) or reject.
- **Withdrawals Management (`/admin/withdrawals`)**: Review payout requests; copy player UPI ID or bank info; approve (mark paid) or reject (refunds back to player Win Balance).
- **Users Management (`/admin/users`)**: Search players, view Free Fire IGN & UID, and adjust balances with audit logs.
- **Settings (`/admin/settings`)**: Update official receiving UPI ID, support WhatsApp, support Telegram, and live marquee announcements.

---

### 4. Real Persistent User Accounts
- Passwords securely hashed with **bcrypt**.
- Sessions authenticated via **JWT**.
- Persistent database stored in `data/rushx_db.json`. User accounts and balances persist permanently across app restarts and browser refreshes.

---

## 🛠️ How to Run

### Production Server (Serves both API and Frontend):
```bash
npm run start
```
The application will be live at:
👉 **User App**: `http://localhost:5050`
👉 **Admin Panel**: `http://localhost:5050/admin` (Login: `admin` / `admin123`)
