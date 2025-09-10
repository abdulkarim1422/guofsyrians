// C:\Users\abodi\OneDrive\Desktop\guofsyrians-main\frontend\src\components\RequireAdmin.jsx

import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // لو النظام لسه بيشيّك على حالة تسجيل الدخول
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mr-3"></div>
        جاري التحقق من الصلاحيات...
      </div>
    );
  }

  // إذا غير مسجل → يرجع للّوج إن
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // إذا مسجل لكن مش أدمن → يرجع للصفحة الرئيسية
  if (user.role !== "admin") return <Navigate to="/" replace />;

  // إذا أدمن → يسمح بالدخول
  return children;
}
