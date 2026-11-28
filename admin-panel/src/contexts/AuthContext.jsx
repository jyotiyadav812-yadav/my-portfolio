import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const userRef = useRef(null);
  const checkRef = useRef(null);

  const applyUser = useCallback((nextUser) => {
    userRef.current = nextUser;
    setUser(nextUser);
    if (!nextUser) setIsAdmin(false);
  }, []);

  const checkAdmin = useCallback(async (userId) => {
    const id = userId ?? userRef.current?.id;
    if (!id) return false;
    if (checkRef.current?.id === id) return checkRef.current.promise;

    setAdminLoading(true);
    const promise = (async () => {
      try {
        const { data, error } = await supabase.rpc('is_admin');
        const allowed = !error && data === true && userRef.current?.id === id;
        if (userRef.current?.id === id) setIsAdmin(allowed);
        return allowed;
      } catch {
        if (userRef.current?.id === id) setIsAdmin(false);
        return false;
      } finally {
        if (userRef.current?.id === id) setAdminLoading(false);
        if (checkRef.current?.id === id) checkRef.current = null;
      }
    })();
    checkRef.current = { id, promise };
    return promise;
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!active) return;
        const sessionUser = data?.session?.user ?? null;
        applyUser(sessionUser);
        if (sessionUser) await checkAdmin(sessionUser.id);
      } catch {
        if (active) setIsAdmin(false);
      } finally {
        if (active) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') return;
      const nextUser = session?.user ?? null;
      if (event === 'SIGNED_IN' && nextUser && userRef.current?.id === nextUser.id) {
        applyUser(nextUser);
        return;
      }
      applyUser(nextUser);
      if (!nextUser) {
        setLoading(false);
        setAdminLoading(false);
        return;
      }
      setLoading(true);
      checkAdmin(nextUser.id).finally(() => {
        if (active) setLoading(false);
      });
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [applyUser, checkAdmin]);

  const login = useCallback(
    async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data?.user) return { data: null, error };

        applyUser(data.user);
        const allowed = await checkAdmin(data.user.id);
        if (!allowed) {
          await supabase.auth.signOut();
          applyUser(null);
          return { data: null, error: { message: 'This account does not have admin access.' } };
        }
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },
    [applyUser, checkAdmin],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    applyUser(null);
    setLoading(false);
    setAdminLoading(false);
  }, [applyUser]);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, adminLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
