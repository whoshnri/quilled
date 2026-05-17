import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import PageState from "../components/PageState";
import ShareOverlay from "../components/ShareOverlay";

const API = import.meta.env.VITE_API_BASE_URL;

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export default function ArticleDetailPage() {
  const { pid } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Likes and Comments state
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentName, setCommentName] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

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
          setLikes(resolvedArticle?.likes || 0);
          // Check local storage for like status as a hint, though server tracks IP
          const likedInStorage = localStorage.getItem(`liked_${pid}`);
          if (likedInStorage) setHasLiked(true);
        }
        
        // Load comments
        const commentsRes = await fetch(`${API}/comments/${pid}`);
        const commentsData = await commentsRes.json();
        if (commentsRes.ok && active) {
          setComments(commentsData.comments || []);
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

  const handleLike = async () => {
    try {
      const method = "PATCH";
      const endpoint = hasLiked ? `${API}/remove/likes/${pid}` : `${API}/add/likes/${pid}`;
      
      const response = await fetch(endpoint, { method });
      const data = await response.json();
      
      if (response.ok) {
        setLikes(data.likes);
        setHasLiked(!hasLiked);
        if (!hasLiked) {
          localStorage.setItem(`liked_${pid}`, "true");
        } else {
          localStorage.removeItem(`liked_${pid}`);
        }
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`${API}/add/comment/${pid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment, name: commentName }),
      });

      if (response.ok) {
        setComments([...comments, { comment: newComment, name: commentName, timestamp: "Just now" }]);
        setNewComment("");
        setCommentName("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const metadata = useMemo(() => {
    const title = article?.title || "Henry's Journal Article";
    const descriptionSource = article?.desc || article?.content || "Read this article on Henry's Journal.";
    const description = stripHtml(descriptionSource).slice(0, 160) || "Read this article on Henry's Journal.";
    const canonicalUrl = `https://quilled-5su6.onrender.com/read/${pid}`;

    return {
      title,
      description,
      canonicalUrl,
      author: article?.author || "Henry's Journal",
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

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : metadata.canonicalUrl;
  const shareText = `${metadata.title} — ${metadata.description}`;

  const openExternal = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareAction = async (target) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedWhatsAppText = encodeURIComponent(`${metadata.title}\n${shareUrl}`);

    if (target === "x") {
      openExternal(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`);
      return;
    }

    if (target === "whatsapp-message") {
      openExternal(`https://wa.me/?text=${encodedWhatsAppText}`);
      return;
    }

    if (target === "whatsapp-status") {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = `whatsapp://send?text=${encodedWhatsAppText}`;
        return;
      }
      openExternal(`https://wa.me/?text=${encodedWhatsAppText}`);
      return;
    }

    if (target === "facebook") {
      openExternal(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
      return;
    }

    if (target === "instagram") {
      try {
        await navigator.clipboard.writeText(`${metadata.title}\n${shareUrl}`);
        setShareStatus("Caption copied. Paste it into Instagram.");
      } catch {
        setShareStatus("Copy failed. You can copy manually from the browser URL bar.");
      }
      openExternal("https://www.instagram.com/");
      return;
    }

    if (target === "copy") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("Link copied.");
      } catch {
        setShareStatus("Copy failed. You can copy manually from the browser URL bar.");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${metadata.title} | Henry's Journal`}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={metadata.canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${metadata.title} | Henry's Journal`} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${metadata.title} | Henry's Journal`} />
        <meta name="twitter:description" content={metadata.description} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <main className="min-h-screen bg-[#0a0a0a] text-neutral-100 px-6 py-16 sm:px-8">
        <article className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="inline-block border border-neutral-800 px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black mb-16"
          >
            Back to Journal
          </Link>

          {loading ? (
            <PageState
              tone="loading"
              className="mt-8"
              title="Loading article"
              message="Preparing this entry for you."
            />
          ) : error ? (
            <PageState
              tone="error"
              className="mt-8"
              title="Could not load this article"
              message={error}
              actionLabel="Back to journal"
              actionTo="/"
            />
          ) : !article ? (
            <PageState
              tone="empty"
              className="mt-8"
              title="Article not found"
              message="The entry may have been moved or removed."
              actionLabel="Back to journal"
              actionTo="/"
            />
          ) : (
            <>
              <header className="mb-16 pb-12 relative text-left">
                <div className="flex items-center justify-start gap-4 text-[10px] uppercase tracking-[0.15em] text-neutral-500 mb-6">
                  <span>{article.category || "General"}</span>
                  <span className="h-[1px] w-4 bg-neutral-900"></span>
                  <span>{article.created || ""}</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-semibold leading-tight text-neutral-100 tracking-tight">{article.title}</h1>
                {article.desc ? (
                  <p className="mt-8 text-lg italic leading-relaxed text-neutral-400 font-serif max-w-xl">
                    {stripHtml(article.desc)}
                  </p>
                ) : null}
                <div className="absolute bottom-0 left-0 w-12 h-[1px] bg-neutral-900"></div>
              </header>

              <section
                className="prose prose-invert prose-neutral max-w-none 
                  prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight
                  prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-8
                  prose-a:text-neutral-100 prose-a:underline-offset-4
                  prose-blockquote:border-neutral-800 prose-blockquote:text-neutral-400 prose-blockquote:italic
                  prose-img:rounded-sm"
                dangerouslySetInnerHTML={{ __html: article.content || article.desc || "" }}
              />

              {/* Interactions Section */}
              <section className="mt-24 pt-12 relative">
                <div className="absolute top-0 left-0 w-12 h-[1px] bg-neutral-900"></div>
                <div className="flex items-center justify-between mb-16">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleLike}
                      className={`flex items-center gap-3 border border-neutral-800 px-5 py-2 text-[10px] uppercase tracking-[0.2em] transition-all ${hasLiked ? 'bg-neutral-100 text-black border-neutral-100' : 'text-neutral-500 hover:text-white hover:border-neutral-500'}`}
                    >
                      <span>{hasLiked ? 'Liked' : 'Like'}</span>
                      <span className="h-3 w-[1px] bg-current opacity-30"></span>
                      <span>{likes}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShareStatus("");
                        setShowShare(true);
                      }}
                      className="border border-neutral-800 px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:border-neutral-500 hover:text-white"
                    >
                      Share
                    </button>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                    {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                  </span>
                </div>

                {/* Comments List */}
                <div className="space-y-12 mb-20">
                  {comments.length > 0 ? (
                    comments.map((c, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-medium text-neutral-200">{c.name}</span>
                          <span className="text-[9px] uppercase tracking-widest text-neutral-700">{c.timestamp}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-neutral-400 max-w-xl">{c.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-700 italic">No comments yet.</p>
                  )}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="space-y-6 max-w-xl">
                  <div className="grid grid-cols-1 gap-6">
                    <input
                      type="text"
                      placeholder="Name"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      required
                      className="bg-transparent border-b border-neutral-900 py-3 text-sm text-neutral-100 focus:border-neutral-500 outline-none transition-colors placeholder:text-neutral-800"
                    />
                  </div>
                  <textarea
                    placeholder="Your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    rows="4"
                    className="w-full bg-transparent border-b border-neutral-900 py-3 text-sm text-neutral-100 focus:border-neutral-500 outline-none transition-colors placeholder:text-neutral-800 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="border border-neutral-800 px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-neutral-500 hover:bg-neutral-100 hover:text-black hover:border-neutral-100 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-500"
                  >
                    {submittingComment ? 'Sending...' : 'Post Comment'}
                  </button>
                </form>
              </section>
            </>
          )}
        </article>
      </main>

      <ShareOverlay
        open={showShare}
        onClose={() => setShowShare(false)}
        title={metadata.title}
        onAction={handleShareAction}
        statusMessage={shareStatus}
      />
    </>
  );
}
