"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { type Logo } from "@/lib/logoData";
import {
  fetchLogos, createLogo, updateLogo, deleteLogo,
  fetchCategories, createCategory, deleteCategory, updateCategory,
  fetchGovernorates, createGovernorate, deleteGovernorate, updateGovernorate,
} from "@/lib/logos";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/svg+xml", "image/jpeg", "image/webp"];

const Admin = () => {
  const queryClient = useQueryClient();
  const { data: logos = [] } = useQuery({ queryKey: ["logos"], queryFn: fetchLogos });
  const { data: categories = ["الكل"] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: governorates = ["الكل"] } = useQuery({ queryKey: ["governorates"], queryFn: fetchGovernorates });

  const [newCategory, setNewCategory] = useState("");
  const [newGovernorate, setNewGovernorate] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [logoInputMode, setLogoInputMode] = useState<string>("upload");

  const [form, setForm] = useState({ name: "", category: "", governorate: "القاهرة", url: "", logoUrl: "", description: "", featured: false, phone: "", address: "" });

  const resetForm = () => {
    setForm({ name: "", category: "", governorate: "القاهرة", url: "", logoUrl: "", description: "", featured: false, phone: "", address: "" });
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

  const handleSave = async () => {
    if (!form.name.trim() || !form.category || !form.url.trim() || !form.logoUrl.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }
    if (form.name.trim().length > 100) {
      toast.error("اسم الشركة طويل جداً (الحد 100 حرف).");
      return;
    }

    const sanitized = {
      name: form.name.trim().slice(0, 100),
      category: form.category,
      governorate: form.governorate,
      url: form.url.trim(),
      logoUrl: form.logoUrl.trim(),
      description: form.description.trim().slice(0, 500),
      featured: form.featured,
      phone: form.phone || undefined,
      address: form.address || undefined,
    };

    try {
      if (editingLogo) {
        await updateLogo(editingLogo.id, sanitized);
        toast.success("تم تحديث الشعار!");
      } else {
        await createLogo(sanitized);
        toast.success("تمت إضافة الشعار!");
      }
      queryClient.invalidateQueries({ queryKey: ["logos"] });
      setDialogOpen(false);
      setEditingLogo(null);
      resetForm();
    } catch (e) {
      toast.error("فشل الحفظ. حاول مجدداً.");
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLogo(id);
      queryClient.invalidateQueries({ queryKey: ["logos"] });
      toast.success("تم حذف الشعار.");
    } catch (e) {
      toast.error("فشل الحذف.");
      console.error(e);
    }
  };

  const toggleFeatured = async (id: string) => {
    const logo = logos.find((l) => l.id === id);
    if (!logo) return;
    try {
      await updateLogo(id, { featured: !logo.featured });
      queryClient.invalidateQueries({ queryKey: ["logos"] });
    } catch (e) {
      toast.error("فشل التحديث.");
      console.error(e);
    }
  };

  const handleEdit = (logo: Logo) => {
    setEditingLogo(logo);
    setForm({ name: logo.name, category: logo.category, governorate: logo.governorate, url: logo.url, logoUrl: logo.logoUrl, description: logo.description, featured: logo.featured, phone: logo.phone || "", address: logo.address || "" });
    setUploadPreview(logo.logoUrl.startsWith("data:") ? logo.logoUrl : null);
    setLogoInputMode(logo.logoUrl.startsWith("data:") ? "upload" : "url");
    setDialogOpen(true);
  };

  const addCategory = async () => {
    const trimmed = newCategory.trim().slice(0, 50);
    if (!trimmed || categories.includes(trimmed)) return;
    try {
      await createCategory(trimmed);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategory("");
      toast.success("تمت إضافة التصنيف!");
    } catch (e) {
      toast.error("فشل إضافة التصنيف.");
      console.error(e);
    }
  };

  const removeCategory = async (cat: string) => {
    if (cat === "الكل") return;
    try {
      await deleteCategory(cat);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("تم حذف التصنيف.");
    } catch (e) {
      toast.error("فشل حذف التصنيف.");
      console.error(e);
    }
  };

  const editCategory = async (oldCat: string) => {
    if (oldCat === "الكل") return;
    const newCat = window.prompt("تعديل التصنيف:", oldCat);
    if (!newCat) return;
    const trimmed = newCat.trim().slice(0, 50);
    if (!trimmed || trimmed === oldCat || categories.includes(trimmed)) return;
    try {
      await updateCategory(oldCat, trimmed);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["logos"] });
      toast.success("تم تعديل التصنيف.");
    } catch (e) {
      toast.error("فشل تعديل التصنيف.");
      console.error(e);
    }
  };

  const addGovernorate = async () => {
    const trimmed = newGovernorate.trim().slice(0, 50);
    if (!trimmed || governorates.includes(trimmed)) return;
    try {
      await createGovernorate(trimmed);
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
      setNewGovernorate("");
      toast.success("تمت إضافة المحافظة!");
    } catch (e) {
      toast.error("فشل إضافة المحافظة.");
      console.error(e);
    }
  };

  const removeGovernorate = async (gov: string) => {
    if (gov === "الكل") return;
    try {
      await deleteGovernorate(gov);
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
      toast.success("تم حذف المحافظة.");
    } catch (e) {
      toast.error("فشل حذف المحافظة.");
      console.error(e);
    }
  };

  const editGovernorate = async (oldGov: string) => {
    if (oldGov === "الكل") return;
    const newGov = window.prompt("تعديل المحافظة:", oldGov);
    if (!newGov) return;
    const trimmed = newGov.trim().slice(0, 50);
    if (!trimmed || trimmed === oldGov || governorates.includes(trimmed)) return;
    try {
      await updateGovernorate(oldGov, trimmed);
      queryClient.invalidateQueries({ queryKey: ["governorates"] });
      queryClient.invalidateQueries({ queryKey: ["logos"] });
      toast.success("تم تعديل المحافظة.");
    } catch (e) {
      toast.error("فشل تعديل المحافظة.");
      console.error(e);
    }
  };

  const nonAllCategories = categories.filter((c) => c !== "الكل");
  const nonAllGovernorates = governorates.filter((g) => g !== "الكل");

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
                "المحافظة": l.governorate,
                "رقم الموبايل": l.phone || "",
                "العنوان": l.address || "",
                "رابط الموقع": l.url,
              }));
              const ws = XLSX.utils.json_to_sheet(data);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "الشعارات");
              ws["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 30 }, { wch: 35 }];
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
                  <Label>المحافظة *</Label>
                  <Select value={form.governorate} onValueChange={(v) => setForm({ ...form, governorate: v })}>
                    <SelectTrigger><SelectValue placeholder="اختر المحافظة" /></SelectTrigger>
                    <SelectContent>
                      {nonAllGovernorates.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
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

        <div className="mb-10 p-6 bg-card rounded-xl border border-border">
          <h2 className="text-lg font-semibold mb-4">التصنيفات</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <span key={cat} className="category-pill category-pill-inactive flex items-center gap-1.5">
                {cat}
                {cat !== "الكل" && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => editCategory(cat)} className="text-muted-foreground hover:text-foreground">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeCategory(cat)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2 mb-8">
            <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="تصنيف جديد" className="max-w-xs" maxLength={50} onKeyDown={(e) => e.key === "Enter" && addCategory()} />
            <Button variant="outline" onClick={addCategory}>إضافة</Button>
          </div>

          <h2 className="text-lg font-semibold mb-4">المحافظات</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {governorates.map((gov) => (
              <span key={gov} className="category-pill category-pill-inactive flex items-center gap-1.5">
                {gov}
                {gov !== "الكل" && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => editGovernorate(gov)} className="text-muted-foreground hover:text-foreground">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeGovernorate(gov)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newGovernorate} onChange={(e) => setNewGovernorate(e.target.value)} placeholder="محافظة جديدة" className="max-w-xs" maxLength={50} onKeyDown={(e) => e.key === "Enter" && addGovernorate()} />
            <Button variant="outline" onClick={addGovernorate}>إضافة</Button>
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
                  <th className="text-right p-4 font-medium text-muted-foreground hidden sm:table-cell">المحافظة</th>
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
                    <td className="p-4 text-muted-foreground hidden sm:table-cell">{logo.governorate}</td>
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
