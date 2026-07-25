import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Splash from "./pages/Splash.jsx";
import Login from "./pages/Login.jsx";
import AuthComplete from "./pages/AuthComplete.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ReportView from "./pages/ReportView.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";
import Help from "./pages/Help.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/complete" element={<AuthComplete />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/report/:id" element={<ProtectedRoute><ReportView /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
