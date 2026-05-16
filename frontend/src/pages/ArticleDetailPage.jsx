import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export default function ArticleDetailPage() {
  const { pid } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/get/blog/${pid}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to load article");
        }

        const resolvedArticle = data?.blog || data;

        if (active) {
          setArticle(resolvedArticle || null);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || "Unable to load this article.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      active = false;
    };
  }, [pid]);

  const metadata = useMemo(() => {
    const title = article?.title || "Quilled Article";
    const descriptionSource = article?.desc || article?.content || "Read this article on Quilled.";
    const description = stripHtml(descriptionSource).slice(0, 160) || "Read this article on Quilled.";
    const canonicalUrl = `https://quilled-5su6.onrender.com/read/${pid}`;

    return {
      title,
      description,
      canonicalUrl,
      author: article?.author || "Quilled",
      published: article?.created || undefined,
      category: article?.category || "Article",
    };
  }, [article, pid]);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metadata.title,
    description: metadata.description,
    author: {
      "@type": "Person",
      name: metadata.author,
    },
    datePublished: metadata.published,
    mainEntityOfPage: metadata.canonicalUrl,
    articleSection: metadata.category,
  };

  return (
    <>
      <Helmet>
        <title>{`${metadata.title} | Quilled`}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={metadata.canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${metadata.title} | Quilled`} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${metadata.title} | Quilled`} />
        <meta name="twitter:description" content={metadata.description} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0a] text-neutral-100 px-5 py-10 sm:px-8">
        <article className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="inline-flex border border-neutral-700 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-neutral-200 transition-colors hover:bg-neutral-100 hover:text-black"
          >
            ← Back to list
          </Link>

          {loading ? (
            <p className="mt-8 text-sm text-neutral-400">Loading article…</p>
          ) : error ? (
            <p className="mt-8 text-sm text-neutral-300">{error}</p>
          ) : !article ? (
            <p className="mt-8 text-sm text-neutral-400">This article was not found.</p>
          ) : (
            <>
              <header className="mt-8 border-b border-neutral-800 pb-6">
                <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
                  {article.category || "Article"} · {article.author || "Unknown"} · {article.created || ""}
                </p>
                <h1 className="mt-4 text-3xl font-semibold leading-tight text-neutral-100">{article.title}</h1>
                {article.desc ? (
                  <p className="mt-4 text-sm leading-6 text-neutral-400">{stripHtml(article.desc)}</p>
                ) : null}
              </header>

              <section
                className="prose prose-invert prose-sm sm:prose-base mt-8 max-w-none prose-headings:text-neutral-100 prose-p:text-neutral-300 prose-a:text-neutral-100"
                dangerouslySetInnerHTML={{ __html: article.content || article.desc || "" }}
              />
            </>
          )}
        </article>
      </main>
    </>
  );
}
