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
      <DialogContent className="sm:max-w-md rounded-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{logo.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{logo.category}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="bg-muted/50 rounded-2xl p-10 w-full flex items-center justify-center">
            <img
              loading="lazy"
              src={logo.logoUrl}
              alt={logo.name}
              className="w-32 h-32 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(logo.name)}&background=f0f0ff&color=4361ee&size=256&font-size=0.35&bold=true`;
              }}
            />
          </div>
          <p className="text-muted-foreground text-center text-sm leading-relaxed">{logo.description}</p>
          
          {(logo.phone || logo.address) && (
            <div className="w-full space-y-3 bg-muted/30 rounded-xl p-4">
              {logo.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href={`tel:${logo.phone}`} className="text-foreground hover:text-primary transition-colors">{logo.phone}</a>
                </div>
              )}
              {logo.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">{logo.address}</span>
                </div>
              )}
            </div>
          )}

          <Button asChild className="w-full gap-2 h-12 rounded-xl font-semibold text-base">
            <a href={logo.url} target="_blank" rel="noopener noreferrer">
              زيارة الموقع <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoDetailDialog;
