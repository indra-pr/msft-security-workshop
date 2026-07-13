---
title: Data Security Investigations
description: >-
  Microsoft Purview Data Security Investigations (preview) — use generative AI
  to analyze and respond to data security incidents, risky insiders, and breaches.
---

# Data Security Investigations

*Use generative AI to analyze and respond to data-security incidents, risky insiders, and breaches — enable it and run an investigation, all on this page.*

## Lab details

| Level | Audience | Estimated time | What you'll build |
|---|---|---|---|
| 300 · Advanced | SOC / Data-security administrator | ~60–90 min (+ billing setup) | An enabled DSI instance and an AI-assisted investigation over a staged incident |

!!! warning "Preview feature"
    Microsoft Purview **Data Security Investigations** is in **preview**. Capabilities and prerequisites may change before general availability. Verify details on Microsoft Learn for your tenant.

!!! info "Complexity: High · Est. time: ~60–90 min setup (+ billing configuration)"
    DSI requires **two billing models** (pay-as-you-go storage + capacity/compute units) and careful permissions. The investigation experience itself is AI-assisted and fast, but initial enablement and billing take planning.

## Why this matters

After a data incident, the hardest question is *"what sensitive data was actually involved, and who's impacted?"* DSI uses generative AI to answer that in minutes instead of days of manual review.

## Overview video

<div class="video-embed">
<iframe src="https://www.youtube-nocookie.com/embed/tgnY65zHd8g" title="Microsoft Mechanics: Data Security Investigations" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
<p class="video-caption"><strong>▶ Watch — Data Security Investigations in Microsoft Purview</strong><br>Microsoft Mechanics · 15:20 — Identify what data was actually exposed in a breach — not just where it moved, but what it contains and how sensitive it is. Search massive volumes with natural language, pinpoint the highest-risk content, and connect it to user activity.</p>

## Introduction

**Microsoft Purview Data Security Investigations (DSI)** helps cybersecurity teams harness **generative AI** to **analyze and respond to** data security incidents, risky insiders, and data breaches. DSI quickly identifies risks from sensitive-data exposure, draws connections across impacted data, and helps teams collaborate to remediate — simplifying tasks that are traditionally time-consuming and complex.

```mermaid
flowchart LR
    I["Incident / breach<br/>(reactive) or hygiene (proactive)"] --> D["Create investigation"]
    D --> AI["Generative-AI analysis<br/>of impacted data"]
    AI --> R["Identify risks &<br/>connections"]
    R --> A["Collaborate & remediate"]
```

!!! tip "When to use DSI"
    Use DSI when a **data incident** (leak, breach, risky insider) requires you to understand *what sensitive data was involved* and *who/what is impacted* — faster than manual review. It integrates with **Microsoft Defender XDR** so SOC teams can launch an investigation from an incident.

## Core concepts

| Term | What it means |
|---|---|
| **Investigation** | A workspace where you analyze an incident's impacted data with AI |
| **Impacted data set** | The files/locations pulled in for analysis (e.g., from a Defender incident) |
| **AI analysis** | Generative-AI summarization of risks, sensitive data, and connections |
| **Storage meter (PAYG)** | Pay-as-you-go storage billed via an Azure subscription/resource group |
| **Capacity units** | Dedicated compute for the AI analysis |

## Prerequisites

