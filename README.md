# Raleigh Housing Landscape

An interactive single-page map + dashboard of the City of Raleigh's affordable
housing production, built on the ArcGIS Maps SDK for JavaScript and Chart.js.

- **Map** — City housing development plus three public, de-identified
  resident-level program layers (homeowner rehabs, homebuyer assistance, other
  housing impact), served from the Raleigh ArcGIS Online organization.
- **Dashboard** — completed units and pipeline by fiscal year and quarter,
  read from the authoritative aggregate summary table.

All data is loaded live from **public, de-identified** hosted feature layers.
No API keys, credentials, or resident-level personal data are included in this
repository.

## Viewing it

The app is a static site — `index.html`, `config.js`, `styles.css`, and the
logo. It needs to be served over HTTP (ES modules do not load from `file://`).

### Live site
Published via GitHub Pages — see the repository's **Pages** URL.

### Run locally
From this folder, on Windows PowerShell:

```powershell
./serve.ps1 -Port 8788
```

Then open <http://localhost:8788/index.html>.

Any static file server works — e.g. `python -m http.server 8788`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | App shell, map + dashboard logic |
| `config.js` | Layer URLs, field mappings, brand tokens |
| `styles.css` | Styling (City of Raleigh brand) |
| `raleigh_horizontal.png` | City logo |
| `serve.ps1` | Minimal local static server |
