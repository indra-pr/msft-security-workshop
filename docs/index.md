---
title: Microsoft Security Workshop
---

# Microsoft Security Workshop

<div class="workshop-hero" markdown>
## From "what is this?" to "I configured it and verified it works."
A hands-on, beginner-friendly learning series for the **Microsoft Security** product family — built for customers and partners who are new to each product. Follow it in order, or jump straight to the product you need.
</div>

!!! tip "How to use this workshop"
    Every feature page follows the **same template**: what it is → prerequisites & licensing → complexity & time → a sample-data script for your lab → recommended policy → a screenshot-backed step-by-step → verification → extensibility → industry use cases. Use the **Previous / Next** buttons at the bottom of each page to walk the series in order, and the **search** box (top) to jump anywhere.

!!! info "Grounded in Microsoft Learn"
    Every fact, feature name, prerequisite, and step is grounded in **[Microsoft Learn](https://learn.microsoft.com/)** and cited in a **Sources** block at the bottom of each page. Anything that can't be verified on Microsoft Learn is flagged **⚠️ Not verified on Microsoft Learn** rather than stated as fact.

## Choose a product

<div class="grid cards" markdown>

-   :material-shield-account:{ .lg .middle } __Microsoft Purview__ &nbsp; <span class="pill pill-built">Built</span>

    ---

    Unified **data security, compliance, and governance**. Protect and govern sensitive data across its lifecycle — DLP, Information Protection, Insider Risk, eDiscovery, Data Map & Unified Catalog, and more.

    [:octicons-arrow-right-24: Start with Purview](purview/index.md)

-   :material-account-key:{ .lg .middle } __Microsoft Entra__ &nbsp; <span class="pill pill-soon">Soon</span>

    ---

    **Identity and network access** — verify every identity, secure access to any resource, and enforce least privilege.

    [:octicons-arrow-right-24: Preview section](entra/index.md)

-   :material-cellphone-cog:{ .lg .middle } __Microsoft Intune__ &nbsp; <span class="pill pill-soon">Soon</span>

    ---

    **Endpoint and app management** — configure, secure, and monitor devices and applications across platforms.

    [:octicons-arrow-right-24: Preview section](intune/index.md)

-   :material-security:{ .lg .middle } __Microsoft Defender__ &nbsp; <span class="pill pill-soon">Soon</span>

    ---

    **Threat protection** across endpoints, identities, email, cloud apps, and cloud workloads (XDR).

    [:octicons-arrow-right-24: Preview section](defender/index.md)

-   :material-radar:{ .lg .middle } __Microsoft Sentinel__ &nbsp; <span class="pill pill-soon">Soon</span>

    ---

    Cloud-native **SIEM and SOAR** — collect, detect, investigate, and respond to threats at cloud scale.

    [:octicons-arrow-right-24: Preview section](sentinel/index.md)

-   :material-robot:{ .lg .middle } __Microsoft Security Copilot__ &nbsp; <span class="pill pill-soon">Soon</span>

    ---

    **Generative-AI assistant** for security and IT teams — investigate, summarize, and respond faster.

    [:octicons-arrow-right-24: Preview section](security-copilot/index.md)

-   :material-account-supervisor-circle:{ .lg .middle } __Microsoft Agent 365__ &nbsp; <span class="pill pill-soon">Soon</span>

    ---

    Managing and securing the **agent workforce** — identity, control, and observability for AI agents.

    [:octicons-arrow-right-24: Preview section](agent-365/index.md)

</div>

## What "done" looks like for each feature

```mermaid
flowchart LR
    A[What is it?] --> B[Prerequisites<br/>& licensing]
    B --> C[Complexity<br/>& time]
    C --> D[Generate<br/>sample data]
    D --> E[Recommended<br/>policy]
    E --> F[Step-by-step<br/>configuration]
    F --> G[Verify it<br/>works]
    G --> H[Extend &<br/>integrate]
    H --> I[Industry<br/>use cases]
```

## Why this exists

Security products are deep, and the hardest part for a newcomer is knowing *where to start* and *how to prove it works*. This workshop pairs every instruction with a supporting diagram or screenshot from Microsoft Learn, splits long walkthroughs into readable **Part 1 → Part N** pages, and always ends with a **verification** step so you can confirm success in your own lab.

## About the author

<div class="grid cards" markdown>

-   :material-account-tie:{ .lg .middle } __Indra Permana Rusli__

    ---

    **Sr. Security Solution Engineer**
    Microsoft ASEAN

    This workshop is a personal learning project. Content is curated from, and grounded in, **[Microsoft Learn](https://learn.microsoft.com/)** — the authoritative source — with each page citing the Learn URLs it draws from.

</div>

!!! warning "Disclaimer — personal project"
    - This is an **independent, personal project** created for learning. The views and content here are the **author's own** and do **not** represent Microsoft. It has **no relationship to, and does not reflect, the author's role or position at Microsoft**.
    - This site is **not** official Microsoft documentation, guidance, endorsement, or support. It is **not** an official Microsoft publication.
    - **Microsoft Learn is the source of truth.** Product names, features, licensing/SKUs, and steps change frequently — always **verify against the linked Microsoft Learn pages for your own tenant** before acting. Anything that couldn't be verified on Learn is flagged **⚠️ Not verified on Microsoft Learn**.

!!! danger "Safety measures — read before running anything"
    - **Lab tenants only.** Sample scripts generate **synthetic, non-real** data (fake card/ID-format values). Run them **only in an isolated, non-production test tenant** — never against production data, users, or devices.
    - **Review before you run.** Read and understand every script, confirm the target tenant/account, and use **least-privilege** roles. Some steps (DLP blocking, retention, information barriers, privileged access) can **restrict access or delete data**.
    - **Get authorization.** Only configure security controls you're **permitted** to change, and follow your organization's policies and all **applicable laws**.
    - **No warranty.** Everything here is provided **"as is," without warranty of any kind**; you use it **at your own risk**, and the author accepts **no liability** for any outcome.
    - **Trademarks** (Microsoft, Purview, Entra, Intune, Defender, Sentinel, Security Copilot, Agent 365, and related marks) belong to the **Microsoft group of companies**.
