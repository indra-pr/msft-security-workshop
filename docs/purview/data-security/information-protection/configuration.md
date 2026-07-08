---
title: Information Protection — Part 2 · Step-by-step configuration
description: >-
  Create a sensitivity label taxonomy, add protection, and publish a label
  policy in the Microsoft Purview portal or with PowerShell.
---

# Information Protection — Part 2

!!! abstract "Step 2 of 3 · Step-by-step configuration"
    1. Overview & prerequisites → **2. Step-by-step configuration** → 3. Verification.

## Recommended label taxonomy (first-time deployment)

If you don't already have a taxonomy, Microsoft Learn suggests starting with clear, business-friendly names and using **sublabels** to group related sensitivities.

| Label | Meaning | Suggested protection |
|---|---|---|
| **Public** | Approved for public release | None |
| **General** | Internal, non-sensitive | Optional footer marking |
| **Confidential** | Sensitive; limit distribution | Encryption + watermark; sublabels *Internal* / *External* |
| **Highly Confidential** | Most sensitive; strict control | Encryption with tightly scoped permissions |

!!! tip "Keep it small"
    Start with **one or two high-impact scenarios** and 3–5 labels. Test names and tooltips with the people who will apply them, then expand.

## Configure labels and a policy

=== "Portal"

    **Step 1 — Create the labels**

    1. Sign in to the **[Microsoft Purview portal](https://purview.microsoft.com)** → **Information Protection → Sensitivity labels**.
    2. Select **＋ Create a label**. Enter a **Name**, **Display name**, and a helpful **tooltip** (for example, *"Business data that shouldn't be shared externally"*). Select **Next**.
    3. On **Scope**, choose where the label applies — **Items** (files, emails, meetings), **Groups & sites**, and/or **Schematized data assets**. Select **Next**.

    **Step 2 — Define what the label does (protection)**

    4. For **Items**, choose the protection settings:
        - **Encryption** — *Configure* → assign permissions (for example, *Confidential* → your organization can Co-Author; *Highly Confidential* → a named group has Viewer only).
        - **Content marking** — add a header/footer/watermark such as *"Confidential"*.
        - **Auto-labeling for files and emails** (optional) — detect a sensitive info type (for example **Credit Card Number**) and apply/recommend this label automatically.
    5. Finish the wizard and **Save** the label. Repeat for each label in your taxonomy.

    **Step 3 — Publish a label policy**

    6. Go to **Sensitivity labels → Label policies → ＋ Publish label**.
    7. **Choose the labels** to include, then select the **users and groups** who should see them (start with a pilot group).
    8. Configure **policy settings** — for example, a **default label** for documents, and whether users must **provide justification** to lower a label.
    9. **Name** the policy, review, and **Submit**. Allow time for the policy to reach users' apps.

    ![Sensitivity label flow: admins create and publish labels, users apply them, apps enforce protection](https://learn.microsoft.com/purview/media/sensitivity-label-flow.png){ loading=lazy }

    *Image source: [Get started with sensitivity labels](https://learn.microsoft.com/purview/get-started-with-sensitivity-labels).*

=== "PowerShell"

    Use **Security & Compliance PowerShell** to create labels and a policy programmatically.

    ```powershell
    # Connect to Security & Compliance PowerShell.
    Connect-IPPSSession -UserPrincipalName admin@contoso.onmicrosoft.com

    # Review any existing labels (grounded cmdlet).
    Get-Label | Format-List DisplayName, Name, Guid, ContentType

    # Create a "Confidential" label for files and emails.
    New-Label `
        -DisplayName "Confidential" `
        -Name "Confidential" `
        -Tooltip "Business data that shouldn't be shared externally." `
        -ContentType "File, Email"

    # Publish the label to users via a label policy.
    New-LabelPolicy `
        -Name "Pilot label policy" `
        -Labels "Confidential" `
        -ExchangeLocation "All"
    ```

    !!! note "Encryption & advanced settings"
        Encryption and content-marking settings are configured with additional parameters on `Set-Label` (for example `-EncryptionEnabled`, `-EncryptionRightsDefinitions`, `-ApplyContentMarkingFooterEnabled`). See the [Set-Label reference](https://learn.microsoft.com/powershell/module/exchangepowershell/set-label) for the exact parameters, or configure them in the portal.

## Optional: auto-labeling at scale

To label existing content **at rest** (SharePoint/OneDrive) or **in transit** (Exchange) without user action, create an **[auto-labeling policy](https://learn.microsoft.com/purview/apply-sensitivity-label-automatically)**. Start it in **simulation** to preview matches before enforcing.

## Continue

Publish complete — now verify labels appear and protection is enforced.

[:octicons-arrow-left-24: Back to Part 1](index.md){ .md-button }
[:octicons-arrow-right-24: Part 3 · Verification](verification.md){ .md-button .md-button--primary }

## Sources

- [Create and configure sensitivity labels and their policies](https://learn.microsoft.com/purview/create-sensitivity-labels)
- [Get started with sensitivity labels](https://learn.microsoft.com/purview/get-started-with-sensitivity-labels)
- [Restrict access to content by using sensitivity labels to apply encryption](https://learn.microsoft.com/purview/encryption-sensitivity-labels)
- [Apply a sensitivity label to content automatically](https://learn.microsoft.com/purview/apply-sensitivity-label-automatically)
- [New-Label (Exchange PowerShell)](https://learn.microsoft.com/powershell/module/exchangepowershell/new-label)
- [New-LabelPolicy (Exchange PowerShell)](https://learn.microsoft.com/powershell/module/exchangepowershell/new-labelpolicy)
