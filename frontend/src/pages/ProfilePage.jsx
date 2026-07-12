import { useEffect, useState } from 'react';
import {
  UserCircle2,
  ShieldCheck,
  BellRing,
  KeyRound,
  LoaderCircle,
  X,
  Edit3,
  Save,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfile } from '../services/api';
import { useToast } from '../components/ToastProvider';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const [editData, setEditData] = useState({
    displayName: '',
  });

  const { addToast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      try {
        const response = await getProfile();

        const savedProfile = JSON.parse(
          localStorage.getItem('profile_details')
        );

        const userProfile = {
          ...response.data,
          displayName:
            savedProfile?.displayName ||
            response.data.email?.split('@')[0],
        };

        setProfile(userProfile);

        setEditData({
          displayName: userProfile.displayName,
        });

        localStorage.setItem('user_email', response.data.email);
      } catch (error) {
        addToast('Unable to load your profile.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = () => {
    const updatedProfile = {
      ...profile,
      displayName: editData.displayName,
    };

    setProfile(updatedProfile);

    localStorage.setItem(
      'profile_details',
      JSON.stringify({ displayName: editData.displayName })
    );

    setShowEditModal(false);
    addToast('Profile updated locally.', 'success');
  };

  const cards = [
    {
      icon: ShieldCheck,
      title: 'Security',
      text: 'JWT authenticated session',
      details:
        'Your account is protected using secure JWT authentication. Your session is validated through API tokens.',
    },
    {
      icon: BellRing,
      title: 'Notifications',
      text: 'Live updates enabled',
      details:
        'Real-time notifications are enabled. You will receive important system updates and alerts.',
    },
    {
      icon: KeyRound,
      title: 'API Access',
      text: 'Token-based access',
      details:
        'Your account uses secure token-based API communication with protected endpoints.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >

      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 p-8 shadow-xl">

        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-5">

            <div className="rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-600 p-5 text-white shadow-lg">
              <UserCircle2 className="h-14 w-14" />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                Profile
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {loading ? 'Loading...' : profile?.displayName || 'User'}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-slate-300">
                <Mail className="h-4 w-4" />
                {profile?.email}
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Signed in with a valid API token
              </div>
            </div>

          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-400"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>

        </div>
      </div>


      {!loading && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur">

          <h3 className="text-xl font-semibold text-white">
            About
          </h3>

          <p className="mt-3 text-slate-400">
            Feature Flag System User
          </p>

        </div>
      )}


      {loading ? (
        <div className="flex items-center gap-2 text-slate-400">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading profile details
        </div>
      ) : (

        <div className="grid gap-5 md:grid-cols-3">

          {cards.map(({ icon: Icon, title, text, details }) => (

            <motion.button
              key={title}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                setActiveCard({
                  title,
                  details,
                  Icon,
                })
              }
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-left shadow-lg backdrop-blur"
            >

              <div className="inline-flex rounded-2xl bg-slate-800 p-3 text-cyan-400">
                <Icon className="h-6 w-6" />
              </div>

              <h4 className="mt-5 text-lg font-semibold text-white">
                {title}
              </h4>

              <p className="mt-2 text-sm text-slate-400">
                {text}
              </p>

            </motion.button>

          ))}

        </div>
      )}


      {/* Card Modal */}
      <AnimatePresence>
        {activeCard && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCard(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"
          >

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-7"
            >

              <div className="flex items-center gap-3">

                {(() => {
                  const Icon = activeCard.Icon;
                  return <Icon className="text-cyan-400" />;
                })()}

                <h3 className="text-xl font-bold text-white">
                  {activeCard.title}
                </h3>

              </div>

              <p className="mt-4 text-slate-400">
                {activeCard.details}
              </p>

              <button
                onClick={() => setActiveCard(null)}
                className="mt-6 w-full rounded-xl bg-slate-800 p-3 text-white"
              >
                Close
              </button>

            </motion.div>

          </motion.div>

        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Edit Profile</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6">
                <label className="block text-sm text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editData.displayName}
                  onChange={(e) =>
                    setEditData({ ...editData, displayName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                <Save className="h-5 w-5" />
                Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ProfilePage;