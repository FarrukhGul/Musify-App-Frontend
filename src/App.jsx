import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { PlayerProvider } from './providers/PlayerProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import MusicList from './components/music/MusicList';
import AlbumList from './components/music/AlbumList';
import AlbumDetail from './components/music/AlbumDetail';
import UploadMusic from './components/music/UploadMusic';
import CreateAlbum from './components/music/CreateAlbum';
import AudioPlayer from './components/player/AudioPlayer';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';

import ArtistHome from './components/music/ArtistHome';
import UserHome from './components/music/UserHome';

// Home component that redirects based on auth status
const Home = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'artist'){
    return <ArtistHome />;
  } 
  if(user.role !== 'artist'){
    return <UserHome />
  }
    
  return <MusicList />;
};


function App() {
  console.log('App rendering');
  
  return (
    <Router>
      <AuthProvider>
        <PlayerProvider>
          <ErrorBoundary>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                
                <Route path="/music" element={
                  <ProtectedRoute>
                    <MusicList />
                  </ProtectedRoute>
                } />
                
                <Route path="/albums" element={
                  <ProtectedRoute>
                    <AlbumList />
                  </ProtectedRoute>
                } />
                
                <Route path="/albums/:id" element={
                  <ProtectedRoute>
                    <AlbumDetail />
                  </ProtectedRoute>
                } />
                
                {/* Artist only routes */}
                <Route path="/upload" element={
                  <ProtectedRoute allowedRoles={['artist']}>
                    <UploadMusic />
                  </ProtectedRoute>
                } />
                
                <Route path="/create-album" element={
                  <ProtectedRoute allowedRoles={['artist']}>
                    <CreateAlbum />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          
          </ErrorBoundary>
        </PlayerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;