import { Link } from "react-router-dom";

const TONE_STYLES = {
  loading: "text-neutral-500",
  error: "text-neutral-300",
  empty: "text-neutral-400",
};

export default function PageState({
  tone = "empty",
  title,
  message,
  actionLabel,
  actionTo,
  className = "",
}) {
  return (
    <section
      className={`mx-auto max-w-2xl border border-neutral-800 px-6 py-10 text-center ${className}`}
      role={tone === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {title ? <h2 className="text-lg font-medium text-neutral-100">{title}</h2> : null}
      {message ? <p className={`mt-3 text-sm ${TONE_STYLES[tone] || TONE_STYLES.empty}`}>{message}</p> : null}
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-6 inline-flex items-center border border-neutral-700 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-300 transition-colors hover:bg-neutral-100 hover:text-black"
        >
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
