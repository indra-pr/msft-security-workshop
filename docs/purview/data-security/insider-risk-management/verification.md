---
title: Insider Risk Management — Part 4 · Verification, extensibility & use cases
description: >-
  Confirm Insider Risk Management generates and lets you triage alerts, then
  extend it with Adaptive Protection and review industry use cases.
---

# Insider Risk Management — Part 4

!!! abstract "Step 4 of 4 · Verification"
    1. Overview & prerequisites → 2. Recommended policy setup → 3. Step-by-step configuration → **4. Verification**. This final part also covers extensibility and industry use cases.

## 7. Verify it works

### Generate a test signal

1. In your lab, mark a test user as a **leaver** by importing the [sample HR CSV](index.md#3-generate-sample-hr-data-for-your-lab) via the HR connector.
2. On an **onboarded device**, have that user perform exfiltration-like activity with the [DLP sample files](../dlp/index.md#3-generate-sample-data-for-your-lab): copy them to a USB drive or upload to a personal cloud location.
3. Allow time for signals to process.

### Confirm alerts and triage

1. Open **Insider Risk Management → Alerts**. Your test activity should appear as an **alert** with a **risk severity**.
2. Open the alert to review the **pseudonymized user**, the **triggering indicators** (for example *copy to USB*), and the **timeline** of activity.
3. **Triage** the alert (Confirm / Dismiss) and, if warranted, **create a case** for deeper investigation.
4. Review **Analytics** insights and the **Users** dashboard to see risk distribution.

!!! success "What 'good' looks like"
    - A departing-user activity produces an **alert** with the expected indicators and severity.
    - The investigating analyst sees a **pseudonymized** identity (privacy by design) unless they have the role to reveal it.
    - You can move an alert into a **case** and take action (notify, escalate, or escalate to eDiscovery).

!!! warning "Interpret responsibly"
    IRM insights are a **starting point** for investigation, not a verdict. Conduct a full, lawful investigation and involve HR/legal before any employment action.

## 8. Extensibility

- **[Adaptive Protection](https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection)** — a user's insider-risk level dynamically drives **DLP** actions and **Conditional Access** decisions.
- **Third-party indicators & connectors** — import non-Microsoft signals; use the **HR connector** and other **[data connectors](https://learn.microsoft.com/purview/archive-third-party-data)**.
- **Microsoft Defender for Endpoint** — security-violation signals feed IRM policies.
- **eDiscovery escalation** — escalate a case to **eDiscovery** for legal hold and review.
- **Agent monitoring** — IRM can help [monitor AI agent activity](https://learn.microsoft.com/purview/insider-risk-management-monitoring-agents) for risky behavior.
- **Security Copilot in Purview** — accelerate alert triage with natural language.

### Integration requirements

| Integration | Requirement |
|---|---|
| HR connector | Configured Microsoft 365 HR connector + mapped CSV feed |
| Data leaks template | At least one DLP policy |
| Security violations template | Microsoft Defender for Endpoint signals |
| Adaptive Protection | IRM policies live; DLP and/or Conditional Access configured |
| Forensic evidence | Investigator role + Approver sign-off; device onboarding |

## 9. Industry use cases

=== "Financial services"

    Detect a departing **trader or analyst** exfiltrating client lists or models before joining a competitor; escalate to a case and legal hold.

=== "Telco"

    Surface **mass export of subscriber data** by an agent, correlating DLP high-severity matches with unusual download volume.

=== "Public sector & SOE"

    Monitor for **leakage of citizen or national-interest data**, with strict pseudonymization and auditor oversight to protect employee privacy.

=== "Energy & resources"

    Catch **IP theft of seismic, reservoir, or plant-design data** by departing engineers on field or plant workstations.

=== "Manufacturing & conglomerates"

    Identify **trade-secret and CAD exfiltration** across business units; use Adaptive Protection to tighten DLP for elevated-risk users.

## Recap

You configured permissions, connectors, analytics, and a departing-user policy — and verified end-to-end triage. Return to the [Data Security overview](../index.md) for the single-page solutions.

[:octicons-arrow-left-24: Back to Part 3](configuration.md){ .md-button }
[:octicons-arrow-right-24: Information Barriers](../information-barriers.md){ .md-button .md-button--primary }

## Sources

- [Get started with Insider Risk Management](https://learn.microsoft.com/purview/insider-risk-management-configure)
- [Help dynamically mitigate risks with Adaptive Protection](https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection)
- [Monitoring agents in Insider Risk Management](https://learn.microsoft.com/purview/insider-risk-management-monitoring-agents)
- [Assign permissions in Insider Risk Management](https://learn.microsoft.com/purview/insider-risk-management-permissions)
- [Insider Risk Management solution overview](https://learn.microsoft.com/purview/insider-risk-management-solution-overview)
