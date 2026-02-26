# 🎵 Musify — Frontend

React-based music streaming frontend for Musify, deployed on Vercel.

![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Build-Vite-purple) ![Tailwind](https://img.shields.io/badge/Style-TailwindCSS-cyan) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

## 🌐 Live

[https://musifyy-self.vercel.app](https://musify-vert.vercel.app/login)

---

## ✨ Features

- 🎧 Stream music directly in the browser
- 👤 User & Artist role-based views
- 💿 Browse albums and tracks
- 🎨 Dynamic gradient covers for tracks and albums
- 📱 Fully responsive — mobile + desktop
- ▶️ Persistent audio player with prev/next/volume/seek
- 🔐 JWT Bearer token authentication

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router v6 | Routing |
| Axios | API calls |

---

## 🚀 Getting Started

### Install

```bash
npm install
```

### Environment Variables

Create `.env` in the root:

```env
VITE_API_URL=http://localhost:5000/api
```

> For production, set `VITE_API_URL` in Vercel dashboard → Settings → Environment Variables

### Run

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Login, Register, ProtectedRoute
│   ├── layout/         # Navbar, Layout
│   ├── music/          # MusicList, AlbumList, AlbumDetail, UploadMusic, CreateAlbum
│   └── player/         # AudioPlayer
├── context/            # AuthContext
├── hooks/              # useAuth, usePlayer
├── providers/          # AuthProvider, PlayerProvider
├── services/           # api.js (Axios instance + interceptors)
└── utils/              # GradientCover.jsx, gradientColors.js
```

---

## 🔐 Roles

| Role | Access |
|------|--------|
| **User** | Browse music, play tracks, view albums |
| **Artist** | Upload music, create albums, manage tracks |

---

## 🌍 Deployment (Vercel)

`vercel.json` is included for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 👨‍💻 Author

**Farrukh Gul**

---

## 📄 License

MIT
