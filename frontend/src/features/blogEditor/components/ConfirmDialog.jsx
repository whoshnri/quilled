export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
  confirmTone = "neutral",
  busy = false,
}) {
  if (!open) {
    return null;
  }

  const confirmClass =
    confirmTone === "danger"
      ? "border-red-700 text-red-200 hover:bg-red-900/40"
      : "border-neutral-300 text-neutral-100 hover:bg-neutral-100 hover:text-black";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-md border border-neutral-800 bg-black p-6 text-neutral-100">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-neutral-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-900"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`border px-4 py-2 text-sm transition-colors disabled:opacity-60 ${confirmClass}`}
          >
            {busy ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
