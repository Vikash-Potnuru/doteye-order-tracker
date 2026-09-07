# DotEye Order Tracker - Full Stack

This project contains the connected React frontend and Node/Express backend for the DotEye Labs assessment.

## Project structure

- `backend/` - Express, MongoDB/Mongoose, JWT/RBAC and Socket.io server.
- `frontend/` - React/Vite application connected only to backend APIs and Socket.io.

The frontend does not contain order, message, dispute or user mock data. Sample data is created by the backend seed script and stored in MongoDB.

## Run backend

```bash
cd backend
npm install
# create .env from .env.example and add your MongoDB Atlas URI and JWT secret
npm run seed
npm run dev
```

Backend: `http://localhost:5000`

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

The frontend `.env.example` contains:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Seed accounts

The seed script creates six sample Customer accounts, one DotEye Admin account, 18 sample orders, persistent chat messages and dispute records in MongoDB. The frontend never hardcodes these users or application records.

### Demo accounts

Customer accounts (password for all): `Customer@123`

- Vikash Potnuru — `vikash@example.com`
- Ananya Rao — `ananya@example.com`
- Rahul Sharma — `rahul@example.com`
- Priya Reddy — `priya@example.com`
- Arjun Kumar — `arjun@example.com`
- Meera Nair — `meera@example.com`

Single Admin account:

- DotEye Support Admin — `admin@doteyelabs.com` / `DotEye@123`

These credentials are for assessment/demo use. Authentication is always handled by the backend.

## Main integrated flows

- JWT login and registration
- Customer/Admin protected routes
- Orders loaded from MongoDB through REST APIs
- Admin order status transitions
- Live order status synchronization with Socket.io
- Order audit timeline
- Order-scoped support chat rooms
- Persistent messages from MongoDB
- Real-time messages
- Real-time typing indicators
- Read/unread message handling
- Customer dispute creation
- Admin dispute review and resolution
- Automatic system messages for status/dispute changes

## Assessment alignment

- Order transitions are validated server-side and recorded in an audit timeline.
- Customers can raise disputes only for `Shipped` or `Delivered` orders.
- Active disputes lock normal order progression until an admin resolves them.
- Customers and admins can cancel only `Placed` or `Processing` orders.
- Dispute responses include customer and order context so admin data remains consistent across screens.
