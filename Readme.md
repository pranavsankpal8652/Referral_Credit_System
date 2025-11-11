# 🧩 PROJECT NAME: Referral-Credit System

🚀 Referral System (MERN + Socket.io)

A real-time referral system built using Next.js (frontend) and Node.js + Express + MongoDB (backend) with Socket.io for instant updates.
Users can register using referral links, and referrers receive live updates and credits when their referred users register or purchase products — without page reloads.

# =========================================

# ⚙️ 1. SETUP INSTRUCTIONS

# =========================================

# → Clone the repository

https://github.com/pranavsankpal8652/Referral_Credit_System

# → Move into the project directory

cd client

# → Install dependencies for both backend and frontend

cd server && npm install
cd ../client && npm install

# → Create .env files in both /server and /client directories (see below)

# → Start the backend server

cd server
npm run dev

# → Start the frontend

cd ../client
npm run dev

# → Open your app in browser

http://localhost:3000

# =========================================

# 🔑 2. ENVIRONMENT VARIABLES SUMMARY

# =========================================

# ----------------------------

# 🖥️ SERVER (.env in /server)

# ----------------------------

PORT=5000

# → Backend port number

MONGO_URI=mongodb+srv://pranavsankpal8652:prn7058@cluster0.scihly0.mongodb.net/ReferralCreditSystem

# → MongoDB connection string for database connection

JWT_SECRET=ReferalSystemSecretKey123

# → Secret key used to sign and verify JWT tokens

CLIENT_URL=https://referral-credit-system-ten.vercel.app/

# → Frontend base URL for enabling CORS requests

# ----------------------------

# 💻 CLIENT (.env in /client)

# ----------------------------

NEXT_PUBLIC_API_BASE_URL=https://referral-credit-system-p29c.onrender.com

# → Base URL of backend API accessible by the client

# =========================================

# 🌐 3. API ENDPOINT OVERVIEW

# =========================================

# → Authentication Routes

POST /auth/register # Registers a new user (supports referral code)

POST /auth/login # Logs in existing user

POST /auth/logout # Logs out in existing logged in user

# → Purchase Routes

POST /products/purchase # Simulates a purchase and triggers referral updates

# → WebSocket Events (Socket.io)

event: 'purchase_success' # Emitted after successful purchase

event: 'user_updated' # Notifies referrer about updated rewards

# =========================================

# 🧠 4. ARCHITECTURE & BUSINESS LOGIC

# =========================================

# ----------------------------

# 🧩 Tech Stack

# ----------------------------

Frontend: Next.js 14 (App Router) + TypeScript + Zustand + Axios + TailwindCSS  
Backend: Node.js + Express + Mongoose + Socket.io  
Database: MongoDB  
Auth: JWT-based authentication  
Hosting: Github

# ----------------------------

# 🏗️ Project Architecture

# ----------------------------

/client
┣ /app → Next.js app router structure

┣ /Components → UI components (AuthForm, Dashboard, etc.)

┣ /zustand/store.ts → Global state management

┣ /socket/socket.ts → Singleton Socket.io client instance

┗ .env → Client environment file

/server
┣ /app/models → Mongoose models (User)

┣ /app/routes → Express routes (AuthRoutes, productRoutes, etc.)

┣ /app/controllers → Business logic for each route

┣ /socket → Socket.io configuration and event handlers

┣ index.ts → Server entry point

┗ .env → Server environment file

# ----------------------------

# 🔄 Business Logic Flow

# ----------------------------

1️⃣ User registers → optional referral code stored

2️⃣ On successful registration → referral relationship saved in DB

3️⃣ When referred user makes a purchase:

• Backend emits 'user_updated' via Socket.io

• Referrer’s dashboard updates live without reload

4️⃣ Global socket (initialized once) ensures real-time updates across pages

5️⃣ Frontend securely fetches data via protected routes using JWT in headers

# ----------------------------

# 🧰 Key Implementation Notes

# ----------------------------

• Global Socket connection lives in `socket.ts` and reused across components

• Dashboard listens to socket events for live reward updates

• Cleanup handled via `disconnect` only on app unmount (not every route change)

• Backend uses CORS with `credentials: true` for cookie/JWT handling

• Referral logic handled in backend before sending API response

# ----------------------------

# 🧪 Postman Collection

# ----------------------------

Import the provided file: `postman_collection.json`
→ Includes all authentication, referral, and purchase endpoints

# ----------------------------

# 🧱 Example Command Summary

# ----------------------------

npm run dev # Start development server
npm run build # Build production code
npm start # Run in production
