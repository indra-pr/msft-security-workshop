# Microsoft Security Workshop

A beginner-friendly, **workshop-style learning series** for the Microsoft Security product family, built as a static site with [MkDocs](https://www.mkdocs.org/) and the [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme and deployed to **GitHub Pages**.

The series takes a reader who is new to a product from *"what is this?"* all the way to *"I configured it and verified it works."* Every feature page follows the same template — description, prerequisites, complexity & time, sample-data script, recommended policy, step-by-step configuration, verification, extensibility, and industry use cases.

> **Source of truth:** every factual claim, feature name, prerequisite, and step is grounded in **[Microsoft Learn](https://learn.microsoft.com/)** and cited in a *Sources* block at the bottom of each page. Where something cannot be verified on Microsoft Learn, it is marked **⚠️ Not verified on Microsoft Learn**.

## Product family

| # | Product | Status |
|---|---------|--------|
| 1 | **Microsoft Purview** | ✅ Built end-to-end (overview + every module + feature deep-dives) |
| 2 | Microsoft Entra | 🧩 Scaffolded (template pages, to be filled) |
| 3 | Microsoft Intune | 🧩 Scaffolded |
| 4 | Microsoft Defender | 🧩 Scaffolded |
| 5 | Microsoft Sentinel | 🧩 Scaffolded |
| 6 | Microsoft Security Copilot | 🧩 Scaffolded |
| 7 | Microsoft Agent 365 | 🧩 Scaffolded |

## Local preview

You need **Python 3.9+**.

```bash
# 1. (Optional) create and activate a virtual environment
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# macOS / Linux
# source .venv/bin/activate

# 2. Install the pinned dependencies
pip install -r requirements.txt

# 3. Live-preview with hot reload at http://127.0.0.1:8000
mkdocs serve
```

To reproduce exactly what CI does (fails on any broken link or missing nav target):

```bash
mkdocs build --strict
```

The generated static site is written to the `site/` folder (git-ignored).

## How the site is generated & deployed

- **Framework:** MkDocs + Material for MkDocs. Material provides — out of the box — automatic Previous/Next pagination (`navigation.footer`), content tabs, admonitions/call-outs, code copy + annotations, instant client-side search, image lightbox (via `mkdocs-glightbox`), and native Mermaid rendering (via `pymdownx.superfences`).
- **Configuration:** [`mkdocs.yml`](mkdocs.yml) holds the full site config — the `nav:` tree (product → module → feature hierarchy), theme features, palette (light/dark toggle), plugins, and Markdown extensions.
- **Content:** all pages live under [`docs/`](docs/) as Markdown.
- **Deployment:** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) is a GitHub Actions workflow that, on every push to `main`:
  1. installs the pinned Python dependencies from [`requirements.txt`](requirements.txt),
  2. runs `mkdocs build --strict`, and
  3. publishes the built site to GitHub Pages using the official Pages actions.

### One-time GitHub setup

1. Push this repository to GitHub with the default branch named `main`.
2. In the repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Update `site_url` in [`mkdocs.yml`](mkdocs.yml) to your Pages URL (for a project site this is usually `https://<user-or-org>.github.io/<repo>/`).
4. Push to `main`. The workflow builds and deploys automatically; the live URL appears in the workflow run's **Deploy** job summary.

## Repository layout

```
.
├── mkdocs.yml                 # site config: nav tree, theme, extensions, plugins
├── requirements.txt           # pinned build dependencies
├── .github/workflows/deploy.yml  # build (--strict) + deploy to GitHub Pages
└── docs/
    ├── index.md               # landing page
    ├── stylesheets/extra.css  # small visual polish
    ├── purview/               # Microsoft Purview — built end-to-end
    │   ├── data-security/
    │   ├── data-compliance/
    │   └── data-governance/
    ├── entra/                 # scaffolded product sections (identical templates)
    ├── intune/
    ├── defender/
    ├── sentinel/
    ├── security-copilot/
    └── agent-365/
```

## Contributing / filling in the scaffolded products

Each scaffolded product (Entra, Intune, Defender, Sentinel, Security Copilot, Agent 365) ships with:

- an **Overview** page (module map + card index), and
- a **Feature deep-dive (template)** page that mirrors the Purview feature template.

To fill one in: ground the taxonomy in Microsoft Learn, then copy the Purview feature structure (the 10-section template documented on every Purview feature page), add real screenshots/diagrams, and cite the Learn URLs in the *Sources* block.
