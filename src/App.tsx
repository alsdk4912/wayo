import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, getRoleHome } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ParentLayout from "./components/layouts/ParentLayout";
import TutorLayout from "./components/layouts/TutorLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import TutorListPage from "./pages/TutorListPage";
import TutorDetailPage from "./pages/TutorDetailPage";
import ParentHomePage from "./pages/parent/ParentHomePage";
import ParentBookingsPage from "./pages/parent/ParentBookingsPage";
import ParentSubscriptionPage from "./pages/parent/ParentSubscriptionPage";
import TutorDashboardPage from "./pages/tutor/TutorDashboardPage";
import TutorSchedulePage from "./pages/tutor/TutorSchedulePage";
import TutorSessionsPage from "./pages/tutor/TutorSessionsPage";
import TutorProfileSetupPage from "./pages/tutor/TutorProfileSetupPage";
import TutorVerificationPage from "./pages/tutor/TutorVerificationPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminTutorsPage from "./pages/admin/AdminTutorsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminVerificationsPage from "./pages/admin/AdminVerificationsPage";
import AdminVerificationDetailPage from "./pages/admin/AdminVerificationDetailPage";
import AdminKitsPage from "./pages/admin/AdminKitsPage";

function RootRedirect() {
  const { user } = useAuth();
  if (user) return <Navigate to={getRoleHome(user.role)} replace />;
  return (
    <>
      <Navbar />
      <HomePage />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<RootRedirect />} />

          <Route path="/parent" element={<ProtectedRoute allowed={["parent"]}><ParentLayout /></ProtectedRoute>}>
            <Route index element={<ParentHomePage />} />
            <Route path="tutors" element={<TutorListPage />} />
            <Route path="tutors/:id" element={<TutorDetailPage />} />
            <Route path="bookings" element={<ParentBookingsPage />} />
            <Route path="subscription" element={<ParentSubscriptionPage />} />
          </Route>

          <Route path="/tutor" element={<ProtectedRoute allowed={["tutor"]}><TutorLayout /></ProtectedRoute>}>
            <Route index element={<TutorDashboardPage />} />
            <Route path="profile" element={<TutorProfileSetupPage />} />
            <Route path="verification" element={<TutorVerificationPage />} />
            <Route path="schedule" element={<TutorSchedulePage />} />
            <Route path="sessions" element={<TutorSessionsPage />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute allowed={["admin"]}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="tutors" element={<AdminTutorsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="verifications" element={<AdminVerificationsPage />} />
            <Route path="verifications/:teacherId" element={<AdminVerificationDetailPage />} />
            <Route path="kits" element={<AdminKitsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
