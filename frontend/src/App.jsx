import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AppRedirect from './pages/AppRedirect';
import BookAppointment from './pages/BookAppointment';
import DoctorQueue from './pages/DoctorQueue';
import CreateUser from './pages/CreateUser';
import Profile from './pages/Profile';

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App shell — redirect to role home */}
        <Route path="/app" element={
          <ProtectedRoute>
            <AppRedirect />
          </ProtectedRoute>
        } />

        {/* Patient */}
        <Route path="/app/book" element={
          <ProtectedRoute roles={['patient']}>
            <BookAppointment />
          </ProtectedRoute>
        } />

        {/* Doctor */}
        <Route path="/app/queue" element={
          <ProtectedRoute roles={['doctor']}>
            <DoctorQueue />
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/app/admin/create-user" element={
          <ProtectedRoute roles={['admin']}>
            <CreateUser />
          </ProtectedRoute>
        } />

        {/* Common */}
        <Route path="/app/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
