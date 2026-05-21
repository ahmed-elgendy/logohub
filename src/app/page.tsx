"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import LogoCard from "@/components/LogoCard";
import FeaturedSlider from "@/components/FeaturedSlider";
import CategorySlider from "@/components/CategorySlider";
import LogoDetailDialog from "@/components/LogoDetailDialog";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { type Logo } from "@/lib/logoData";
import { fetchLogos, fetchCategories, fetchGovernorates } from "@/lib/logos";

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeGovernorate, setActiveGovernorate] = useState("الكل");
  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: logos = [] } = useQuery({ queryKey: ["logos"], queryFn: fetchLogos });
  const { data: categories = ["الكل"] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: governorates = ["الكل"] } = useQuery({ queryKey: ["governorates"], queryFn: fetchGovernorates });
  const isMobile = useIsMobile();

  const filtered = useMemo(() => {
    return logos.filter((logo) => {
      const matchesSearch = logo.name.toLowerCase().includes(search.toLowerCase()) ||
        logo.category.toLowerCase().includes(search.toLowerCase()) ||
        logo.governorate.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "الكل" || logo.category === activeCategory;
      const matchesGovernorate = activeGovernorate === "الكل" || logo.governorate === activeGovernorate;
      return matchesSearch && matchesCategory && matchesGovernorate;
    });
  }, [logos, search, activeCategory, activeGovernorate]);

  const featuredLogos = useMemo(() => logos.filter((l) => l.featured), [logos]);

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

      <section className="relative min-h-[75vh] flex items-center px-4 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start text-start max-w-2xl pt-20 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 bg-card/80 backdrop-blur-md border border-border/80 text-foreground rounded-full px-5 py-2 text-sm font-semibold mb-8 shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              أكبر مكتبة للشعارات العربية
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
            >
              اكتشف هوية 
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-primary/60">
                العلامات التجارية
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-muted-foreground text-lg md:text-2xl mb-12 leading-relaxed max-w-lg"
            >
              تصفّح، ابحث، واستلهم من أرشيف شامل يضم شعارات أشهر الشركات والمؤسسات حول العالم.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-all duration-500 group-hover:bg-primary/30 group-hover:blur-2xl opacity-50" />
                <div className="relative flex items-center bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl transition-all duration-300 group-hover:border-primary/50 h-16">
                  <Search className="absolute right-5 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="ابحث باسم الشركة أو التصنيف..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-14 h-full w-full rounded-2xl bg-transparent border-none text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
                  />
                </div>
              </div>

              <div className="relative w-full sm:w-[160px] group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl transition-all duration-500 group-hover:bg-primary/30 group-hover:blur-2xl opacity-50" />
                <div className="relative bg-card/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/80 transition-all duration-300 group-hover:border-primary/50">
                  <Select value={activeGovernorate} onValueChange={setActiveGovernorate} dir="rtl">
                    <SelectTrigger className="w-full h-16 rounded-2xl bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-base px-5">
                      <SelectValue placeholder="المحافظة" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl">
                      {governorates.map((gov) => (
                        <SelectItem key={gov} value={gov} className="cursor-pointer py-3 text-base">
                          {gov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right side visual (asymmetric layout) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative h-full w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[40px] border border-border/40 backdrop-blur-3xl overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
               <div className="grid grid-cols-2 gap-6 p-12 h-full opacity-60 rotate-[8deg] scale-125">
                  <div className="bg-card flex items-center justify-center p-6 rounded-3xl border border-border/50 shadow-2xl h-40 transform -translate-y-16 transition-transform duration-700 hover:-translate-y-20">
                    <img src="https://mensclubcollection.com/cdn/shop/files/280-280_logo_mc.png?v=1776264494&width=270" className="max-w-full max-h-full object-contain opacity-80" alt="Men's Club" />
                  </div>
                  <div className="bg-card flex items-center justify-center p-6 rounded-3xl border border-border/50 shadow-2xl h-56 transition-transform duration-700 hover:-translate-y-4">
                    <img src="https://blaban.net/data/files/blabanlogo.png" className="max-w-full max-h-full object-contain opacity-80" alt="B Laban" />
                  </div>
                  <div className="bg-card flex items-center justify-center p-6 rounded-3xl border border-border/50 shadow-2xl h-48 transform translate-x-4 transition-transform duration-700 hover:-translate-y-4">
                    <img src="https://bazookaegy.com/public/uploads/resturantes/s_1696848769358054.png" className="max-w-full max-h-full object-contain opacity-80" alt="Bazooka" />
                  </div>
                  <div className="bg-card flex items-center justify-center p-6 rounded-3xl border border-border/50 shadow-2xl h-32 transition-transform duration-700 hover:-translate-y-4">
                    <img src="https://sigma-computer.com/_next/image?url=%2Fsigma-logo.png&w=384&q=60" className="max-w-full max-h-full object-contain opacity-80" alt="Sigma Computer" />
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {!search && activeCategory === "الكل" && activeGovernorate === "الكل" && featuredLogos.length > 0 && (
        <FeaturedSlider logos={featuredLogos} onLogoClick={handleLogoClick} />
      )}

      <section className="pb-8 px-4">
        <div className="container mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-muted-foreground tracking-wide">التصنيف:</span>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`category-pill ${activeCategory === cat ? "category-pill-active" : "category-pill-inactive"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
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
                لم يتم العثور على شعارات. جرّب بحثاً أو تصنيفاً أو محافظة مختلفة.
              </p>
            </motion.div>
          ) : isMobile && activeCategory === "الكل" && activeGovernorate === "الكل" && !search ? (
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
