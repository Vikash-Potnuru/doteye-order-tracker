# DotEye Order Tracker Backend

Node.js + Express + MongoDB Atlas + Mongoose + JWT + Socket.io backend for the DotEye Labs assessment.

## Setup

```bash
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
JWT_EXPIRES_IN=7d
```

Run development server:

```bash
npm run dev
```

Seed sample data:

```bash
npm run seed
```

The seed command is destructive by design. It clears the application collections
and recreates a consistent demo tenant containing users, orders, disputes, and
order-scoped chat history.

## Seed credentials

Customer demo accounts (all use password `Customer@123`):

- Vikash Potnuru — `vikash@example.com`
- Ananya Rao — `ananya@example.com`
- Rahul Sharma — `rahul@example.com`
- Priya Reddy — `priya@example.com`
- Arjun Kumar — `arjun@example.com`
- Meera Nair — `meera@example.com`

Admin:

- Name: `DotEye Support Admin`
- Email: `admin@doteyelabs.com`
- Password: `DotEye@123`

## REST API

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Orders

- GET `/api/orders`
- GET `/api/orders/metadata`
- GET `/api/orders/my-orders`
- GET `/api/orders/:orderId`
- GET `/api/orders/:orderId/timeline`
- POST `/api/orders`
- PATCH `/api/orders/:orderId/status`
- PATCH `/api/orders/:orderId/cancel`

### Messages

- GET `/api/orders/:orderId/messages`
- GET `/api/orders/messages/all`
- POST `/api/orders/:orderId/messages`
- PATCH `/api/orders/:orderId/messages/read`

### Disputes

- POST `/api/disputes`
- GET `/api/disputes`
- GET `/api/disputes/my-disputes`
- GET `/api/disputes/:disputeId`
- PATCH `/api/disputes/:disputeId/status`

Dispute list and detail responses include the normalized `customer` object and
an `order` summary in addition to the persisted dispute fields. This keeps
customer and order context consistent for admin screens without requiring a
second client-side lookup.

### Dashboard

- GET `/api/dashboard/customer`
- GET `/api/dashboard/admin`

## Socket.io events

Client sends:

- `join-order`
- `leave-order`
- `typing-start`
- `typing-stop`

Server emits:

- `joined-order`
- `socket-error`
- `order-status-updated`
- `new-message`
- `messages-read`
- `dispute-updated`
- `typing-start`
- `typing-stop`

Every order uses its order ID as the Socket.io room ID.

## Request body examples

### Create order

```json
{
	"customerId": "USR-002",
	"items": [
		{"name": "USB-C Dock", "quantity": 1, "price": 7499}
	]
}
```

### Change order status

```json
{
	"status": "Shipped",
	"note": "Package handed to the delivery partner."
}
```

### Create dispute

```json
{
	"orderId": "ORD-1002",
	"reasonCategory": "Item Not Received",
	"description": "The delivery window has passed and the package has not arrived."
}
```

### Resolve dispute

```json
{
	"status": "Resolved (Refunded)",
	"adminResolutionNotes": "Refund approved after delivery investigation."
}
```
