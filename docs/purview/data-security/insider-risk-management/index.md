---
title: Insider Risk Management
description: >-
  A self-contained, follow-along lab: configure Microsoft Purview Insider Risk
  Management, create a departing-users policy, and verify alerts — with privacy
  by design — all on this page.
---

# Insider Risk Management

*Identify, triage, and act on risky user activity (IP theft, data leakage, security violations) — configure it **and** verify it, all on this page, with privacy by design.*

## Lab details

| Level | Audience | Estimated time | What you'll build |
|---|---|---|---|
| 300 · Advanced | Insider Risk / Compliance administrator | ~90 min (analytics scan up to 48 h) | A *Data theft by departing users* policy, plus verified alert triage |

!!! info "Complexity: High · Est. time: ~90 min (analytics up to 48 h)"
    IRM touches **privacy, HR data connectors, and role separation**, and its **analytics scan can take up to 48 hours**. The steps are guided, but plan for stakeholder sign-off (HR, legal, privacy) before you enable anything.

!!! warning "Privacy by design — read first"
    IRM is **built with privacy by design**: users are **pseudonymized by default**, and **role-based access controls** and **audit logs** protect user-level privacy. Insights about an individual can be calculated by administrators, so IRM must be used **in compliance with applicable laws** — involve **HR, legal, and privacy** stakeholders before enabling policies about people.

## Why this matters

Departing employees, accidental oversharing, and malicious insiders are among the hardest risks to catch — the activity often looks legitimate. IRM correlates many weak signals into a clear, prioritized picture, **while protecting employee privacy**.

Common challenges this lab solves:

- "We can't tell when a departing employee is taking data with them."
- "We need to investigate risky activity without exposing everyone's identity."
- "Alerts are too noisy to act on."

## Overview video

<div class="video-embed">
<iframe src="https://www.youtube-nocookie.com/embed/og90Rs8tVUA" title="Microsoft Mechanics: Insider Risk Management" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
<p class="video-caption"><strong>▶ Watch — Insider Risk Management: admin set-up tutorial</strong><br>Microsoft Mechanics · 13:44 — A step-by-step admin walkthrough: enable auditing and analytics, assign roles, tune indicators and intelligent detections across Office, devices, and cloud apps, then build policies from templates and review the matches.</p>

## Introduction

**Microsoft Purview Insider Risk Management (IRM)** correlates signals from **Microsoft 365 and Microsoft Graph** — plus third-party indicators — to help you **identify, triage, and act on** risky user activity.

```mermaid
flowchart LR
    S1["M365 & Graph signals"] --> C
    S2["HR connector<br/>(resignations, terminations)"] --> C
    S3["DLP & Defender signals"] --> C
    C["Insider Risk policies<br/>(templates + thresholds)"] --> A["Alerts"]
    A --> T["Triage & investigate<br/>(pseudonymized)"]
    T --> R["Act: notify · escalate · case · eDiscovery"]
```

!!! tip "Real-world example"
    An engineer resigns. The HR feed flags them as a **departing user**; over the next two weeks IRM notices unusual **copy-to-USB** and **personal-cloud upload** activity on priority content. An analyst triages the (pseudonymized) alert, opens a case, and escalates to legal hold.

## Core concepts

| Term | What it means |
|---|---|
| **Policy template** | A scenario-tuned starting point (*Data theft by departing users*, *Data leaks*, *Security violations*) |
| **Indicators & thresholds** | The signals a policy watches, and how much activity triggers an alert |
| **Analytics** | A no-policy scan that estimates risk and recommends thresholds |
| **Alert → Case** | Triage alerts, then open a case for deeper investigation and action |
| **Adaptive Protection** | Feeds a user's risk level to DLP and Conditional Access |

## Prerequisites

