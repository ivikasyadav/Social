import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './component/Login';
import Register from './component/Register';
import HomePage from './component/Home';
import CelebrityDashboard from './component/CelebrityDashboard';
import ProtectedRoute from './route/Protectedroute';
import RoleBasedRoute from './route/ROlebased';
import Navbar from './component/Navbar';
import Celebraty from './path/Celebraty';
import Public from './path/Public';
import { SocketProvider } from './context/SocketContext';
import { FeedProvider } from './context/FeedContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <FeedProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/celeb/*" element={
                  <ProtectedRoute>
                    <Celebraty />
                  </ProtectedRoute>
                } />

                <Route path="/pub/*" element={<Public />} />
              </Routes>
            </div>
          </div>
        </FeedProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
