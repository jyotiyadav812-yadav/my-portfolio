import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useSiteContent(key, defaults, normalize) {
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      const { data, error: loadError } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (!active) return;
      if (loadError) setError(loadError.message);
      else setForm(normalize ? normalize(data?.value ?? {}) : { ...defaults, ...(data?.value ?? {}) });
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [key, defaults, normalize]);

  const save = useCallback(
    async (value = form) => {
      setError('');
      setSaving(true);
      const { error: saveError } = await supabase
        .from('site_content')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      setSaving(false);

      if (saveError) {
        setToast({ kind: 'error', message: saveError.message });
        return false;
      }

      setToast({ kind: 'success', message: 'Changes saved. Your portfolio will show them on reload.' });
      return true;
    },
    [form, key]
  );

  return { form, setForm, loading, saving, error, toast, setToast, save };
}
