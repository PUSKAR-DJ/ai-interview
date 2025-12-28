import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../app/layouts/AppLayout";

// Auth & Public
import Login from "../marketing/pages/Login";
import Landing from "../marketing/pages/Landing"; // Assuming you have a Landing page
import NotFound from "../marketing/pages/NotFound"; // New
import Unauthorized from "../app/pages/Unauthorized"; // New

// App Pages
import Dashboard from "../app/pages/dashboard/Dashboard";
import InterviewSession from "../app/pages/interviews/InterviewSession";
import InterviewResult from "../app/pages/interviews/InterviewSummary"; 
import Candidates from "../app/pages/candidates/Candidates";
import Departments from "../app/pages/admin/Departments"; // New

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected App Routes */}
      <Route path="/app" element={<AppLayout />}>
        
        {/* Dashboard (Shared) */}
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin", "hr"]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Departments (Admin Only) */}
        <Route 
          path="admin/departments" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Departments />
            </ProtectedRoute>
          } 
        />

        {/* Candidates (Admin & HR) */}
        <Route 
          path="candidates" 
          element={
            <ProtectedRoute allowedRoles={["hr", "admin"]}>
              <Candidates />
            </ProtectedRoute>
          } 
        />

        {/* Student: Interview */}
        <Route 
          path="interview" 
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <InterviewSession />
            </ProtectedRoute>
          } 
        />

        {/* Student: Result */}
        <Route 
          path="result" 
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <InterviewResult />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}