=== "Licensing"

    Offered in several subscriptions — **Microsoft 365 E5**, the **Microsoft Purview** suite (formerly M365 E5 Compliance), and **Microsoft 365 A5** (education). IRM is available in tenants hosted in **regions supported by its Azure dependencies**. See [Subscriptions and licensing](https://learn.microsoft.com/purview/insider-risk-management-configure#subscriptions-and-licensing).

=== "Roles & role groups"

    IRM uses **six role groups** for separation of duties:

    | Role group | Typical use |
    |---|---|
    | **Insider Risk Management** | Full access (super-user) |
    | **Insider Risk Management Admins** | Configure policies & settings |
    | **Insider Risk Management Analysts** | Investigate alerts & cases (no forensic evidence) |
    | **Insider Risk Management Investigators** | Investigate + forensic evidence + Content Explorer |
    | **Insider Risk Management Auditors** | View/export audit logs |
    | **Insider Risk Management Approvers** | Approve forensic evidence capture requests |

    To first make **Insider Risk Management** appear in the portal, be a **Global Administrator or Compliance Administrator**, or a member of **Organization Management**, **Insider Risk Management**, or **Insider Risk Management Admins**.

=== "Connectors & dependencies"

    - **HR connector** — for *Data theft by departing users*, configure the **[Microsoft 365 HR connector](https://learn.microsoft.com/purview/import-hr-data)** to import resignation/termination dates.
    - **DLP policy** — for *Data leaks*, you need at least one **DLP policy**.
    - **Audit** — ensure auditing is on so activities are captured.

## What you'll accomplish

By the end of this lab you will:

- [x] Enable IRM: permissions, **HR connector**, analytics, indicators
- [x] Create a **Data theft by departing users** policy and triage an alert
- [x] Add **Data leaks** and **Security policy violations** policies
- [x] Turn on **Adaptive Protection** to make DLP/access risk-based

## Use cases covered

Each use case is one way to implement Insider Risk Management, walked through as **preconfig → configure → validate**:

| # | Surface | What you configure | Time |
|---|---|---|---|
| 1 | **Enable IRM & foundations** | Permissions, HR connector, analytics, indicators | ~60 min |
| 2 | **Data theft by departing users** | HR-triggered exfiltration policy | ~30 min |
| 3 | **Data leaks** | DLP-driven sensitive-data policy | ~30 min |
| 4 | **Security policy violations** | Defender-for-Endpoint-driven policy | ~30 min |
| 5 | **Adaptive Protection** | Risk-based DLP & Conditional Access | ~30 min |

---

## Generate lab data

The *Data theft by departing users* template relies on an HR feed of leavers. This script produces a **representative CSV** of synthetic employees with resignation dates.

!!! warning "Match your connector mapping"
    Column names must match the **field mapping** you define when you set up the HR connector. Adjust columns to your mapping — see [Import data with the HR connector](https://learn.microsoft.com/purview/import-hr-data).

```powershell
# Generate a synthetic HR "leavers" CSV for the Data theft by departing users template.
$lab = Join-Path $env:USERPROFILE 'IRM-Lab-Data'
New-Item -ItemType Directory -Path $lab -Force | Out-Null

$today = Get-Date
$rows = 1..5 | ForEach-Object {
    [pscustomobject]@{
        EmployeeId       = "user{0}@contoso.onmicrosoft.com" -f $_
        ResignationDate  = $today.AddDays(-$_).ToString('yyyy-MM-ddTHH:mm:ssZ')
        LastWorkingDate  = $today.AddDays(14 - $_).ToString('yyyy-MM-ddTHH:mm:ssZ')
        EffectiveDate    = $today.AddDays(-$_).ToString('yyyy-MM-ddTHH:mm:ssZ')
    }
}
$csv = Join-Path $lab 'hr-leavers.csv'
$rows | Export-Csv -Path $csv -NoTypeInformation -Encoding UTF8
Write-Host "Wrote $csv" -ForegroundColor Green
Get-Content $csv
```

To also generate *activity* to detect, reuse the [DLP sample-data script](../dlp/index.md#generate-lab-data) and have a test "departing" user copy those files to a USB drive or personal cloud location on an onboarded device.

## Recommended first policy

Microsoft Learn recommends running **analytics first** — it scans for potential insider risks **without any policy configured** and recommends thresholds, so your first real policy is well-tuned instead of noisy.

```mermaid
flowchart TB
    A["Run analytics<br/>(no policy needed)"] --> B["Review insights &<br/>threshold recommendations"]
    B --> C["Create ONE policy from a template"]
    C --> D["Apply recommended thresholds"]
    D --> E["Triage, tune, expand"]
```

!!! tip "A high-value, privacy-respecting start"
    Begin with **Data theft by departing users** — concrete, time-bounded (tied to resignation/last-working dates), and easy to explain to stakeholders.

| Setting | Recommended start | Why |
|---|---|---|
| **Template** | **Data theft by departing users** | Focused, HR-triggered, high signal |
| **Prerequisite** | Microsoft 365 **HR connector** configured | Supplies resignation/termination dates |
| **Users in scope** | A **pilot group** | Limit blast radius while you learn |
| **Indicators** | **File exfiltration** (download, copy to USB, copy to personal cloud, print) | Core departing-user risks |
| **Thresholds** | **Analytics-recommended** | Reduces false positives |
| **Privacy** | Keep **pseudonymization on** (default) | Protects user identity during triage |

---

## Use case 1 — Enable Insider Risk Management & foundations

*Turn IRM on, connect HR data, and let analytics recommend thresholds — the base every policy builds on.*

### Preconfig

You need **Global/Compliance Administrator** (or Organization Management) to see IRM, plus your synthetic [HR leavers CSV](#generate-lab-data).

### Configure

**Assign permissions**

1. **Settings → Roles & scopes → Role groups** — add people to the IRM role groups (Admins, Analysts, Investigators, Auditors, Approvers). Allow up to **30 minutes**.

![Insider Risk Management configuration steps](https://learn.microsoft.com/purview/media/ir-solution-ir-steps.png){ loading=lazy }

*Image source: [Insider Risk Management solution overview](https://learn.microsoft.com/purview/insider-risk-management-solution-overview).*

**Connect HR data**

2. **Data connectors → Connectors** → create a **Microsoft 365 HR** connector, define the **field mapping** to match your [sample CSV](#generate-lab-data), and import it — see [Import HR data](https://learn.microsoft.com/purview/import-hr-data).

**Enable analytics & indicators**

3. **Insider Risk Management → Analytics** → **turn on analytics** (results can take up to **48 hours**); note the **recommended thresholds**.
4. **Settings** — keep **pseudonymization** on; under **Policy indicators**, enable **file exfiltration** indicators (download, USB, personal cloud, print); optionally define **priority content**.

### Validate the config

1. Confirm **Insider Risk Management** appears for role-group members.
2. Confirm the **HR connector** shows imported records and **analytics** is running/complete.
3. Confirm your indicators and privacy settings are saved.

---

## Use case 2 — Data theft by departing users (policy)

*The highest-signal starting policy — tie exfiltration to resignation / last-working dates.*

### Preconfig

Use case 1 complete (permissions, HR connector, analytics, indicators), and a **pilot group** of users.

### Configure

1. **Insider Risk Management → Policies → ＋ Create policy** → **Data theft by departing users**. **Next**.
2. **Name** it, choose the **pilot group** in scope. **Next**.
3. Confirm the **HR connector** dependency is satisfied.
4. Select **priority content** and **indicators**, apply the **analytics-recommended thresholds**. **Next → Submit**.

### Validate the config

1. Mark a test user as a **leaver** (import the [HR CSV](#generate-lab-data)); on an **onboarded device**, have that user copy [DLP sample files](../dlp/index.md#generate-lab-data) to USB / personal cloud.
2. **Insider Risk Management → Alerts** — confirm an **alert** with the expected indicators and severity.
3. Open it (pseudonymized user + activity timeline), **triage** (Confirm/Dismiss), and optionally **create a case**.

!!! warning "Interpret responsibly"
    IRM insights are a **starting point** for investigation, not a verdict. Conduct a full, lawful investigation and involve HR/legal before any employment action.

---

## Use case 3 — Data leaks (policy)

*Detect risky sharing/exfiltration of sensitive content — driven by DLP and priority content.*

### Preconfig

Use case 1 foundations, plus **at least one DLP policy** (see the [DLP lab](../dlp/index.md)) so IRM can consume high-severity DLP signals.

### Configure

1. **Policies → ＋ Create policy** → **Data leaks**. **Next**.
2. Choose whether to trigger on a **DLP policy** (high-severity alerts) or on **user activities**; select the **DLP policy** and scope the users.
3. Set **priority content** (sites / *Highly Confidential* labels) and indicators; apply recommended thresholds. **Submit**.

### Validate the config

1. Have a scoped user trigger a **high-severity DLP** event on priority content.
2. Confirm a **Data leaks** alert appears in IRM with the linked DLP activity, then triage it.

---

## Use case 4 — Security policy violations (policy)

*Correlate endpoint security alerts with data risk using Microsoft Defender for Endpoint.*

### Preconfig

Use case 1 foundations, and **Microsoft Defender for Endpoint** onboarded with Defender ↔ Purview signal-sharing turned on.

### Configure

1. **Policies → ＋ Create policy** → the **Security policy violations** template that fits (e.g., *by departing / risky users*). **Next**.
2. Scope users and confirm **Defender for Endpoint** indicators (malware, unwanted software, security-control tampering). **Submit**.

### Validate the config

1. Generate a benign **Defender for Endpoint** test detection on a scoped device.
2. Confirm the signal surfaces as an IRM **alert** and triage it.

---

## Use case 5 — Adaptive Protection (risk-based DLP & access)

*Let a user's calculated risk level dynamically tighten DLP and Conditional Access — strong controls only for higher-risk users.*

### Preconfig

Live IRM policies (Use cases 2–4) and a **DLP policy** (and/or Conditional Access) you can scope to risk levels.

### Configure

1. **Insider Risk Management → Adaptive Protection** → turn it on.
2. Map **insider-risk levels** (Elevated / Moderate / Minor) to **DLP policy** actions (e.g., Elevated = block, Moderate = warn) and/or **Conditional Access** controls. See [Adaptive Protection](https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection).

### Validate the config

1. Drive a test user to an **Elevated** risk level (repeated exfiltration signals).
2. Confirm the mapped **DLP/CA** control tightens for that user, and relaxes as risk decreases.

## Governance guardrails

- Involve **HR, legal, and privacy** before enabling policies about people.
- Keep at least one member in the **Insider Risk Management** or **Insider Risk Management Admins** role group to avoid a "zero administrator" state.
- Document your **investigation process** — analytics alone isn't a basis for employment decisions.

## Extensibility

- **[Adaptive Protection](https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection)** — a user's risk level dynamically drives **DLP** actions and **Conditional Access**.
- **Third-party indicators & connectors** — import non-Microsoft signals via the HR connector and other [data connectors](https://learn.microsoft.com/purview/archive-third-party-data).
- **Microsoft Defender for Endpoint** — security-violation signals feed IRM policies.
- **eDiscovery escalation** — escalate a case to eDiscovery for legal hold and review.
- **Agent monitoring** — IRM can help [monitor AI agent activity](https://learn.microsoft.com/purview/insider-risk-management-monitoring-agents).

| Integration | Requirement |
|---|---|
| HR connector | Configured Microsoft 365 HR connector + mapped CSV feed |
| Data leaks template | At least one DLP policy |
| Security violations template | Microsoft Defender for Endpoint signals |
| Adaptive Protection | IRM policies live; DLP and/or Conditional Access configured |
| Forensic evidence | Investigator role + Approver sign-off; device onboarding |

## Industry use cases

=== "Financial services"

    Detect a departing **trader or analyst** exfiltrating client lists or models before joining a competitor; escalate to a case and legal hold.

=== "Telecommunication"

    Surface **mass export of subscriber data** by an agent, correlating DLP high-severity matches with unusual download volume.

=== "Public sector & SOE"

    Monitor for **leakage of citizen or national-interest data**, with strict pseudonymization and auditor oversight.

=== "Energy & resources"

    Catch **IP theft of seismic, reservoir, or plant-design data** by departing engineers on field or plant workstations.

=== "Manufacturing & conglomerates"

    Identify **trade-secret and CAD exfiltration** across business units; use Adaptive Protection to tighten DLP for elevated-risk users.

## Change management & rollout

Never switch a new policy on for the whole tenant at once. Roll it out in controlled waves so you protect data **without surprising users or blocking legitimate work**. IRM handles sensitive people-signals, so privacy and scope discipline matter as much as the rollout mechanics.

| Phase | What you do | Who's affected | Move on when… |
|---|---|---|---|
| **1. Pilot** | Start with **Analytics** (aggregated, de-identified) to size risk; then create one narrowly-scoped policy with **pseudonymization on**. | Pilot scope | Analytics shows meaningful signals; policy alerts are reviewable, not noisy |
| **2. Expand** | Add policy templates and scopes gradually; involve HR/Legal reviewers; keep role-based access tight. | Department(s) | Triage workflow works; stakeholders aligned |
| **3. Tenant-wide** | Extend policies to the intended population with agreed **privacy controls and approvals** in place. | Intended population | Steady state; alerts understood |
| **4. Operate** | Tune thresholds; review analytics and re-baseline; audit reviewer access periodically. | Ongoing | — |

!!! tip "Least-disruption levers"
    - **Start in a safe mode:** **Analytics** and **pseudonymization** before named-user policies.
    - **Communicate first:** coordinate with **HR, Legal, and privacy**; document the lawful basis and reviewer roles.
    - **Keep a rollback path:** pause or delete a policy; keep scopes minimal and privacy settings on.
    - **Log the change:** record scope, approver, and date in your change-management system (e.g., a change ticket).

## Summary & golden rules

You configured permissions, connectors, analytics, and a departing-user policy — and verified end-to-end triage, all from this page.

- **Analytics first** — tune thresholds before your first policy so it isn't noisy.
- **One template, pilot scope** — start focused, expand later.
- **Privacy by design** — keep pseudonymization on; involve HR/legal.
- **Never act on an alert alone** — investigate fully before any decision.
- **Pair with Adaptive Protection** to auto-tighten DLP for elevated-risk users.

## Sources

- [Insider Risk Management (solution overview)](https://learn.microsoft.com/purview/insider-risk-management-solution-overview)
- [Get started with Insider Risk Management](https://learn.microsoft.com/purview/insider-risk-management-configure)
- [Plan for Insider Risk Management](https://learn.microsoft.com/purview/insider-risk-management-plan)
- [Assign permissions in Insider Risk Management](https://learn.microsoft.com/purview/insider-risk-management-permissions)
- [Import data with the HR connector](https://learn.microsoft.com/purview/import-hr-data)
- [Insider Risk Management analytics](https://learn.microsoft.com/purview/insider-risk-management-settings-analytics) · [Policy indicators](https://learn.microsoft.com/purview/insider-risk-management-settings-policy-indicators)
- [Adaptive Protection](https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection) · [Monitoring agents](https://learn.microsoft.com/purview/insider-risk-management-monitoring-agents)
