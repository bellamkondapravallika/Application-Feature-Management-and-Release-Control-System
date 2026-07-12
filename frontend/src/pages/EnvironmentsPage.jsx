import { useEffect, useState } from 'react';
import { Plus, ServerCog, Trash2, Pencil, LoaderCircle } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/ToastProvider';
import { createEnvironment, deleteEnvironment, getEnvironments, updateEnvironment } from '../services/api';

const initialForm = { name: '', description: '' };

const EnvironmentsPage = () => {
  const [environments, setEnvironments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const { addToast } = useToast();

  const loadEnvironments = async () => {
    setLoading(true);
    try {
      const response = await getEnvironments();
      setEnvironments(response.data || []);
    } catch (error) {
      addToast('Unable to load environments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnvironments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      addToast('Please fill in both fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateEnvironment(editingId, form);
        addToast('Environment updated successfully.', 'success');
      } else {
        await createEnvironment(form);
        addToast('Environment created successfully.', 'success');
      }
      setForm(initialForm);
      setEditingId(null);
      loadEnvironments();
    } catch (error) {
      addToast(error.response?.data?.detail || 'Unable to save environment.', 'error');
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
      await deleteEnvironment(targetId);
      addToast('Environment deleted.', 'success');
      loadEnvironments();
    } catch (error) {
      addToast(error.response?.data?.detail || 'Unable to delete environment.', 'error');
    } finally {
      setConfirmOpen(false);
      setTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-400">Environments</p>
          <h2 className="mt-2 text-2xl font-semibold">Environment inventory</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit Environment' : 'Add Environment'}</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
              placeholder="Environment name"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="min-h-24 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
              placeholder="Description"
            />
            <div className="flex gap-3">
              <button disabled={submitting} className="flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300">Cancel</button> : null}
            </div>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {loading ? <div className="col-span-full rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">Loading environments…</div> : environments.map((env) => (
            <div key={env.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-400"><ServerCog className="h-5 w-5" /></div>
                <div>
                  <p className="font-semibold">{env.name}</p>
                  <p className="text-sm text-slate-400">{env.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-400">Active</span>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(env.id); setForm({ name: env.name, description: env.description }); }} className="rounded-xl border border-slate-700 p-2 text-slate-300"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => confirmDelete(env.id)} className="rounded-xl border border-rose-500/20 p-2 text-rose-300"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete environment"
        message="This action cannot be undone. Continue?"
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setTargetId(null); }}
      />
    </div>
  );
};

export default EnvironmentsPage;
