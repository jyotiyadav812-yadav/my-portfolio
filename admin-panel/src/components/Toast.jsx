import { X, CheckCircle, AlertCircle } from 'lucide-react';

export default function Toast({ toast, onRemove }) {
  if (!toast) return null;

  const isSuccess = toast.kind === 'success';

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-lg border flex items-center gap-3 z-50 animate-in fade-in slide-in-from-right-2 duration-300 ${
        isSuccess
          ? 'bg-[#ECFDFF] border-[#67DDF5] text-[#065F6B]'
          : 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]'
      }`}
    >
      {isSuccess ? (
        <CheckCircle size={20} className="text-[#67DDF5]" />
      ) : (
        <AlertCircle size={20} className="text-[#FCA5A5]" />
      )}
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={onRemove}
        className="ml-auto p-1 rounded hover:bg-current/10"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
