# Networking (Meraki + ThousandEyes) FY26 Committed Roadmap

> **Restructured version** using Splunk-style language patterns with bi-directional Canvas integration

---

## Timeline Overview

| Milestone | Target Date | Focus |
|-----------|-------------|-------|
| **Beta** | Feb 28, 2026 | Initial integration, core MCP skills, A2A protocol |
| **CA** | End of March, 2026 | Expanded troubleshooting, widget improvements, user provisioning |
| **GA** | End of July, 2026 | Full RBAC, admin governance, advanced agent capabilities |

---

## Meraki Platform

| Beta (Feb 28, 2026) | CA (EoMarch, 2026) | GA (EoJuly, 2026) |
|---------------------|---------------------|-------------------|
| **Initial integration:** | | |
| • Surface Path Visualization in AI Canvas for end-to-end network analysis | | |

---

## Networking AI

*AI-powered capabilities for troubleshooting, monitoring, and intelligent insights*

| Beta (Feb 28, 2026) | CA (EoMarch, 2026) | GA (EoJuly, 2026) |
|---------------------|---------------------|-------------------|
| **Troubleshooting:** | **Troubleshooting:** | |
| • Surface Client Onboarding troubleshooting via Canvas skills | • Enable Wireless Performance Troubleshooting via Canvas | • Integrate LLM-based Outage Explanation into Canvas responses |
| • Expose Application Performance Degradation analysis in Canvas | | • Surface Intelligent Testing recommendations in Canvas |
| | | |
| **Monitoring:** | **Monitoring:** | |
| • Render Network/Org Overview insights in Canvas boards | • Surface Licensing compliance and expiration data in Canvas | |
| • Display Client and Device Insights (Wireless/Switching/Routing) in Canvas widgets | • Render Camera/IoT Device Insights in Canvas | |
| • Surface Policies & Configuration status via MCP skills | | |

---

## Networking Agents

*Agent infrastructure: MCP Server, A2A protocol, skills and tools exposed to Canvas*

| Beta (Feb 28, 2026) | CA (EoMarch, 2026) | GA (EoJuly, 2026) |
|---------------------|---------------------|-------------------|
| **MCP Server:** | **MCP Server:** | **MCP Server:** |
| • Expose events and alerts skill via ThousandEyes MCP Server | • Expose endpoint metrics skill via ThousandEyes MCP Server | • Provide Internet Insights outage data for external root cause context |
| • Expose path visualization skill via ThousandEyes MCP Server | • Ship instant tests to production for on-demand troubleshooting | • Enable full Golden Prompts coverage per Canvas PRD |
| • Optimize get_path tool response for reduced token count and LLM-friendliness | • Expose Site Health skill for site-level troubleshooting context | |
| | • Expose "Live" Test Info skill (target IP, target network) | |
| **A2A Protocol:** | | |
| • Enable A2A protocol communication between ThousandEyes and Meraki agents | **Widgets:** | |
| | • Move segment grouping logic to MCP Server for cleaner data payloads | |
| | • Surface NetworkVis widget in Canvas with white node support | |

---

## Cisco Identity

| Beta (Feb 28, 2026) | CA (EoMarch, 2026) | GA (EoJuly, 2026) |
|---------------------|---------------------|-------------------|
| • Replace API keys with CUI token-based authentication | • Provision **1M Meraki users** into CUI, expanding Canvas access at scale | |
| • Migrate Alpha customers to CUI tokens + Meraki provisioning | • Support **SAML/IdP user provisioning** in Meraki | |
| • Provision Beta customers in CUI including SAML/IdP users | • Enable **CUI-only login** for Beta customers | |
| • Enable Meraki MCP servers to support CUI tokens | • Deliver **CUI-native login experience** in CA Beta, even when accessing Canvas via Meraki | |

---

## Core AI Canvas

*End-to-end network intelligence: the only view from client to cloud*

| Beta (Feb 28, 2026) | CA (EoMarch, 2026) | GA (EoJuly, 2026) |
|---------------------|---------------------|-------------------|
| **End-to-end path visualization** | **AI-powered root cause** | **Proactive intelligence** |
| • Interactive NetworkVis: every hop from client → AP → WAN → internet → app, clickable and explainable | • "Why is this slow?" answered across domains—AI correlates Meraki congestion with ThousandEyes latency | • Internet Insights: know about ISP/CDN outages before users complain |
| • Path context in every conversation—ask about any segment, get instant analysis | • Wireless Performance troubleshooting with AI-guided remediation | • Predictive alerts: AI detects degradation patterns before they become incidents |
| | | |
| **Network-aware AI** | **Location-aware troubleshooting** | **Enterprise governance** |
| • Canvas AI understands your network topology—not just data, but relationships | • Custom Map widget: see issues geographically, drill into any site | • Full RBAC: control who sees what across ThousandEyes + Meraki |
| • Natural language queries across Meraki + ThousandEyes: "Show me all clients with poor WiFi signal connecting to slow apps" | • Camera/IoT visibility: bring sensor fleet into the same troubleshooting canvas | • Audit trail: every AI interaction logged for compliance |

