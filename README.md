# CypherNet

CypherNet is a secure multi-tenant collaboration platform built with:

- `Next.js` for the frontend
- `Node.js + Express.js` for the backend
- `MongoDB + Mongoose` for persistence
- `SocketCluster` for realtime room chat and signaling
- `WebRTC` for browser-based calls

The project supports:

- JWT-based authentication
- role-based access control
- organization management
- room creation and join-by-code
- moderated participant admission
- message history and live chat
- secure file uploads
- steganography-ready public key exchange
- WebRTC signaling and ICE server delivery

## Repository Structure

```text
SWE363-Team40/
├── back-end/
│   ├── db.js
│   ├── server.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── realtime.js
│   ├── signaling.js
│   ├── tests/
│   └── .env.example
├── front-end/
│   ├── src/
│   ├── next.config.ts
│   └── .env.example
└── README.md
```

## Tech Stack

### Backend

- `Node.js`
- `Express.js`
- `MongoDB`
- `Mongoose`
- `bcryptjs`
- `jsonwebtoken`
- `multer`
- `socketcluster-server`

### Frontend

- `Next.js 16`
- `React 19`
- `socketcluster-client`
- `WebRTC`

## Setup

### 0. Clone the Repository

```bash
git clone https://github.com/elmasry99-tech/SWE363-Team40.git
cd SWE363-Team40
```

### 1. Backend

```bash
cd back-end
npm install
cp .env.example .env
```

Required backend environment variables:

- `PORT`: Express server port. Default: `8000`
- `ENV`: runtime mode. Example: `dev`
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: secret used to sign and verify JWTs
- `ALLOWED_ORIGINS`: comma-separated allowed frontend origins
- `STUN_URLS`: comma-separated STUN URLs for WebRTC ICE config

Start the backend:

```bash
npm run dev
```

Run backend tests:

```bash
npm test
```

### 2. Frontend

```bash
cd front-end
npm install
cp .env.example .env.local
```

Frontend environment variables:

- `BACKEND_URL`: server-side rewrite target. Default: `http://localhost:8000`
- `NEXT_PUBLIC_BACKEND_URL`: direct browser socket/WebRTC backend origin

Start the frontend:

```bash
npm run dev
```

Lint and production build:

```bash
npm run lint
npm run build
```

## Running the Full Project

