import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../marketing/pages/Landing";
import AppLayout from "../app/layouts/AppLayout";
import Dashboard from "../app/pages/dashboard/Dashboard";
import InterviewsList from "../app/pages/interviews/InterviewsList";
import Candidates from "../app/pages/candidates/Candidates";
import Settings from "../app/pages/settings/Settings";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Marketing */}
                <Route path="/" element={<Landing />} />

                {/* App */}
                <Route element={<AppLayout />}>
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/app/interviews" element={<InterviewsList />} />
                    <Route path="/app/candidates" element={<Candidates />} />
                    <Route path="/app/settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
