export type Classification =
  | 'Urgent'
  | 'Decision Needed'
  | 'Client Risk'
  | 'Delivery Risk'
  | 'Engineering Blocker'
  | 'Follow-up Required'
  | 'Waiting On Others'
  | 'Commercial Opportunity'
  | 'FYI'
  | 'Ignore'

export type RiskLevel = 'Low' | 'Medium' | 'High'
export type Confidence = 'Low' | 'Medium' | 'High'
export type Source = 'slack' | 'gmail' | 'clickup' | 'drive'
export type Status = 'open' | 'closed' | 'snoozed'

export interface BriefItem {
  id: string
  created_at: string
  source: Source
  channel?: string
  thread_id?: string
  sender?: string
  raw_content: string
  summary: string
  why_it_matters: string
  owner: string
  recommended_action: string
  classification: Classification
  risk_level: RiskLevel
  confidence: Confidence
  status: Status
  vijith_mentioned: boolean
  draft_response?: string
  draft_approved?: boolean
  draft_sent?: boolean
}

export interface TaskItem {
  id: string
  created_at: string
  updated_at: string
  source: Source
  description: string
  addressed_by: string
  channel?: string
  thread_id?: string
  status: Status
  context: string
}

export interface ThreadItem {
  id: string
  created_at: string
  updated_at: string
  source: Source
  channel: string
  thread_id: string
  title: string
  summary: string
  last_activity: string
  participants: string[]
  vijith_named: boolean
  action_required: boolean
}

export interface WebhookPayload {
  source: Source
  event_type: string
  channel?: string
  channel_id?: string
  thread_ts?: string
  sender?: string
  sender_id?: string
  content: string
  timestamp: string
  metadata?: Record<string, unknown>
}
