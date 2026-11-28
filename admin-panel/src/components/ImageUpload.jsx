import { useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useDeleteGuard } from '../contexts/DeleteGuardContext';
import { Upload, Trash2 } from 'lucide-react';

export default function ImageUpload({ value, onChange, label = 'Image' }) {
  const confirmDelete = useDeleteGuard();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setUploading(true);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error: uploadError } = await supabase.storage
      .from('site-images')
      .upload(fileName, file, { upsert: true, cacheControl: '3600' });
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('site-images').getPublicUrl(fileName);
    onChange(data.publicUrl);
    setUploading(false);
    inputRef.current.value = '';
  };

  const handleRemove = async () => {
    const confirmed = await confirmDelete({
      title: 'Remove image',
      description: 'Enter your admin password to remove this image.',
      confirmLabel: 'Remove',
    });
    if (confirmed) onChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted block">{label}</label>
      <div className="flex items-center gap-3">
        {value && (
          <div className="relative">
            <img
              src={value}
              alt=""
              className="w-24 h-24 object-cover rounded-md border border-border bg-white"
            />
            <button type="button" onClick={handleRemove} className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
              <Trash2 size={14} />
            </button>
          </div>
        )}
        <label className="px-4 py-2 rounded-md border border-border text-sm text-muted hover:border-lavender hover:text-lavender transition cursor-pointer flex items-center gap-2 disabled:opacity-50">
          {uploading ? 'Uploading...' : <><Upload size={16} /> {label}</>}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
