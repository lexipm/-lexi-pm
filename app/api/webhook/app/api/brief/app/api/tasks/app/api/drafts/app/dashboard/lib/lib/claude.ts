import Anthropic from '@anthropic-ai/sdk'
import { BriefItem, WebhookPayload } from '@/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SYSTEM_PROMPT = `You are Lexi, Chief of Staff for Vijith Srinivas at Almond Fintech. Classify every item and return valid JSON only in this exact structure:
{
  "summary": "one sentence",
  "why_it_matters": "business impact",
  "owner": "who owns next step",
  "recommended_action": "what should happen",
  "classification": "Urgent|Decision Needed|Client Risk|Delivery Risk|Engineering Blocker|Follow-up Required|Waiting On Others|Commercial Opportunity|FYI|Ignore",
  "risk_level": "Low|Medium|High",
  "confidence": "Low|Medium|High",
  "vijith_mentioned": true or false,
  "draft_response": "drafted response in Vijith's voice or null"
}`

export async function analyseWithClaude(payload: WebhookPayload): Promise<Partial<BriefItem>> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `Source: ${payload.source}\nChannel: ${payload.channel}\nSender: ${payload.sender}\nContent: ${payload.content}` }],
  })

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('')

  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim())
  } catch {
    return { summary: 'Parse error', classification: 'FYI', risk_level: 'Low', confidence: 'Low', vijith_mentioned: false }
  }
}