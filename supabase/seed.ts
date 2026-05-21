/**
 * One-shot seed: copies defaultLogos + defaultCategories from src/lib/logoData.ts
 * into a fresh Supabase project. Run with:
 *   bun run supabase/seed.ts
 *
 * Reads SUPABASE_SERVICE_ROLE_KEY from .env.local.
 */
import { createClient } from "@supabase/supabase-js";
import { defaultLogos, defaultCategories, defaultGovernorates } from "../src/lib/logoData";

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

  const govs = defaultGovernorates.filter((g) => g !== "الكل");
  const govsRows = govs.map((name, i) => ({ name, position: i }));
  const { error: govErr } = await supabase.from("governorates").upsert(govsRows, { onConflict: "name" });
  if (govErr) throw govErr;
  console.log(`Seeded ${govsRows.length} governorates.`);

  const logoRows = defaultLogos.map((l) => ({
    name: l.name,
    category: l.category,
    governorate: l.governorate,
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
