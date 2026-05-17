import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageState from "../components/PageState";
import useDashboardData from "../features/dashboard/hooks/useDashboardData";
import { updateUserProfile } from "../services/dashboardApi";

function StatCard({ label, value }) {
  return (
    <article className="border border-neutral-800 p-4">
      <p className="text-[10px] uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-100">{value}</p>
    </article>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { username, uuid } = useParams();
  const token = localStorage.getItem("token");
  const { data, loading, error, isFallback, reload } = useDashboardData({ username, uuid, token });

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [profileStatus, setProfileStatus] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const safeBlogs = useMemo(() => data?.blogs || [], [data]);
  const safeComments = useMemo(() => data?.recent_comments || [], [data]);
  const stats = data?.stats || { post_count: 0, view_count: 0, like_count: 0, comment_count: 0 };

  const applyProfileField = (key) => (event) => {
    setProfileForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    setProfileStatus("");

    const payload = {};
    if (profileForm.username.trim()) {
      payload.username = profileForm.username.trim();
    }
    if (profileForm.email.trim()) {
      payload.email = profileForm.email.trim();
    }
    if (profileForm.password.trim()) {
      payload.password = profileForm.password.trim();
    }

    if (!Object.keys(payload).length) {
      setProfileStatus("No changes entered.");
      return;
    }

    setSavingProfile(true);
    const result = await updateUserProfile({ uuid, payload, token });
    setSavingProfile(false);

    if (!result.ok) {
      setProfileStatus(result.error);
      return;
    }

    const updated = result.data;
    localStorage.setItem(
      "session_user",
      JSON.stringify({
        username: updated.username || username,
        uuid: updated.uuid || uuid,
      }),
    );

    setProfileForm({ username: "", email: "", password: "" });
    setProfileStatus("Profile updated.");

    const nextUsername = updated.username || username;
    const nextUuid = updated.uuid || uuid;
    if (nextUsername !== username || nextUuid !== uuid) {
      navigate(`/dashboard/${nextUsername}/${nextUuid}`, { replace: true });
      return;
    }
    reload();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("session_user");
    navigate("/whoshnri");
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] px-6 py-16">
        <PageState tone="error" title="Login required" message="Please log in to access your dashboard." actionLabel="Go to login" actionTo="/whoshnri" />
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Henry&apos;s Journal</title>
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-neutral-100 sm:px-8">
        <section className="mx-auto max-w-6xl space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-3 border border-neutral-800 p-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Henry&apos;s Journal</p>
              <h1 className="mt-1 text-3xl font-semibold">Dashboard</h1>
              <p className="mt-2 text-sm text-neutral-400">
                {data?.user?.username ? `Signed in as ${data.user.username}` : `Signed in as ${username}`}
                {isFallback ? " · Showing cached data" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/${username}/${uuid}/new`}
                className="border border-neutral-100 px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors hover:bg-neutral-100 hover:text-black"
              >
                Add New Blog
              </Link>
              <button
                type="button"
                onClick={logout}
                className="border border-neutral-700 px-4 py-2 text-xs uppercase tracking-[0.16em] text-neutral-300 transition-colors hover:bg-neutral-900"
              >
                Logout
              </button>
            </div>
          </header>

          {loading ? (
            <PageState tone="loading" title="Loading dashboard" message="Gathering your post performance and comments." />
          ) : error ? (
            <PageState tone="error" title="Could not load dashboard" message={error} />
          ) : (
            <>
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Posts" value={stats.post_count || 0} />
                <StatCard label="Views" value={stats.view_count || 0} />
                <StatCard label="Likes" value={stats.like_count || 0} />
                <StatCard label="Comments" value={stats.comment_count || 0} />
              </section>

              <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <article className="xl:col-span-2 border border-neutral-800 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Your Blogs</h2>
                    <button
                      type="button"
                      onClick={reload}
                      className="border border-neutral-700 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-neutral-300 transition-colors hover:bg-neutral-900"
                    >
                      Refresh
                    </button>
                  </div>
                  {safeBlogs.length === 0 ? (
                    <p className="text-sm text-neutral-500">No posts yet. Create your first entry.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-neutral-800 text-xs uppercase tracking-[0.12em] text-neutral-500">
                            <th className="py-2 pr-3">Title</th>
                            <th className="py-2 pr-3">Category</th>
                            <th className="py-2 pr-3">Views</th>
                            <th className="py-2 pr-3">Likes</th>
                            <th className="py-2 pr-3">Comments</th>
                            <th className="py-2 pr-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {safeBlogs.map((blog) => (
                            <tr key={blog.pid} className="border-b border-neutral-900">
                              <td className="py-3 pr-3 text-neutral-100">{blog.title}</td>
                              <td className="py-3 pr-3 text-neutral-400">{blog.category || "General"}</td>
                              <td className="py-3 pr-3 text-neutral-400">{blog.views ?? 0}</td>
                              <td className="py-3 pr-3 text-neutral-400">{blog.likes ?? 0}</td>
                              <td className="py-3 pr-3 text-neutral-400">{blog.comment_count ?? 0}</td>
                              <td className="py-3 pr-3">
                                <div className="flex gap-2">
                                  <Link
                                    to={`/read/${blog.pid}`}
                                    className="border border-neutral-700 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-neutral-300 transition-colors hover:bg-neutral-900"
                                  >
                                    View
                                  </Link>
                                  <Link
                                    to={`/dashboard/${username}/${uuid}/edit/${blog.pid}`}
                                    className="border border-neutral-700 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-neutral-300 transition-colors hover:bg-neutral-900"
                                  >
                                    Edit
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </article>

                <article className="border border-neutral-800 p-4">
                  <h2 className="text-lg font-medium">Update Profile</h2>
                  <p className="mt-2 text-xs text-neutral-500">Leave fields blank to keep existing values.</p>
                  <form onSubmit={submitProfile} className="mt-4 space-y-3">
                    <label className="block text-xs uppercase tracking-[0.12em] text-neutral-500">
                      Username
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={applyProfileField("username")}
                        className="mt-2 w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 focus:border-neutral-300 focus:outline-none"
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-[0.12em] text-neutral-500">
                      Email
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={applyProfileField("email")}
                        className="mt-2 w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 focus:border-neutral-300 focus:outline-none"
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-[0.12em] text-neutral-500">
                      Password
                      <input
                        type="password"
                        value={profileForm.password}
                        onChange={applyProfileField("password")}
                        className="mt-2 w-full border border-neutral-700 bg-black px-3 py-2 text-sm text-neutral-100 focus:border-neutral-300 focus:outline-none"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="w-full border border-neutral-100 px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors hover:bg-neutral-100 hover:text-black disabled:opacity-60"
                    >
                      {savingProfile ? "Saving..." : "Save profile"}
                    </button>
                    {profileStatus ? <p className="text-sm text-neutral-300">{profileStatus}</p> : null}
                  </form>
                </article>
              </section>

              <section className="border border-neutral-800 p-4">
                <h2 className="text-lg font-medium">Recent Comments</h2>
                {safeComments.length === 0 ? (
                  <p className="mt-3 text-sm text-neutral-500">No comments yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {safeComments.slice(0, 20).map((item, index) => (
                      <article key={`${item.blog_pid}-${index}`} className="border border-neutral-900 p-3">
                        <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">{item.blog_title}</p>
                        <p className="mt-2 text-sm text-neutral-200">{item.comment}</p>
                        <p className="mt-2 text-xs text-neutral-500">
                          {item.name} · {item.timestamp}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </section>
      </main>
    </>
  );
}
