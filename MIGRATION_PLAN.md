# Migrate logo-haven-dash → Next.js (App Router) + Supabase

## Context

Today the project is **Vite + React 18 + TypeScript** with shadcn/ui, react-router-dom, react-query, Tailwind RTL. All data lives in `localStorage` ([src/lib/logoData.ts](src/lib/logoData.ts)) and admin login is hardcoded `admin/admin123` ([src/lib/auth.ts](src/lib/auth.ts)).

The user wants to persist data in **Supabase**. The cleanest way to use Supabase's official SSR helpers (`@supabase/ssr` — cookie-based sessions, server components, middleware-based route protection) is to migrate to **Next.js 14 (App Router)**.

We migrate **in place** — keep `src/`, all components, shadcn/ui, Tailwind, RTL. We swap:
- runtime: Vite → Next.js,
- routing: react-router-dom → Next.js file-based routing,
- data layer: localStorage → Supabase tables,
- auth: hardcoded check → Supabase Auth.

## Decisions (locked, confirmed with user)

1. In-place migration of this directory.
2. Next.js **14 App Router** (not Pages Router).
3. **Supabase Auth** replaces localStorage auth.
4. Two Supabase tables: `logos` + `categories`.

## Important rules for the executor

- **Do not delete shadcn `src/components/ui/*` files** — they stay untouched.
- **Do not change any file under `src/components/ui/*`**.
- **Add `"use client";` as the very first line** of every file that uses React state, effects, refs, browser APIs, framer-motion, react-query mutations, sonner, or shadcn dialogs/dropdowns. When in doubt, mark it client.
- **Use `@/...` import paths** — `tsconfig.json` keeps the alias.
- **Do not reformat or restyle untouched code**. Only make the edits listed.
- After all tasks, run the verification section in order.

---

# Task list (execute in order)

## Task 1 — Update `package.json`

Replace the entire file with:

```json
{
  "name": "logo-haven-dash",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "seed": "bun run supabase/seed.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.45.4",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-autoplay": "^8.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^11.0.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.462.0",
    "next": "^14.2.15",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "xlsx": "^0.18.5",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "@tailwindcss/typography": "^0.5.16",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^22.16.5",
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.21",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.15",
    "jsdom": "^20.0.3",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "vitest": "^3.2.4"
  }
}
```

Removed deps: `vite`, `@vitejs/plugin-react-swc`, `lovable-tagger`, `react-router-dom`, plus the old eslint stack (`@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `typescript-eslint`).

Added: `next`, `@supabase/supabase-js`, `@supabase/ssr`, `eslint-config-next`, `@vitejs/plugin-react` (so Vitest still compiles JSX without the SWC plugin).

Note: `"type": "module"` is removed (Next.js handles its own ESM resolution).

---

## Task 2 — Replace `tsconfig.json`

Overwrite with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] },
    "noImplicitAny": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "strictNullChecks": false
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Task 3 — Delete obsolete files

Delete these files (they are Vite/router-specific):

- `index.html`
- `vite.config.ts`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `src/main.tsx`
- `src/App.tsx`
- `src/App.css`
- `src/vite-env.d.ts`
- `src/components/ProtectedRoute.tsx`

Use `rm <path>` (or the editor's delete) for each.

---

## Task 4 — Move `src/index.css` → `src/app/globals.css`

Create the directory `src/app/` if it doesn't exist. Move the file (do not edit its contents):

```bash
mkdir -p src/app
mv src/index.css src/app/globals.css
```

---

## Task 5 — Create `next.config.mjs`

Create at the project root:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev" },
    ],
  },
};

export default nextConfig;
```

---

## Task 6 — Create `next-env.d.ts`

Create at the project root:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

---

## Task 7 — Create `.env.example` and `.env.local`

`.env.example` (committed):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# Only needed locally for the seed script — never commit real value
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`.env.local` (uncommitted — same shape, with empty values; user fills in real values).

Append `.env.local` to `.gitignore` if not already present.

---

## Task 8 — Replace `eslint.config.js` with `.eslintrc.json`

Delete `eslint.config.js`. Create `.eslintrc.json`:

```json
{
  "extends": "next/core-web-vitals"
}
```

---

## Task 9 — Update `vitest.config.ts`

Overwrite with:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

(Only change vs current: `@vitejs/plugin-react-swc` → `@vitejs/plugin-react`, since the SWC plugin was removed in Task 1.)

---

## Task 10 — Update `playwright.config.ts`

The current file uses `lovable-agent-playwright-config`. Overwrite with a self-contained config pointing at port 3000:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

---

## Task 11 — Create the Supabase clients

### Task 11a — `src/lib/supabase/client.ts`

```ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

### Task 11b — `src/lib/supabase/server.ts`

```ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // called from a Server Component — safe to ignore.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // called from a Server Component — safe to ignore.
          }
        },
      },
    },
  );
}
```

### Task 11c — `src/lib/supabase/middleware.ts`

```ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin
  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}
