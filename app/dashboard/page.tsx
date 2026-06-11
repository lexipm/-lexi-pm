'use client'

import { useEffect, useState, useCallback } from 'react'
import { BriefItem, TaskItem } from '@/types'
import { formatDistanceToNow } from 'date-fns'

// ── Helpers ──────────────────────────────────────────────────────────────────
function classificationColor(c: string) {
  const map: Record<string, string> = {
    'Urgent': 'bg-red-100 text-red-700 border-red-200',
    'Decision Needed': 'bg-purple-100 text-purple-700 border-purple-200',
    'Client Risk': 'bg-orange-100 text-orange-700 border-orange-200',
    'Delivery Risk': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Engineering Blocker': 'bg-red-100 text-red-800 border-red-200',
    'Follow-up Required': 'bg-blue-100 text-blue-700 border-blue-200',
    'Waiting On Others': 'bg-gray-100 text-gray-600 border-gray-200',
    'Commercial Opportunity': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'FYI': 'bg-slate-100 text-slate-600 border-slate-200',
  }
  return map[c] || 'bg-gray-100 text-gray-600 border-gray-200'
}

function riskColor(r: string) {
  if (r === 'High') return 'text-red-600'
  if (r === 'Medium') return 'text-amber-600'
  return 'text-emerald-600'
}

function sourceIcon(s: string) {
  if (s === 'slack') return '💬'
  if (s === 'gmail') return '📧'
  if (s === 'clickup') return '✅'
  if (s === 'drive') return '📁'
  return '📌'
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title, count, icon }: { title: string; count: number; icon: string }) {
```
