import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useDeleteGuard } from '../contexts/DeleteGuardContext';

export function SectionCard({ title, onAdd, children }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-lavender hover:bg-[#F3EDFF] shrink-0 transition-colors"
        >
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function StringListCard({ title, items, onAdd, onChange, onRemove }) {
  const confirmDelete = useDeleteGuard();

  const handleRemove = async (index) => {
    const confirmed = await confirmDelete({
      title: 'Remove item',
      description: 'Enter your admin password to remove this item from the list.',
      confirmLabel: 'Remove',
    });
    if (confirmed) onRemove(index);
  };

  return (
    <SectionCard title={title} onAdd={onAdd}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <input
            className="flex-1 px-3 py-2.5 border border-border rounded-lg"
            value={item}
            onChange={(e) => onChange(index, e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            aria-label="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </SectionCard>
  );
}

export function RowActions({ index, length, onMove, onRemove }) {
  const confirmDelete = useDeleteGuard();

  const handleRemove = async () => {
    const confirmed = await confirmDelete({
      title: 'Delete item',
      description: 'Enter your admin password to remove this item.',
      confirmLabel: 'Delete',
    });
    if (confirmed) onRemove();
  };

  return (
    <div className="md:col-span-2 flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onMove(index, -1)}
        disabled={index === 0}
        className="p-2 text-muted hover:bg-white rounded disabled:opacity-40"
        aria-label="Move up"
      >
        <ArrowUp size={16} />
      </button>
      <button
        type="button"
        onClick={() => onMove(index, 1)}
        disabled={index === length - 1}
        className="p-2 text-muted hover:bg-white rounded disabled:opacity-40"
        aria-label="Move down"
      >
        <ArrowDown size={16} />
      </button>
      <button type="button" onClick={handleRemove} className="p-2 text-red-600 hover:bg-red-50 rounded" aria-label="Delete">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
