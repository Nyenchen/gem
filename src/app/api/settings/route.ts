import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('settings')
    .select('data')
    .eq('id', 1)
    .single();

  if (error || !data) return NextResponse.json({});
  return NextResponse.json(data.data ?? {});
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, data: body });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
