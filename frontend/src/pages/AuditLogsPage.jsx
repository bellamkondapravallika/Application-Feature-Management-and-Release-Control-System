import { useEffect, useMemo, useState } from 'react';
import { FileText, Search, Filter } from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import { getAuditLogs } from '../services/api';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  // Filters
  const [flagFilter, setFlagFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const { addToast } = useToast();

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const response = await getAuditLogs();
        setLogs(response.data || []);
      } catch (error) {
        addToast('Unable to load audit logs.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [addToast]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const haystack = `${log.action} ${log.performed_by} ${log.old_state || ''} ${log.new_state || ''} ${log.flag_id || ''} ${log.environment_id || ''}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesFlag = flagFilter ? String(log.flag_id).includes(flagFilter) : true;
      const matchesUser = userFilter ? String(log.performed_by).toLowerCase().includes(userFilter.toLowerCase()) : true;
      const matchesAction = actionFilter ? String(log.action).toLowerCase().includes(actionFilter.toLowerCase()) : true;
      const matchesDate =
        (!dateRange.from || new Date(log.timestamp) >= new Date(dateRange.from)) &&
        (!dateRange.to || new Date(log.timestamp) <= new Date(dateRange.to));

      return matchesSearch && matchesFlag && matchesUser && matchesAction && matchesDate;
    });
  }, [logs, search, flagFilter, userFilter, actionFilter, dateRange]);

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Audit Logs</p>
            <h2 className="mt-2 text-2xl font-semibold">Trace every change</h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none"
              placeholder="Search activity"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={flagFilter}
            onChange={(e) => setFlagFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm outline-none"
            placeholder="Filter by Flag ID"
          />
          <input
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm outline-none"
            placeholder="Filter by User"
          />
          <input
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm outline-none"
            placeholder="Filter by Action"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm outline-none"
            />
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-slate-400">
            Loading audit logs…
          </div>
          
        ) : filteredLogs.length === 0 ? (
  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-center text-slate-400">
    No audit logs found.
  </div>
) : (
  filteredLogs.map((log) => (
            <button
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className="flex w-full items-start gap-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg text-left transition hover:bg-slate-800"
            >
              <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{log.action}</p>
                  <span className="text-sm text-slate-400">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recently recorded'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Flag: {log.flag_id || 'N/A'} | Env: {log.environment_id || 'N/A'}
                </p>
                <p className="mt-2 text-sm text-slate-500">By {log.performed_by}</p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Audit Log Details</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p><span className="font-medium">Action:</span> {selectedLog.action}</p>
              <p><span className="font-medium">User:</span> {selectedLog.performed_by}</p>
              <p><span className="font-medium">Flag ID:</span> {selectedLog.flag_id || 'N/A'}</p>
              <p><span className="font-medium">Environment ID:</span> {selectedLog.environment_id || 'N/A'}</p>
              <p><span className="font-medium">Timestamp:</span> {selectedLog.timestamp ? new Date(selectedLog.timestamp).toLocaleString() : 'N/A'}</p>
              <p><span className="font-medium">Old State:</span> {selectedLog.old_state || 'N/A'}</p>
              <p><span className="font-medium">New State:</span> {selectedLog.new_state || 'N/A'}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsPage;
