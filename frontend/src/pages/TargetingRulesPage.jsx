import { useEffect, useState } from 'react';
import { getTargetingRules, createTargetingRule, deleteTargetingRule } from '../services/api';
import { useToast } from '../components/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, LoaderCircle, Users, User } from 'lucide-react';

const TargetingRulesPage = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newRule, setNewRule] = useState({
  flag_id: 1,
  rule_type: 'user',
  rule_value: ''
});
  const { addToast } = useToast();

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await getTargetingRules();
      setRules(response.data || []);
    } catch (error) {
      addToast('Failed to load targeting rules.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreate = async () => {
    if (!newRule.rule_value) {
      addToast('Please enter a target ID.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await createTargetingRule({
  flag_id: newRule.flag_id,
  rule_type: newRule.rule_type,
  rule_value: newRule.rule_value
});
      addToast('Targeting rule created successfully.', 'success');
      setShowModal(false);
      setNewRule({
  flag_id: 1,
  rule_type: 'user',
  rule_value: ''
});
      fetchRules();
    } catch (error) {
      addToast('Failed to create targeting rule.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setSubmitting(true);
    try {
      await deleteTargetingRule(deleteConfirm.id);
      addToast('Targeting rule deleted successfully.', 'success');
      setDeleteConfirm(null);
      fetchRules();
    } catch (error) {
      addToast('Failed to delete targeting rule.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Targeting Rules</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          <Plus className="h-5 w-5" /> New Rule
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <LoaderCircle className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      ) : rules.length === 0 ? (
        <p className="text-slate-400">No targeting rules found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/60">
          <table className="min-w-full text-sm text-slate-300">
            <thead className="bg-slate-800/70 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Target ID</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-t border-slate-700">
                  <td className="px-4 py-3 flex items-center gap-2">
                    {rule.type === 'user' ? <User className="h-4 w-4 text-cyan-400" /> : <Users className="h-4 w-4 text-violet-400" />}
                    {rule.type}
                  </td>
                  <td className="px-4 py-3">{rule.rule_value}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setDeleteConfirm(rule)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Rule Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Create Targeting Rule</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Type</label>
                  <select
                    value={newRule.rule_type}
                    onChange={(e) => setNewRule({ ...newRule, rule_type: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-200"
                  >
                    <option value="user">User</option>
                    <option value="group">Group</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Target ID</label>
                  <input
                    type="text"
                    value={newRule.rule_value}
                    onChange={(e) => setNewRule({ ...newRule, rule_value: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-200"
                    placeholder="Enter user or group ID"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-600 px-4 py-2 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70"
                >
                  {submitting && <LoaderCircle className="h-5 w-5 animate-spin" />}
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Delete Rule</h2>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete this targeting rule for <span className="font-semibold">{deleteConfirm.targetId}</span>?
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

export default TargetingRulesPage;
