# DotEye Order Tracker Frontend

React/Vite frontend connected to the DotEye backend.

## Important

There is no frontend mock store. Users, orders, messages and disputes come from the backend API/database. Seed sample records with the backend `npm run seed` command.

## Setup

```bash
npm install
npm run dev
```

Create `.env` if required:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

The backend must be running on port 5000.
