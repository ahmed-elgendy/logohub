import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import LogoCard from "@/components/LogoCard";
import FeaturedSlider from "@/components/FeaturedSlider";
import CategorySlider from "@/components/CategorySlider";
import LogoDetailDialog from "@/components/LogoDetailDialog";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { getLogos, getCategories, type Logo } from "@/lib/logoData";

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const logos = getLogos();
  const categories = getCategories();
  const isMobile = useIsMobile();

  const filtered = useMemo(() => {
    return logos.filter((logo) => {
      const matchesSearch = logo.name.toLowerCase().includes(search.toLowerCase()) ||
        logo.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "الكل" || logo.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [logos, search, activeCategory]);

  const featuredLogos = useMemo(() => logos.filter((l) => l.featured), [logos]);

  // Group logos by category for mobile slider view
  const logosByCategory = useMemo(() => {
    const grouped: Record<string, Logo[]> = {};
    const cats = categories.filter((c) => c !== "الكل");
    cats.forEach((cat) => {
      const catLogos = logos.filter((l) => l.category === cat);
      if (catLogos.length > 0) grouped[cat] = catLogos;
    });
    return grouped;
  }, [logos, categories]);

  const handleLogoClick = (logo: Logo) => {
    setSelectedLogo(logo);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />

      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto text-center max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            اكتشف أفضل العلامات التجارية
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight"
          >
            مجموعة شعارات
            <br />
            <span className="text-primary">العلامات التجارية</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed"
          >
            تصفّح وابحث واستكشف شعارات أشهر الشركات حول العالم
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative max-w-lg mx-auto"
          >
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث عن شعار باسم الشركة أو التصنيف…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-12 h-14 rounded-2xl bg-card border-border text-base shadow-sm focus:shadow-md transition-shadow"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {!search && activeCategory === "الكل" && featuredLogos.length > 0 && (
        <FeaturedSlider logos={featuredLogos} onLogoClick={handleLogoClick} />
      )}

      {/* Categories */}
      <section className="pb-8 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-2.5"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-pill ${activeCategory === cat ? "category-pill-active" : "category-pill-inactive"}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="container mx-auto">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-muted-foreground text-lg">
                لم يتم العثور على شعارات. جرّب بحثاً أو تصنيفاً مختلفاً.
              </p>
            </motion.div>
          ) : isMobile && activeCategory === "الكل" && !search ? (
            <div>
              {Object.entries(logosByCategory).map(([cat, catLogos]) => (
                <CategorySlider
                  key={cat}
                  category={cat}
                  logos={catLogos}
                  onLogoClick={handleLogoClick}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {filtered.map((logo, i) => (
                <LogoCard key={logo.id} logo={logo} onClick={handleLogoClick} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10 px-4 bg-card/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LogoHub. جميع شعارات العلامات التجارية ملك لأصحابها.
        </div>
      </footer>

      <LogoDetailDialog logo={selectedLogo} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default Index;
