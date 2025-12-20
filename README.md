# Scribbly 🎨

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=flat&logo=angular&logoColor=white)
![Node](https://img.shields.io/badge/node.js-%2343853D.svg?style=flat&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=flat&logo=socket.io&badgeColor=010101)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white)

> **A high-performance, real-time collaborative whiteboard platform built for seamless team ideation.**

Scribbly is a modern web application that enables teams to collaborate visually in real-time. Built with the **MEAN stack** (MongoDB, Express, Angular, Node.js) and **Socket.IO**, it delivers a low-latency, synchronized drawing experience with integrated chat and meeting management.

---

## 🚀 Key Features

*   **Real-time Collaboration**: Instant synchronization of drawing events across all connected clients using WebSockets.
*   **High-Performance Rendering**: Optimized canvas rendering engine with **NgZone** bypass and event throttling (10ms) to ensure 60fps performance even under load.
*   **Secure Authentication**: Robust JWT-based authentication for both REST API endpoints and Socket.IO connections.
*   **Scalable Architecture**: Modular backend design with database indexing and API pagination to handle growing datasets.
*   **Modern UI/UX**: Aesthetic, responsive interface designed with **Google Material Design 3** principles, featuring a floating toolbar and glassmorphism effects.
*   **Team Communication**: Integrated real-time chat with persistent message history for active meetings.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: Angular 19 (Standalone Components)
*   **State Management**: RxJS (Observables, Subjects)
*   **Styling**: SCSS with CSS Variables (Theming), FontAwesome
*   **Real-time**: Socket.IO Client
*   **HTTP**: Angular HttpClient with Interceptors

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Real-time**: Socket.IO Server
*   **Security**: BCrypt (Hashing), JSON Web Tokens (JWT), CORS

## 🏗️ System Architecture

Scribbly employs a **Client-Server architecture** optimized for real-time interactivity:

1.  **REST API**: Handles user authentication, meeting creation, and historical data retrieval.
2.  **WebSocket Layer**: Manages ephemeral state (cursor positions, drawing paths) and chat messages.
    *   *Optimization*: Drawing events are throttled and broadcasted efficiently to minimize bandwidth usage.
3.  **Database**: MongoDB stores persistent data (Users, Meetings) with optimized indexes on frequently queried fields (`members.userId`).

## ⚡ Performance Optimizations

*   **Zone.js Bypass**: Canvas event listeners (`mousemove`, `touchmove`) run outside Angular's `NgZone` to prevent unnecessary change detection cycles, significantly reducing CPU usage.
*   **Network Throttling**: Drawing events are throttled to ~100 updates/second to balance smoothness with network efficiency.
*   **Database Indexing**: Compound indexes on meeting members ensure O(log n) lookup times for dashboard queries.
*   **Pagination**: API endpoints implement cursor-based or offset-based pagination to ensure scalability.

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   Angular CLI (`npm install -g @angular/cli`)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/scribbly.git
cd scribbly
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file
echo "PORT=5001" > .env
echo "MONGO_URI=mongodb://localhost:27017/scribbly" >> .env
echo "JWT_SECRET=your_super_secret_key_change_this" >> .env
# Start the server
npm start
```

### 3. Frontend Setup
```bash
cd ideaboard-client
npm install
# Start the development server
npm start
```

Navigate to `http://localhost:4200` to view the application.

## 📂 Project Structure

```
scribbly/
├── backend/                 # Node.js/Express Server
│   ├── config/              # DB Connection
│   ├── controllers/         # Route Logic
│   ├── middlewares/         # Auth & Uploads
│   ├── models/              # Mongoose Schemas
│   ├── routes/              # API Routes
│   ├── socket/              # Socket.IO Logic
│   └── server.js            # Entry Point
│
└── ideaboard-client/        # Angular Frontend
    ├── src/
    │   ├── app/
    │   │   ├── features/    # Feature Modules (Auth, Board, etc.)
    │   │   ├── services/    # API & Socket Services
    │   │   └── ...
    │   ├── assets/          # Images & Static Files
    │   └── styles.scss      # Global Design System
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/yourusername">Abhishek Nejkar</a></sub>
</div>
