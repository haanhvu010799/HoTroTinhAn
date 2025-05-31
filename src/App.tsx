import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { CasePage } from './pages/CasePage';
import { CaseListPage } from './pages/CaseListPage';
import { AdminPage } from './pages/AdminPage';
import { useAuthStore } from './stores/authStore';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, loading } = useAuthStore();
  
  if (loading) {
    return <div>Đang tải...</div>;
  }
  
  if (!user) {
    return <Navigate to="/dang-nhap" />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/ho-so" />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dang-nhap" element={<LoginPage />} />
        
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/ho-so" />} />
          
          <Route
            path="/ho-so"
            element={
              <ProtectedRoute>
                <CaseListPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ho-so/moi"
            element={
              <ProtectedRoute>
                <CasePage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/quan-ly"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;