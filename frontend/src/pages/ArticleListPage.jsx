import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageState from "../components/PageState";

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
        <title>Henry&apos;s Journal | Articles</title>
        <meta
          name="description"
          content="Read the latest monochrome-first articles on Henry&apos;s Journal."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://quilled-5su6.onrender.com/" />
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0a] text-neutral-100 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-20 pb-12 relative">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-2">Henry&apos;s Journal</p>
              <h1 className="text-5xl font-semibold tracking-tight text-neutral-100">Journal</h1>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-widest text-neutral-600">{articleCountLabel}</p>
            <div className="absolute bottom-0 left-0 w-12 h-[1px] bg-neutral-900"></div>
          </header>

          {loading ? (
            <PageState
              tone="loading"
              title="Loading latest entries"
              message="Fetching your recent writing."
            />
          ) : error ? (
            <PageState
              tone="error"
              title="Could not load articles"
              message={error}
              actionLabel="Try again from home"
              actionTo="/"
            />
          ) : articles.length === 0 ? (
            <PageState
              tone="empty"
              title="No entries yet"
              message="Publish your first post to start Henry&apos;s Journal."
              actionLabel="Refresh"
              actionTo="/"
            />
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
              {articles.map((article, index) => {
                const summary = stripHtml(article.desc || article.content || "").slice(0, 160);

                return (
                  <article
                    key={article.pid || `${article.title}-${index}`}
                    className="group text-left relative"
                  >
                    <div className="mb-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.15em] text-neutral-500">
                      <span>{article.category || "General"}</span>
                      <span className="h-[1px] w-4 bg-neutral-900"></span>
                      <span>{article.created || ""}</span>
                    </div>
                    <h2 className="text-2xl font-medium leading-snug text-neutral-100 transition-colors group-hover:text-white">
                      <Link to={`/read/${article.pid}`}>
                        {article.title || "Untitled"}
                      </Link>
                    </h2>
                    {summary ? (
                      <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                        {summary}...
                      </p>
                    ) : null}
                    <div className="mt-8">
                      <Link
                        to={`/read/${article.pid}`}
                        className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-white"
                      >
                        Read More
                      </Link>
                    </div>
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
