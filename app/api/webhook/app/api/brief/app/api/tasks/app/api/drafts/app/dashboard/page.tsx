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
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-base">{icon}</span>
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">{title}</h2>
      {count > 0 && (
        <span className="ml-auto bg-almond-green text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#1A6B4A' }}>
          {count}
        </span>
      )}
    </div>
  )
}

function BriefCard({ item, onClose, onApproveDraft }: {
  item: BriefItem
  onClose: (id: string) => void
  onApproveDraft: (id: string, response: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editedDraft, setEditedDraft] = useState(item.draft_response || '')
  const [draftApproved, setDraftApproved] = useState(item.draft_approved || false)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-3">
      {/* Card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5 flex-shrink-0">{sourceIcon(item.source)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${classificationColor(item.classification)}`}>
                {item.classification}
              </span>
              {item.vijith_mentioned && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                  Mentions you
                </span>
              )}
              {item.draft_response && !item.draft_sent && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  Draft ready
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 leading-snug">{item.summary}</p>
            <div className="flex items-center gap-3 mt-1.5">
              {item.channel && (
                <span className="text-xs text-gray-400 font-mono">#{item.channel}</span>
              )}
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              </span>
              <span className={`text-xs font-semibold ml-auto ${riskColor(item.risk_level)}`}>
                {item.risk_level} risk
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Why it matters</p>
            <p className="text-sm text-gray-700 leading-relaxed">{item.why_it_matters}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Recommended action</p>
            <p className="text-sm text-gray-700 leading-relaxed">{item.recommended_action}</p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Owner</p>
              <p className="text-sm font-medium text-gray-800">{item.owner}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Confidence</p>
              <p className="text-sm font-medium text-gray-800">{item.confidence}</p>
            </div>
          </div>

          {/* Draft response */}
          {item.draft_response && !item.draft_sent && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-2">Draft Response</p>
              <textarea
                value={editedDraft}
                onChange={e => setEditedDraft(e.target.value)}
                className="w-full text-sm text-gray-800 bg-white border border-amber-200 rounded-md p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300"
                rows={6}
              />
              {!draftApproved ? (
                <button
                  onClick={() => {
                    onApproveDraft(item.id, editedDraft)
                    setDraftApproved(true)
                  }}
                  className="mt-2 w-full py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: '#1A6B4A' }}
                >
                  Approve and ready to send
                </button>
              ) : (
                <div className="mt-2 py-2 rounded-lg text-sm font-semibold text-center text-emerald-700 bg-emerald-50 border border-emerald-200">
                  Approved — copy and send in Slack or Gmail
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onClose(item.id)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Mark closed
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function TaskCard({ task, onClose }: { task: TaskItem; onClose: (id: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-3">
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{sourceIcon(task.source)}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-snug">{task.description}</p>
          <div className="flex items-center gap-3 mt-1.5">
            {task.channel && (
              <span className="text-xs text-gray-400 font-mono">#{task.channel}</span>
            )}
            <span className="text-xs text-gray-400">from {task.addressed_by}</span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        <button
          onClick={() => onClose(task.id)}
          className="flex-shrink-0 text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 py-1 rounded-md hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function LexiDashboard() {
  const [briefItems, setBriefItems] = useState<BriefItem[]>([])
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [drafts, setDrafts] = useState<BriefItem[]>([])
  const [activeTab, setActiveTab] = useState<'brief' | 'tasks' | 'drafts' | 'fyi'>('brief')
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchAll = useCallback(async () => {
    try {
      const [briefRes, tasksRes, draftsRes] = await Promise.all([
        fetch('/api/brief?status=open&limit=100'),
        fetch('/api/tasks?status=open'),
        fetch('/api/drafts'),
      ])
      const [briefData, tasksData, draftsData] = await Promise.all([
        briefRes.json(),
        tasksRes.json(),
        draftsRes.json(),
      ])
      setBriefItems(Array.isArray(briefData) ? briefData : [])
      setTasks(Array.isArray(tasksData) ? tasksData : [])
      setDrafts(Array.isArray(draftsData) ? draftsData : [])
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    // Refresh every 60 seconds
    const interval = setInterval(fetchAll, 60000)
    return () => clearInterval(interval)
  }, [fetchAll])

  const handleClose = async (id: string) => {
    await fetch('/api/brief', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'closed' }),
    })
    setBriefItems(prev => prev.filter(i => i.id !== id))
  }

  const handleCloseTask = async (id: string) => {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'closed' }),
    })
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const handleApproveDraft = async (id: string, response: string) => {
    await fetch('/api/drafts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'approve', edited_response: response }),
    })
  }

  // Split brief items
  const urgent = briefItems.filter(i =>
    ['Urgent', 'Decision Needed', 'Client Risk', 'Engineering Blocker'].includes(i.classification)
  )
  const priorities = briefItems.filter(i =>
    ['Delivery Risk', 'Follow-up Required', 'Commercial Opportunity'].includes(i.classification)
  )
  const fyi = briefItems.filter(i =>
    ['FYI', 'Waiting On Others'].includes(i.classification)
  )

  const tabs = [
    { id: 'brief', label: 'Brief', count: urgent.length + priorities.length },
    { id: 'tasks', label: 'Tasks', count: tasks.length },
    { id: 'drafts', label: 'Drafts', count: drafts.length },
    { id: 'fyi', label: 'FYI', count: fyi.length },
  ] as const

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F4F2' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0D1F17' }} className="sticky top-0 z-10 px-4 pt-safe">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Lexi</h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Chief of Staff · {formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </p>
            </div>
            <button
              onClick={fetchAll}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: '#1A6B4A', color: '#fff' }}
            >
              Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 pb-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                style={activeTab === tab.id ? { backgroundColor: '#1A6B4A' } : {}}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 text-xs font-bold ${
                    activeTab === tab.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: '#1A6B4A', borderTopColor: 'transparent' }} />
            <p className="text-sm text-gray-500">Lexi is loading your brief...</p>
          </div>
        ) : (
          <>
            {/* BRIEF TAB */}
            {activeTab === 'brief' && (
              <div>
                {urgent.length > 0 && (
                  <div className="mb-6">
                    <SectionHeader title="Urgent and Decisions" count={urgent.length} icon="🔴" />
                    {urgent.map(item => (
                      <BriefCard
                        key={item.id}
                        item={item}
                        onClose={handleClose}
                        onApproveDraft={handleApproveDraft}
                      />
                    ))}
                  </div>
                )}
                {priorities.length > 0 && (
                  <div className="mb-6">
                    <SectionHeader title="Priorities and Follow-ups" count={priorities.length} icon="🟡" />
                    {priorities.map(item => (
                      <BriefCard
                        key={item.id}
                        item={item}
                        onClose={handleClose}
                        onApproveDraft={handleApproveDraft}
                      />
                    ))}
                  </div>
                )}
                {urgent.length === 0 && priorities.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-4xl mb-3">✅</p>
                    <p className="text-sm font-medium text-gray-600">You are across everything.</p>
                    <p className="text-xs text-gray-400 mt-1">No urgent items or priorities right now.</p>
                  </div>
                )}
              </div>
            )}

            {/* TASKS TAB */}
            {activeTab === 'tasks' && (
              <div>
                <SectionHeader title="Open Tasks" count={tasks.length} icon="📋" />
                {tasks.length > 0 ? (
                  tasks.map(task => (
                    <TaskCard key={task.id} task={task} onClose={handleCloseTask} />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <p className="text-4xl mb-3">✅</p>
                    <p className="text-sm font-medium text-gray-600">No open tasks addressed to you.</p>
                  </div>
                )}
              </div>
            )}

            {/* DRAFTS TAB */}
            {activeTab === 'drafts' && (
              <div>
                <SectionHeader title="Drafts Ready to Send" count={drafts.length} icon="✍️" />
                {drafts.length > 0 ? (
                  drafts.map(item => (
                    <BriefCard
                      key={item.id}
                      item={item}
                      onClose={handleClose}
                      onApproveDraft={handleApproveDraft}
                    />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-sm font-medium text-gray-600">No drafts waiting for your review.</p>
                  </div>
                )}
              </div>
            )}

            {/* FYI TAB */}
            {activeTab === 'fyi' && (
              <div>
                <SectionHeader title="FYI and Context" count={fyi.length} icon="📡" />
                {fyi.length > 0 ? (
                  fyi.map(item => (
                    <BriefCard
                      key={item.id}
                      item={item}
                      onClose={handleClose}
                      onApproveDraft={handleApproveDraft}
                    />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <p className="text-4xl mb-3">🔇</p>
                    <p className="text-sm font-medium text-gray-600">No FYI items at the moment.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
