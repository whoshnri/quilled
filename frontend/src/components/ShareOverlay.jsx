export default function ShareOverlay({ open, onClose, title, onAction, statusMessage }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75" onClick={onClose}>
      <div className="flex h-full items-end md:items-center md:justify-center md:px-4">
        <section
          className="w-full border-t border-neutral-800 bg-[#0a0a0a] p-5 pb-8 md:max-w-md md:border md:pb-5"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Share article"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-[0.18em] text-neutral-300">Share</h2>
            <button
              type="button"
              onClick={onClose}
              className="border border-neutral-700 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-black"
            >
              Close
            </button>
          </div>

          <p className="mb-4 text-sm text-neutral-400">{title}</p>

          <div className="grid grid-cols-1 gap-2">
            <button type="button" onClick={() => onAction("x")} className="border border-neutral-800 px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-neutral-300 hover:bg-neutral-900">
              X Post Intent
            </button>
            <button type="button" onClick={() => onAction("whatsapp-message")} className="border border-neutral-800 px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-neutral-300 hover:bg-neutral-900">
              WhatsApp Message
            </button>
            <button type="button" onClick={() => onAction("whatsapp-status")} className="border border-neutral-800 px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-neutral-300 hover:bg-neutral-900">
              WhatsApp Status
            </button>
            <button type="button" onClick={() => onAction("facebook")} className="border border-neutral-800 px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-neutral-300 hover:bg-neutral-900">
              Facebook
            </button>
            <button type="button" onClick={() => onAction("instagram")} className="border border-neutral-800 px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-neutral-300 hover:bg-neutral-900">
              Instagram
            </button>
            <button type="button" onClick={() => onAction("copy")} className="border border-neutral-800 px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-neutral-300 hover:bg-neutral-900">
              Copy Link
            </button>
          </div>

          {statusMessage ? <p className="mt-4 text-xs text-neutral-400">{statusMessage}</p> : null}
        </section>
      </div>
    </div>
  );
}
