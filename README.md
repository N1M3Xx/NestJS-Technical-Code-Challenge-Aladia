# NestJS Monorepo Microservices Architecture

This project demonstrates a microservices architecture using NestJS monorepo mode, TCP transport, and MongoDB. It consists of a Gateway (HTTP) and an Authentication Service (Microservice).

## 🏗 Architecture

- **Gateway**: Handles HTTP requests, validation, rate limiting, and forwards commands to microservices.
- **Authentication**: Handles user management, authentication logic, and persistence.
- **Transport**: TCP communication between Gateway and Authentication service.
- **Database**: MongoDB with Mongoose.

## 🚀 Features

- **Monorepo Structure**: Managed with NestJS CLI workspace.
- **Authentication**:
  - User Registration (Password Hashing).
  - JWT Login (Issuance and Validation).
- **Networking Abstraction**: Custom `NetworkingService` to encapsulate TCP client logic.
- **Shared Library**: Common DTOs, Constants, and Networking logic in `libs/common`.
- **Bonus Features**:
  - **Health Checks**: `/health` endpoint in Gateway.
  - **Rate Limiting**: Throttling configured for API protection.
  - **Validation**: Strict DTO validation with `class-validator`.
  - **Swagger**: API Documentation at `/api`.

## 🛠 Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

## 📦 Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory (copy from `.env.example` if available, or use the following template):

```env
MONGODB_URI=mongodb://mongo:27017/nest (or localhost if running locally)
GATEWAY_PORT=8000
AUTH_HOST=localhost (or 'authentication' for docker)
AUTH_PORT=3001
JWT_SECRET=your_super_secret_key
PORT=3001
```

## 🏃 Running the Project

### Local Development

1. Start MongoDB (ensure it's running on port 27017).
2. Start the Authentication Microservice:
   ```bash
   npm run start:auth
   ```
3. Start the Gateway:
   ```bash
   npm run start:gateway
   ```

### Devcontainer

1. Open the project in VS Code/Cursor with the **Dev Containers** extension, then select **Reopen in Container**.
2. Wait for the container to finish building (it runs `npm ci` and starts Docker services like MongoDB).
3. Start the Authentication Microservice:
   ```bash
   npm run start:auth
   ```
4. Start the Gateway:
   ```bash
   npm run start:gateway
   ```

### Docker (Production-like)

To run the entire stack (Gateway + Auth + MongoDB) using Docker Compose:

```bash
docker-compose up --build
```

The Gateway will be available at `http://localhost:8000`.

## 🧪 Testing

- **Unit Tests**:
  ```bash
  npm run test
  ```
- **E2E Tests**:
  ```bash
  npm run test:e2e:gateway
  npm run test:e2e:auth
  ```

## 📚 API Documentation

Once the Gateway is running, visit: `http://localhost:8000/api` to see the Swagger documentation.