```

---

## Task 12 — Create `middleware.ts` at project root

```ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

## Task 13 — Rewrite `src/lib/auth.ts`

Overwrite with Supabase-backed wrappers (still client-side, used by Login + Header):

```ts
"use client";

import { createClient } from "@/lib/supabase/client";

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return !error;
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
```

---

## Task 14 — Split `src/lib/logoData.ts`

### Task 14a — Rewrite `src/lib/logoData.ts` (types + defaults only, no localStorage)

```ts
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
```

The four functions `getLogos`, `saveLogos`, `getCategories`, `saveCategories` are removed — they are replaced in Task 14b.

### Task 14b — Create `src/lib/logos.ts` (Supabase CRUD)

```ts
"use client";

import { createClient } from "@/lib/supabase/client";
import type { Logo } from "@/lib/logoData";

type LogoRow = {
  id: string;
  name: string;
  category: string;
  url: string;
  logo_url: string;
  description: string;
  featured: boolean;
  phone: string | null;
  address: string | null;
};

const rowToLogo = (r: LogoRow): Logo => ({
  id: r.id,
  name: r.name,
  category: r.category,
  url: r.url,
  logoUrl: r.logo_url,
  description: r.description,
  featured: r.featured,
  phone: r.phone ?? undefined,
  address: r.address ?? undefined,
});

const logoToRow = (l: Omit<Logo, "id"> & { id?: string }) => ({
  ...(l.id ? { id: l.id } : {}),
  name: l.name,
  category: l.category,
  url: l.url,
  logo_url: l.logoUrl,
  description: l.description,
  featured: l.featured,
  phone: l.phone ?? null,
  address: l.address ?? null,
});

export async function fetchLogos(): Promise<Logo[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("logos").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return (data as LogoRow[]).map(rowToLogo);
}

export async function createLogo(input: Omit<Logo, "id">): Promise<Logo> {
  const supabase = createClient();
  const { data, error } = await supabase.from("logos").insert(logoToRow(input)).select().single();
  if (error) throw error;
  return rowToLogo(data as LogoRow);
}

export async function updateLogo(id: string, patch: Partial<Omit<Logo, "id">>): Promise<Logo> {
  const supabase = createClient();
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.url !== undefined) row.url = patch.url;
  if (patch.logoUrl !== undefined) row.logo_url = patch.logoUrl;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.featured !== undefined) row.featured = patch.featured;
  if (patch.phone !== undefined) row.phone = patch.phone ?? null;
  if (patch.address !== undefined) row.address = patch.address ?? null;

  const { data, error } = await supabase.from("logos").update(row).eq("id", id).select().single();
  if (error) throw error;
  return rowToLogo(data as LogoRow);
}

export async function deleteLogo(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("logos").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchCategories(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("name, position")
    .order("position", { ascending: true });
  if (error) throw error;
  return ["الكل", ...(data ?? []).map((c) => c.name as string)];
}

export async function createCategory(name: string): Promise<void> {
  const supabase = createClient();
  // pick next position
  const { data: maxRow } = await supabase
    .from("categories")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPos = ((maxRow?.position as number | undefined) ?? 0) + 1;
  const { error } = await supabase.from("categories").insert({ name, position: nextPos });
  if (error) throw error;
}

export async function deleteCategory(name: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("name", name);
  if (error) throw error;
}
```

---

## Task 15 — Create `src/app/providers.tsx`

```tsx
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster />
        <Sonner />
        <FloatingWhatsApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

---

## Task 16 — Create `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "LogoHub",
  description: "Browse and search logos of the world's biggest brands.",
  openGraph: {
    title: "LogoHub",
    description: "Browse and search logos of the world's biggest brands.",
    type: "website",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3ba00cdf-4f47-4dc1-9513-7befc2e63055/id-preview-5805b6fc--72d7b02f-1800-4ad0-8c24-187d55c81ea6.lovable.app-1775723560161.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Lovable",
    title: "LogoHub",
    description: "Browse and search logos of the world's biggest brands.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

(Note: changed `lang="en"` from the original `index.html` to `lang="ar"` because content is Arabic — `dir="rtl"` is preserved.)

---

## Task 17 — Rewrite `src/components/NavLink.tsx`

Overwrite with a `next/link` wrapper that uses `usePathname()`:

```tsx
"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps
  extends Omit<LinkProps, "className">,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  children?: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName: _pendingClassName, href, children, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
      <Link ref={ref} href={href} className={cn(className, isActive && activeClassName)} {...props}>
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
```

(`pendingClassName` no longer applies — Next has no pending route state — but we keep the prop in the API so callers don't break. The leading `_` marks it unused.)

---

## Task 18 — Rewrite `src/components/Header.tsx`

Overwrite with:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layers, Settings, Home, PlusCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname === "/admin";
  const isContact = pathname === "/contact";
  const isLogin = pathname === "/login";

  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setAuthed(!!user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Logo<span className="text-primary">Hub</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {!isContact && !isAdmin && !isLogin && (
            <Button variant="outline" size="sm" asChild className="gap-2 rounded-full px-5 font-semibold">
              <Link href="/contact">
                <PlusCircle className="w-4 h-4" />
                أضف علامتك
              </Link>
            </Button>
          )}

          {authed && (
            <>
              <Button
                variant={isAdmin ? "default" : "outline"}
                size="sm"
                asChild
                className="gap-2 rounded-full px-5 font-semibold"
              >
                <Link href={isAdmin ? "/" : "/admin"}>
                  {isAdmin ? <Home className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                  {isAdmin ? "عرض الموقع" : "لوحة التحكم"}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 rounded-full px-4 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

---

## Task 19 — Create `src/app/page.tsx` (was `src/pages/Index.tsx`)

Create the file with the contents below. Vs. the original ([src/pages/Index.tsx](src/pages/Index.tsx)) the changes are:

1. Add `"use client";` at the very top.
2. Replace `import { getLogos, getCategories, type Logo } from "@/lib/logoData";` with imports from `@/lib/logos` + `@/lib/logoData`.
3. Replace synchronous `getLogos()` / `getCategories()` calls with `useQuery`.

```tsx
"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import LogoCard from "@/components/LogoCard";
import FeaturedSlider from "@/components/FeaturedSlider";
import CategorySlider from "@/components/CategorySlider";
import LogoDetailDialog from "@/components/LogoDetailDialog";
import Header from "@/components/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { type Logo } from "@/lib/logoData";
import { fetchLogos, fetchCategories } from "@/lib/logos";

const Index = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: logos = [] } = useQuery({ queryKey: ["logos"], queryFn: fetchLogos });
  const { data: categories = ["الكل"] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const isMobile = useIsMobile();

  const filtered = useMemo(() => {
    return logos.filter((logo) => {
      const matchesSearch = logo.name.toLowerCase().includes(search.toLowerCase()) ||
        logo.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "الكل" || logo.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [logos, search, activeCategory]);

  const featuredLogos = useMemo(() => logos.filter((l) => l.featured), [logos]);

  const logosByCategory = useMemo(() => {
    const grouped: Record<string, Logo[]> = {};
    const cats = categories.filter((c) => c !== "الكل");
    cats.forEach((cat) => {
      const catLogos = logos.filter((l) => l.category === cat);
      if (catLogos.length > 0) grouped[cat] = catLogos;
    });
    return grouped;
  }, [logos, categories]);

  const handleLogoClick = (logo: Logo) => {
    setSelectedLogo(logo);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />

      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="container mx-auto text-center max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            اكتشف أفضل العلامات التجارية
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight"
          >
            مجموعة شعارات
            <br />
            <span className="text-primary">العلامات التجارية</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed"
          >
            تصفّح وابحث واستكشف شعارات أشهر الشركات حول العالم
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative max-w-lg mx-auto"
          >
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث عن شعار باسم الشركة أو التصنيف…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-12 h-14 rounded-2xl bg-card border-border text-base shadow-sm focus:shadow-md transition-shadow"
            />
          </motion.div>
        </div>
      </section>

      {!search && activeCategory === "الكل" && featuredLogos.length > 0 && (
        <FeaturedSlider logos={featuredLogos} onLogoClick={handleLogoClick} />
      )}

      <section className="pb-8 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-2.5"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-pill ${activeCategory === cat ? "category-pill-active" : "category-pill-inactive"}`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="container mx-auto">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-muted-foreground text-lg">
                لم يتم العثور على شعارات. جرّب بحثاً أو تصنيفاً مختلفاً.
              </p>
            </motion.div>
          ) : isMobile && activeCategory === "الكل" && !search ? (
            <div>
              {Object.entries(logosByCategory).map(([cat, catLogos]) => (
                <CategorySlider
                  key={cat}
                  category={cat}
                  logos={catLogos}
                  onLogoClick={handleLogoClick}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {filtered.map((logo, i) => (
                <LogoCard key={logo.id} logo={logo} onClick={handleLogoClick} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 px-4 bg-card/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LogoHub. جميع شعارات العلامات التجارية ملك لأصحابها.
        </div>
      </footer>

      <LogoDetailDialog logo={selectedLogo} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default Index;
```

After creating this file, **delete `src/pages/Index.tsx`**.

---

## Task 20 — Create `src/app/login/page.tsx` (was `src/pages/Login.tsx`)

Changes vs. original:
1. `"use client";` first line.
2. Replace `useNavigate` from react-router with `useRouter` from `next/navigation`.
3. Form switches from `username` to `email`.
4. Replace `login(...)` / `isAuthenticated()` with `signIn(...)` and a Supabase `getUser()` check.

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/Header";
import { signIn } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/admin");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await signIn(email.trim(), password);
    if (ok) {
      toast.success("تم تسجيل الدخول بنجاح");
      router.replace("/admin");
      router.refresh();
    } else {
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <section className="relative py-20 px-4 overflow-hidden min-h-[calc(100vh-4rem)] flex items-center">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border/60 rounded-3xl p-8 shadow-xl backdrop-blur-xl"
          >
            <div className="text-center mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                تسجيل دخول المسؤول
              </h1>
              <p className="text-muted-foreground text-sm">
                أدخل بياناتك للوصول إلى لوحة التحكم
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="pr-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10 h-11"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 rounded-full font-semibold">
                {loading ? "جاري التحقق..." : "تسجيل الدخول"}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Login;
```

After creating, **delete `src/pages/Login.tsx`**.

---

## Task 21 — Create `src/app/contact/page.tsx` (was `src/pages/Contact.tsx`)

Changes vs. original ([src/pages/Contact.tsx](src/pages/Contact.tsx)):
1. Add `"use client";`.
2. Replace `import { getCategories } from "@/lib/logoData";` with React Query against `fetchCategories` from `@/lib/logos`.

Copy the original file verbatim, then apply the two diffs. Concretely, change the top imports and the `categories` line:

Old (lines 1-10 + 24):
```tsx
import { useState } from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Send, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { getCategories } from "@/lib/logoData";
import { useToast } from "@/hooks/use-toast";

// ...
const categories = getCategories().filter((c) => c !== "الكل");
```

New:
```tsx
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

// ...
const { data: allCategories = ["الكل"] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
const categories = allCategories.filter((c) => c !== "الكل");
```

(Place the `useQuery` line directly after `const { toast } = useToast();` inside the component.)

Everything else (the JSX, the WhatsApp logic, etc.) is unchanged.

After creating, **delete `src/pages/Contact.tsx`**.

---

## Task 22 — Create `src/app/admin/page.tsx` (was `src/pages/Admin.tsx`)

Changes vs. original ([src/pages/Admin.tsx](src/pages/Admin.tsx)):

1. Add `"use client";` first line.
2. Remove `import { getLogos, saveLogos, getCategories, saveCategories, type Logo } from "@/lib/logoData";`.
3. Add:
   ```tsx
   import { type Logo } from "@/lib/logoData";
   import {
     fetchLogos, createLogo, updateLogo, deleteLogo,
     fetchCategories, createCategory, deleteCategory,
   } from "@/lib/logos";
   import { useQuery, useQueryClient } from "@tanstack/react-query";
   ```
4. Replace the `useState(getLogos)` / `useState(getCategories)` initial-state hooks with React Query:
   ```tsx
   const queryClient = useQueryClient();
   const { data: logos = [] } = useQuery({ queryKey: ["logos"], queryFn: fetchLogos });
   const { data: categories = ["الكل"] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
   ```
5. Replace every `setLogos(updated); saveLogos(updated);` with a Supabase mutation followed by `queryClient.invalidateQueries({ queryKey: ["logos"] })`. Same for categories.

Concretely, the handlers become:

```tsx
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
```

6. Remove the old `useState<Logo[]>(getLogos)` and `useState<string[]>(getCategories)` lines.

Everything else (JSX, file-upload handler, XLSX export) is unchanged. The Excel export still uses the local `logos` array — no change needed.

After creating, **delete `src/pages/Admin.tsx`**.

---

## Task 23 — Create `src/app/not-found.tsx` (was `src/pages/NotFound.tsx`)

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
```

After creating, **delete `src/pages/NotFound.tsx`** and remove the now-empty `src/pages/` directory.

---

## Task 24 — Audit components for any leftover `react-router-dom` imports

Run:

```bash
grep -rn "react-router-dom" src
```

Expected output: empty. If anything still appears in `src/components/*.tsx` (not `ui/*`), apply the same `Link`/`useRouter`/`usePathname` substitutions used in Tasks 17–18. Files known to need this: `src/components/NavLink.tsx` and `src/components/Header.tsx` (already covered). [src/components/LogoCard.tsx](src/components/LogoCard.tsx), [src/components/FeaturedSlider.tsx](src/components/FeaturedSlider.tsx), [src/components/CategorySlider.tsx](src/components/CategorySlider.tsx), [src/components/LogoDetailDialog.tsx](src/components/LogoDetailDialog.tsx), [src/components/FloatingWhatsApp.tsx](src/components/FloatingWhatsApp.tsx) — only add `"use client";` to the top of any of these that aren't already client. Leave the rest unchanged.

Also run:

```bash
grep -rn "localStorage" src
```

Expected: empty (after Task 13 + Task 14). If anything remains, replace with the equivalent Supabase call from `@/lib/logos`.

---

## Task 25 — Add the Supabase database schema

Create `supabase/schema.sql`:

```sql
-- Categories
create table if not exists public.categories (
  name text primary key,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- Logos
create table if not exists public.logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null references public.categories(name) on update cascade,
  url text not null,
  logo_url text not null,
  description text not null default '',
  featured boolean not null default false,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create index if not exists logos_category_idx on public.logos (category);
create index if not exists logos_featured_idx on public.logos (featured);

-- RLS
alter table public.categories enable row level security;
alter table public.logos enable row level security;

-- Public read
drop policy if exists "categories are public" on public.categories;
create policy "categories are public" on public.categories for select using (true);

drop policy if exists "logos are public" on public.logos;
create policy "logos are public" on public.logos for select using (true);

-- Authenticated write (admins are simply any authenticated user for now)
drop policy if exists "auth can write categories" on public.categories;
create policy "auth can write categories" on public.categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth can write logos" on public.logos;
create policy "auth can write logos" on public.logos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
```

This file is run **once** by the user inside Supabase SQL editor. Do not run it from code.

---

## Task 26 — Add the seed script `supabase/seed.ts`

```ts
/**
 * One-shot seed: copies defaultLogos + defaultCategories from src/lib/logoData.ts
 * into a fresh Supabase project. Run with:
 *   bun run supabase/seed.ts
 *
 * Reads SUPABASE_SERVICE_ROLE_KEY from .env.local.
 */
import { createClient } from "@supabase/supabase-js";
import { defaultLogos, defaultCategories } from "../src/lib/logoData";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  const cats = defaultCategories.filter((c) => c !== "الكل");
  const catsRows = cats.map((name, i) => ({ name, position: i }));
  const { error: catErr } = await supabase.from("categories").upsert(catsRows, { onConflict: "name" });
  if (catErr) throw catErr;
  console.log(`Seeded ${catsRows.length} categories.`);

  const logoRows = defaultLogos.map((l) => ({
    name: l.name,
    category: l.category,
    url: l.url,
    logo_url: l.logoUrl,
    description: l.description,
    featured: l.featured,
    phone: l.phone ?? null,
    address: l.address ?? null,
  }));
  // Wipe + insert so reruns are deterministic
  await supabase.from("logos").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error: logoErr } = await supabase.from("logos").insert(logoRows);
  if (logoErr) throw logoErr;
  console.log(`Seeded ${logoRows.length} logos.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

The seed is run from Bun (`bun run supabase/seed.ts`) which auto-loads `.env.local`. Note: the executor must **not** run this script — the user will run it after creating their Supabase project.

---

## Task 27 — Install dependencies

Run:

```bash
rm -rf node_modules bun.lock bun.lockb package-lock.json
bun install
```

Expected: a fresh install with no Vite/lovable-tagger packages, plus `next`, `@supabase/ssr`, `@supabase/supabase-js`.

---

## Task 28 — Sanity build

Run:

```bash
bun run build
```

This must succeed before declaring the migration done. Common failures and fixes:
- **"Module not found: react-router-dom"** → revisit Task 24, find the leftover import.
- **"useState is not defined" / "Hooks are not allowed in Server Components"** → the page/component is missing `"use client";`. Add it as the first line.
- **`Type error: Cannot find module 'next/navigation'`** → `next` not installed; rerun `bun install`.

---

# Files summary

**Created (new):**
- `next.config.mjs`
- `next-env.d.ts`
- `middleware.ts`
- `.env.example`, `.env.local`
- `.eslintrc.json`
- `src/app/layout.tsx`, `src/app/providers.tsx`, `src/app/globals.css` (moved), `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/contact/page.tsx`, `src/app/admin/page.tsx`, `src/app/not-found.tsx`
- `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`
- `src/lib/logos.ts`
- `supabase/schema.sql`, `supabase/seed.ts`

**Modified:**
- `package.json` (Task 1)
- `tsconfig.json` (Task 2)
- `vitest.config.ts` (Task 9)
- `playwright.config.ts` (Task 10)
- `src/lib/auth.ts` (Task 13)
- `src/lib/logoData.ts` (Task 14a)
- `src/components/NavLink.tsx` (Task 17)
- `src/components/Header.tsx` (Task 18)

**Deleted:**
- `index.html`, `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`
- `src/main.tsx`, `src/App.tsx`, `src/App.css`, `src/vite-env.d.ts`, `src/index.css` (moved)
- `src/components/ProtectedRoute.tsx`
- `src/pages/Index.tsx`, `src/pages/Login.tsx`, `src/pages/Contact.tsx`, `src/pages/Admin.tsx`, `src/pages/NotFound.tsx`
- `src/pages/` (empty after deletions)

---

# Verification (run after Task 28)

The user must do these one-time setup steps before functional verification:

A. Create a Supabase project at https://app.supabase.com.
B. Copy the **Project URL** + **anon key** + **service role key** → paste into `.env.local`.
C. In Supabase SQL editor, run the contents of `supabase/schema.sql`.
D. In Supabase Auth → Users, click "Add user" → create an admin email + password. Mark "Auto-confirm email".
E. Run `bun run seed` to populate default logos and categories.

Then verify in order:

1. **Boot**: `bun run dev` → `http://localhost:3000` loads with no console errors.
2. **Public home (`/`)**: shows all 16 seeded logos, the 7 default categories in the pill row, the featured slider, and (on mobile width) the per-category sliders.
3. **Filter / search**: clicking a category pill narrows the grid; typing in the search box filters by name and category.
4. **Logo detail**: clicking a logo card opens the detail dialog with the right image, description, and links.
5. **Contact (`/contact`)**: renders the form, the category select shows the 6 non-`"الكل"` categories, submitting opens WhatsApp with the encoded message.
6. **Admin gate**: visiting `/admin` while signed-out redirects to `/login`.
7. **Login**: signing in with the seeded admin email + password redirects to `/admin` and the header shows "خروج".
8. **Admin CRUD**:
   - Add a new logo (URL mode and file upload mode both work) → row appears in Supabase `logos` table → grid on `/` updates after refresh.
   - Edit an existing logo → row updates.
   - Toggle featured → reflected in the home page featured slider.
   - Delete a logo → gone from Supabase + UI.
   - Add and remove a category → reflected in `/` and `/contact` after refresh.
9. **Logout**: clicking خروج clears the session and `/admin` redirects to `/login` again.
10. **RTL**: confirm `<html dir="rtl">` is rendered (DevTools → Elements) and the layout is right-to-left as before.
11. **Static checks**: `bun run lint` and `bun run build` both green.
12. **Tests**: `bun run test` (Vitest) green.
