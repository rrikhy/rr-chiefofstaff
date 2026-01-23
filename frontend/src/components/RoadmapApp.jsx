import { useState, useMemo } from 'react'

// Roadmap data parsed from the markdown
const roadmapData = {
  lastUpdated: "January 8, 2026",
  categories: [
    {
      id: "ai-platform-core",
      name: "AI Platform (Core)",
      icon: "🔷",
      description: "Core AI capabilities that power the ThousandEyes AI experience.",
      color: "blue",
      subcategories: [
        {
          id: "interfaces",
          name: "Interfaces",
          description: "How customers access and interact with AI.",
          items: [
            { id: 1, name: "Conversational Analytics (CA)", jira: "PR-1331", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1331", status: "in_progress", owner: "Hans Ashlock", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/4853137603", timeline: "Q3 2026" },
            { id: 2, name: "ThousandEyes MCP Server", jira: "PR-1654", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1654", status: "ready", owner: "Vikram", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5054431495", timeline: "Q2 2026" },
            { id: 3, name: "AI Assistant Phase 3 - Account Health Checks", jira: "PR-1486", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1486", status: "ready", owner: "Hans Ashlock", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5054431495", timeline: "Q3 2026" },
            { id: 4, name: "AI Assistant/Agents as External Service", jira: "PR-1802", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1802", status: "in_progress", owner: "Raj", spec: null, timeline: "Q4 2026" },
          ]
        },
        {
          id: "embedded-intelligence",
          name: "Embedded Intelligence",
          description: "AI-powered capabilities built into existing workflows.",
          items: [
            { id: 5, name: "Troubleshooting via AI Assistant V2 - Milestones 2 & 3", jira: "PR-1682", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1682", status: "ready", owner: "Yuvnesh Modi", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5239668827/AI+assistant+FY+26+priorities", timeline: "Q3 2026" },
            { id: 6, name: "Intelligent Testing", jira: "PR-1650", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1650", status: "in_progress", owner: "Brandon Cato", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5110398985", timeline: "Q4 2026" },
            { id: 7, name: "Collective Intelligence Degradation", jira: "PR-1119", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1119", status: "definition", owner: "Adam", spec: "https://docs.google.com/document/d/1PjHmzx0p6J_mhl7W2H1NPUZ0SejvL2dOiWxXQ06f-u4/edit?tab=t.0", timeline: "Q4 2026" },
            { id: 8, name: "Views Explanations - Time Range Selections", jira: "PR-1572", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1572", status: "none", owner: "Raj", spec: null, timeline: "Q3 2026" },
            { id: 9, name: "Views Explanations - Cloud Insights", jira: "PR-1683", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1683", status: "in_progress", owner: "Raj", spec: null, timeline: "Q3 2026" },
            { id: 10, name: "Ambient Agents - Continuous Drift Detection", jira: "PR-1806", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1806", status: "none", owner: "Raj", spec: null, timeline: "TBD" },
            { id: 11, name: "BGP Hygiene - Automated Edge Immunization", jira: "PR-1804", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1804", status: "none", owner: "Arun", spec: null, timeline: "TBD" },
          ]
        },
        {
          id: "infrastructure",
          name: "Infrastructure",
          description: "Platform, services, and backend capabilities powering AI.",
          groups: [
            {
              name: "Network Intelligence",
              items: [
                { id: 12, name: "Anomaly Detection as-a-Service (Univariate)", jira: "PR-1770", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1770", status: "definition", owner: "Adam", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5110263978", timeline: "Q3 2026" },
                { id: 13, name: "Anomaly Detection as-a-Service (Covariate)", jira: "PR-1797", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1797", status: "none", owner: "Adam", spec: "https://cisco-my.sharepoint.com/:w:/p/rrikhy/IQApUH6yhCuLSJf_L8V2BY7RAbexCYU4U2qyHFn14HmhKXg?e=hukyKc", timeline: "TBD" },
                { id: 14, name: "Anomaly Detection as-a-Service (Multivariate)", jira: "PR-1801", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1801", status: "none", owner: "Adam", spec: "https://cisco-my.sharepoint.com/:w:/p/rrikhy/IQApUH6yhCuLSJf_L8V2BY7RAbexCYU4U2qyHFn14HmhKXg?e=hukyKc", timeline: "TBD" },
                { id: 15, name: "Baselining Service", jira: "PR-1461", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1461", status: "none", owner: "Adam", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/4932886584", timeline: "TBD" },
                { id: 16, name: "Causal AI models for RCA", jira: "PR-1799", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1799", status: "none", owner: "Raj", spec: null, timeline: "TBD" },
              ]
            },
            {
              name: "Integrations",
              items: [
                { id: 17, name: "Meraki and ThousandEyes A2A Communication", jira: "PR-1796", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1796", status: "none", owner: "Hans Ashlock", spec: null, timeline: "Q3 2026" },
                { id: 18, name: "AI Workflow Orchestration in ThousandEyes", jira: "PR-1800", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1800", status: "none", owner: "Vikram", spec: null, timeline: "Q4 2026" },
                { id: 19, name: "Deep Agent Integration in ThousandEyes", jira: "PR-1798", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1798", status: "none", owner: "Hans Ashlock", spec: null, timeline: "Q4 2026" },
                { id: 20, name: "Automated Proving Grounds - Canary Deployment", jira: "PR-1803", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1803", status: "none", owner: "Raj", spec: null, timeline: "TBD" },
                { id: 21, name: "App-Aware Traffic Manager - DNS Failover", jira: "PR-1805", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1805", status: "none", owner: "Raj", spec: null, timeline: "TBD" },
              ]
            },
            {
              name: "Platform Tooling",
              items: [
                { id: 22, name: "GenAI SDK - Eval Support", jira: "PR-1400", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1400", status: "open", owner: "Raj", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/4984668688", timeline: "Q3 2026" },
                { id: 23, name: "GenAI SDK - Credo Integration", jira: "PR-1400", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1400", status: "open", owner: "Raj", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/4984668688", timeline: "Q3 2026" },
                { id: 24, name: "GenAI SDK - Operational Functionality", jira: "PR-1400", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1400", status: "open", owner: "Raj", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/4984668688", timeline: "Q3 2026" },
                { id: 25, name: "GenAI SDK - Cost Attribution", jira: "PR-1400", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1400", status: "open", owner: "Raj", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/4984668688", timeline: "Q3 2026" },
              ]
            }
          ]
        }
      ]
    },
    {
      id: "central-product-teams",
      name: "Central Product Teams",
      icon: "🔶",
      description: "AI capabilities developed by product teams across the organization.",
      color: "orange",
      items: [
        { id: 26, name: "Natural Language Dashboarding", jira: "PR-1161", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1161", status: "paused", owner: "Sowmya", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/4817084516", timeline: "TBD" },
        { id: 27, name: "Connected Devices AI Assistant", jira: "PR-1602", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1602", status: "ready", owner: "Hassan", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5090467969", timeline: "Q3 2026" },
        { id: 28, name: "Transaction Test Creation", jira: "PR-1447", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1447", status: "definition", owner: "Lulu Bai", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5000003942", timeline: "Q3/Q4 2026" },
        { id: 29, name: "Agent Suggestion Skill", jira: "PR-1538", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1538", status: "none", owner: "Shimei", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5012095058", timeline: "Q4 2026" },
        { id: 30, name: "API JSON Creation / Broad API Query Support", jira: "PR-1406", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1406", status: "none", owner: "Raj", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/4857692235", timeline: "TBD" },
        { id: 31, name: "AI Summary Cloud Config", jira: "PR-1322", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1322", status: "definition", owner: "-", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/4912406811", timeline: "TBD" },
        { id: 32, name: "Endpoint Agent Skill", jira: "PR-1516", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1516", status: "in_progress", owner: "Valentin", spec: "https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5024547379", timeline: "Q3 2026" },
        { id: 33, name: "Integration Skill", jira: "PR-1795", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1795", status: "none", owner: "Filipa", spec: null, timeline: "TBD" },
        { id: 34, name: "Best Practice Recommendations", jira: "PR-1130", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1130", status: "open", owner: "Brandon", spec: null, timeline: "TBD" },
        { id: 35, name: "BGP Peering Recommendations", jira: null, jiraUrl: null, status: "in_progress", owner: "-", spec: null, timeline: "TBD" },
        { id: 36, name: "AI-Powered Adaptive Testing Recommendations", jira: "PR-1794", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1794", status: "none", owner: "Brandon", spec: null, timeline: "TBD" },
        { id: 37, name: "AI-Assisted Alert Creation and Configuration", jira: "PR-1791", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1791", status: "none", owner: "Sowmya", spec: null, timeline: "TBD" },
        { id: 38, name: "AI Alert Summary and Insights", jira: "PR-1793", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1793", status: "none", owner: "Sowmya", spec: null, timeline: "TBD" },
        { id: 39, name: "AI-Driven DNS Monitoring Recommendations", jira: "PR-1792", jiraUrl: "https://thousandeyes.atlassian.net/browse/PR-1792", status: "none", owner: "Lulu", spec: null, timeline: "TBD" },
      ]
    }
  ]
}

const statusConfig = {
  in_progress: { label: "In Progress", color: "bg-yellow-500", textColor: "text-yellow-700", bgLight: "bg-yellow-50", icon: "🟡" },
  ready: { label: "Ready", color: "bg-emerald-500", textColor: "text-emerald-700", bgLight: "bg-emerald-50", icon: "🟢" },
  definition: { label: "Definition", color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-50", icon: "🔵" },
  open: { label: "Open", color: "bg-gray-400", textColor: "text-gray-600", bgLight: "bg-gray-50", icon: "⚪" },
  paused: { label: "Paused", color: "bg-orange-400", textColor: "text-orange-700", bgLight: "bg-orange-50", icon: "⏸️" },
  none: { label: "No Status", color: "bg-slate-300", textColor: "text-slate-500", bgLight: "bg-slate-50", icon: "⬜" },
}

const timelineOrder = ["Q2 2026", "Q3 2026", "Q3/Q4 2026", "Q4 2026", "TBD"]

function getAllItems(data) {
  const items = []
  data.categories.forEach(cat => {
    if (cat.items) {
      items.push(...cat.items.map(item => ({ ...item, category: cat.name, categoryColor: cat.color })))
    }
    if (cat.subcategories) {
      cat.subcategories.forEach(sub => {
        if (sub.items) {
          items.push(...sub.items.map(item => ({ ...item, category: cat.name, subcategory: sub.name, categoryColor: cat.color })))
        }
        if (sub.groups) {
          sub.groups.forEach(group => {
            items.push(...group.items.map(item => ({ ...item, category: cat.name, subcategory: sub.name, group: group.name, categoryColor: cat.color })))
          })
        }
      })
    }
  })
  return items
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.none
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgLight} ${config.textColor} border border-current/10`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  )
}

function InitiativeCard({ item, onClick, isSelected }) {
  const config = statusConfig[item.status] || statusConfig.none
  
  return (
    <div
      onClick={() => onClick(item)}
      className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-50/50 shadow-lg ring-2 ring-indigo-500/20' 
          : 'border-slate-200 bg-white hover:border-indigo-300'
      }`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${config.color} transition-all duration-300 group-hover:w-1.5`} />
      
      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-indigo-700 transition-colors">
            {item.name}
          </h4>
          <StatusBadge status={item.status} />
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {item.jira && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded font-mono">
              {item.jira}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {item.owner}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {item.timeline}
          </span>
        </div>
      </div>
    </div>
  )
}

function DetailPanel({ item, onClose }) {
  if (!item) return null
  
  const config = statusConfig[item.status] || statusConfig.none
  
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 z-50 overflow-y-auto animate-slide-in">
      <div className={`sticky top-0 bg-gradient-to-r ${
        item.categoryColor === 'blue' ? 'from-blue-600 to-indigo-600' : 'from-orange-500 to-amber-500'
      } p-6`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="pr-12">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            {item.category}
            {item.subcategory && <> › {item.subcategory}</>}
            {item.group && <> › {item.group}</>}
          </div>
          <h2 className="text-xl font-bold text-white">{item.name}</h2>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</div>
            <StatusBadge status={item.status} />
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Timeline</div>
            <div className="font-semibold text-slate-800">{item.timeline}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Owner</div>
            <div className="font-semibold text-slate-800">{item.owner}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">JIRA</div>
            {item.jira ? (
              <a 
                href={item.jiraUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {item.jira} ↗
              </a>
            ) : (
              <span className="text-slate-400">Not assigned</span>
            )}
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Specification</div>
          {item.spec ? (
            <a 
              href={item.spec} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Specification
            </a>
          ) : (
            <div className="flex items-center gap-2 text-amber-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Specification needed</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          {item.jiraUrl && (
            <a
              href={item.jiraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 11.513H0a5.218 5.218 0 005.232 5.215h2.13v2.057A5.215 5.215 0 0012.575 24V12.518a1.005 1.005 0 00-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 005.215 5.214h2.129v2.058a5.218 5.218 0 005.215 5.214V6.758a1.001 1.001 0 00-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 005.215 5.215h2.129v2.057A5.215 5.215 0 0024 12.483V1.005A1.005 1.005 0 0023.013 0z"/>
              </svg>
              Open in JIRA
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function TimelineView({ items, selectedItem, onItemClick }) {
  const grouped = useMemo(() => {
    const groups = {}
    timelineOrder.forEach(t => groups[t] = [])
    items.forEach(item => {
      const key = timelineOrder.includes(item.timeline) ? item.timeline : 'TBD'
      groups[key].push(item)
    })
    return groups
  }, [items])
  
  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
      
      <div className="space-y-8">
        {timelineOrder.map(timeline => {
          const timelineItems = grouped[timeline]
          if (timelineItems.length === 0) return null
          
          return (
            <div key={timeline} className="relative">
              <div className="sticky top-20 z-10 flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {timeline === 'TBD' ? '?' : timeline.replace(' 2026', '').replace('Q', '')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{timeline}</h3>
                  <p className="text-sm text-slate-500">{timelineItems.length} initiatives</p>
                </div>
              </div>
              
              <div className="ml-16 grid gap-3">
                {timelineItems.map(item => (
                  <InitiativeCard 
                    key={item.id} 
                    item={item} 
                    onClick={onItemClick}
                    isSelected={selectedItem?.id === item.id}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CategoryView({ data, selectedItem, onItemClick }) {
  return (
    <div className="space-y-8">
      {data.categories.map(category => (
        <div key={category.id} className="space-y-6">
          <div className={`flex items-center gap-3 p-4 rounded-xl ${
            category.color === 'blue' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
              : 'bg-gradient-to-r from-orange-500 to-amber-500'
          }`}>
            <span className="text-3xl">{category.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{category.name}</h2>
              <p className="text-white/80 text-sm">{category.description}</p>
            </div>
          </div>
          
          {category.subcategories?.map(sub => (
            <div key={sub.id} className="ml-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${category.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                <h3 className="text-lg font-semibold text-slate-700">{sub.name}</h3>
                <span className="text-sm text-slate-400">— {sub.description}</span>
              </div>
              
              {sub.items && (
                <div className="grid gap-3 md:grid-cols-2">
                  {sub.items.map(item => (
                    <InitiativeCard 
                      key={item.id} 
                      item={{...item, category: category.name, subcategory: sub.name, categoryColor: category.color}}
                      onClick={onItemClick}
                      isSelected={selectedItem?.id === item.id}
                    />
                  ))}
                </div>
              )}
              
              {sub.groups?.map(group => (
                <div key={group.name} className="ml-4 space-y-3">
                  <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{group.name}</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {group.items.map(item => (
                      <InitiativeCard 
                        key={item.id} 
                        item={{...item, category: category.name, subcategory: sub.name, group: group.name, categoryColor: category.color}}
                        onClick={onItemClick}
                        isSelected={selectedItem?.id === item.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          
          {category.items && (
            <div className="grid gap-3 md:grid-cols-2 ml-4">
              {category.items.map(item => (
                <InitiativeCard 
                  key={item.id} 
                  item={{...item, category: category.name, categoryColor: category.color}}
                  onClick={onItemClick}
                  isSelected={selectedItem?.id === item.id}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function StatsCard({ icon, label, value, color }) {
  return (
    <div className={`p-4 rounded-xl ${color} border border-white/50`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <div className="text-2xl font-bold text-slate-800">{value}</div>
          <div className="text-xs text-slate-600">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default function RoadmapApp() {
  const [view, setView] = useState('category')
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')
  
  const allItems = useMemo(() => getAllItems(roadmapData), [])
  
  const owners = useMemo(() => {
    const set = new Set(allItems.map(i => i.owner).filter(Boolean))
    return Array.from(set).sort()
  }, [allItems])
  
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jira?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesOwner = ownerFilter === 'all' || item.owner === ownerFilter
      return matchesSearch && matchesStatus && matchesOwner
    })
  }, [allItems, searchQuery, statusFilter, ownerFilter])
  
  const stats = useMemo(() => {
    return {
      total: allItems.length,
      withSpecs: allItems.filter(i => i.spec).length,
      missingSpecs: allItems.filter(i => !i.spec).length,
      inProgress: allItems.filter(i => i.status === 'in_progress').length,
      ready: allItems.filter(i => i.status === 'ready').length,
    }
  }, [allItems])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Header */}
      <header className="relative sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Platform Roadmap</h1>
                <p className="text-sm text-slate-400">Last updated: {roadmapData.lastUpdated}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-800/50 rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => setView('category')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'category' 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  By Category
                </button>
                <button
                  onClick={() => setView('timeline')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === 'timeline' 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  By Timeline
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Stats Bar */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatsCard icon="📊" label="Total Initiatives" value={stats.total} color="bg-white/10 backdrop-blur" />
          <StatsCard icon="🟡" label="In Progress" value={stats.inProgress} color="bg-yellow-500/20 backdrop-blur" />
          <StatsCard icon="🟢" label="Ready" value={stats.ready} color="bg-emerald-500/20 backdrop-blur" />
          <StatsCard icon="📄" label="With Specs" value={stats.withSpecs} color="bg-blue-500/20 backdrop-blur" />
          <StatsCard icon="⚠️" label="Need Specs" value={stats.missingSpecs} color="bg-amber-500/20 backdrop-blur" />
        </div>
      </div>
      
      {/* Filters */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-wrap gap-4 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search initiatives, owners, JIRA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="all" className="bg-slate-800">All Statuses</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key} className="bg-slate-800">{config.icon} {config.label}</option>
            ))}
          </select>
          
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="all" className="bg-slate-800">All Owners</option>
            {owners.map(owner => (
              <option key={owner} value={owner} className="bg-slate-800">{owner}</option>
            ))}
          </select>
          
          {(searchQuery || statusFilter !== 'all' || ownerFilter !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); setOwnerFilter('all'); }}
              className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
          
          <div className="flex items-center text-slate-400 text-sm">
            Showing {filteredItems.length} of {allItems.length}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          {view === 'timeline' ? (
            <TimelineView 
              items={filteredItems} 
              selectedItem={selectedItem}
              onItemClick={setSelectedItem}
            />
          ) : (
            <CategoryView 
              data={roadmapData} 
              selectedItem={selectedItem}
              onItemClick={setSelectedItem}
            />
          )}
        </div>
      </main>
      
      {/* Detail Panel */}
      {selectedItem && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setSelectedItem(null)}
          />
          <DetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
        </>
      )}
      
      {/* Custom styles */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
