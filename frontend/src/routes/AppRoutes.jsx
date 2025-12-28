import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import AppLayout from "../app/layouts/AppLayout";

// Pages
import Login from "../marketing/pages/Login"; // Assuming you have this
import Dashboard from "../app/pages/dashboard/Dashboard";
import InterviewSession from "../app/pages/interviews/InterviewSession";
import InterviewResult from "../app/pages/interviews/InterviewSummary"; // Or Result page
import Candidates from "../app/pages/candidates/Candidates";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/auth/login" />} />

                {/* Protected App Routes */}
                <Route path="/app" element={<AppLayout />}>
                    
                    {/* ADMIN & HR DASHBOARDS */}
                    <Route 
                        path="dashboard" 
                        element={
                            <ProtectedRoute allowedRoles={["admin", "hr"]}>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />

                    {/* ADMIN ONLY */}
                    <Route 
                        path="admin/*" 
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                {/* Add Admin specific routes here if needed */}
                                <div>Admin Settings Panel</div>
                            </ProtectedRoute>
                        } 
                    />

                    {/* HR & ADMIN: CANDIDATES */}
                    <Route 
                        path="candidates" 
                        element={
                            <ProtectedRoute allowedRoles={["hr", "admin"]}>
                                <Candidates />
                            </ProtectedRoute>
                        } 
                    />

                    {/* STUDENT: INTERVIEW SESSION */}
                    <Route 
                        path="interview" 
                        element={
                            <ProtectedRoute allowedRoles={["student"]}>
                                <InterviewSession />
                            </ProtectedRoute>
                        } 
                    />

                    {/* STUDENT: RESULT PAGE */}
                    <Route 
                        path="result" 
                        element={
                            <ProtectedRoute allowedRoles={["student"]}>
                                <InterviewResult />
                            </ProtectedRoute>
                        } 
                    />

                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/auth/login" />} />
            </Routes>
        </BrowserRouter>
    );
}
