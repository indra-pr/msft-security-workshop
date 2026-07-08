---
title: Audit
description: >-
  Microsoft Purview Audit (Standard and Premium) — log and search user and
  admin activity across Microsoft 365 for investigations and compliance.
---

# Audit

!!! info "Complexity: Low (Standard) / Medium (Premium) · Est. time: ~20 min (Standard); ~45–60 min (Premium)"
    **Audit (Standard)** is on by default — you mostly assign permissions and search. **Audit (Premium)** adds per-user Advanced Auditing, long-term retention policies, and high-value events, which takes more setup.

## 1. Description

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

## 2. Prerequisites

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

## 3. Generate sample data (audited activity)

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

## 4. Recommended setup

!!! tip "Turn on the high-value events you'll actually need"
    For most orgs, enable **Audit (Premium)** for privileged/at-risk users to capture events like `MailItemsAccessed`, and configure **retention policies** so critical workloads (Entra, Exchange, SharePoint, OneDrive) are kept for **1 year**.

| Recommendation | Why |
|---|---|
| Confirm ingestion is **on** | No log = no investigation |
| Assign **View-Only Audit Logs** to analysts | Least privilege |
| Enable **Advanced Auditing** for key users (Premium) | Captures high-value events |
| Create a **1-year retention policy** for core workloads | Meets common investigation windows |

## 5. Step-by-step configuration

=== "Portal"

    1. In the **[Microsoft Purview portal](https://purview.microsoft.com)**, open **Audit**. If prompted, **turn on** auditing.
    2. Use the **Audit** search form: set a **date range**, **activities**, **users**, and **workloads**, then **Search**.
    3. (Premium) In the **Microsoft 365 admin center → Users → Active users**, open a user → **Licenses and apps** → enable **Microsoft 365 Advanced Auditing**.
    4. (Premium) Create **audit log retention policies** to keep specific record types longer (up to 1 year, or 10 years with the add-on).

=== "PowerShell"

    ```powershell
    Connect-ExchangeOnline -UserPrincipalName admin@contoso.onmicrosoft.com

    # Turn on audit log ingestion if needed.
    Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true

    # Search for a specific user's mailbox access (a high-value Premium event).
    Search-UnifiedAuditLog `
        -StartDate (Get-Date).AddDays(-7) -EndDate (Get-Date) `
        -Operations MailItemsAccessed `
        -UserIds "vip@contoso.onmicrosoft.com"
    ```

## 6. Verification

1. Perform a known action (for example, download a specific test file as a test user).
2. Search the audit log for that **user + activity + time window**.
3. Confirm the matching **audit record** appears with the correct user, operation, and timestamp.
4. **Export to CSV** and confirm the export contains the record.

!!! success "What 'good' looks like"
    Your known test action shows up as an audit record within the search window; exports work; and (Premium) high-value events like `MailItemsAccessed` appear for licensed users.

## 7. Extensibility

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

## 8. Industry use cases

=== "Financial services"

    Investigate access to deal rooms and mailboxes; retain audit records for **1+ year** to meet regulator expectations.

=== "Telco"

    Trace admin changes to provisioning and billing systems during incident response.

=== "Public sector & SOE"

    Provide **transparency and accountability** of user/admin actions for internal reviews and external audits.

=== "Energy & resources"

    Detect unusual access to OT/engineering document libraries via high-value file events.

=== "Manufacturing & conglomerates"

    Correlate cross-BU admin activity when investigating suspected IP access.

## 9. Sources

- [Learn about auditing solutions in Microsoft Purview](https://learn.microsoft.com/purview/audit-solutions-overview)
- [Get started with auditing solutions](https://learn.microsoft.com/purview/audit-get-started)
- [Turn audit log search on or off](https://learn.microsoft.com/purview/audit-log-enable-disable)
- [Search the audit log](https://learn.microsoft.com/purview/audit-search)
- [Audit log activities](https://learn.microsoft.com/purview/audit-log-activities)
