import React, { useEffect, useState } from 'react';
import { Activity, Boxes, Layers3, ToggleLeft, TrendingUp, LoaderCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/ToastProvider';
import { evaluateFlag, getEnvironments, getFlags, getOverrides } from '../services/api';
import { useNavigate } from "react-router-dom";
import { getRedisStatus } from "../services/api";
import { useTranslation } from "react-i18next";

import {
  getAnalyticsSummary,
  getAnalyticsFlags,
  getAnalyticsUsage,
} from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardPage = () => {
  const { t } = useTranslation();
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
  const [summary, setSummary] = useState({});
const [flagData, setFlagData] = useState([]);
const [usageData, setUsageData] = useState([]);


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
        { label: t('dashboard.totalFlags'), value: flags.length, icon: Boxes, accent: 'from-cyan-500 to-blue-500' },
        { label: t('dashboard.totalEnvironments'), value: environments.length, icon: Layers3, accent: 'from-violet-500 to-fuchsia-500' },
        { label: t('dashboard.totalOverrides'), value: overrides.length, icon: ToggleLeft, accent: 'from-emerald-500 to-teal-500' },
      ]);

      const latestActivity = [];
      if (flags[0]) {
        latestActivity.push({
          title: t('dashboard.latestFlagSynced'),
          detail: t('dashboard.flagSyncDetail', { flagKey: flags[0].key, state: flags[0].enabled ? t('common.enabled') : t('common.disabled') }),
          time: t('dashboard.justUpdated'),
        });
      }
      if (environments[0]) {
        latestActivity.push({
          title: t('dashboard.environmentAvailable'),
          detail: t('dashboard.environmentReadyDetail', { environmentName: environments[0].name }),
          time: t('dashboard.justLoaded'),
        });
      }
      if (overrides[0]) {
        latestActivity.push({
          title: t('dashboard.overrideConfigured'),
          detail: t('dashboard.overrideActiveDetail', { overrideId: overrides[0].id }),
          time: t('dashboard.justLoaded'),
        });
      }

      setActivity(latestActivity);
    } catch (error) {
      addToast(error.response?.data?.detail || t('dashboard.loadError'), 'error');
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
      addToast(t('dashboard.evaluationMissingFields'), 'error');
      return;
    }

    setEvaluating(true);
    try {
      const response = await evaluateFlag(evaluation);
      setEvaluationResult(response.data.value);
      addToast('Evaluation completed successfully.', 'success');
    } catch (error) {
      addToast(error.response?.data?.detail || t('dashboard.evaluationError'), 'error');
    } finally {
      setEvaluating(false);
    }
  };

  const handleTesterEvaluation = async (e) => {
    e.preventDefault();
    if (!tester.flag_key || !tester.environment || !tester.user_id) {
      addToast(t('dashboard.testerMissingFields'), 'error');
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
      addToast(t('dashboard.testerSuccess'), 'success');
    } catch (error) {
      addToast(error.response?.data?.detail || t('dashboard.testerError'), 'error');
    } finally {
      setTesterLoading(false);
    }
  };
  useEffect(() => {
  const loadAnalytics = async () => {
    const summaryRes = await getAnalyticsSummary();
    const flagsRes = await getAnalyticsFlags();
    const usageRes = await getAnalyticsUsage();

    setSummary(summaryRes.data);
    setFlagData(flagsRes.data);
    setUsageData(usageRes.data);
  };

  loadAnalytics();
}, []);

  return (
    
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">{t('dashboard.title')}</p>
            <h2 className="mt-2 text-3xl font-semibold">{t('dashboard.title')}</h2>
            <p className="mt-2 max-w-2xl text-slate-400">{t('dashboard.overview')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setConfirmOpen(true)} className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{t('dashboard.resetPreview')}</button>
            <button onClick={handleRefresh} className="flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-300">
              {refreshing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />} {t('dashboard.refreshData')}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
  <button onClick={() => navigate("/feature-flags")} className="rounded-xl bg-cyan-600 p-3">
    {t('nav.featureFlags')}
  </button>

  <button onClick={() => navigate("/environments")} className="rounded-xl bg-violet-600 p-3">
    {t('nav.environments')}
  </button>

  <button onClick={() => navigate("/overrides")} className="rounded-xl bg-emerald-600 p-3">
    {t('nav.overrides')}
  </button>

  <button onClick={() => navigate("/group-management")} className="rounded-xl bg-orange-600 p-3">
    {t('nav.groupManagement')}
  </button>

  <button onClick={() => navigate("/group-members")} className="rounded-xl bg-pink-600 p-3">
    {t('nav.groupMembers')}
  </button>

  <button onClick={() => navigate("/targeting-rules")} className="rounded-xl bg-indigo-600 p-3">
    {t('nav.targetingRules')}
  </button>

  <button onClick={() => navigate("/audit-logs")} className="rounded-xl bg-red-600 p-3">
    {t('nav.auditLogs')}
  </button>
</div>
<div className="grid gap-6 lg:grid-cols-2">
  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
    <h3 className="mb-4 text-lg font-semibold">{t('dashboard.flagEvaluationCounts')}</h3>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={flagData}>
        <XAxis dataKey="flag" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="evaluations" fill="#06b6d4" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold">{t('dashboard.environmentUsage')}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={usageData}
          dataKey="count"
          nameKey="environment"
          outerRadius={100}
          label
        >
          {usageData.map((entry, index) => (
            <Cell
              key={index}
              fill={["#06b6d4", "#8b5cf6", "#22c55e"][index % 3]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-slate-400 text-sm">{t('dashboard.totalFlags')}</p>
    <h2 className="mt-2 text-3xl font-bold">{summary.total_flags ?? 0}</h2>
  </div>

  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-slate-400 text-sm">{t('dashboard.activeFlags')}</p>
    <h2 className="mt-2 text-3xl font-bold">{summary.active_flags ?? 0}</h2>
  </div>

  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-slate-400 text-sm">{t('dashboard.todaysEvaluations')}</p>
    <h2 className="mt-2 text-3xl font-bold">{summary.todays_evaluations ?? 0}</h2>
  </div>

  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-slate-400 text-sm">{t('dashboard.auditLogsToday')}</p>
    <h2 className="mt-2 text-3xl font-bold">{summary.audit_logs_today ?? 0}</h2>
  </div>
</div>
      {loading ? <LoadingSpinner label={t('common.loading')} /> : (
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
            <h3 className="text-lg font-semibold">{t('dashboard.recentActivity')}</h3>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-400">{t('dashboard.live')}</span>
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
            )) : <p className="text-sm text-slate-400">{t('dashboard.noBackendActivity')}</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
          <h3 className="text-lg font-semibold">{t('dashboard.flagEvaluation')}</h3>
          <form onSubmit={handleEvaluation} className="mt-4 space-y-3">
            <input
              value={evaluation.flag_key}
              onChange={(e) => setEvaluation({ ...evaluation, flag_key: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
              placeholder={t('dashboard.flagKeyPlaceholder')}
            />
            <input
              value={evaluation.environment}
              onChange={(e) => setEvaluation({ ...evaluation, environment: e.target.value })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
              placeholder={t('dashboard.environmentPlaceholder')}
            />
            <button disabled={evaluating} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
              {evaluating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {t('dashboard.evaluateFlag')}
            </button>
          </form>
          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
            {evaluationResult === null ? t('dashboard.evaluationInstructions') : t('dashboard.evaluationResult', { status: evaluationResult ? t('common.enabled') : t('common.disabled') })}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <h3 className="text-lg font-semibold">{t('dashboard.featureEvaluationTester')}</h3>
        <form onSubmit={handleTesterEvaluation} className="mt-4 space-y-3">
          <input
            value={tester.flag_key}
            onChange={(e) => setTester({ ...tester, flag_key: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
            placeholder={t('dashboard.flagKeyPlaceholder')}
          />
          <input
            value={tester.environment}
            onChange={(e) => setTester({ ...tester, environment: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
            placeholder={t('dashboard.environmentPlaceholder')}
          />
          <input
            value={tester.user_id}
            onChange={(e) => setTester({ ...tester, user_id: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
            placeholder={t('dashboard.userIdPlaceholder')}
          />
          <input
            value={tester.groups}
            onChange={(e) => setTester({ ...tester, groups: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
            placeholder={t('dashboard.groupsPlaceholder')}
          />
          <button
            disabled={testerLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {testerLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {t('dashboard.evaluateFeature')}
          </button>
        </form>

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
          {testerResult === null ? (
            t('dashboard.testerInstructions')
          ) : (
            <div className="space-y-2">
              <p><span className="font-medium text-white">{t('dashboard.featureEnabled')}</span> {testerResult.value ? t('common.enabled') : t('common.disabled')}</p>
              <p><span className="font-medium text-white">{t('dashboard.evaluationReason')}</span> {testerResult.reason}</p>
              <p><span className="font-medium text-white">{t('dashboard.userBucket')}</span> {testerResult.bucket}</p>
              <p><span className="font-medium text-white">{t('dashboard.rolloutPercentage')}</span> {testerResult.rollout_percentage}%</p>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
  <h3 className="text-lg font-semibold mb-4">{t('dashboard.redisStatusTitle')}</h3>

  {redisStatus ? (
    <div className="space-y-2">
      <p>
        <span className="font-medium text-white">{t('dashboard.statusLabel')}</span>{" "}
        <span className={redisStatus.status === "Connected" ? "text-green-400" : "text-red-400"}>
          {redisStatus.status === "Connected" ? t('dashboard.redisStatusConnected') : t('dashboard.redisStatusDisconnected')}
        </span>
      </p>

      <p>
        <span className="font-medium text-white">{t('dashboard.cacheLabel')}</span>{" "}
        {redisStatus.cache_enabled ? t('common.enabled') : t('common.disabled')}
      </p>

      <p>
        <span className="font-medium text-white">{t('dashboard.ttlLabel')}</span>{" "}
        {redisStatus.ttl} {t('dashboard.secondsLabel')}
      </p>
    </div>
  ) : (
    <p>{t('dashboard.redisStatusLoading')}</p>
  )}
</div>

      <ConfirmDialog
        open={confirmOpen}
        title={t('dashboard.resetPreviewTitle')}
        message={t('dashboard.resetPreviewMessage')}
        onConfirm={() => {
          setConfirmOpen(false);
          setEvaluationResult(null);
          setTesterResult(null);
          addToast(t('dashboard.previewStateReset'), 'info');
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;