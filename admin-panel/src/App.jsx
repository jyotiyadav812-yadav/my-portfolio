import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import CMS from './pages/CMS';

function ProtectedRoute({ children }) {
  const { user, loading, adminLoading, isAdmin } = useAuth();

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3 text-muted text-sm">
          <span className="w-8 h-8 rounded-full border-2 border-border border-t-lavender animate-spin" />
          Checking access...
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="admin" element={<CMS />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
