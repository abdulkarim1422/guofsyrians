import React from "react";

import ReactDOM from "react-dom/client";
import { Resume } from "./Pages/Resume";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import { ContactForm } from "./Pages/form";
import Dashboard from "./Pages/dashboard";

import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter future={{ 
                v7_startTransition: true,
                v7_relativeSplatPath: true 
            }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/cv" element={<Resume />} />
                    <Route path="/form" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/students-list" element={<Dashboard />} />
                    <Route path="/chat" element={<Dashboard />} />
                    <Route path="/tasks" element={<Dashboard />} />
                    <Route path="/reports" element={<Dashboard />} />
                    <Route path="/settings" element={<Dashboard />} />
                    <Route path="/contact-form" element={<ContactForm />} />
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>,
);

