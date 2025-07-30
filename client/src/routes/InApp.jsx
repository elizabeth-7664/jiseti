// src/InApp.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Shared Components
import ProtectedRoute from "../components/shared/ProtectedRoute";
import AdminRoute from "../components/shared/AdminRoute";
import Header from "../components/shared/Header";
import Footer from "../components/shared/Footer";

// Pages
import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import PostListPage from "../pages/PostListPage";
import PostDetailPage from "../pages/PostDetailPage";
import CreatePostPage from "../pages/CreatePostPage";
import EditPostPage from "../pages/EditPostPage";
import ProfilePage from "../pages/ProfilePage";

// Admin Pages
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ReviewReportPage from "../pages/ReviewReportPage";

const InApp = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground p-4">
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <PostListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reports/:id"
            element={
              <AdminRoute>
                <ReviewReportPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default InApp;
