---
title: Information Protection — Part 3 · Verification, extensibility & use cases
description: >-
  Confirm sensitivity labels appear and protect content, then extend
  Information Protection and review industry use cases.
---

# Information Protection — Part 3

!!! abstract "Step 3 of 3 · Verification"
    1. Overview & prerequisites → 2. Step-by-step configuration → **3. Verification**. This final part also covers extensibility and industry use cases.

## 7. Verify it works

### Confirm labels reach users

1. Sign in to **Word/Excel/PowerPoint** or **Outlook** (web or desktop) as a **pilot user** in your label policy.
2. Look for the **Sensitivity** button on the ribbon (or the label bar). Your published labels (for example *Confidential*) should appear.
3. Apply **Confidential** to `confidential-contract.txt` (opened/saved as a document). Confirm any configured **header/footer/watermark** appears.

### Confirm protection is enforced

1. As a user **outside** the permitted group, try to open the encrypted document. You should be **denied** or limited to the assigned rights (for example, view-only).
2. If you set a default label or mandatory labeling, confirm new documents get labeled and that **lowering** a label prompts for **justification** (if you required it).

### Confirm auto-labeling (if configured)

1. Open **Information Protection → Auto-labeling** and review your policy's **simulation results** — items containing the credit-card SIT in `confidential-contract.txt` should be matched.
2. Use **Data explorer / Content explorer** to see labeled items, and **Activity explorer** to see label activities.

!!! success "What 'good' looks like"
    - Pilot users **see** the labels in their apps and can apply them.
    - Encrypted items **enforce** permissions for unauthorized users.
    - **Activity explorer** shows *Label applied* / *Label changed* events, and auto-labeling simulation lists the expected matches.

!!! warning "Give it time & test broadly"
    Label policies can take time to propagate to apps, and different apps enforce labels slightly differently. Test on the platforms your users actually use (Windows, macOS, web, mobile).

## 8. Extensibility

- **[Double Key Encryption](https://learn.microsoft.com/purview/double-key-encryption)** and **[Customer Key](https://learn.microsoft.com/purview/customer-key-overview)** — for the strictest key-control requirements.
- **[Information Protection client & scanner](https://learn.microsoft.com/purview/information-protection-client)** — extend labeling to File Explorer/PowerShell and discover/label files in **on-premises** repositories and file shares.
- **[Microsoft Purview Information Protection SDK](https://learn.microsoft.com/information-protection/develop/overview)** — third-party apps can read/write label metadata and apply encryption.
- **Partner solutions** — many ISVs integrate with sensitivity labels; labels stored in document metadata are portable across supported apps.
- **Data Map integration** — apply sensitivity labels to schematized data assets discovered by [Data Map](https://learn.microsoft.com/purview/data-map-sensitivity-labels-apply).

### Integration requirements

| Integration | Requirement |
|---|---|
| Information Protection client/scanner | Windows 11 / 10 (x64) / Server 2019–2016; labeling subscription |
| Double Key Encryption | You host and control the second key; DKE service configured |
| SDK / partner apps | MIP SDK; appropriate app registration and permissions |
| Data Map labeling | Microsoft 365 licensing in the same Entra tenant; pay-as-you-go for non-M365 sources |

## 9. Industry use cases

=== "Financial services"

    Apply **Highly Confidential** with encryption to M&A and client-portfolio documents so only deal-team members can open them, even if forwarded.

=== "Telco"

    Standardize a **Public → Highly Confidential** taxonomy across the enterprise; auto-label engineering docs containing network topology as **Confidential**.

=== "Public sector & SOE"

    Map labels to a **government classification scheme**; enforce visual markings and encryption for citizen and national-interest data.

=== "Energy & resources"

    Encrypt **reservoir, geophysical, and plant-design** documents so intellectual property remains protected when shared with JV partners.

=== "Manufacturing & conglomerates"

    Label and encrypt **product designs and trade secrets**; use auto-labeling to catch CAD/BOM content and protect it consistently across business units.

## Recap

You created a label taxonomy, added protection, published a policy, and verified enforcement. Continue with the next data-security solution.

[:octicons-arrow-left-24: Back to Part 2](configuration.md){ .md-button }
[:octicons-arrow-right-24: Insider Risk Management](../insider-risk-management/index.md){ .md-button .md-button--primary }

## Sources

- [Get started with sensitivity labels](https://learn.microsoft.com/purview/get-started-with-sensitivity-labels)
- [Restrict access to content by using sensitivity labels to apply encryption](https://learn.microsoft.com/purview/encryption-sensitivity-labels)
- [Apply a sensitivity label to content automatically](https://learn.microsoft.com/purview/apply-sensitivity-label-automatically)
- [Microsoft Purview Information Protection client](https://learn.microsoft.com/purview/information-protection-client)
- [Microsoft Purview Information Protection SDK](https://learn.microsoft.com/information-protection/develop/overview)
