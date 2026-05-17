import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`${API}/new/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Signup failed.");
      }

      navigate("/login");
    } catch (submitError) {
      setError(submitError.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Signup | Henry&apos;s Journal</title>
        <meta name="description" content="Create a Henry&apos;s Journal account." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://quilled-5su6.onrender.com/signup" />
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0a] text-neutral-100 px-5 py-10 sm:px-8 flex items-center justify-center">
        <section className="w-full max-w-md border border-neutral-800 bg-black/40 p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Henry&apos;s Journal</p>
          <h1 className="mt-3 text-2xl font-semibold">Signup</h1>
          <p className="mt-2 text-sm text-neutral-400">Create your account in one step.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-xs uppercase tracking-[0.16em] text-neutral-500">
              Username
              <input
                type="text"
                value={formData.username}
                onChange={updateField("username")}
                required
                className="mt-2 w-full border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-100 focus:border-neutral-200 focus:outline-none"
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.16em] text-neutral-500">
              Email
              <input
                type="email"
                value={formData.email}
                onChange={updateField("email")}
                required
                className="mt-2 w-full border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-100 focus:border-neutral-200 focus:outline-none"
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.16em] text-neutral-500">
              Password
              <input
                type="password"
                value={formData.password}
                onChange={updateField("password")}
                required
                minLength={6}
                className="mt-2 w-full border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-100 focus:border-neutral-200 focus:outline-none"
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.16em] text-neutral-500">
              Confirm password
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={updateField("confirmPassword")}
                required
                minLength={6}
                className="mt-2 w-full border border-neutral-700 bg-black/60 px-3 py-2 text-sm text-neutral-100 focus:border-neutral-200 focus:outline-none"
              />
            </label>

            {error ? <p className="text-sm text-neutral-300">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full border border-neutral-100 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-100 transition-colors hover:bg-neutral-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Signup"}
            </button>
          </form>

          <div className="mt-6 flex gap-4 text-xs uppercase tracking-[0.14em]">
            <Link to="/login" className="text-neutral-300 hover:text-white">
              Already have an account
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
