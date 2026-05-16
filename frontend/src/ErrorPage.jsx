import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-100 px-6 py-16 flex items-center justify-center">
      <div className="max-w-lg w-full border border-neutral-800 bg-black/40 p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">404</p>
        <h1 className="mt-3 text-2xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-neutral-400">
          The page you requested does not exist in the redesigned experience.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center border border-neutral-700 px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-neutral-100 hover:text-black transition-colors"
        >
          Back to articles
        </Link>
      </div>
    </main>
  );
}
