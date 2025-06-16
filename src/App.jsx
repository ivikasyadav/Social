import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './component/Login';
import Register from './component/Register';
import HomePage from './component/Home';
import CelebrityDashboard from './component/CelebrityDashboard';
import ProtectedRoute from './route/Protectedroute';
import RoleBasedRoute from './route/ROlebased';
import UserSidebar from './component/SIdebar';
import Navbar from './component/Navbar';
import Celebraty from './path/Celebraty';
import CreatePost from './component/CreatePost';
import Public from './path/Public';
import { SocketProvider } from './context/SocketContext';
import { FeedProvider } from './context/FeedContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <FeedProvider>
      <div className="flex min-h-screen">
        {/* <UserSidebar /> */}
        <div className="flex-1">
          <Navbar />
          <div className="p-4">
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
      </div>
        </FeedProvider>
    </SocketProvider>
    </AuthProvider>
  );
}

export default App;
