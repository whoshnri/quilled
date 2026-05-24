import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const productFallback = [
  {
    id: "signal-grid",
    title: "Signal Grid",
    category: "Infrastructure Product",
    created: "Archive 01",
    summary: "A telemetry architecture system for resilient product operations and observability design.",
  },
  {
    id: "quartz-shell",
    title: "Quartz Shell",
    category: "Interface System",
    created: "Archive 02",
    summary: "A calm interaction layer that aligns product behavior, navigation rhythm, and decision clarity.",
  },
  {
    id: "module-station",
    title: "Module Station",
    category: "Platform Studio",
    created: "Archive 03",
    summary: "A modular delivery framework joining frontend architecture with backend infrastructure primitives.",
  },
];

const featureRail = [
  {
    title: "System Blueprinting",
    excerpt: "Architectural discovery and technical product mapping for durable software systems.",
  },
  {
    title: "Interface Engines",
    excerpt: "High-precision interaction design with resilient component and motion orchestration.",
  },
  {
    title: "Infrastructure Narrative",
    excerpt: "Deployment, observability, and scaling decisions shaped as a clear product story.",
  },
  {
    title: "Experience Audits",
    excerpt: "Signal-first analysis of product quality, friction points, and system debt.",
  },
];

const principles = [
  "Designed deliberately",
  "Systems over noise",
  "Calm interfaces",
  "Human-centered intelligence",
  "Built for longevity",
];

const testimonials = [
  {
    quote:
      "Quill Labs introduced a systems language that changed how our team thinks, designs, and ships.",
    author: "Product Lead",
    org: "Northline Platform",
  },
  {
    quote:
      "Every interaction became clearer. Every engineering decision became easier to defend and scale.",
    author: "CTO",
    org: "Delta Foundry",
  },
  {
    quote:
      "They operate like architects inside code, interfaces, and infrastructure all at once.",
    author: "Director of Design",
    org: "Monolith Systems",
  },
];

const navItems = [
  { label: "HOME", to: "#home" },
  { label: "WORK", to: "#work" },
  { label: "SYSTEMS", to: "#systems" },
  { label: "ABOUT", to: "#about" },
  { label: "CONTACT", to: "#contact" },
];

