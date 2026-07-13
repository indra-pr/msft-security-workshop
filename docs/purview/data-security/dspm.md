---
title: Data Security Posture Management
description: >-
  Microsoft Purview Data Security Posture Management — discover, protect, and
  investigate sensitive-data risks across your digital estate (preview).
---

# Data Security Posture Management

*Discover, protect, and investigate sensitive-data risks across your whole estate from one data-centric view — set it up and act on it, all on this page.*

## Lab details

| Level | Audience | Estimated time | What you'll build |
|---|---|---|---|
| 200 · Intermediate | Security / Data-security administrator | ~30–60 min (scans take time) | Enabled DSPM with insights and at least one one-click remediation policy |

!!! warning "Preview & evolving"
    DSPM is generally referred to as **preview / evolving**, and there are **classic** versions (DSPM classic and DSPM for AI classic). This page covers the **current** DSPM. Verify capabilities on Microsoft Learn for your tenant.

!!! info "Complexity: Medium · Est. time: ~30–60 min to first insights (analytics scans take time)"
    DSPM is largely **guided** through built-in setup tasks, and it *unifies* other Purview solutions rather than replacing them. Value depends on having foundations (SITs, labels, DLP, Insider Risk) in place first.

## Why this matters

Sensitive data is scattered across Microsoft 365, Azure, and SaaS — and AI makes oversharing riskier. DSPM gives you **one data-centric view** of where the risk is and what to fix first, before you roll out Copilot.

## Overview video

<div class="video-embed">
<iframe src="https://www.youtube-nocookie.com/embed/yxELPt-K9Fk" title="Microsoft Mechanics: Data Security Posture Management" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
<p class="video-caption"><strong>▶ Watch — Stop oversharing: safeguard sensitive data fast with DSPM</strong><br>Microsoft Mechanics · 1:26 — Locate, assess, and prioritize high-risk data across Microsoft and non-Microsoft services with Data Security Posture Management — find sensitive files, spot emerging data risks, and focus remediation where it matters most.</p>

## Introduction

**Microsoft Purview Data Security Posture Management** helps you **discover, protect, and investigate** sensitive-data risks across your **digital estate** — Microsoft 365, Azure, Fabric, and integrated third-party SaaS — for both traditional apps and **AI apps and agents**. Rather than focusing on infrastructure or endpoints, DSPM centers on the **data itself**: where it resides, who can access it, how it's used, and whether it's adequately protected. It continuously scans to identify sensitive data, assess risk, and recommend actions, **consolidating insights** from other Purview solutions (Information Protection, DLP, Insider Risk Management).

```mermaid
flowchart TB
    subgraph Foundations
        SIT[Sensitive info types]
        LBL[Sensitivity labels]
        IRM[Insider Risk]
        DLP[DLP]
    end
    Foundations --> DSPM["DSPM<br/>continuous scan + guided workflows"]
    DSPM --> V[Visibility & risk assessment]
    DSPM --> R[Recommendations → one-click policies]
    DSPM --> INV[Investigate with Security Copilot]
```

!!! tip "When to use DSPM"
    Use DSPM to get a **single, data-centric view** of risk — especially to reduce **oversharing** before rolling out **Microsoft 365 Copilot** and agents, and to prioritize where to apply DLP/labels next.

## Core concepts

| Term | What it means |
|---|---|
| **Data security posture** | A data-centric view of where sensitive data is, who can access it, and how it's protected |
| **Setup task** | A guided task (e.g., *Auditing and analytics*) that turns on DSPM insights |
| **Recommendation** | A suggested action DSPM surfaces — often a one-click DLP/label policy |
| **Oversharing** | Sensitive content accessible more broadly than it should be (key pre-Copilot risk) |
| **DSPM for AI** | Posture management focused on Copilot, agents, and third-party AI apps |
| **Content Explorer** | Browse where classified/labeled content lives (your data inventory) |
| **Activity Explorer** | See actions taken on sensitive data (sharing, labeling, egress) |

## Prerequisites

