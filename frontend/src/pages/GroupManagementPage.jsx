import { useEffect, useState } from 'react';
import { getGroups, createGroup, updateGroup, deleteGroup } from '../services/api';
import { useToast } from '../components/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, LoaderCircle } from 'lucide-react';

const GroupManagementPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({ id: null, name: '' });
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await getGroups();
      setGroups(response.data || []);
    } catch (error) {
      addToast('Failed to load groups', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleOpenModal = (group = null) => {
    if (group) {
      setFormData({ id: group.id, name: group.group_name });
    } else {
      setFormData({ id: null, name: '' });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Group name is required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (formData.id) {
        await updateGroup(formData.id, { group_name: formData.name });
        addToast('Group updated successfully', 'success');
      } else {
        await createGroup({ group_name: formData.name });
        addToast('Group created successfully', 'success');
      }
      setModalOpen(false);
      fetchGroups();
    } catch (error) {
      addToast('Failed to save group', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setSubmitting(true);
    try {
      await deleteGroup(deleteConfirm.id);
      addToast('Group deleted successfully', 'success');
      setDeleteConfirm(null);
      fetchGroups();
    } catch (error) {
      addToast('Failed to delete group', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Group Management</h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            <Plus className="h-5 w-5" /> New Group
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="h-10 w-10 animate-spin text-cyan-400" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-xl"
          >
            <table className="min-w-full divide-y divide-slate-800">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {groups.map((group) => (
                  <motion.tr
                    key={group.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-800/50 transition"
                  >
                    <td className="px-6 py-4 text-slate-200">{group.id}</td>
                    <td className="px-6 py-4 text-slate-200">{group.group_name}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenModal(group)}
                        className="mr-3 text-cyan-400 hover:text-cyan-300"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(group)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                {formData.id ? 'Edit Group' : 'Create Group'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Group Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
                    placeholder="Enter group name"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70"
                  >
                    {submitting && <LoaderCircle className="h-5 w-5 animate-spin" />}
                    {formData.id ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Delete Group</h2>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete <span className="font-semibold">{deleteConfirm.name}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-xl border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-400 disabled:opacity-70"
                >
                  {submitting && <LoaderCircle className="h-5 w-5 animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupManagementPage;