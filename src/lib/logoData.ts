export interface Logo {
  id: string;
  name: string;
  category: string;
  governorate: string;
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

export const defaultGovernorates = [
  "الكل",
  "القاهرة",
  "الإسكندرية",
  "الجيزة",
  "الشرقية",
  "الدقهلية",
  "البحيرة",
  "المنيا",
  "القليوبية",
  "سوهاج",
  "الغربية",
  "أسيوط",
  "المنوفية",
  "الفيوم",
  "قنا",
  "بني سويف",
  "كفر الشيخ",
  "المنيا",
  "أسوان",
  "دمياط",
  "الإسماعيلية",
  "الأقصر",
  "بورسعيد",
  "السويس",
  "مطروح",
  "شمال سيناء",
  "جنوب سيناء",
  "البحر الأحمر",
  "الوادي الجديد",
];

export const defaultLogos: Logo[] = [
  { id: "1", name: "Starbucks", category: "مقاهي", governorate: "القاهرة", url: "https://www.starbucks.com", logoUrl: "https://logo.clearbit.com/starbucks.com", description: "سلسلة مقاهي عالمية مشهورة بمشروبات القهوة المتخصصة.", featured: true },
  { id: "2", name: "McDonald's", category: "مطاعم", governorate: "الجيزة", url: "https://www.mcdonalds.com", logoUrl: "https://logo.clearbit.com/mcdonalds.com", description: "أكبر سلسلة مطاعم وجبات سريعة في العالم.", featured: true },
  { id: "3", name: "Walmart", category: "سوبرماركت", governorate: "الإسكندرية", url: "https://www.walmart.com", logoUrl: "https://logo.clearbit.com/walmart.com", description: "شركة تجزئة متعددة الجنسيات تدير متاجر كبرى.", featured: false },
  { id: "4", name: "Apple", category: "تكنولوجيا", governorate: "القاهرة", url: "https://www.apple.com", logoUrl: "https://logo.clearbit.com/apple.com", description: "شركة تكنولوجيا تصمم الأجهزة الإلكترونية والبرمجيات.", featured: true },
  { id: "5", name: "Nike", category: "متاجر", governorate: "الجيزة", url: "https://www.nike.com", logoUrl: "https://logo.clearbit.com/nike.com", description: "أكبر شركة ملابس رياضية في العالم.", featured: false },
  { id: "6", name: "Visa", category: "مالية", governorate: "القاهرة", url: "https://www.visa.com", logoUrl: "https://logo.clearbit.com/visa.com", description: "شركة عالمية لتكنولوجيا المدفوعات.", featured: false },
  { id: "7", name: "Costa Coffee", category: "مقاهي", governorate: "الإسكندرية", url: "https://www.costa.co.uk", logoUrl: "https://logo.clearbit.com/costa.co.uk", description: "سلسلة مقاهي بريطانية ذات حضور عالمي.", featured: false },
  { id: "8", name: "Subway", category: "مطاعم", governorate: "الشرقية", url: "https://www.subway.com", logoUrl: "https://logo.clearbit.com/subway.com", description: "سلسلة وجبات سريعة متخصصة في الساندويتشات.", featured: false },
  { id: "9", name: "Target", category: "سوبرماركت", governorate: "الدقهلية", url: "https://www.target.com", logoUrl: "https://logo.clearbit.com/target.com", description: "متجر تجزئة للبضائع العامة في الولايات المتحدة.", featured: true },
  { id: "10", name: "Google", category: "تكنولوجيا", governorate: "القاهرة", url: "https://www.google.com", logoUrl: "https://logo.clearbit.com/google.com", description: "شركة تكنولوجيا متعددة الجنسيات متخصصة في خدمات الإنترنت.", featured: true },
  { id: "11", name: "Zara", category: "متاجر", governorate: "الجيزة", url: "https://www.zara.com", logoUrl: "https://logo.clearbit.com/zara.com", description: "متجر أزياء سريعة إسباني.", featured: false },
  { id: "12", name: "PayPal", category: "مالية", governorate: "القاهرة", url: "https://www.paypal.com", logoUrl: "https://logo.clearbit.com/paypal.com", description: "نظام مدفوعات إلكتروني يدعم تحويل الأموال.", featured: false },
  { id: "13", name: "Burger King", category: "مطاعم", governorate: "الإسكندرية", url: "https://www.bk.com", logoUrl: "https://logo.clearbit.com/bk.com", description: "سلسلة عالمية لمطاعم الوجبات السريعة.", featured: false },
  { id: "14", name: "Microsoft", category: "تكنولوجيا", governorate: "القاهرة", url: "https://www.microsoft.com", logoUrl: "https://logo.clearbit.com/microsoft.com", description: "شركة تكنولوجيا تنتج البرمجيات والأجهزة.", featured: false },
  { id: "15", name: "H&M", category: "متاجر", governorate: "الجيزة", url: "https://www.hm.com", logoUrl: "https://logo.clearbit.com/hm.com", description: "شركة سويدية متعددة الجنسيات لبيع الملابس بالتجزئة.", featured: false },
  { id: "16", name: "Whole Foods", category: "سوبرماركت", governorate: "الإسكندرية", url: "https://www.wholefoodsmarket.com", logoUrl: "https://logo.clearbit.com/wholefoodsmarket.com", description: "سلسلة سوبرماركت أمريكية متخصصة في الأغذية العضوية.", featured: false },
  { id: "17", name: "Vodafone Egypt", category: "تكنولوجيا", governorate: "القاهرة", url: "https://www.vodafone.com.eg", logoUrl: "https://logo.clearbit.com/vodafone.com.eg", description: "شركة اتصالات رائدة في مصر.", featured: true },
  { id: "18", name: "CIB", category: "مالية", governorate: "القاهرة", url: "https://www.cibeg.com", logoUrl: "https://logo.clearbit.com/cibeg.com", description: "البنك التجاري الدولي، من أكبر البنوك في مصر.", featured: true },
  { id: "19", name: "Juhayna", category: "سوبرماركت", governorate: "الجيزة", url: "https://www.juhayna.com", logoUrl: "https://logo.clearbit.com/juhayna.com", description: "شركة مصرية رائدة في إنتاج الألبان والعصائر.", featured: false },
];
