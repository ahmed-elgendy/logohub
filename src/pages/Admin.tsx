import { useState } from "react";
import { Plus, Trash2, Star, StarOff, Pencil, Upload, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/Header";
import { getLogos, saveLogos, getCategories, saveCategories, type Logo } from "@/lib/logoData";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/svg+xml", "image/jpeg", "image/webp"];

const Admin = () => {
  const [logos, setLogos] = useState<Logo[]>(getLogos);
  const [categories, setCategories] = useState<string[]>(getCategories);
  const [newCategory, setNewCategory] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [logoInputMode, setLogoInputMode] = useState<string>("upload");

  const [form, setForm] = useState({ name: "", category: "", url: "", logoUrl: "", description: "", featured: false, phone: "", address: "" });

  const resetForm = () => {
    setForm({ name: "", category: "", url: "", logoUrl: "", description: "", featured: false, phone: "", address: "" });
    setUploadPreview(null);
    setLogoInputMode("upload");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("صيغة غير مدعومة. استخدم PNG أو SVG أو JPG أو WebP.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("حجم الملف كبير جداً. الحد الأقصى 2 ميغابايت.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setUploadPreview(dataUrl);
      setForm((prev) => ({ ...prev, logoUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.category || !form.url.trim() || !form.logoUrl.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }
    if (form.name.trim().length > 100) {
      toast.error("اسم الشركة طويل جداً (الحد 100 حرف).");
      return;
    }

    const sanitized = {
      ...form,
      name: form.name.trim().slice(0, 100),
      url: form.url.trim(),
      logoUrl: form.logoUrl.trim(),
      description: form.description.trim().slice(0, 500),
    };

    let updated: Logo[];
    if (editingLogo) {
      updated = logos.map((l) => (l.id === editingLogo.id ? { ...l, ...sanitized } : l));
      toast.success("تم تحديث الشعار!");
    } else {
      const newLogo: Logo = { ...sanitized, id: Date.now().toString() };
      updated = [...logos, newLogo];
      toast.success("تمت إضافة الشعار!");
    }
    setLogos(updated);
    saveLogos(updated);
    setDialogOpen(false);
    setEditingLogo(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const updated = logos.filter((l) => l.id !== id);
    setLogos(updated);
    saveLogos(updated);
    toast.success("تم حذف الشعار.");
  };

  const toggleFeatured = (id: string) => {
    const updated = logos.map((l) => (l.id === id ? { ...l, featured: !l.featured } : l));
    setLogos(updated);
    saveLogos(updated);
  };

  const handleEdit = (logo: Logo) => {
    setEditingLogo(logo);
    setForm({ name: logo.name, category: logo.category, url: logo.url, logoUrl: logo.logoUrl, description: logo.description, featured: logo.featured, phone: logo.phone || "", address: logo.address || "" });
    setUploadPreview(logo.logoUrl.startsWith("data:") ? logo.logoUrl : null);
    setLogoInputMode(logo.logoUrl.startsWith("data:") ? "upload" : "url");
    setDialogOpen(true);
  };

  const addCategory = () => {
    const trimmed = newCategory.trim().slice(0, 50);
    if (!trimmed || categories.includes(trimmed)) return;
    const updated = [...categories, trimmed];
    setCategories(updated);
    saveCategories(updated);
    setNewCategory("");
    toast.success("تمت إضافة التصنيف!");
  };

  const removeCategory = (cat: string) => {
    if (cat === "الكل") return;
    const updated = categories.filter((c) => c !== cat);
    setCategories(updated);
    saveCategories(updated);
    toast.success("تم حذف التصنيف.");
  };

  const nonAllCategories = categories.filter((c) => c !== "الكل");

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="flex items-center justify-between mb-8 gap-2 flex-wrap">
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => {
              const data = logos.map((l) => ({
                "الاسم": l.name,
                "القسم": l.category,
                "رقم الموبايل": l.phone || "",
                "العنوان": l.address || "",
                "رابط الموقع": l.url,
              }));
              const ws = XLSX.utils.json_to_sheet(data);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "الشعارات");
              ws["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 30 }, { wch: 35 }];
              XLSX.writeFile(wb, "logos_export.xlsx");
              toast.success("تم تصدير البيانات بنجاح!");
            }}>
              <Download className="w-4 h-4" /> تصدير Excel
            </Button>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingLogo(null); resetForm(); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> إضافة شعار</Button>
            </DialogTrigger>
            <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingLogo ? "تعديل الشعار" : "إضافة شعار جديد"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>الاسم *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسم الشركة" maxLength={100} />
                </div>
                <div className="grid gap-2">
                  <Label>التصنيف *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder="اختر التصنيف" /></SelectTrigger>
                    <SelectContent>
                      {nonAllCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>رابط الموقع *</Label>
                  <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://example.com" />
                </div>

                {/* Logo input: Upload or URL */}
                <div className="grid gap-2">
                  <Label>الشعار *</Label>
                  <Tabs value={logoInputMode} onValueChange={(v) => setLogoInputMode(v)} className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="upload" className="flex-1 gap-1.5">
                        <Upload className="w-3.5 h-3.5" /> رفع ملف
                      </TabsTrigger>
                      <TabsTrigger value="url" className="flex-1">رابط صورة</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-3">
                      <div className="flex flex-col items-center gap-3">
                        <label
                          htmlFor="logo-upload"
                          className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-accent/50 transition-colors"
                        >
                          {uploadPreview ? (
                            <img src={uploadPreview} alt="معاينة" className="w-20 h-20 object-contain" />
                          ) : (
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {uploadPreview ? "انقر لتغيير الصورة" : "انقر لرفع شعار (PNG, SVG, JPG)"}
                          </span>
                          <span className="text-xs text-muted-foreground">الحد الأقصى: 2 ميغابايت</span>
                        </label>
                        <input
                          id="logo-upload"
                          type="file"
                          accept=".png,.svg,.jpg,.jpeg,.webp"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="url" className="mt-3">
                      <Input
                        value={form.logoUrl.startsWith("data:") ? "" : form.logoUrl}
                        onChange={(e) => { setForm({ ...form, logoUrl: e.target.value }); setUploadPreview(null); }}
                        placeholder="https://logo.clearbit.com/example.com"
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="grid gap-2">
                  <Label>الوصف</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف مختصر" maxLength={500} />
                </div>
                <div className="grid gap-2">
                  <Label>رقم الموبايل</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" maxLength={20} />
                </div>
                <div className="grid gap-2">
                  <Label>العنوان</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="العنوان بالتفصيل" maxLength={200} />
                </div>
                <Button onClick={handleSave}>{editingLogo ? "تحديث" : "إضافة"} الشعار</Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Categories Management */}
        <div className="mb-10 p-6 bg-card rounded-xl border border-border">
          <h2 className="text-lg font-semibold mb-4">التصنيفات</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <span key={cat} className="category-pill category-pill-inactive flex items-center gap-1.5">
                {cat}
                {cat !== "الكل" && (
                  <button onClick={() => removeCategory(cat)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="تصنيف جديد" className="max-w-xs" maxLength={50} onKeyDown={(e) => e.key === "Enter" && addCategory()} />
            <Button variant="outline" onClick={addCategory}>إضافة</Button>
          </div>
        </div>

        {/* Logos Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-right p-4 font-medium text-muted-foreground">الشعار</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">الاسم</th>
                  <th className="text-right p-4 font-medium text-muted-foreground hidden sm:table-cell">التصنيف</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {logos.map((logo) => (
                  <tr key={logo.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <img loading="lazy" src={logo.logoUrl} alt={logo.name} className="w-8 h-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(logo.name)}&size=64`; }} />
                    </td>
                    <td className="p-4 font-medium">{logo.name}</td>
                    <td className="p-4 text-muted-foreground hidden sm:table-cell">{logo.category}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-start gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toggleFeatured(logo.id)} title={logo.featured ? "إلغاء التمييز" : "تمييز"}>
                          {logo.featured ? <Star className="w-4 h-4 text-accent fill-accent" /> : <StarOff className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(logo)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(logo.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
