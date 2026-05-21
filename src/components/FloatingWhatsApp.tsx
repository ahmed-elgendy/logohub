"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "01012345678";

const FloatingWhatsApp = () => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن خدماتكم")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default FloatingWhatsApp;
