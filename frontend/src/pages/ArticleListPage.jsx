import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const API = import.meta.env.VITE_API_BASE_URL;

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/get/blogs/recent`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to load articles");
        }

        if (active) {
          setArticles(Array.isArray(data) ? data : []);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || "Unable to load articles right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      active = false;
    };
  }, []);

  const articleCountLabel = useMemo(() => {
    if (loading) {
      return "Loading";
    }

    return `${articles.length} article${articles.length === 1 ? "" : "s"}`;
  }, [articles.length, loading]);

  return (
    <>
      <Helmet>
        <title>Quilled | Articles</title>
        <meta
          name="description"
          content="Read the latest monochrome-first articles on Quilled."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://quilled-5su6.onrender.com/" />
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0a] text-neutral-100 px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-10 border-b border-neutral-800 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">Quilled</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-100">Article list</h1>
              </div>
              <nav className="flex gap-3 text-xs uppercase tracking-[0.16em]">
                <Link
                  to="/login"
                  className="border border-neutral-700 px-4 py-2 text-neutral-200 transition-colors hover:bg-neutral-100 hover:text-black"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="border border-neutral-700 px-4 py-2 text-neutral-200 transition-colors hover:bg-neutral-100 hover:text-black"
                >
                  Signup
                </Link>
              </nav>
            </div>
            <p className="mt-4 text-xs text-neutral-500">{articleCountLabel}</p>
          </header>

          {loading ? (
            <p className="text-sm text-neutral-400">Loading articles…</p>
          ) : error ? (
            <p className="text-sm text-neutral-300">{error}</p>
          ) : articles.length === 0 ? (
            <p className="text-sm text-neutral-400">No articles published yet.</p>
          ) : (
            <section className="grid gap-5">
              {articles.map((article, index) => {
                const summary = stripHtml(article.desc || article.content || "").slice(0, 180);

                return (
                  <article
                    key={article.pid || `${article.title}-${index}`}
                    className="border border-neutral-800 bg-black/40 p-5 transition-colors hover:border-neutral-500"
                  >
                    <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                      <span>{article.category || "Uncategorized"}</span>
                      <span>{article.author || "Unknown"}</span>
                      <span>{article.created || ""}</span>
                    </div>
                    <h2 className="text-xl font-medium leading-tight text-neutral-100">
                      <Link to={`/read/${article.pid}`} className="hover:text-white">
                        {article.title || "Untitled"}
                      </Link>
                    </h2>
                    {summary ? <p className="mt-3 text-sm leading-6 text-neutral-400">{summary}</p> : null}
                    <Link
                      to={`/read/${article.pid}`}
                      className="mt-5 inline-flex text-xs uppercase tracking-[0.18em] text-neutral-300 hover:text-white"
                    >
                      Read article →
                    </Link>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
