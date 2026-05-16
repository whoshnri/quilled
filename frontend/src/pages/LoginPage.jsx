import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API}/get/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data?.token) {
        throw new Error("Invalid credentials.");
      }

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (submitError) {
      setError(submitError.message || "Unable to login.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Quilled</title>
        <meta name="description" content="Login to Quilled." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://quilled-5su6.onrender.com/login" />
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0a] text-neutral-100 px-5 py-10 sm:px-8 flex items-center justify-center">
        <section className="w-full max-w-md border border-neutral-800 bg-black/40 p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Quilled</p>
          <h1 className="mt-3 text-2xl font-semibold">Login</h1>
          <p className="mt-2 text-sm text-neutral-400">Access your account to continue.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-xs uppercase tracking-[0.16em] text-neutral-500">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-100 focus:border-neutral-200 focus:outline-none"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.16em] text-neutral-500">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-100 focus:border-neutral-200 focus:outline-none"
                placeholder="••••••••"
              />
            </label>

            {error ? <p className="text-sm text-neutral-300">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full border border-neutral-100 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-100 transition-colors hover:bg-neutral-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 flex gap-4 text-xs uppercase tracking-[0.14em]">
            <Link to="/signup" className="text-neutral-300 hover:text-white">
              Create account
            </Link>
            <Link to="/" className="text-neutral-300 hover:text-white">
              Back to list
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
