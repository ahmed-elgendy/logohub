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
      transition={{ duration: 0.4, delay: index * 0.035, ease: [0.4, 0, 0.2, 1] }}
      className="logo-card group flex flex-col"
      onClick={() => onClick(logo)}
    >
      {logo.featured && <span className="featured-badge">⭐</span>}
      {/* Logo area */}
      <div className="flex items-center justify-center bg-secondary/30 p-4 h-[180px] md:h-[220px] shrink-0">
        <img
          loading="lazy"
          src={logo.logoUrl}
          alt={logo.name}
          className="max-w-full max-h-full object-contain transition-all duration-400 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(logo.name)}&background=f0f0ff&color=4361ee&size=256&font-size=0.35&bold=true`;
          }}
        />
      </div>
      {/* Info area */}
      <div className="p-3 md:p-4 text-center space-y-1.5 shrink-0">
        <span className="text-sm md:text-base font-bold text-foreground block leading-snug truncate">{logo.name}</span>
        <span className="category-badge">{logo.category}</span>
      </div>
    </motion.div>
  );
};

export default LogoCard;
