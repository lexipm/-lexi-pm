# Lexi — My Chief of Staff

Lexi is a living, intelligent Chief of Staff dashboard built for Vijith Srinivas. It monitors Slack, Gmail, ClickUp, and Google Drive in real time, classifies everything using Claude AI, and surfaces the highest value information in a clean mobile-first dashboard hosted on Vercel.

## Stack

- Next.js 14 (App Router)
- Supabase (database and storage)
- Anthropic Claude API (intelligence engine)
- Make (automation and webhooks)
- Vercel (hosting)
- Tailwind CSS (styling)

## Setup Instructions

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://kirtizraprnmxcjtswtn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ANTHROPIC_API_KEY=your_claude_api_key
WEBHOOK_SECRET=lexi-make-secret-2026
```

### 2. Database Setup

Go to your Supabase project → SQL Editor → paste the entire contents of `supabase/schema.sql` and click Run.

### 3. Deploy to Vercel

Connect your GitHub repository to Vercel. Add all environment variables in Vercel project settings. Deploy.

### 4. Make Webhook Setup

Your Vercel webhook endpoint is:
`https://your-vercel-url.vercel.app/api/webhook`

In every Make scenario, add an HTTP header:
`x-webhook-secret: lexi-make-secret-2026`

Payload format for all sources:
```json
{
  "source": "slack",
  "event_type": "message",
  "channel": "client-taptapsend_us_s",
  "channel_id": "C0957CG7XL0",
  "thread_ts": "1781000708.281099",
  "sender": "Yunus Sevimli",
  "sender_id": "U010W3MJ9MZ",
  "content": "message text here",
  "timestamp": "2026-06-11T03:24:25Z"
}
```
 
## Make Scenario Payloads by Source

### Slack
source: "slack"

### Gmail
source: "gmail"

### ClickUp
source: "clickup"

### Google Drive
source: "drive"