=== "Licensing"

    DSPM requires **Microsoft 365 E5** or the **Microsoft Purview** suite (formerly Microsoft 365 E5 Compliance), and your **region** must be supported. Monitoring **Copilot/agents** requires users to have a **Microsoft 365 Copilot** license. Confirm on the [service description](https://learn.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-purview-service-description).

=== "Roles"

    Least-privilege roles such as **Purview Compliance Administrator**, **Information Protection Admin**, **Security Administrator**, **Purview Data Security AI Admin**, or **Entra Global Admin**. See [permissions](https://learn.microsoft.com/purview/ai-microsoft-purview-permissions).

=== "Foundations"

    - **Microsoft Purview Audit** enabled (default for new tenants).
    - Built-in/custom **SITs** identified and a **sensitivity labeling** schema configured.
    - Optionally an **Insider Risk Management** program and **Security Copilot** for investigation.
    - For third-party AI sites: onboard devices + install the **Purview browser extension**.

## What you'll accomplish

By the end of this lab you will:

- [x] Seed the estate with labeled / oversharable sensitive content
- [x] Enable **Auditing and analytics** and let DSPM scan
- [x] Review **insights and oversharing** findings in Reports
- [x] Turn a **recommendation** into a one-click policy

## Use cases covered

| # | Use case | Outcome | Time |
|---|---|---|---|
| 1 | **Enable DSPM and review insights** | Populated posture insights + oversharing findings | ~30–60 min (scans take time) |
| 2 | **Verify insights & recommendations** | Confirmed findings + an actionable recommendation | ~15 min |

## Generate lab data

DSPM scans existing content, so seed your tenant with labeled/sensitive data. Reuse the [Information Protection](information-protection/index.md#generate-lab-data) and [DLP](dlp/index.md#generate-lab-data) sample scripts, then upload the files to a few SharePoint sites and OneDrive accounts.

```powershell
# Quick estate seeding: create oversharable sensitive content, then upload to SharePoint/OneDrive.
$lab = Join-Path $env:USERPROFILE 'DSPM-Lab-Data'
New-Item -ItemType Directory -Path $lab -Force | Out-Null
1..3 | ForEach-Object {
    @"
Confidential pricing (LAB #$_)
Synthetic card: 4111 1111 1111 1111
Share scope: (intentionally broad for DSPM oversharing detection)
"@ | Set-Content (Join-Path $lab "pricing-$_.txt")
}
Write-Host "Seeded $lab. Upload these to test SharePoint sites, then let DSPM scan." -ForegroundColor Green
```

!!! note "DSPM auto-scans SharePoint"
    DSPM for AI automatically runs a **weekly data risk assessment** for the **top 100 SharePoint sites** by usage — so oversharing in your seeded sites will surface over time.

## Recommended setup

!!! tip "Do the foundations, then follow setup tasks"
    DSPM is only as insightful as the foundations beneath it. Configure SITs + labels + audit first, then work the built-in **setup tasks** and **one-click policies**.

| Recommendation | Why |
|---|---|
| Enable **Audit + analytics** first | The required initial setup task |
| Turn on **one-click** DSPM-for-AI policies | Fast insight into Copilot/agent data flows |
| Prioritize **oversharing** remediation | Highest risk before Copilot rollout |
| Iterate **monthly** | Review recommendations, update policies |

## Use case 1 — Enable DSPM and review insights

1. In the **[Microsoft Purview portal](https://purview.microsoft.com)**, open **Data Security Posture Management**.
2. Go to **Actions → Setup tasks** and complete the required **Auditing and analytics** task.
3. Optionally create **collection policies** to capture AI interactions, and activate recommended **one-click DSPM for AI** policies.
4. Review the **Overview**, **Reports**, and **Recommendations** as data accumulates (allow **~24 hours** for policy data to appear).
5. Act on recommendations — many generate **DLP/label policies** directly; investigate deeper with **Security Copilot**.

### The four-step deployment model

| Step | Outcome |
|---|---|
| 1. Establish foundations (SITs, labels, IRM, Security Copilot) | Data estate understood |
| 2. Configure access & analytics; start initial scan | DSPM starts pulling insights |
| 3. Understand data landscape & risks | Risks assessed |
| 4. Take action & investigate with Security Copilot | Environment secured |

## Use case 2 — Verify insights & recommendations

1. Confirm the **Auditing and analytics** setup task shows **complete**.
2. After scans run, open **Reports** — you should see sensitive-data insights and **oversharing** findings for your seeded sites.
3. Confirm at least one **recommendation** appears and can be turned into a policy.
4. If enabled, confirm **Copilot/agent** interaction insights appear in the reports.

!!! success "What 'good' looks like"
    DSPM shows your seeded sensitive content, flags oversharing on the test sites, and offers **actionable recommendations** (for example create a DLP policy or apply a label) that you can enact in one click.

## What DSPM helps you assess

Beyond the guided setup above, DSPM is how you answer the questions a data-security evaluation asks. These are the scenarios customers most often want to see:

| Assessment area | What you can see / do | Where |
|---|---|---|
| **Data discovery** | Automatically find sensitive data across Microsoft 365 (SharePoint, OneDrive); add structured databases and multicloud sources by scanning | DSPM reports · [Data Map lab](../data-governance/data-map.md) |
| **Classification** | Detect PII/PCI and **local patterns** (national ID, tax ID, account numbers) with SITs, custom SITs, regex, keyword dictionaries, and EDM | [DLP detection methods](dlp/index.md#how-dlp-detects-sensitive-data) |
| **Labeling coverage** | Auto-apply sensitivity labels after discovery and spot unlabeled sensitive content | [Information Protection lab](information-protection/index.md) |
| **Exposure & oversharing** | Detect publicly/anonymously shared files and external sharing, and score exposure severity | DSPM oversharing assessments · Activity Explorer |
| **Encryption coverage** | See which sensitive content is (un)protected by label encryption and where the gaps are | DSPM recommendations · Information Protection |
| **Data owner & inventory** | Map data owners and build a data inventory / topology | Content Explorer · Unified Catalog |
| **Risk reporting** | Produce an enterprise data-risk baseline and classification-distribution reports | DSPM reports · Content Explorer |

!!! note "Where DSPM ends and Defender / Entra begin"
    DSPM is **data-centric**. Questions about **excessive permissions, dormant or over-privileged identities, attack paths, and cloud-storage/database encryption posture** are answered by **Microsoft Defender for Cloud** (DSPM for Cloud, CSPM, CIEM) and **Microsoft Entra** — pair them with Purview for full coverage.

## Extensibility

- **DSPM for AI** — dedicated posture management for Microsoft 365 Copilot, agents, and third-party AI apps.
- **Security Copilot & the Data Security Posture agent** — AI-assisted investigation (consumes **SCUs**).
- **Third-party SaaS & multicloud** — extend visibility beyond Microsoft 365 (Azure, Fabric, integrated SaaS).
- **One-click policies** — turn recommendations into DLP/label/collection policies.

### Integration requirements

| Integration | Requirement |
|---|---|
| Copilot monitoring | Microsoft 365 Copilot licenses; audit enabled |
| Third-party AI sites | Devices onboarded + Purview browser extension |
| Posture agent | Security Copilot **SCUs** |
| Fabric/Copilot in Fabric | Enterprise Purview data governance + collection policy |

## Industry use cases

=== "Financial services"

    Reduce **oversharing of client and deal data** in SharePoint before enabling Copilot for advisors.

=== "Telecommunication"

    Get a **data-centric risk map** across support, billing, and engineering repositories.

=== "Public sector & SOE"

    Continuously assess exposure of **citizen and national-interest data** and prioritize remediation.

=== "Energy & resources"

    Surface unprotected **IP and operational data** across cloud and SaaS before AI adoption.

=== "Manufacturing & conglomerates"

    Prioritize protection of **designs and trade secrets** by seeing where sensitive data concentrates across BUs.

## Change management & rollout

Never switch new policies on for the whole tenant at once. Roll them out in controlled waves so you protect data **without surprising users or blocking legitimate work**. DSPM insights are read-only, but the policies it recommends (DLP, labels) do change behavior — so apply them one at a time.

| Phase | What you do | Who's affected | Move on when… |
|---|---|---|---|
| **1. Pilot** | Enable **Audit + analytics** (read-only insights); review recommendations without acting. Pick **one** recommendation to trial. | Just admins | Insights populate; one recommended policy validated in simulation |
| **2. Expand** | Apply recommended DLP/label policies **one at a time**, each piloted in simulation before enforcing. | Department(s) | Each policy behaves as expected; oversharing trend improving |
| **3. Tenant-wide** | Roll out validated policies tenant-wide; use DSPM as the prioritization dashboard before enabling Copilot. | All users | Steady state; risk trend improving |
| **4. Operate** | Review the risk trend monthly; act on new recommendations; keep foundations (SITs, labels) current. | Ongoing | — |

!!! tip "Least-disruption levers"
    - **Start in a safe mode:** **read-only insights** first; apply each recommendation via its own simulation.
    - **Communicate first:** share the risk baseline with data owners; agree remediation priorities.
    - **Keep a rollback path:** recommendations are optional — roll back the underlying DLP/label policy if needed.
    - **Log the change:** record scope, approver, and date in your change-management system (e.g., a change ticket).

## Summary & golden rules

- Do the **foundations first** (SITs, labels, audit) — DSPM is only as good as them.
- Enable **Audit + analytics** (the required setup task) before expecting insights.
- Prioritize **oversharing** remediation before enabling Copilot.
- Turn recommendations into **one-click** DLP/label policies; iterate **monthly**.

## Sources

- [Learn about Data Security Posture Management](https://learn.microsoft.com/purview/data-security-posture-management-learn-about)
- [Setup tasks for Data Security Posture Management](https://learn.microsoft.com/purview/data-security-posture-management-setup)
- [Considerations for DSPM (prerequisites)](https://learn.microsoft.com/purview/data-security-posture-management-considerations)
- [Deploy and use DSPM (deployment model)](https://learn.microsoft.com/purview/deploymentmodels/depmod-dspm-intro)
- [Learn about DSPM for AI](https://learn.microsoft.com/purview/dspm-for-ai)
