import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const checkAdmin = async () => {
    setAdminLoading(true);
    const { data, error } = await supabase.rpc('is_admin');
    const allowed = !error && data === true;
    setIsAdmin(allowed);
    setAdminLoading(false);
    return allowed;
  };

  useEffect(() => {
    let active = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const sessionUser = data?.session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) await checkAdmin();
      if (active) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        setLoading(true);
        checkAdmin().finally(() => setLoading(false));
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.user) return { data: null, error };

    const allowed = await checkAdmin();
    if (!allowed) {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      return { data: null, error: { message: 'This account does not have admin access.' } };
    }

    return { data, error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, adminLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
