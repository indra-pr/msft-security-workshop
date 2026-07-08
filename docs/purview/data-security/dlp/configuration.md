---
title: DLP — Part 3 · Step-by-step configuration
description: >-
  Build a Microsoft Purview DLP policy end to end in the Purview portal or with
  Security & Compliance PowerShell, in simulation mode first.
---

# Data Loss Prevention — Part 3

!!! abstract "Step 3 of 4 · Step-by-step configuration"
    1. Overview & prerequisites → 2. Recommended policy setup → **3. Step-by-step configuration** → 4. Verification.

Build the starter policy from [Part 2](policy-setup.md): protect **Credit Card Number** across Microsoft 365, in **simulation mode**, with policy tips on. Do it in the portal *or* with PowerShell.

=== "Portal"

    1. Sign in to the **[Microsoft Purview portal](https://purview.microsoft.com)** and open **Data Loss Prevention → Policies**.
    2. Select **＋ Create policy**.
    3. Choose a **category** and **template**. For this lab, pick **Financial → PCI Data Security Standard (PCI DSS)**, or choose **Custom → Custom policy** to start from scratch. Select **Next**.
    4. Enter a **Name** (for example, `Starter — PCI credit card`) and a meaningful **description**. Select **Next**.
    5. On **Assign admin units**, leave the **full directory** selected (admin units are optional). Select **Next**.
    6. On **Choose where to apply the policy (locations)**, turn **on**: **Exchange email**, **SharePoint sites**, **OneDrive accounts**, and **Teams chat and channel messages**. Leave **Devices** off for now. Select **Next**.
    7. On **Define policy settings**, choose **Create or customize advanced DLP rules**, then **＋ Create rule**:
        - **Name** the rule (for example, `Block external credit card sharing`).
        - Under **Conditions**, add **Content contains → Sensitive info types → Credit Card Number**. Set **confidence level = High** and **instance count = 1 to Any**.
        - Add a condition **Recipient domain is not** your own domain(s) to scope the *block* to **external** sharing.
        - Under **Actions**, add **Restrict access or encrypt the content**, and select **Block only people outside your organization**.
        - Turn on **Use notifications to inform your users (policy tips)** and enable **Allow overrides** with a **business justification**.
        - Turn on **alerts**: send an alert **every time an activity matches the rule** for high-severity events. Select **Save**.
    8. Select **Next**. On **Policy mode**, choose **Run the policy in simulation mode** and (optionally) **Show policy tips while in simulation mode**. Select **Next**.
    9. **Review** your settings and select **Submit**. The policy appears in the list with a **Simulation** status.

    ![Screenshot of the DLP create policy page in the Microsoft Purview portal](https://learn.microsoft.com/fabric/governance/media/data-loss-prevention-configure/create-policy.png){ loading=lazy }

    *DLP "Create policy" experience in the Microsoft Purview portal. Image source: [Configure DLP policies for Fabric](https://learn.microsoft.com/fabric/governance/data-loss-prevention-configure).*

=== "PowerShell"

    Use **Security & Compliance PowerShell**. Install the module once with `Install-Module -Name ExchangeOnlineManagement`, then connect and create the policy and rule.

    ```powershell
    # 1) Connect to Security & Compliance PowerShell (opens sign-in).
    Connect-IPPSSession -UserPrincipalName admin@contoso.onmicrosoft.com   # (1)!

    # 2) Create the policy in simulation mode across Microsoft 365 locations.
    New-DlpCompliancePolicy `
        -Name "Starter - PCI credit card" `
        -Comment "Blocks external sharing of credit card numbers (lab)" `
        -Mode Enable `
        -ExchangeLocation All `
        -SharePointLocation All `
        -OneDriveLocation All `
        -TeamsLocation All   # (2)!

    # 3) Add a rule: block EXTERNAL sharing of high-confidence credit card data.
    New-DlpComplianceRule `
        -Name "Block external credit card sharing" `
        -Policy "Starter - PCI credit card" `
        -ContentContainsSensitiveInformation @{ Name = "Credit Card Number"; minconfidence = "85" } `
        -ExceptIfRecipientDomainIs @("contoso.com") `
        -BlockAccess $true `
        -BlockAccessScope PerUser `
        -NotifyUser Owner `
        -NotifyPolicyTipDisplayOption "Tip" `
        -NotifyAllowOverride "WithJustification" `
        -GenerateAlert $true   # (3)!
    ```

    1. `Connect-IPPSSession` authenticates you to the Security & Compliance endpoint used by Purview policy cmdlets.
    2. `-Mode Enable` turns the policy on for enforcement. To *simulate* instead, use `-Mode Enable` only after testing, or create in test mode via the portal; PowerShell also supports `-Mode TestWithNotifications` / `-Mode TestWithoutNotifications` for simulation.
    3. `-GenerateAlert $true` raises a DLP alert on each match; `-NotifyAllowOverride "WithJustification"` lets users override with a reason.

    !!! tip "Simulate first from PowerShell"
        To run in simulation mode, set the policy `-Mode` to `TestWithNotifications` (policy tips shown) or `TestWithoutNotifications` (silent). Switch to `Enable` only after you've reviewed simulation results.

## Optional: extend to endpoints

To also catch sensitive files copied to USB, printed, or uploaded to consumer cloud apps, **onboard devices** to endpoint DLP and add the **Devices** location to your policy. See [Get started with Endpoint DLP](https://learn.microsoft.com/purview/endpoint-dlp-getting-started) and [device onboarding](https://learn.microsoft.com/purview/device-onboarding-overview).

## Continue

The policy is live in simulation. Now confirm it actually works.

[:octicons-arrow-left-24: Back to Part 2](policy-setup.md){ .md-button }
[:octicons-arrow-right-24: Part 4 · Verification](verification.md){ .md-button .md-button--primary }

## Sources

- [Create and deploy data loss prevention policies](https://learn.microsoft.com/purview/dlp-create-deploy-policy)
- [New-DlpCompliancePolicy (Exchange PowerShell)](https://learn.microsoft.com/powershell/module/exchangepowershell/new-dlpcompliancepolicy)
- [New-DlpComplianceRule (Exchange PowerShell)](https://learn.microsoft.com/powershell/module/exchangepowershell/new-dlpcompliancerule)
- [Connect to Security & Compliance PowerShell](https://learn.microsoft.com/powershell/exchange/connect-to-scc-powershell)
- [Get started with Endpoint data loss prevention](https://learn.microsoft.com/purview/endpoint-dlp-getting-started)
