// C:\Users\abodi\OneDrive\Desktop\guofsyrians-main\frontend\src\main.jsx


import React from "react";

import ReactDOM from "react-dom/client";
import { Resume } from "@/pages/Resume.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import { ResumeForm } from "@/pages/ResumeForm.jsx";
import Dashboard from "@/pages/dashboard.jsx";
import LoginPage from "@/pages/LoginPage.tsx";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import ProtectedRoute from "@/components/auth-components/ProtectedRoute.tsx";
import {Wave} from "@/pages/MainLandingPage.jsx";
import JobDetails from '@/pages/JobDetails.jsx';
import { ComponentTest } from '@/pages/ComponentTest.jsx';
import { LoginTest } from '@/pages/LoginTest.jsx';







import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HelmetProvider>
            <AuthProvider>
                <BrowserRouter future={{ 
                    v7_startTransition: true,
                    v7_relativeSplatPath: true 
                }}>
                    <Routes>
                        <Route path="/" element={
                                <Wave />
                        } />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/cv/:memberId" element={<Resume />} />
                        <Route path="/form" element={
                                <ResumeForm />
                        } />
                        <Route path="/test" element={<ComponentTest />} />
                        <Route path="/login-test" element={<LoginTest />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/students-list" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/chat" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/tasks" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/reports" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/announcements" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/about" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/edit-resume" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                         {/* 👇 مسار صفحة إضافة وظيفة للأدمن */}
                        <Route path="/admin/jobs/new" element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/jobs/:id" element={<JobDetails />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </HelmetProvider>
    </React.StrictMode>,
);

