import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { analyseWithClaude } from '@/lib/claude'
import { WebhookPayload } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    if (secret !== process.env.WEBHOOK_SECRET) {
      console.log('Auth failed')
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const payload: WebhookPayload = await req.json()
    console.log('Received payload:', JSON.stringify(payload))

    if (!payload.content || payload.content.trim().length < 2) {
      console.log('Skipped - empty content')
      return NextResponse.json({ status: 'skipped' })
    }

    const analysis = await analyseWithClaude(payload)
    console.log('Claude analysis:', JSON.stringify(analysis))

    if (analysis.classification === 'Ignore') {
      console.log('Ignored by Claude')
      return NextResponse.json({ status: 'ignored' })
    }

    const { data, error } = await supabase
      .from('brief_items')
      .insert({
        source: payload.source || 'slack',
        channel: payload.channel || 'unknown',
        thread_id: payload.thread_ts || null,
        sender: payload.sender || 'unknown',
        raw_content: payload.content,
        summary: analysis.summary || 'No summary',
        why_it_matters: analysis.why_it_matters || '',
        owner: analysis.owner || 'Vijith',
        recommended_action: analysis.recommended_action || '',
        classification: analysis.classification || 'FYI',
        risk_level: analysis.risk_level || 'Low',
        confidence: analysis.confidence || 'Low',
        vijith_mentioned: analysis.vijith_mentioned || false,
        draft_response: analysis.draft_response || null,
        draft_approved: false,
        draft_sent: false,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      console.log('Supabase error:', JSON.stringify(error))
      throw error
    }

    console.log('Saved to Supabase:', data.id)

    if (analysis.vijith_mentioned && analysis.classification !== 'FYI') {
      await supabase.from('tasks').insert({
        source: payload.source || 'slack',
        description: analysis.summary || payload.content,
        addressed_by: payload.sender || 'unknown',
        channel: payload.channel || 'unknown',
        thread_id: payload.thread_ts || null,
        status: 'open',
        context: payload.content,
      })
    }

    return NextResponse.json({ status: 'processed', id: data.id })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
