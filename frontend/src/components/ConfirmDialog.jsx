const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300">Cancel</button>
          <button onClick={onConfirm} className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
