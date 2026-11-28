import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DeleteGuardProvider } from './contexts/DeleteGuardContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Site from './pages/Site';
import Nav from './pages/Nav';
import Profile from './pages/Profile';
import Skills from './pages/Skills';
import Tools from './pages/Tools';
import Projects from './pages/Projects';
import Education from './pages/Education';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import Footer from './pages/Footer';
import Style from './pages/Style';
import Messages from './pages/Messages';
import Admins from './pages/Admins';
import Account from './pages/Account';

function ProtectedRoute({ children }) {
  const { user, loading, adminLoading, isAdmin } = useAuth();

  if (!user && (loading || adminLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3 text-muted text-sm">
          <span className="w-8 h-8 rounded-full border-2 border-border border-t-lavender animate-spin" />
          Checking access...
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (adminLoading && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3 text-muted text-sm">
          <span className="w-8 h-8 rounded-full border-2 border-border border-t-lavender animate-spin" />
          Checking access...
        </div>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <DeleteGuardProvider>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="admin" element={<Dashboard />} />
            <Route path="admin/site" element={<Site />} />
            <Route path="admin/nav" element={<Nav />} />
            <Route path="admin/profile" element={<Profile />} />
            <Route path="admin/contact" element={<Contact />} />
            <Route path="admin/footer" element={<Footer />} />
            <Route path="admin/style" element={<Style />} />
            <Route path="admin/skills" element={<Skills />} />
            <Route path="admin/tools" element={<Tools />} />
            <Route path="admin/education" element={<Education />} />
            <Route path="admin/faq" element={<Faq />} />
            <Route path="admin/projects" element={<Projects />} />
            <Route path="admin/messages" element={<Messages />} />
            <Route path="admin/admins" element={<Admins />} />
            <Route path="admin/account" element={<Account />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </DeleteGuardProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