=== "Licensing & billing"

    DSI uses **both** Purview billing models:

    - **Pay-as-you-go storage meter** — requires an **Azure subscription in the same tenant** and a **resource group**.
    - **Capacity billing** — dedicated **compute units** for AI analysis.

    Confirm plan details on the [service description](https://learn.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-purview-service-description) and [DSI billing](https://learn.microsoft.com/purview/data-security-investigations-billing).

=== "Roles"

    - **Compliance Administrator** and **Organization Management** get **admin + contributor** access automatically.
    - **Data Security Management** and **Insider Risk Management** role groups get **contributor** access.
    - To configure **billing**, you need **Global Administrator** plus resource-group **Owner/Contributor**.

## What you'll accomplish

By the end of this lab you will:

- [x] Configure DSI **billing** (storage meter + capacity) and roles
- [x] Stage an incident data set and create an **investigation**
- [x] Run **AI analysis** to surface sensitive data and impacted entities
- [x] Know how to launch DSI from a **Defender XDR** incident

## Use cases covered

| # | Use case | Outcome | Time |
|---|---|---|---|
| 1 | **Enable DSI and run an investigation** | An AI-analyzed investigation over staged data | ~60–90 min (+ billing) |
| 2 | **Verify findings** | Confirmed sensitive data + impacted entities | ~15 min |

## Generate lab data

Stage a folder of mixed sensitive files that could represent an incident's impacted data. Reuse the [DLP sample-data script](dlp/index.md#generate-lab-data), or run this to create a representative set:

```powershell
$lab = Join-Path $env:USERPROFILE 'DSI-Lab-Data'
New-Item -ItemType Directory -Path $lab -Force | Out-Null

1..3 | ForEach-Object {
    @"
CONFIDENTIAL customer record (LAB) #$_
Name: Test User $_
Card (synthetic): 4111 1111 1111 1111
National ID (synthetic): 900-$_-0000
"@ | Set-Content (Join-Path $lab "record-$_.txt")
}
Write-Host "Staged $((Get-ChildItem $lab).Count) files in $lab" -ForegroundColor Green
```

In practice, DSI investigations often start from data already identified by a **Defender XDR incident**, **DLP alert**, or **Insider Risk** case.

## Recommended setup

!!! tip "Enable billing first, then scope narrowly"
    Configure the **Azure subscription/resource group** and **compute capacity** before your first investigation. Start with a **single, well-scoped incident** to learn the AI analysis workflow.

| Recommendation | Why |
|---|---|
| Reuse an existing Purview Azure subscription | One subscription manages pay-as-you-go across Purview |
| Assign least-privilege roles | Contributor for investigators, admin for owners |
| Start reactive | Investigate one real/simulated incident end to end |

## Use case 1 — Enable DSI and run an investigation

1. In the **[Microsoft Purview portal](https://purview.microsoft.com/dsi)**, open **Data Security Investigations**. On first access, **read and agree** to the Privacy Statement, then **Get started**.
2. **Configure permissions** — use the setup task or the **Role groups** page to grant DSI access (Compliance Administrator / Organization Management for admins).
3. **Configure billing** — complete the **storage meter** (link Azure subscription + resource group) and **capacity** (compute units) setup tasks.
4. **Create an investigation** — add the impacted data set (for example results from a Defender incident or a data location), then run **AI analysis** to summarize risks and connections.
5. **Act** — review AI insights, collaborate with partner teams, and drive remediation.

!!! note "Start from Defender XDR"
    SOC teams with **Security Administrator/Operator** can launch a DSI investigation directly from a **Microsoft Defender** incident where a data set is affected. See [Create investigations in DSI from the Defender portal](https://learn.microsoft.com/defender-xdr/create-dsi-in-defender).

## Use case 2 — Verify findings

1. Confirm DSI shows **billing configured** (storage + capacity) with no setup-task warnings.
2. Create a test investigation over your staged data and run **AI analysis**.
3. Confirm the investigation surfaces the **sensitive information types** present and the **impacted entities**.
4. Confirm assigned users can access per their role (admin vs. contributor).

!!! success "What 'good' looks like"
    A test investigation completes AI analysis, lists the sensitive data found (for example credit-card and national-ID SITs), identifies impacted users, and lets your team collaborate on remediation.

## Extensibility

- **Microsoft Defender XDR integration** — start investigations from SOC incidents.
- **Data Security Posture agent (preview)** — a Security Copilot agent surfaces posture insights within DSI (requires SCUs).
- **Insider Risk Management** — escalate risky-insider cases into an investigation.
- **Security Copilot** — natural-language investigation and summarization.

### Integration requirements

| Integration | Requirement |
|---|---|
| Defender XDR | Security Administrator/Operator; DSI Administrator to view in Purview |
| Posture agent | Security Copilot **SCUs** provisioned |
| Pay-as-you-go | Azure subscription + resource group in the same tenant |

## Industry use cases

=== "Financial services"

    After a suspected leak of client PII, rapidly determine **which records and clients** are impacted for regulator notification timelines.

=== "Telecommunication"

    Investigate a **subscriber-data breach** to scope exposure across support and billing repositories.

=== "Public sector & SOE"

    Assess a **citizen-data incident** with AI-assisted analysis while maintaining strict access controls and auditability.

=== "Energy & resources"

    Scope exposure of **operational or IP data** after a phishing-driven compromise.

=== "Manufacturing & conglomerates"

    Determine whether a compromised account touched **trade-secret designs** across business units.

## Change management & rollout

Never switch a new capability on for the whole tenant at once. Roll it out in controlled waves so you protect data **without surprising users or blowing the budget**. DSI is preview and billed by usage, so pilot with one controlled investigation and tight access before wider use.

| Phase | What you do | Who's affected | Move on when… |
|---|---|---|---|
| **1. Pilot** | Configure **billing** and least-privilege roles; run **one** investigation over a staged/real incident with a small investigator group. | Pilot investigators | Investigation completes; costs and access are understood |
| **2. Expand** | Onboard more investigators and incident types; connect to Defender XDR incidents; set cost guardrails. | SOC team | Repeatable workflow; billing predictable |
| **3. Tenant-wide** | Make DSI the standard tool for in-scope incident types with agreed roles and budget. | All in-scope incidents | Steady state; spend understood |
| **4. Operate** | Monitor consumption; refine access; review investigation outcomes. | Ongoing | — |

!!! tip "Least-disruption levers"
    - **Start in a safe mode:** **one controlled investigation** with least-privilege roles.
    - **Communicate first:** align **SOC, Legal, and privacy**; agree who can launch investigations and on what data.
    - **Keep a rollback path:** restrict roles or pause new investigations; watch spend.
    - **Log the change:** record scope, approver, and date in your change-management system (e.g., a change ticket).

## Summary & golden rules

- Configure **billing** (Azure subscription + compute) before your first investigation.
- Start **reactive** — one real or simulated incident, end to end.
- Assign **least-privilege** roles (contributor for investigators, admin for owners).
- Launch investigations from a **Defender XDR** incident where possible.

## Sources

- [Learn about Data Security Investigations](https://learn.microsoft.com/purview/data-security-investigations)
- [Get started with Data Security Investigations](https://learn.microsoft.com/purview/data-security-investigations-get-started)
- [Billing in Data Security Investigations](https://learn.microsoft.com/purview/data-security-investigations-billing)
- [Data Security Investigations permissions](https://learn.microsoft.com/purview/data-security-investigations-permissions)
- [Create investigations in DSI from the Microsoft Defender portal](https://learn.microsoft.com/defender-xdr/create-dsi-in-defender)