1. Start MongoDB locally or provide a MongoDB Atlas URI.
2. Start the backend on `http://localhost:8000`.
3. Start the frontend on `http://localhost:3000`.
4. Open [http://localhost:3000](http://localhost:3000).

Recommended terminal flow:

Terminal 1:

```bash
cd SWE363-Team40/back-end
npm run dev
```

Terminal 2:

```bash
cd SWE363-Team40/front-end
npm run dev
```

## API Documentation

All protected routes require:

```http
Authorization: Bearer <jwt>
```

### Health

#### `GET /health-check`

Returns:

```text
OK
```

### Authentication

#### `POST /auth/signup`

Creates a new account.

Request:

```json
{
  "name": "Belal Shebl",
  "email": "belal@example.com",
  "password": "Password#123",
  "role": "general",
  "orgId": null
}
```

Notes:

- `role` must be one of `oso`, `internal`, `guest`, `general`
- `oso` and `internal` require a valid `orgId`
- password must be at least 8 chars, include one uppercase letter and one special char
- `oso` and `internal` accounts are created with `pending` status

Success response:

```json
{
  "message": "Account created.",
  "userId": "6814e0...",
  "status": "active"
}
```

#### `POST /auth/login`

Request:

```json
{
  "email": "general@example.com",
  "password": "Password#123"
}
```

Success response:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "6814e0...",
    "name": "General User",
    "email": "general@example.com",
    "role": "general",
    "orgId": null
  }
}
```

### Organizations

#### `GET /orgs/public`

Lists active organizations for signup selection.

#### `GET /orgs`

Lists organizations:

- `admin`: all organizations
- `oso`: only their own organization

#### `POST /orgs`

Admin-only organization creation.

Request:

```json
{
  "name": "Northstar Legal",
  "status": "active",
  "policies": {
    "fileSharing": true,
    "screenSharing": true,
    "guestAccess": true,
    "retentionDays": 90,
    "sessionExpiry": 30,
    "messageRateLimit": 200
  },
  "officer": {
    "name": "Northstar Officer",
    "email": "oso@northstar.com",
    "password": "Password#123"
  }
}
```

#### `PATCH /orgs/:id`

Updates organization metadata and policies.

#### `GET /orgs/:id/users`

Lists users belonging to the organization.

### Users

#### `GET /users`

Lists all users for `admin`, or org-scoped users for `oso`.

#### `PATCH /users/:id/status`

Approves, disables, or re-pends a user.

Request:

```json
{
  "status": "active"
}
```

#### `POST /users/me/public-key`

Stores the authenticated user’s public key.

Request:

```json
{
  "publicKey": "BASE64_PUBLIC_KEY"
}
```

#### `GET /users/:id/public-key`

Fetches another user’s public key for encrypted steg delivery.

### Rooms

#### `GET /rooms`

Lists rooms visible to the current user.

#### `POST /rooms`

Creates a room.

Request:

```json
{
  "name": "Client Intake - Jones",
  "orgId": "6814e0..."
}
```

#### `GET /rooms/:id`

Fetches one room.

#### `PATCH /rooms/:id`

Updates room name or status.

Request:

```json
{
  "status": "closed"
}
```

#### `DELETE /rooms/:id`

Archives a room.

#### `POST /rooms/join`

Joins a room by code.

Request:

```json
{
  "code": "CN-AB12CD"
}
```

#### `POST /rooms/:id/admit`

Admits or denies a waiting participant.

Request:

```json
{
  "userId": "6814e0...",
  "status": "admitted"
}
```

### Messages

#### `GET /messages/:roomId?limit=50`

Returns message history for a room.

#### `POST /messages`

Creates a room message.

Request:

```json
{
  "roomId": "6814e0...",
  "content": "Hello room",
  "type": "text"
}
```

Supported types:

- `text`
- `file`
- `steg`
- `system`

### Files

#### `POST /files/upload`

Uploads a room-scoped file using `multipart/form-data`.

Fields:

- `roomId`
- `file`

Allowed file types:

- `image/jpeg`
- `image/png`
- `image/gif`
- `application/pdf`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

#### `GET /files/:id`

Downloads a previously uploaded file if the user has room access.

### Realtime and Signaling

#### SocketCluster path

```text
/socketcluster/
```

Room chat channels:

```text
room-<roomId>
```

Supported realtime events:

- `message:send`
- `user:typing`
- `presence`

Supported signaling events:

- `call:offer`
- `call:answer`
- `call:ice-candidate`
- `call:end`

#### `GET /ice-servers`

Returns WebRTC ICE server configuration.

Example response:

```json
{
  "iceServers": [
    { "urls": "stun:stun.l.google.com:19302" }
  ]
}
```

## Validation and Error Handling

The backend validates:

- required fields
- email format
- password strength
- MongoDB ObjectId format
- role/status enum values
- room/message/user/file identifiers
- organization policy numeric bounds
- upload MIME types and file size

Common status codes:

- `200` success
- `201` created
- `400` validation error
- `401` missing or invalid token
- `403` forbidden
- `404` resource not found
- `409` duplicate resource
- `500` server error

## Testing Coverage

The backend test suite covers:

- signup and login flows
- pending approval behavior
- organization create/list/update
- room create/join/admit
- message post/history
- file upload
- user public-key save/fetch
- user status updates

Run:

```bash
cd back-end
npm test
```

## Example cURL Requests

Login:

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"general@example.com","password":"Password#123"}'
```

Create room:

```bash
curl -X POST http://localhost:8000/rooms \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Secure Review Room"}'
```

Get room messages:

```bash
curl -X GET http://localhost:8000/messages/<roomId>?limit=20 \
  -H "Authorization: Bearer <jwt>"
```

Upload file:

```bash
curl -X POST http://localhost:8000/files/upload \
  -H "Authorization: Bearer <jwt>" \
  -F "roomId=<roomId>" \
  -F "file=@./document.pdf"
```

## Team

- Belal Shebl — Frontend Integration + WebRTC Client
- Mazen Abdelatty — Backend Foundation, Auth, Server Wiring
- Fuad Anabosi — Steganography Components and Crypto
- Loay Shqair — Backend Feature APIs, Realtime, Signaling
