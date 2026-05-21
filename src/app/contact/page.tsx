"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Send, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { fetchCategories } from "@/lib/logos";
import { useToast } from "@/hooks/use-toast";

const CONTACT_INFO = {
  phones: ["01012345678", "01098765432"],
  email: "info@logohub.com",
  social: {
    facebook: "https://facebook.com/logohub",
    instagram: "https://instagram.com/logohub",
    linkedin: "https://linkedin.com/company/logohub",
  },
};

const Contact = () => {
  const { toast } = useToast();
  const { data: allCategories = ["الكل"] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const categories = allCategories.filter((c) => c !== "الكل");

  const [form, setForm] = useState({
    phone: "",
    companyName: "",
    category: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone || !form.companyName || !form.category) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول", variant: "destructive" });
      return;
    }

    const message =
      `🏢 طلب إضافة علامة تجارية جديدة\n\n` +
      `📱 رقم الموبايل: ${form.phone}\n` +
      `🏪 اسم الشركة: ${form.companyName}\n` +
      `📂 القسم: ${form.category}`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONTACT_INFO.phones[0]}?text=${encoded}`;
    window.open(whatsappUrl, "_blank");

    toast({ title: "تم", description: "جاري فتح واتساب لإرسال الطلب" });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            أضف علامتك التجارية الآن
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            تواصل معنا لإضافة منتجك أو خدمتك في منصتنا والوصول لعملاء أكثر
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/60 shadow-sm h-full">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  معلومات التواصل
                </h2>

                {/* Phones */}
                <div className="space-y-3">
                  {CONTACT_INFO.phones.map((phone, i) => (
                    <a
                      key={i}
                      href={`tel:${phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-foreground tracking-wide" dir="ltr">{phone}</span>
                    </a>
                  ))}
                </div>

                {/* Email */}
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-foreground">{CONTACT_INFO.email}</span>
                </a>

                {/* Social Media */}
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground mb-3">تابعنا على</h3>
                  <div className="flex gap-3">
                    <a href={CONTACT_INFO.social.facebook} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl flex items-center justify-center bg-secondary/50 hover:bg-[hsl(220,46%,48%)] hover:text-white text-muted-foreground transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href={CONTACT_INFO.social.instagram} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl flex items-center justify-center bg-secondary/50 hover:bg-[hsl(340,75%,54%)] hover:text-white text-muted-foreground transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href={CONTACT_INFO.social.linkedin} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl flex items-center justify-center bg-secondary/50 hover:bg-[hsl(210,70%,45%)] hover:text-white text-muted-foreground transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/60 shadow-sm h-full">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                  سجل بياناتك
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">اسم الشركة / العلامة التجارية</label>
                    <Input
                      placeholder="مثال: مطعم الشرق"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">رقم الموبايل</label>
                    <Input
                      placeholder="01xxxxxxxxx"
                      type="tel"
                      dir="ltr"
                      className="text-right"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">نوع النشاط</label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر القسم" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full gap-2 rounded-xl font-bold text-base h-12" style={{ background: "var(--gradient-primary)" }}>
                    <Send className="w-5 h-5" />
                    إرسال عبر واتساب
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
