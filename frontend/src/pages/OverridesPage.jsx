import { useEffect, useState } from 'react';
import { Plus, ShieldAlert, Trash2, Pencil, LoaderCircle } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/ToastProvider';
import { createOverride, deleteOverride, getEnvironments, getFlags, getOverrides, updateOverride } from '../services/api';

const initialForm = { flag_id: '', environment_id: '', value: true };

const OverridesPage = () => {
  const [overrides, setOverrides] = useState([]);
  const [flags, setFlags] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const { addToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [overridesRes, flagsRes, environmentsRes] = await Promise.all([getOverrides(), getFlags(), getEnvironments()]);
      setOverrides(overridesRes.data || []);
      setFlags(flagsRes.data || []);
      setEnvironments(environmentsRes.data || []);
    } catch (error) {
      addToast('Unable to load overrides.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.flag_id || !form.environment_id) {
      addToast('Please choose both a flag and environment.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form, flag_id: Number(form.flag_id), environment_id: Number(form.environment_id), value: Boolean(form.value) };
      if (editingId) {
        await updateOverride(editingId, payload);
        addToast('Override updated.', 'success');
      } else {
        await createOverride(payload);
        addToast('Override created.', 'success');
      }
      setForm(initialForm);
      setEditingId(null);
      loadData();
    } catch (error) {
      addToast(error.response?.data?.detail || 'Unable to save override.', 'error');
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
      await deleteOverride(targetId);
      addToast('Override deleted.', 'success');
      loadData();
    } catch (error) {
      addToast(error.response?.data?.detail || 'Unable to delete override.', 'error');
    } finally {
      setConfirmOpen(false);
      setTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Overrides</p>
          <h2 className="mt-2 text-2xl font-semibold">Temporary environment overrides</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit Override' : 'Create Override'}</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <select value={form.flag_id} onChange={(e) => setForm({ ...form, flag_id: e.target.value })} className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
              <option value="">Select flag</option>
              {flags.map((flag) => <option key={flag.id} value={flag.id}>{flag.key}</option>)}
            </select>
            <select value={form.environment_id} onChange={(e) => setForm({ ...form, environment_id: e.target.value })} className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
              <option value="">Select environment</option>
              {environments.map((env) => <option key={env.id} value={env.id}>{env.name}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={Boolean(form.value)} onChange={(e) => setForm({ ...form, value: e.target.checked })} />
              Override value enabled
            </label>
            <div className="flex gap-3">
              <button disabled={submitting} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300">Cancel</button> : null}
            </div>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {loading ? <div className="col-span-full rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">Loading overrides…</div> : overrides.map((override) => (
            <div key={override.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400"><ShieldAlert className="h-5 w-5" /></div>
                <div>
                  <p className="font-semibold">Override #{override.id}</p>
                  <p className="text-sm text-slate-400">Flag {override.flag_id} · Env {override.environment_id}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className={`rounded-full px-3 py-1 ${override.value ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>{override.value ? 'Active' : 'Disabled'}</span>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(override.id); setForm({ flag_id: override.flag_id.toString(), environment_id: override.environment_id.toString(), value: override.value }); }} className="rounded-xl border border-slate-700 p-2 text-slate-300"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => confirmDelete(override.id)} className="rounded-xl border border-rose-500/20 p-2 text-rose-300"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog open={confirmOpen} title="Delete override" message="This action cannot be undone. Continue?" onConfirm={handleDelete} onCancel={() => { setConfirmOpen(false); setTargetId(null); }} />
    </div>
  );
};

export default OverridesPage;
