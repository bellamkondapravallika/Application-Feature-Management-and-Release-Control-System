import { useEffect, useState } from 'react';
import { addUserToGroup, getGroups } from '../services/api';
import { useToast } from '../components/ToastProvider';
import { motion } from 'framer-motion';
import { LoaderCircle, Users, UserPlus } from 'lucide-react';

const GroupMembersPage = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
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
    fetchGroups();
  }, [addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroup || !userId) {
      addToast('Please select a group and enter a User ID.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await addUserToGroup({
  user_id: Number(userId),
  group_id: Number(selectedGroup),
});
      addToast('User successfully added to group', 'success');
      setUserId('');
      setSelectedGroup('');
    } catch (error) {
      addToast('Failed to add user to group', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_45%),linear-gradient(135deg,_#020617,_#111827)] p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-8 w-8 text-cyan-400" />
          <h1 className="text-2xl font-semibold text-white">Group Members Management</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoaderCircle className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Select Group</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
              >
                <option value="">-- Choose a group --</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.group_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">User ID</label>
              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
                <UserPlus className="h-5 w-5 text-slate-400 mr-2" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter User ID"
                  className="w-full bg-transparent outline-none text-white"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign User to Group'
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default GroupMembersPage;
