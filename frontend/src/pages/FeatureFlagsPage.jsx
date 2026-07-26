import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, SlidersHorizontal, ToggleLeft, Trash2, Pencil, LoaderCircle } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/ToastProvider';
import { createFlag, deleteFlag, getFlags, updateFlag } from '../services/api';

const initialForm = { key: '', description: '', enabled: true, default_value: false, rollout_percentage: 100 };

const FeatureFlagsPage = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showOnlyEnabled, setShowOnlyEnabled] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const { addToast } = useToast();

  const loadFlags = async () => {
    setLoading(true);
    try {
      const response = await getFlags();
      setFlags(response.data || []);
    } catch (error) {
      addToast('Unable to load feature flags.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlags();
  }, []);

  const filteredFlags = useMemo(() => flags.filter((flag) => {
    const matchesSearch = `${flag.key} ${flag.description}`.toLowerCase().includes(search.toLowerCase());
    const matchesEnabled = !showOnlyEnabled || flag.enabled;
    return matchesSearch && matchesEnabled;
  }), [flags, search, showOnlyEnabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.key.trim() || !form.description.trim()) {
      addToast('Please provide a key and description.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateFlag(editingId, form);
        addToast('Flag updated successfully.', 'success');
      } else {
        await createFlag(form);
        addToast('Flag created successfully.', 'success');
      }
      setForm(initialForm);
      setEditingId(null);
      loadFlags();
    } catch (error) {
      addToast(error.response?.data?.detail || 'Unable to save flag.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    setTargetId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!targetId) return;
    try {
      await deleteFlag(targetId);
      addToast('Flag deleted.', 'success');
      loadFlags();
    } catch (error) {
      addToast(error.response?.data?.detail || 'Unable to delete flag.', 'error');
    } finally {
      setConfirmOpen(false);
      setTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Feature Flags</p>
          <h2 className="mt-2 text-2xl font-semibold">Manage release toggles</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit Flag' : 'Create Flag'}</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2" placeholder="Flag key" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-24 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2" placeholder="Description" />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
              Enabled by default
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.default_value} onChange={(e) => setForm({ ...form, default_value: e.target.checked })} />
              Default value
            </label>

            {/* Rollout Percentage */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Rollout Percentage</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={form.rollout_percentage}
                  onChange={(e) => setForm({ ...form, rollout_percentage: Number(e.target.value) })}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.rollout_percentage}
                  onChange={(e) => setForm({ ...form, rollout_percentage: Number(e.target.value) })}
                  className="w-20 rounded-xl border border-slate-800 bg-slate-950/70 px-2 py-1 text-center"
                />
                <span className="text-slate-400 text-sm">%</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button disabled={submitting} className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300">Cancel</button> : null}
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg sm:p-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none" placeholder="Search flags" />
            </div>
            <button onClick={() => setShowOnlyEnabled((value) => !value)} className="flex items-center gap-2 rounded-xl border border-slate-800 px-3 py-2 text-sm text-slate-300">
              <SlidersHorizontal className="h-4 w-4" /> {showOnlyEnabled ? 'Enabled only' : 'All flags'}
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Key</th>
                  <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Default</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Rollout %</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-slate-400">
                      Loading flags…
                    </td>
                  </tr>
                ) : filteredFlags.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-slate-400">
                      No flags found.
                    </td>
                  </tr>
                ) : (
                  filteredFlags.map((flag) => (
                    <tr key={flag.id} className="border-t border-slate-800 bg-slate-900/60">
                      <td className="px-4 py-3 font-medium">{flag.key}</td>
                      <td className="px-4 py-3">{flag.description}</td>
                      <td className="px-4 py-3">{flag.default_value ? 'On' : 'Off'}</td>
                      <td className="px-4 py-3">
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
                            flag.enabled
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <ToggleLeft className="h-4 w-4" /> {flag.enabled ? 'Enabled' : 'Disabled'}
                        </div>
                      </td>
                      <td className="px-4 py-3">{flag.rollout_percentage}%</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(flag.id);
                              setForm({
                                key: flag.key,
                                description: flag.description,
                                enabled: flag.enabled,
                                default_value: flag.default_value,
                                rollout_percentage:
                                  flag.rollout_percentage !== undefined
                                    ? flag.rollout_percentage
                                    : 100,
                              });
                            }}
                            className="rounded-xl border border-slate-700 p-2 text-slate-300"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(flag.id)}
                            className="rounded-xl border border-rose-500/20 p-2 text-rose-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete flag"
        message="This action cannot be undone. Continue?"
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setTargetId(null);
        }}
      />
    </div>
  );
};

export default FeatureFlagsPage;
