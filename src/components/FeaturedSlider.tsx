"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LogoCard from "@/components/LogoCard";
import type { Logo } from "@/lib/logoData";

interface FeaturedSliderProps {
  logos: Logo[];
  onLogoClick: (logo: Logo) => void;
}

const FeaturedSlider = ({ logos, onLogoClick }: FeaturedSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    direction: "rtl",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    loop: true,
  }, [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="pb-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              العلامات التجارية المميزة
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-full" onClick={scrollNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-full" onClick={scrollPrev}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {logos.map((logo, i) => (
              <div
                key={logo.id}
                className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(20%-13px)]"
              >
                <LogoCard logo={logo} onClick={onLogoClick} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSlider;
