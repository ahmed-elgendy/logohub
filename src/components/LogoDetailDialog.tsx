"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone, MapPin } from "lucide-react";
import type { Logo } from "@/lib/logoData";

interface LogoDetailDialogProps {
  logo: Logo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LogoDetailDialog = ({ logo, open, onOpenChange }: LogoDetailDialogProps) => {
  if (!logo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-[32px] border-border/60 bg-card/95 backdrop-blur-3xl shadow-2xl overflow-hidden p-0 gap-0" dir="rtl">
        {/* Abstract blur background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 w-full">
          <DialogHeader className="px-8 pt-8 pb-2 items-start text-start">
            <DialogTitle className="text-2xl font-black mb-1">{logo.name}</DialogTitle>
            <DialogDescription className="flex gap-2 items-center text-sm font-semibold">
              <span className="bg-secondary/60 text-secondary-foreground px-3 py-1 rounded-full border border-border/40 shadow-sm">{logo.category}</span>
              <span className="bg-secondary/60 text-secondary-foreground px-3 py-1 rounded-full border border-border/40 shadow-sm">{logo.governorate}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col px-8 pb-8 gap-6 mt-4">
            <div className="bg-gradient-to-br from-secondary/40 to-background/20 border border-border/50 rounded-[28px] p-10 w-full flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <img
                loading="lazy"
                src={logo.logoUrl}
                alt={logo.name}
                className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(logo.name)}&background=f0f0ff&color=4361ee&size=256&font-size=0.35&bold=true`;
                }}
              />
            </div>
            
            <p className="text-foreground/80 text-sm leading-relaxed">{logo.description}</p>
            
            {(logo.phone || logo.address) && (
              <div className="w-full space-y-3 bg-secondary/30 rounded-2xl p-5 border border-border/40">
                {logo.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-background rounded-full p-2 shadow-sm border border-border/40">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <a href={`tel:${logo.phone}`} className="text-foreground font-medium hover:text-primary transition-colors" dir="ltr">{logo.phone}</a>
                  </div>
                )}
                {logo.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-background rounded-full p-2 shadow-sm border border-border/40">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{logo.address}</span>
                  </div>
                )}
              </div>
            )}

            <Button asChild className="w-full gap-2 h-14 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <a href={logo.url} target="_blank" rel="noopener noreferrer">
                زيارة الموقع <ExternalLink className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoDetailDialog;
