import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LogoCard from "@/components/LogoCard";
import type { Logo } from "@/lib/logoData";

interface CategorySliderProps {
  category: string;
  logos: Logo[];
  onLogoClick: (logo: Logo) => void;
}

const CategorySlider = ({ category, logos, onLogoClick }: CategorySliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      direction: "rtl",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      loop: true,
    },
    [Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 rounded-full" style={{ background: "var(--gradient-primary)" }} />
          <h3 className="text-base font-bold text-foreground">{category}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="w-7 h-7 rounded-full" onClick={scrollNext}>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="w-7 h-7 rounded-full" onClick={scrollPrev}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {logos.map((logo, i) => (
            <div
              key={logo.id}
              className="flex-shrink-0 w-[calc(50%-6px)]"
            >
              <LogoCard logo={logo} onClick={onLogoClick} index={i} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategorySlider;
