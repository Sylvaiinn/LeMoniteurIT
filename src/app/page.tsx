import Header from "@/components/Header";
import MoodBanner from "@/components/MoodBanner";
import FeaturedArticles from "@/components/FeaturedArticles";
import ArticleGrid from "@/components/ArticleGrid";
import LiveFeed from "@/components/LiveFeed";
import NewsletterForm from "@/components/NewsletterForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ── */}
      <Header />

      {/* ── Humeur du Réseau ── */}
      <MoodBanner />

      {/* ── À la Une ── */}
      <FeaturedArticles />

      {/* ── Divider ── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <hr className="divider-ornament" />
      </div>

      {/* ── Main Content: Articles + Le Fil ── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main column: article grid */}
          <div className="lg:col-span-2">
            <ArticleGrid />
          </div>

          {/* Sidebar: Le Fil (live feed) */}
          <div className="order-first lg:order-last">
            <LiveFeed />
          </div>
        </div>
      </main>

      {/* ── Divider ── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <hr className="divider-thin" />
      </div>

      {/* ── Newsletter ── */}
      <NewsletterForm />

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
