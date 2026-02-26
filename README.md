# 🎵 Musify

A full-stack music streaming web app built with React, Node.js, MongoDB, and deployed on Vercel + Render.

![Musify](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 🌐 Live Demo

- **Frontend:** https://musifyy-self.vercel.app
- **Backend:** https://musify-app-backend.onrender.com

---

## ✨ Features

- 🎧 Stream music directly in the browser
- 🎤 Artist accounts — upload tracks and create albums
- 👤 User accounts — browse and play all music
- 💿 Album creation with track selection
- 🎨 Dynamic gradient covers for tracks and albums
- 📱 Fully responsive — works on mobile and desktop
- 🔐 JWT-based authentication (Bearer token)
- ▶️ Persistent audio player with prev/next/volume controls

---

## 🛠️ Tech Stack

### Frontend
| Tech | Usage |
|------|-------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router v6 | Routing |
| Axios | API calls |

### Backend
| Tech | Usage |
|------|-------|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Multer | File uploads |
| bcryptjs | Password hashing |
| ImageKit | Audio file storage |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- ImageKit account

### Clone the repo

```bash
git clone https://github.com/FarrukhGul/Musify-App-Frontend.git
cd Musify-App-Frontend
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
NODE_ENV=development
```

```bash
npm start
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/          # Login, Register, ProtectedRoute
│   │   ├── layout/        # Navbar, Layout
│   │   ├── music/         # MusicList, AlbumList, AlbumDetail, Upload, CreateAlbum
│   │   └── player/        # AudioPlayer
│   ├── context/           # AuthContext
│   ├── hooks/             # useAuth, usePlayer
│   ├── providers/         # AuthProvider, PlayerProvider
│   ├── services/          # api.js (Axios)
│   └── utils/             # GradientCover, gradientColors

backend/
├── src/
│   ├── controllers/       # auth.controller, music.controller
│   ├── middlewares/       # auth.middleware
│   ├── models/            # user.model, music.model, album.model
│   ├── routes/            # auth.routes, music.routes
│   └── services/          # storage.service (ImageKit)
```

---

## 🔐 Roles

| Role | Permissions |
|------|-------------|
| **User** | Browse music, play tracks, view albums |
| **Artist** | Upload music, create albums, manage tracks |

---

## 🌍 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Storage | ImageKit |

---

## 👨‍💻 Author

**Farrukh Gul**

---

## 📄 License

MIT
