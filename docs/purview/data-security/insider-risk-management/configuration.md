---
title: Insider Risk Management — Part 3 · Step-by-step configuration
description: >-
  Assign permissions, enable analytics, configure the HR connector, and create
  a Data theft by departing users policy in the Microsoft Purview portal.
---

# Insider Risk Management — Part 3

!!! abstract "Step 3 of 4 · Step-by-step configuration"
    1. Overview & prerequisites → 2. Recommended policy setup → **3. Step-by-step configuration** → 4. Verification.

Follow the steps below in order. IRM is configured primarily in the **[Microsoft Purview portal](https://purview.microsoft.com)**.

## Step 1 — Assign permissions (required)

1. Ensure your account is a **Global Administrator / Compliance Administrator** (or **Organization Management**) so **Insider Risk Management** appears in the portal.
2. Open **Settings → Roles & scopes → Role groups** (or the Insider Risk Management **Permissions** area) and add the right people to the six IRM role groups (Admins, Analysts, Investigators, Auditors, Approvers).
3. Allow **up to 30 minutes** for role membership to take effect.

![Insider Risk Management configuration steps](https://learn.microsoft.com/purview/media/ir-solution-ir-steps.png){ loading=lazy }

*Insider Risk Management configuration flow. Image source: [Insider Risk Management solution overview](https://learn.microsoft.com/purview/insider-risk-management-solution-overview).*

## Step 2 — Configure the HR connector

The *Data theft by departing users* template needs resignation/termination dates.

1. In the Purview portal, open **Data connectors → Connectors** and create a **Microsoft 365 HR (Human Resources)** connector.
2. Define the **field mapping** to match your CSV (see the [sample HR file from Part 1](index.md#3-generate-sample-hr-data-for-your-lab)).
3. Upload/import the CSV (in production you automate this on a schedule) per [Import data with the HR connector](https://learn.microsoft.com/purview/import-hr-data).

## Step 3 — Enable analytics (recommended)

1. Open **Insider Risk Management → Analytics** and **turn on analytics**.
2. Wait for the scan — results can take **up to 48 hours**.
3. Review the insights and note the **recommended indicator thresholds** for your policy.

!!! tip "Why analytics first"
    Analytics gives you real-time **threshold recommendations** and shows how many users a change brings into scope — so you avoid a noisy first policy.

## Step 4 — Review settings & indicators

1. Open **Insider Risk Management → Settings**.
2. Confirm **privacy** settings (keep **pseudonymization** on by default).
3. Under **Policy indicators**, enable the **file exfiltration** indicators you want (download, copy to USB, copy to personal cloud, print, etc.).
4. Optionally define **priority content** (specific SharePoint sites, or content with the *Highly Confidential* label).

## Step 5 — Create the policy

1. Open **Insider Risk Management → Policies → ＋ Create policy**.
2. Choose the **Data theft by departing users** template. Select **Next**.
3. **Name** the policy and add a description.
4. Choose **users and groups in scope** — start with your **pilot group**. Select **Next**.
5. Confirm the **HR connector** dependency is satisfied (the wizard flags it if not).
6. Select the **content to prioritize** and the **indicators** to include.
7. Apply the **analytics-recommended thresholds** (or accept defaults). Select **Next**.
8. **Review** and **Submit**. The policy begins evaluating in-scope users against imported HR events and activity signals.

!!! note "Alerts take time to appear"
    After creation, IRM needs activity + HR signals to generate alerts. Trigger test activity (Part 4) and allow processing time.

## Continue

Policy created — now verify alerts and triage.

[:octicons-arrow-left-24: Back to Part 2](policy-setup.md){ .md-button }
[:octicons-arrow-right-24: Part 4 · Verification](verification.md){ .md-button .md-button--primary }

## Sources

- [Get started with Insider Risk Management](https://learn.microsoft.com/purview/insider-risk-management-configure)
- [Assign permissions in Insider Risk Management](https://learn.microsoft.com/purview/insider-risk-management-permissions)
- [Import data with the HR connector](https://learn.microsoft.com/purview/import-hr-data)
- [Insider Risk Management settings: Analytics](https://learn.microsoft.com/purview/insider-risk-management-settings-analytics)
- [Insider Risk Management settings: Policy indicators](https://learn.microsoft.com/purview/insider-risk-management-settings-policy-indicators)
