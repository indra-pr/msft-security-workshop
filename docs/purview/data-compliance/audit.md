---
title: Audit
description: >-
  Microsoft Purview Audit (Standard and Premium) — log and search user and
  admin activity across Microsoft 365 for investigations and compliance.
---

# Audit

*Log and search user and admin activity across Microsoft 365 — turn on auditing, run a search, and read the results, all on this page.*

## Lab details

| Level | Audience | Estimated time | What you'll build |
|---|---|---|---|
| 100 · Foundational | Compliance / security administrator | ~1.5 hrs (all 3 surfaces); ~20 min for Standard | A permissioned audit search that returns real activity events |

!!! info "Complexity: Low (Standard) / Medium (Premium) · Est. time: ~1.5 hrs total (all 3 surfaces); ~20 min for a Standard search"
    **Audit (Standard)** is on by default — you mostly assign permissions and search. **Audit (Premium)** adds per-user Advanced Auditing, long-term retention policies, and high-value events, which takes more setup.

## Why this matters

When something goes wrong — a leak, a config change, a suspicious sign-in — the first question is *who did what, when?* Audit is the system of record that answers it, and it only helps if it's turned on **before** the incident.

## Overview video

<div class="video-embed">
<iframe src="https://www.youtube-nocookie.com/embed/G25gyBW6L5Q" title="Microsoft Security: Microsoft 365 Advanced Auditing" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
<p class="video-caption"><strong>▶ Watch — Microsoft 365 Advanced Auditing for forensic &amp; compliance investigations</strong><br>Microsoft Security · 13:54 — How Advanced Auditing supports forensic and compliance investigations: high-value events, longer retention, and the audit data you need to answer who did what, where, and when.</p>

## Introduction

**Microsoft Purview Audit** lets you **log and search** the activities that users and admins perform across Microsoft 365 services — to support **forensic, IT, compliance, and legal** investigations. It comes in two tiers:

| | Audit (Standard) | Audit (Premium) |
|---|---|---|
| Enabled by default | ✅ | ✅ |
| Thousands of searchable events | ✅ | ✅ |
| Audit search tool + Graph API + `Search-UnifiedAuditLog` | ✅ | ✅ |
| Default retention | **180 days** | **1 year** (up to **10 years** with add-on) |
| High-value events (e.g. `MailItemsAccessed`, `SendOnBehalf`, `SearchQueryInitiated`) | | ✅ |
| Custom audit **retention policies** & intelligent insights | | ✅ |

!!! tip "When to use Audit"
    Use Audit to answer "**who did what, where, and when**" — investigating a suspected compromise, a data-access question, or supporting an eDiscovery/insider-risk case.

## Core concepts

| Term | What it means |
|---|---|
| **Unified audit log** | The single searchable log of user/admin activity across Microsoft 365 |
| **Audit (Standard)** | On by default; ~180-day retention; thousands of events |
| **Audit (Premium)** | High-value events, longer retention, custom retention policies (E5) |
| **Record type / operation** | The activity category (e.g., `SharePointFileOperation`, `MailItemsAccessed`) |
| **Retention policy** | A rule that keeps specific record types longer (Premium) |

## Prerequisites

