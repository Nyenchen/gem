import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';

// Map Supabase snake_case row → Product camelCase
function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as { zh: string; en: string },
    description: row.description as { zh: string; en: string },
    price: row.price as number,
    originalPrice: row.original_price as number | undefined,
    weight: row.weight as number,
    category: row.category as string,
    cut: row.cut as string,
    color: row.color as string,
    images: (row.images as string[]) ?? [],
    videoUrl: row.video_url as string | undefined,
    featured: row.featured as boolean,
    isNew: row.is_new as boolean,
    isRare: row.is_rare as boolean,
    createdAt: row.created_at as string,
  };
}

// Map Product camelCase → Supabase snake_case row
function productToRow(p: Product) {
  return {
    id: p.id || `gem-${Date.now()}`,
    name: p.name,
    description: p.description,
    price: p.price,
    original_price: p.originalPrice ?? null,
    weight: p.weight,
    category: p.category,
    cut: p.cut,
    color: p.color,
    images: p.images,
    video_url: p.videoUrl ?? null,
    featured: p.featured,
    is_new: p.isNew,
    is_rare: p.isRare,
    created_at: p.createdAt || new Date().toISOString().split('T')[0],
  };
}

export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json((data ?? []).map(rowToProduct));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const row = productToRow(body as Product);

  const { data, error } = await supabase
    .from('products')
    .upsert(row)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(rowToProduct(data));
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
