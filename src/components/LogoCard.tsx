"use client";

import { motion } from "framer-motion";
import type { Logo } from "@/lib/logoData";

interface LogoCardProps {
  logo: Logo;
  onClick: (logo: Logo) => void;
  index: number;
}

const LogoCard = ({ logo, onClick, index }: LogoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.035, type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="logo-card group flex flex-col"
      onClick={() => onClick(logo)}
    >
      {logo.featured && <span className="featured-badge">⭐</span>}
      {/* Logo area */}
      <div className="flex items-center justify-center bg-secondary/20 relative p-4 h-[180px] md:h-[220px] shrink-0 border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <img
          loading="lazy"
          src={logo.logoUrl}
          alt={logo.name}
          className="relative z-10 max-w-[85%] max-h-[85%] object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-sm group-hover:drop-shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(logo.name)}&background=f0f0ff&color=4361ee&size=256&font-size=0.35&bold=true`;
          }}
        />
      </div>
      {/* Info area */}
      <div className="p-4 md:p-5 text-center space-y-3 shrink-0 bg-card z-10">
        <span className="text-sm md:text-base font-bold text-foreground block leading-snug truncate tracking-tight">{logo.name}</span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="category-badge border border-primary/20 shadow-sm">{logo.category}</span>
          <span className="category-badge opacity-70 border border-primary/10">{logo.governorate}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LogoCard;
