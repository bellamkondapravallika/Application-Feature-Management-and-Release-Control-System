import { useEffect, useState } from 'react';
import { Activity, Boxes, Layers3, ToggleLeft, TrendingUp, LoaderCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/ToastProvider';
import { evaluateFlag, getEnvironments, getFlags, getOverrides } from '../services/api';
import { useNavigate } from "react-router-dom";
import { getRedisStatus } from "../services/api";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [activity, setActivity] = useState([]);
  const [evaluation, setEvaluation] = useState({ flag_key: '', environment: 'production' });
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  // New state for Feature Flag Evaluation Tester
  const [tester, setTester] = useState({ flag_key: '', environment: 'production', user_id: '', groups: '' });
  const [testerResult, setTesterResult] = useState(null);
  const [testerLoading, setTesterLoading] = useState(false);
  const [redisStatus, setRedisStatus] = useState(null);


  const { addToast } = useToast();

  const loadDashboard = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const [flagsRes, environmentsRes, overridesRes, redisRes] = await Promise.all([
        getFlags(),
        getEnvironments(),
        getOverrides(),
        getRedisStatus(),
      ]);

      const flags = flagsRes.data || [];
      const environments = environmentsRes.data || [];
      const overrides = overridesRes.data || [];
      const redis = redisRes.data || null;
      setRedisStatus(redis);

      setStats([
        { label: 'Total Feature Flags', value: flags.length, icon: Boxes, accent: 'from-cyan-500 to-blue-500' },
        { label: 'Total Environments', value: environments.length, icon: Layers3, accent: 'from-violet-500 to-fuchsia-500' },
        { label: 'Total Overrides', value: overrides.length, icon: ToggleLeft, accent: 'from-emerald-500 to-teal-500' },
      ]);

      const latestActivity = [];
      if (flags[0]) {
        latestActivity.push({
          title: 'Latest flag synced',
          detail: `${flags[0].key} is ${flags[0].enabled ? 'enabled' : 'disabled'} from the backend`,
          time: 'Just updated',
        });
      }
      if (environments[0]) {
        latestActivity.push({
          title: 'Environment available',
          detail: `${environments[0].name} is ready for traffic routing`,
          time: 'Just loaded',
        });
      }
      if (overrides[0]) {
        latestActivity.push({
          title: 'Override configured',
          detail: `Override #${overrides[0].id} is active for a targeted rollout`,
          time: 'Just loaded',
        });
      }

      setActivity(latestActivity);
    } catch (error) {
      addToast(error.response?.data?.detail || 'Unable to load dashboard data.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboard(false);
  };

  const handleEvaluation = async (e) => {
    e.preventDefault();
    if (!evaluation.flag_key || !evaluation.environment) {
      addToast('Please enter a flag key and environment.', 'error');
      return;
    }

    setEvaluating(true);
    try {
      const response = await evaluateFlag(evaluation);
      setEvaluationResult(response.data.value);
      addToast('Evaluation completed successfully.', 'success');
    } catch (error) {
      addToast(error.response?.data?.detail || 'Unable to evaluate the flag.', 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const handleTesterEvaluation = async (e) => {
    e.preventDefault();
    if (!tester.flag_key || !tester.environment || !tester.user_id) {
      addToast('Please enter flag key, environment, and user ID.', 'error');
      return;
    }

    setTesterLoading(true);
    try {
      const payload = {
        ...tester,
        groups: tester.groups ? tester.groups.split(',').map(g => g.trim()) : []
      };
      const response = await evaluateFlag(payload);
      setTesterResult(response.data);
      addToast('Feature evaluation completed successfully.', 'success');
    } catch (error) {
      addToast(error.response?.data?.detail || 'Unable to evaluate feature.', 'error');
    } finally {
      setTesterLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold">Overview of your platform</h2>
            <p className="mt-2 max-w-2xl text-slate-400">Monitor flags, environments, and customer experience from a single command center.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setConfirmOpen(true)} className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">Reset Preview</button>
            <button onClick={handleRefresh} className="flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-300">
              {refreshing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />} Refresh Data
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
  <button onClick={() => navigate("/feature-flags")} className="rounded-xl bg-cyan-600 p-3">
    Feature Flags
  </button>

  <button onClick={() => navigate("/environments")} className="rounded-xl bg-violet-600 p-3">
    Environments
  </button>

  <button onClick={() => navigate("/overrides")} className="rounded-xl bg-emerald-600 p-3">
    Overrides
  </button>

  <button onClick={() => navigate("/group-management")} className="rounded-xl bg-orange-600 p-3">
    Groups
  </button>

  <button onClick={() => navigate("/group-members")} className="rounded-xl bg-pink-600 p-3">
    Group Members
  </button>

  <button onClick={() => navigate("/targeting-rules")} className="rounded-xl bg-indigo-600 p-3">
    Targeting Rules
  </button>

  <button onClick={() => navigate("/audit-logs")} className="rounded-xl bg-red-600 p-3">
    Audit Logs
  </button>
</div>
      {loading ? <LoadingSpinner label="Loading dashboard data" /> : (
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
              <div className={`inline-flex rounded-2xl bg-gradient-to-br ${accent} p-3 text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-400">Live</span>
          </div>
          <div className="space-y-3">
            {activity.length > 0 ? activity.map((item) => (
              <div key={item.title} className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="rounded-2xl bg-cyan-500/15 p-2 text-cyan-400"><Activity className="h-5 w-5" /></div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.detail}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                </div>
              </div>
            )) : <p className="text-sm text-slate-400">No backend activity is available yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <h3 className="text-lg font-semibold">Flag Evaluation</h3>
          <form onSubmit={handleEvaluation} className="mt-4 space-y-3">
            <input
              value={evaluation.flag_key}
              onChange={(e) => setEvaluation({ ...evaluation, flag_key: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
              placeholder="flag key"
            />
            <input
              value={evaluation.environment}
              onChange={(e) => setEvaluation({ ...evaluation, environment: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
              placeholder="environment"
            />
            <button disabled={evaluating} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
              {evaluating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Evaluate Flag
            </button>
          </form>
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
            {evaluationResult === null ? 'Run an evaluation to see the live result.' : `Result: ${evaluationResult ? 'Enabled' : 'Disabled'}`}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <h3 className="text-lg font-semibold">Feature Flag Evaluation Tester</h3>
        <form onSubmit={handleTesterEvaluation} className="mt-4 space-y-3">
          <input
            value={tester.flag_key}
            onChange={(e) => setTester({ ...tester, flag_key: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
            placeholder="flag key"
          />
          <input
            value={tester.environment}
            onChange={(e) => setTester({ ...tester, environment: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
            placeholder="environment"
          />
          <input
            value={tester.user_id}
            onChange={(e) => setTester({ ...tester, user_id: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
            placeholder="user id"
          />
          <input
            value={tester.groups}
            onChange={(e) => setTester({ ...tester, groups: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
            placeholder="groups (comma-separated)"
          />
          <button
            disabled={testerLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {testerLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            Evaluate Feature
          </button>
        </form>

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
          {testerResult === null ? (
            'Run a feature evaluation to see detailed results.'
          ) : (
            <div className="space-y-2">
              <p><span className="font-medium text-white">Feature Enabled:</span> {testerResult.value ? 'True' : 'False'}</p>
              <p><span className="font-medium text-white">Evaluation Reason:</span> {testerResult.reason}</p>
              <p><span className="font-medium text-white">User Bucket:</span> {testerResult.bucket}</p>
              <p><span className="font-medium text-white">Rollout Percentage:</span> {testerResult.rollout_percentage}%</p>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
  <h3 className="text-lg font-semibold mb-4">Redis Cache Status</h3>

  {redisStatus ? (
    <div className="space-y-2">
      <p>
        <span className="font-medium text-white">Status:</span>{" "}
        <span className={redisStatus.status === "Connected" ? "text-green-400" : "text-red-400"}>
          {redisStatus.status}
        </span>
      </p>

      <p>
        <span className="font-medium text-white">Cache:</span>{" "}
        {redisStatus.cache_enabled ? "Enabled" : "Disabled"}
      </p>

      <p>
        <span className="font-medium text-white">TTL:</span>{" "}
        {redisStatus.ttl} seconds
      </p>
    </div>
  ) : (
    <p>Loading Redis status...</p>
  )}
</div>

      <ConfirmDialog
        open={confirmOpen}
        title="Reset preview state"
        message="This will clear the temporary dashboard preview values. Continue?"
        onConfirm={() => {
          setConfirmOpen(false);
          setEvaluationResult(null);
          setTesterResult(null);
          addToast('Preview state reset', 'info');
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;