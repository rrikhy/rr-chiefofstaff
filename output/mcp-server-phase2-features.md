# MCP Server Phase 2 - Feature Roadmap

**Source**: [MCP Server Phase 2 Confluence Page](https://thousandeyes.atlassian.net/wiki/spaces/PROD/pages/5484544081/MCP+Server+Phase+2)  
**Generated**: January 12, 2026

---

## Q3 FY26 (Feb 1 - Apr 30, 2026) — Foundation

| Feature | Description | Key Capabilities |
|---------|-------------|------------------|
| **CEA Instant Tests** | Run instant tests with intelligent agent selection | Agent suggestions based on location/load, troubleshooting context |
| **CEA Test Management** | Create, modify, search, and delete tests via natural language | CRUD operations, search/filter, safe deletion with impact analysis |
| **EPA Instant Tests with Context** | Run endpoint tests with visibility into device state | CPU, network, roaming status; user-targeted troubleshooting |
| **EPA Agent Discovery & Labels** | Find and organize endpoints by carrier, location, or custom criteria | "Find mobile users on AT&T", location labels, label queries |
| **Agent Fleet Visibility** | View agent health, versions, and utilization across the fleet | Version tracking, utilization hotspots, config validation |

**Q3 Delivery: 5 Features**

---

## Q4 FY26 (May 1 - Jul 31, 2026) — Intelligence & Bulk Operations

| Feature | Description | Key Capabilities |
|---------|-------------|------------------|
| **Bulk Test Updates** | Modify test intervals, proxies, or settings across many tests at once | Pattern-based selection, incident response workflows |
| **Test Templates & Recommendations** | Suggest tests based on environment and agent types | Template library, complementary test suggestions |
| **Automated Test Labeling** | Apply labels based on naming patterns or network paths | "Label all 'phx' tests as Phoenix", network-path labeling |
| **EPA Stale Detection & Bulk Ops** | Find agents not checking in; bulk disable by location or criteria | Staleness threshold, "disable endpoints on 3rd floor" |
| **Agent Lifecycle Operations** | Enable, disable, delete agents; update proxy and module settings | Bulk operations, dead agent cleanup |

**Q4 Delivery: 5 Features**

---

## Q1 FY27 (Aug 1 - Oct 31, 2026) — Cloud & Routing

| Feature | Description | Key Capabilities |
|---------|-------------|------------------|
| **Cloud Insights Setup & Deployment** | Configure integrations and deploy agents to AZs/VPCs | Auto-configuration, multi-cloud discovery, traffic rules |
| **Cloud Traffic Troubleshooting** | Isolate inter-AZ issues and configuration problems | LB/FW misconfiguration detection, anomaly detection |
| **BGP & Route Monitoring** | Monitor AS numbers, detect zombie routes and misconfigurations | Upstream transit, route health validation |
| **Agent Cluster Maintenance** | Move tests for patching; rebalance clusters afterward | Maintenance mode, test migration, cluster optimization |

**Q1 Delivery: 4 Features**

---

## Q2 FY27 (Nov 1, 2026 - Jan 30, 2027) — Analytics & Platform

| Feature | Description | Key Capabilities |
|---------|-------------|------------------|
| **Branch Traffic Analysis** | Analyze traffic at locations; identify causes and user impact | Traffic attribution, slowness diagnosis, impact count |
| **HTTP Error Root Cause Analysis** | Parse headers and logs to identify fault domains | Header analysis, log parsing, attribution (e.g., Cloudflare vs origin) |
| **Connected Devices Integration** | Query and monitor connected devices (scope TBD) | Collaboration with Sam Goodman/Sergio |
| **MCP Protocol Enhancements** | Implement sampling, elicitation, and interactive UIs | MCP spec alignment |

**Q2 Delivery: 4 Features**

---

## Future / Backlog (Q3 FY27+)

| Feature | Description | Dependencies |
|---------|-------------|--------------|
| **Device Layer Analysis** | Identify device-level congestion and bottlenecks | Pending Traffic Insights rebuild |
| **Enterprise-Scale Search** | Query across 10k+ tests and subaccounts | Foundation features |
| **Multi-Language Support** | Queries and responses in Mandarin, Spanish, German, etc. | Platform maturity |
| **Workflow Automation** | Pre-built agents for common operational patterns | All domains |

---

## Summary

| Quarter | Features | Theme |
|---------|----------|-------|
| Q3 FY26 | 5 | Test execution & agent visibility |
| Q4 FY26 | 5 | Bulk operations & templates |
| Q1 FY27 | 4 | Cloud & routing |
| Q2 FY27 | 4 | Traffic analytics & platform |
| Future | 4 | Scale & automation |
| **Total** | **22** | |

---

## Stakeholders

| Domain | Contact |
|--------|---------|
| Routing | Kemal (Research), Arun (PM) |
| Cloud Insights | Alistair Scott |
| Traffic Insights | Sergio Diaz Miguel Coca |
| Connected Devices | Sam Goodman, Sergio |
| Device Layer | Traffic Insights Team (pending rebuild) |

---

## Key Customer Feedback Incorporated

**HSBC (via Prab)**
- Global search across 10k+ tests and subaccounts
- Multi-language support for global L1 teams
- MCP as "global search function" for TE

**Atlassian**
- HTTP header/log analysis for root cause (Cloudflare outage example)
- Fault domain attribution from error data
