export interface Logo {
  id: string;
  name: string;
  category: string;
  url: string;
  logoUrl: string;
  description: string;
  featured: boolean;
  phone?: string;
  address?: string;
}

export const defaultCategories = [
  "الكل",
  "مطاعم",
  "مقاهي",
  "سوبرماركت",
  "متاجر",
  "تكنولوجيا",
  "مالية",
];

export const defaultLogos: Logo[] = [
  { id: "1", name: "Starbucks", category: "مقاهي", url: "https://www.starbucks.com", logoUrl: "https://logo.clearbit.com/starbucks.com", description: "سلسلة مقاهي عالمية مشهورة بمشروبات القهوة المتخصصة.", featured: true },
  { id: "2", name: "McDonald's", category: "مطاعم", url: "https://www.mcdonalds.com", logoUrl: "https://logo.clearbit.com/mcdonalds.com", description: "أكبر سلسلة مطاعم وجبات سريعة في العالم.", featured: true },
  { id: "3", name: "Walmart", category: "سوبرماركت", url: "https://www.walmart.com", logoUrl: "https://logo.clearbit.com/walmart.com", description: "شركة تجزئة متعددة الجنسيات تدير متاجر كبرى.", featured: false },
  { id: "4", name: "Apple", category: "تكنولوجيا", url: "https://www.apple.com", logoUrl: "https://logo.clearbit.com/apple.com", description: "شركة تكنولوجيا تصمم الأجهزة الإلكترونية والبرمجيات.", featured: true },
  { id: "5", name: "Nike", category: "متاجر", url: "https://www.nike.com", logoUrl: "https://logo.clearbit.com/nike.com", description: "أكبر شركة ملابس رياضية في العالم.", featured: false },
  { id: "6", name: "Visa", category: "مالية", url: "https://www.visa.com", logoUrl: "https://logo.clearbit.com/visa.com", description: "شركة عالمية لتكنولوجيا المدفوعات.", featured: false },
  { id: "7", name: "Costa Coffee", category: "مقاهي", url: "https://www.costa.co.uk", logoUrl: "https://logo.clearbit.com/costa.co.uk", description: "سلسلة مقاهي بريطانية ذات حضور عالمي.", featured: false },
  { id: "8", name: "Subway", category: "مطاعم", url: "https://www.subway.com", logoUrl: "https://logo.clearbit.com/subway.com", description: "سلسلة وجبات سريعة متخصصة في الساندويتشات.", featured: false },
  { id: "9", name: "Target", category: "سوبرماركت", url: "https://www.target.com", logoUrl: "https://logo.clearbit.com/target.com", description: "متجر تجزئة للبضائع العامة في الولايات المتحدة.", featured: true },
  { id: "10", name: "Google", category: "تكنولوجيا", url: "https://www.google.com", logoUrl: "https://logo.clearbit.com/google.com", description: "شركة تكنولوجيا متعددة الجنسيات متخصصة في خدمات الإنترنت.", featured: true },
  { id: "11", name: "Zara", category: "متاجر", url: "https://www.zara.com", logoUrl: "https://logo.clearbit.com/zara.com", description: "متجر أزياء سريعة إسباني.", featured: false },
  { id: "12", name: "PayPal", category: "مالية", url: "https://www.paypal.com", logoUrl: "https://logo.clearbit.com/paypal.com", description: "نظام مدفوعات إلكتروني يدعم تحويل الأموال.", featured: false },
  { id: "13", name: "Burger King", category: "مطاعم", url: "https://www.bk.com", logoUrl: "https://logo.clearbit.com/bk.com", description: "سلسلة عالمية لمطاعم الوجبات السريعة.", featured: false },
  { id: "14", name: "Microsoft", category: "تكنولوجيا", url: "https://www.microsoft.com", logoUrl: "https://logo.clearbit.com/microsoft.com", description: "شركة تكنولوجيا تنتج البرمجيات والأجهزة.", featured: false },
  { id: "15", name: "H&M", category: "متاجر", url: "https://www.hm.com", logoUrl: "https://logo.clearbit.com/hm.com", description: "شركة سويدية متعددة الجنسيات لبيع الملابس بالتجزئة.", featured: false },
  { id: "16", name: "Whole Foods", category: "سوبرماركت", url: "https://www.wholefoodsmarket.com", logoUrl: "https://logo.clearbit.com/wholefoodsmarket.com", description: "سلسلة سوبرماركت أمريكية متخصصة في الأغذية العضوية.", featured: false },
];

const STORAGE_KEY = "logohub_logos";
const CATEGORIES_KEY = "logohub_categories";

export function getLogos(): Logo[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLogos));
  return defaultLogos;
}

export function saveLogos(logos: Logo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logos));
}

export function getCategories(): string[] {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
  return defaultCategories;
}

export function saveCategories(categories: string[]) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}