const formatMetaDate = (value) => {
  if (!value) {
    return "Active";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

function SystemSketch() {
  return (
    <svg viewBox="0 0 420 280" className="w-full h-full" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.15">
        <path d="M20 210 L140 120 L290 165 L390 85" className="ql-stroke-drift" />
        <path d="M50 60 L200 60 L300 120 L370 210" className="ql-stroke-drift" />
        <circle cx="140" cy="120" r="18" />
        <circle cx="290" cy="165" r="14" />
        <circle cx="300" cy="120" r="20" />
        <path d="M110 165 L210 230 L350 230" />
        <rect x="55" y="35" width="80" height="40" />
      </g>
    </svg>
  );
}

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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

  const featuredProducts = useMemo(() => {
    if (!articles.length) {
      return productFallback;
    }

    return articles.slice(0, 3).map((article, index) => ({
      id: article.pid || `${article.title}-${index}`,
      pid: article.pid,
      title: article.title || "Untitled System",
      category: article.category || "Product Study",
      created: formatMetaDate(article.created),
      summary:
        stripHtml(article.desc || article.content || "").slice(0, 168) ||
        "A focused product system designed with modern infrastructure and authored interface decisions.",
    }));
  }, [articles]);

  return (
    <>
      <Helmet>
        <title>Quill Labs — Software Laboratory</title>
        <meta
          name="description"
          content="Quill Labs is a software laboratory and product studio building meaningful digital systems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://quilled-5su6.onrender.com/" />
      </Helmet>

      <div className="bg-[#050505] text-neutral-100 font-sans">
        <header className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-6">
          <nav className="mx-auto max-w-[1400px] flex items-center justify-between">
            <a href="#home" className="flex items-center gap-3 text-[11px] tracking-[0.32em] uppercase">
              <span className="inline-block h-4 w-4 border border-neutral-400 ql-cut-corner" />
              Quill Labs
            </a>
            <button
              type="button"
              className="border border-neutral-700/80 px-4 py-2 text-[10px] tracking-[0.28em] uppercase transition-colors hover:border-neutral-400"
              onClick={() => setMenuOpen((current) => !current)}
              aria-expanded={menuOpen}
              aria-label="Toggle fullscreen menu"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </nav>
        </header>

        <div
          className={`fixed inset-0 z-50 bg-[#050505]/97 backdrop-blur transition-opacity duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
          <div className="h-full flex flex-col items-center justify-center gap-6 sm:gap-8 px-6 text-center">
            {navItems.map((item, index) => (
              <a
                key={item.label}
                href={item.to}
                onClick={() => setMenuOpen(false)}
                className={`text-4xl sm:text-5xl md:text-7xl leading-none tracking-[-0.02em] text-neutral-300 transition-all duration-500 hover:text-white hover:translate-x-1 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                style={{ transitionDelay: menuOpen ? `${index * 70}ms` : "0ms" }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <main id="home">
          <section className="relative min-h-screen px-6 md:px-10 pt-28 sm:pt-36 pb-20 overflow-hidden">
            <div className="ql-orbit-lines" aria-hidden="true" />
            <div className="absolute inset-0 ql-grid-mask opacity-70" aria-hidden="true" />
            <div className="mx-auto max-w-[1400px] relative z-10">
              <p className="text-[11px] uppercase tracking-[0.32em] text-neutral-400 mb-8">
                Software laboratory and product studio
              </p>
              <h1 className="max-w-5xl text-5xl sm:text-6xl lg:text-8xl tracking-[-0.04em] leading-[0.95] font-medium text-white">
                Serious software systems with authored interfaces and architectural precision.
              </h1>
              <p className="mt-10 max-w-xl text-sm sm:text-base text-neutral-400 leading-relaxed">
                Quill Labs builds meaningful digital systems at the intersection of thoughtful design,
                modern infrastructure, and editorial-grade product craft.
              </p>
              <div className="mt-14 flex flex-wrap gap-4">
                <a
                  href="#work"
                  className="border border-neutral-600 px-6 py-3 text-[11px] uppercase tracking-[0.24em] transition-all hover:border-neutral-300 hover:-translate-y-0.5"
                >
                  View work
                </a>
                <a
                  href="#systems"
                  className="border border-neutral-800 bg-neutral-900/60 px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-neutral-300 transition-all hover:bg-neutral-900 hover:text-white"
                >
                  Explore systems
                </a>
              </div>
              <div className="mt-20 max-w-2xl h-[220px] sm:h-[280px] text-neutral-500">
                <SystemSketch />
              </div>
            </div>
          </section>

          <section id="work" className="bg-[#f7f7f3] text-neutral-900 px-6 md:px-10 py-24 sm:py-28">
            <div className="mx-auto max-w-[1400px]">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
                <h2 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl tracking-[-0.035em] leading-tight">
                  Featured products and studies shaped as modern software architecture.
                </h2>
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                  {loading ? "Syncing work ledger" : `${featuredProducts.length} selected systems`}
                </p>
              </div>

              {error ? (
                <p className="text-sm text-neutral-600 border border-neutral-300 bg-white px-6 py-5 max-w-lg">
                  Work stream unavailable right now. Displaying curated studio archives.
                </p>
              ) : null}

              <div className="space-y-10">
                {featuredProducts.map((product, index) => {
                  const body = (
                    <>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.24em] text-neutral-500 mb-10">
                        <span>{product.category}</span>
                        <span className="h-px w-7 bg-neutral-300" />
                        <span>{product.created}</span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em] leading-tight mb-6">
                        {product.title}
                      </h3>
                      <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-600">
                        {product.summary}
                      </p>
                      <div className="mt-12 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-neutral-500">
                        <span>Open case study</span>
                        <span className="inline-block h-px w-9 bg-neutral-400" />
                      </div>
                    </>
                  );

                  return product.pid ? (
                    <Link
                      key={product.id}
                      to={`/read/${product.pid}`}
                      className={`group block border border-neutral-300 bg-white px-7 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16 transition-all hover:border-neutral-900 hover:-translate-y-1 ${index % 2 === 0 ? "lg:mr-24" : "lg:ml-24"}`}
                    >
                      {body}
                    </Link>
                  ) : (
                    <article
                      key={product.id}
                      className={`border border-neutral-300 bg-white px-7 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16 ${index % 2 === 0 ? "lg:mr-24" : "lg:ml-24"}`}
                    >
                      {body}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="systems" className="px-6 md:px-10 py-24 bg-[#0a0a0a]">
            <div className="mx-auto max-w-[1400px]">
              <h2 className="text-3xl sm:text-5xl tracking-[-0.03em] max-w-4xl mb-12">
                Capabilities arranged as infrastructural modules.
              </h2>
              <div className="ql-rail no-scrollbar overflow-x-auto pb-4 snap-x snap-mandatory flex gap-6">
                {featureRail.map((feature) => (
                  <article
                    key={feature.title}
                    className="min-w-[84vw] md:min-w-[55vw] lg:min-w-[36vw] snap-start border border-neutral-800 bg-neutral-950 px-7 py-8 ql-cut-corner"
                  >
                    <div className="h-32 text-neutral-600 mb-8">
                      <SystemSketch />
                    </div>
                    <h3 className="text-2xl tracking-[-0.02em] mb-4">{feature.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{feature.excerpt}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="bg-[#f2f2ee] text-neutral-900 px-6 md:px-10 py-24 sm:py-32">
            <div className="mx-auto max-w-[1400px] grid lg:grid-cols-[1.1fr,1fr] gap-14 lg:gap-20">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500 mb-7">Principles</p>
                <h2 className="text-4xl sm:text-6xl tracking-[-0.04em] leading-[1.02]">
                  We design software as a long-term system, not a short-term campaign.
                </h2>
              </div>
              <div className="space-y-8">
                {principles.map((principle) => (
                  <div key={principle} className="border-t border-neutral-300 pt-6">
                    <p className="text-2xl sm:text-3xl tracking-[-0.02em]">{principle}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 md:px-10 py-24 bg-[#050505]">
            <div className="mx-auto max-w-[1400px]">
              <div className="mb-10 flex items-end justify-between gap-6">
                <h2 className="text-4xl sm:text-5xl tracking-[-0.03em] max-w-3xl">
                  Trusted by teams building critical software products.
                </h2>
                <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500 hidden sm:block">
                  Testimonial ledger
                </p>
              </div>
              <div className="ql-rail no-scrollbar overflow-x-auto pb-4 snap-x snap-mandatory flex gap-6">
                {testimonials.map((item) => (
                  <article
                    key={item.quote}
                    className="min-w-[86vw] md:min-w-[64vw] lg:min-w-[43vw] snap-start border border-neutral-800 bg-neutral-900/40 px-7 py-9 sm:px-9 sm:py-11"
                  >
                    <p className="text-2xl sm:text-3xl tracking-[-0.02em] leading-[1.3] text-neutral-100">
                      “{item.quote}”
                    </p>
                    <p className="mt-10 text-[11px] uppercase tracking-[0.22em] text-neutral-500">
                      {item.author} / {item.org}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer id="contact" className="bg-[#f7f7f3] text-neutral-900 px-6 md:px-10 pt-20 pb-10">
          <div className="mx-auto max-w-[1400px] border border-neutral-300 rounded-[28px] px-7 sm:px-10 lg:px-14 py-12 sm:py-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-8">Let&apos;s build</p>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.04em] max-w-4xl">
              Designed systems for ambitious software teams.
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="mailto:hello@quilllabs.studio"
                className="border border-neutral-900 px-6 py-3 text-[11px] uppercase tracking-[0.24em] transition-colors hover:bg-neutral-900 hover:text-white"
              >
                hello@quilllabs.studio
              </a>
              <div className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 flex gap-4">
                <span>X</span>
                <span>GitHub</span>
                <span>LinkedIn</span>
              </div>
            </div>
            <p className="mt-14 ql-crop-word text-[20vw] sm:text-[16vw] leading-none tracking-[-0.06em] font-medium">
              QUILL
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