=== "Licensing"

    Audit (Standard) is included with most enterprise Microsoft 365/Office 365 subscriptions. **Audit (Premium)** features (high-value events, long retention) require an **E5** license (or an **Audit** add-on) and the **Microsoft 365 Advanced Auditing** service plan enabled per user. Confirm on the [service description](https://learn.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-purview-service-description).

=== "Roles"

    To search, you need the **Audit Logs** or **View-Only Audit Logs** role in the Microsoft Purview portal (or Exchange admin center for cmdlets). Follow least privilege.

=== "Verify auditing is on"

    Audit log search is on by default. Verify in **Exchange Online PowerShell**:

    ```powershell
    Get-AdminAuditLogConfig | Format-List UnifiedAuditLogIngestionEnabled
    # True = audit log search is on
    ```

## What you'll accomplish

By the end of this lab you will:

- [x] Confirm audit logging is **on** and run a **Standard** search
- [x] Verify a known action appears as a record and export it
- [x] Enable **Premium** advanced auditing + a retention policy
- [x] Stream audit data to a **SIEM** (Sentinel)

## Use cases covered

Each use case is one way to implement Audit, walked through as **preconfig → configure → validate**:

| # | Surface | What you configure | Time |
|---|---|---|---|
| 1 | **Audit (Standard) search** | Permissioned search of the unified audit log | ~20 min |
| 2 | **Audit (Premium)** | Advanced auditing + retention policies | ~45 min |
| 3 | **Export / SIEM streaming** | Management Activity API / Graph → Sentinel | ~30 min |

## Generate lab data

Create some activity to find, then search for it. Run a couple of benign audited actions (for example, view/download a file in SharePoint/OneDrive), then query the log.

```powershell
# Connect and search the unified audit log for recent activity (Exchange Online PowerShell).
Connect-ExchangeOnline -UserPrincipalName admin@contoso.onmicrosoft.com

# Look at file/page activity in the last 24 hours.
Search-UnifiedAuditLog `
    -StartDate (Get-Date).AddDays(-1) `
    -EndDate (Get-Date) `
    -RecordType SharePointFileOperation `
    -ResultSize 50 |
    Select-Object CreationDate, UserIds, Operations |
    Format-Table -AutoSize
```

To generate specific activity, sign in as a test user and view/download a document, or send an email — then re-run the search filtered by that user.

## Recommended setup

!!! tip "Turn on the high-value events you'll actually need"
    For most orgs, enable **Audit (Premium)** for privileged/at-risk users to capture events like `MailItemsAccessed`, and configure **retention policies** so critical workloads (Entra, Exchange, SharePoint, OneDrive) are kept for **1 year**.

| Recommendation | Why |
|---|---|
| Confirm ingestion is **on** | No log = no investigation |
| Assign **View-Only Audit Logs** to analysts | Least privilege |
| Enable **Advanced Auditing** for key users (Premium) | Captures high-value events |
| Create a **1-year retention policy** for core workloads | Meets common investigation windows |

## Use case 1 — Audit (Standard) search

*Investigate a suspected mailbox compromise by searching the unified audit log for who accessed, sent, or exported a user's mail — the always-on baseline for "who did what, when".*

### Preconfig

**Audit (Standard)** is on by default; assign least-privilege **Audit Logs** / **View-Only Audit Logs** roles. Generate some [audited activity](#generate-lab-data).

### Configure

=== "Portal"

    1. **[Microsoft Purview portal](https://purview.microsoft.com)** → **Audit**. If prompted, **turn on** auditing.
    2. Set a **date range**, **activities**, **users**, and **workloads**, then **Search**.

=== "PowerShell"

    ```powershell
    Connect-ExchangeOnline -UserPrincipalName admin@contoso.onmicrosoft.com
    Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true
    Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-1) -EndDate (Get-Date) `
        -RecordType SharePointFileOperation -ResultSize 50
    ```

### Validate

1. Perform a known action (e.g., download a test file as a test user).
2. Search for that **user + activity + time window** and confirm the **record** appears.
3. **Export to CSV** and confirm it contains the record.

---

## Use case 2 — Audit (Premium) — advanced auditing & retention

*Turn on high-value events like **MailItemsAccessed** and keep logs for a year (or up to ten) so you can reconstruct a breach discovered months after it happened.*

### Preconfig

**E5** (or an Audit add-on) and the **Advanced Auditing** service plan.

### Configure

1. **Microsoft 365 admin center → Users → Active users** → open a user → **Licenses and apps** → enable **Microsoft 365 Advanced Auditing** for privileged/at-risk users.
2. In **Purview → Audit**, create **audit log retention policies** to keep specific record types longer (up to 1 year, or 10 years with the add-on).

### Validate

1. As a licensed user, generate a high-value event (e.g., access a mailbox item).
2. Search for `MailItemsAccessed` and confirm it appears.
3. Confirm your **retention policy** is listed and applied to the core workloads.

---

## Use case 3 — Export / SIEM streaming

*Stream audit events into **Microsoft Sentinel** so the SOC can correlate them with other signals and hunt across long-term analytics.*

### Preconfig

A **registered app** with the right permissions (Graph / Office 365 Management Activity API), or the **Microsoft Sentinel** connector.

### Configure

1. Choose an export path: **Audit Search Graph API**, the **Office 365 Management Activity API**, or the **Microsoft 365 connector in Sentinel**.
2. Subscribe to the relevant **content types** and point them at your SIEM/SOAR.

### Validate

1. Trigger an audited action.
2. Confirm the event arrives in your **SIEM** (e.g., a Sentinel table) with the expected fields.

## Extensibility

- **Audit Search Graph API** — programmatic access to the audit search experience via [Microsoft Graph](https://learn.microsoft.com/graph/api/resources/security-api-overview).
- **Office 365 Management Activity API** — stream audit data to SIEM/SOAR (for example, **Microsoft Sentinel**).
- **`Search-UnifiedAuditLog`** — script recurring investigations.
- **AI/non-Microsoft data auditing** — pay-as-you-go billing extends auditing to some generative-AI interactions.

### Integration requirements

| Integration | Requirement |
|---|---|
| Graph audit API | Graph permissions; appropriate roles |
| Management Activity API / Sentinel | Registered app + subscription to content types |
| Premium events | E5 + Advanced Auditing service plan |

## Industry use cases

=== "Financial services"

    Investigate access to deal rooms and mailboxes; retain audit records for **1+ year** to meet regulator expectations.

=== "Telecommunication"

    Trace admin changes to provisioning and billing systems during incident response.

=== "Public sector & SOE"

    Provide **transparency and accountability** of user/admin actions for internal reviews and external audits.

=== "Energy & resources"

    Detect unusual access to OT/engineering document libraries via high-value file events.

=== "Manufacturing & conglomerates"

    Correlate cross-BU admin activity when investigating suspected IP access.

## Change management & rollout

Roll this out in controlled waves rather than flipping everything on at once. Auditing is low-disruption (it logs, it doesn't block), so rollout is mostly about coverage, permissions, and retention.

| Phase | What you do | Who's affected | Move on when… |
|---|---|---|---|
| **1. Pilot** | Confirm **Audit (Standard)** is on; assign **least-privilege** search roles to a pilot analyst; trial **Premium** on a few key users. | Pilot analysts | Searches return expected events; roles scoped correctly |
| **2. Expand** | Enable **Advanced Auditing** for privileged/at-risk users; add retention policies for core workloads. | Key user groups | High-value events captured; retention meets needs |
| **3. Tenant-wide** | Standardize retention and access across the tenant; wire audit into SIEM if needed. | All workloads | Steady state; coverage understood |
| **4. Operate** | Review coverage and retention regularly; adjust as workloads and obligations change. | Ongoing | — |

!!! tip "Least-disruption levers"
    - **Start in a safe mode:** no user impact — validate **permissions and coverage** in a pilot before broad reliance.
    - **Communicate first:** inform SecOps/compliance who can search and what's retained (privacy/works-council as required).
    - **Keep a rollback path:** adjust roles or retention; disabling audit is rarely advisable.
    - **Log the change:** record scope, approver, and date in your change-management system (e.g., a change ticket).

## Summary & golden rules

- Confirm **Audit (Standard)** is on and assign the **least-privilege** search roles.
- Search by **activity, user, and date range** — not everything at once.
- For long retention and high-value events, plan **Audit (Premium)**.
- Treat the audit log as **evidence**: export and preserve what matters.

## Sources

- [Learn about auditing solutions in Microsoft Purview](https://learn.microsoft.com/purview/audit-solutions-overview)
- [Get started with auditing solutions](https://learn.microsoft.com/purview/audit-get-started)
- [Turn audit log search on or off](https://learn.microsoft.com/purview/audit-log-enable-disable)
- [Search the audit log](https://learn.microsoft.com/purview/audit-search)
- [Audit log activities](https://learn.microsoft.com/purview/audit-log-activities)
