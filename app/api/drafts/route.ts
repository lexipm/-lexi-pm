import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('brief_items')
    .select('*')
    .not('draft_response', 'is', null)
    .eq('draft_approved', false)
    .eq('draft_sent', false)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, action, edited_response } = body

  if (action === 'approve') {
    const { data, error } = await supabase
      .from('brief_items')
      .update({ draft_approved: true, draft_response: edited_response || undefined })
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ status: 'approved', data })
  }

  if (action === 'dismiss') {
    const { data, error } = await supabase
      .from('brief_items')
      .update({ status: 'closed' })
      .eq('id', id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ status: 'dismissed', data })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
