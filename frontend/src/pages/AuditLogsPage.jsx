import { useEffect, useMemo, useState } from 'react';
import { FileText, Search } from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import { getAuditLogs } from '../services/api';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
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

  const filteredLogs = useMemo(() => logs.filter((log) => {
    const haystack = `${log.action} ${log.performed_by} ${log.new_value || ''} ${log.old_value || ''}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  }), [logs, search]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Audit Logs</p>
            <h2 className="mt-2 text-2xl font-semibold">Trace every change</h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm outline-none" placeholder="Search activity" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-slate-400">Loading audit logs…</div> : filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
            <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-400"><FileText className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{log.action}</p>
                <span className="text-sm text-slate-400">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recently recorded'}</span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{log.new_value || log.old_value || 'No additional details'}</p>
              <p className="mt-2 text-sm text-slate-500">By {log.performed_by}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogsPage;