---

## JIRA Cross-Reference

### ThousandEyes (PR Project)

| Item | JIRA Key | Status | Owner |
|------|----------|--------|-------|
| A2A Communication | [PR-1796](https://thousandeyes.atlassian.net/browse/PR-1796) | OPEN | Hans Ashlock |
| AI Canvas Integration | [PR-1651](https://thousandeyes.atlassian.net/browse/PR-1651) | IN PROGRESS | Hans Ashlock |
| Canvas CA | [PR-1731](https://thousandeyes.atlassian.net/browse/PR-1731) | IN PROGRESS | - |
| ThousandEyes MCP Server (GA) | [PR-1654](https://thousandeyes.atlassian.net/browse/PR-1654) | READY FOR RELEASE | Vikram Narayan |
| Troubleshooting V2 | [PR-1682](https://thousandeyes.atlassian.net/browse/PR-1682) | READY FOR PLANNING | Yuvnesh Modi |
| LLM-based Outage Explanation | [PR-1771](https://thousandeyes.atlassian.net/browse/PR-1771) | DEFINITION | Adam Newman |
| Views Explainability Fast Follow | [PR-1572](https://thousandeyes.atlassian.net/browse/PR-1572) | IN PROGRESS | Yuvnesh Modi |
| Instant Tests | [PR-1762](https://thousandeyes.atlassian.net/browse/PR-1762) | IN PROGRESS | - |

### Meraki (GEN Project)

| Item | JIRA Key | Status | Notes |
|------|----------|--------|-------|
| Alpha APIs → Beta promotion | [GEN-4919](https://meraki.atlassian.net/browse/GEN-4919) | IN PROGRESS | Tracking API maturity for Canvas CA/GA |
| AIC Experiments Tracker | [GEN-5122](https://meraki.atlassian.net/browse/GEN-5122) | IN PROGRESS | Routing accuracy: 73% → 82% |
| Dynamic Widget Selection Tests | [GEN-5310](https://meraki.atlassian.net/browse/GEN-5310) | DONE | MerakiKeyValueTable integration tests |
| AI Canvas side navigation | [GEN-3580](https://meraki.atlassian.net/browse/GEN-3580) | IN REVIEW | Dashboard integration |
| MCP Server load testing | [GEN-5490](https://meraki.atlassian.net/browse/GEN-5490) | CLOSED | Performance validation complete |
| Roaming history API → Beta | [MR-77065](https://meraki.atlassian.net/browse/MR-77065) | - | Unblocking Canvas feature |

---

## Key Language Patterns Applied

| Old Language | New Language |
|--------------|--------------|
| "Contribute Path Visualization to Canvas board" | "Surface Path Visualization in AI Canvas for end-to-end network analysis" |
| "Exposed Multi-Agent Framework covering different Networking Capabilities to Canvas" | "Enable A2A protocol communication between ThousandEyes and Meraki agents" |
| "Connecting the Networking Agents via A2A protocol" | *(merged into above)* |
| "Contributing AIA Eval Framework to Canvas" | "Integrate AIA Eval Framework for response quality measurement" |
| "Integrate Document Search capabilities from AI Assistant into Canvas" | *(kept - already action-oriented)* |
| "Full RBAC for AI Canvas access" | "Leverage full RBAC for AI Canvas access (sharing permissions)" |

---

## Comparison: Before vs After

### Before (Vague Categories)
```
Agentic Architecture:
• Exposed Multi-Agent Framework covering different Networking Capabilities to Canvas
• Connecting the Networking Agents via A2A protocol

Agentic Capabilities:
• Troubleshooting: Client Onboarding, Application Performance Degradation
• Monitoring: Network/Org Overview, Client and Device Insights, Policies & Configuration
```

### After (Specific, Action-Oriented)
```
Networking AI:
• Surface Client Onboarding troubleshooting via Canvas skills
• Expose Application Performance Degradation analysis in Canvas
• Render Network/Org Overview insights in Canvas boards
• Display Client and Device Insights (Wireless/Switching/Routing) in Canvas widgets

Networking Agents:
• Enable A2A protocol communication between ThousandEyes and Meraki agents
• Expose events and alerts skill via ThousandEyes MCP Server
• Expose path visualization skill via ThousandEyes MCP Server
• Optimize get_path tool response for reduced token count
```

---

## Source Documents

- [AI Platform OKRs Q3FY26](https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5614272557)
- [6-Pager - AI Canvas ThousandEyes Agents](https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5050861830)
- [NetworkVis (Network Visualization)](https://thousandeyes.atlassian.net/wiki/spaces/AC/pages/5314445448)
- [AI Canvas - Overview](https://thousandeyes.atlassian.net/wiki/spaces/AC/pages/5360648344)
- [Integration of ThousandEyes Endpoint Agents Data with Cisco AI Canvas](https://thousandeyes.atlassian.net/wiki/spaces/AC/pages/5398462632)
- [6 Pager - Internet Insights Preview for AI Assistant & Canvas](https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5079597060)
