"use client";

import { createClient } from "@/lib/supabase/client";
import type { Logo } from "@/lib/logoData";

type LogoRow = {
  id: string;
  name: string;
  category: string;
  governorate: string;
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
  governorate: r.governorate,
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
  governorate: l.governorate,
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
  if (patch.governorate !== undefined) row.governorate = patch.governorate;
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

export async function fetchGovernorates(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("governorates")
    .select("name, position")
    .order("position", { ascending: true });
  if (error) throw error;
  return ["الكل", ...(data ?? []).map((c) => c.name as string)];
}

export async function createGovernorate(name: string): Promise<void> {
  const supabase = createClient();
  const { data: maxRow } = await supabase
    .from("governorates")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPos = ((maxRow?.position as number | undefined) ?? 0) + 1;
  const { error } = await supabase.from("governorates").insert({ name, position: nextPos });
  if (error) throw error;
}

export async function deleteGovernorate(name: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("governorates").delete().eq("name", name);
  if (error) throw error;
}

export async function updateCategory(oldName: string, newName: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("categories").update({ name: newName }).eq("name", oldName);
  if (error) throw error;
}

export async function updateGovernorate(oldName: string, newName: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("governorates").update({ name: newName }).eq("name", oldName);
  if (error) throw error;
}

