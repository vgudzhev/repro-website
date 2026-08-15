# repro.md website

Landing page and documentation site for repro.md — an open-source CLI and format for reproducing AI coding-agent failures.

## Development

```
npm run dev         # Start dev server (port 4321)
npm run build       # Production build to dist/
npm run preview     # Preview production build
```

## Stack

- Astro (static site, no SSR)
- Plain CSS (no Tailwind)
- TypeScript
- Deploys to Cloudflare Pages

## Structure

- `src/pages/index.astro` — Landing page (12 sections)
- `src/pages/docs/` — Documentation
- `src/pages/spec/` — Format specification
- `src/content/snippets.ts` — Shared content strings (CLI output, file structures, trace examples)
- `src/components/` — Terminal.astro, CodeBlock.astro
- `src/layouts/Base.astro` — Base layout with nav + footer
- `src/styles/global.css` — All styles (CSS custom properties, dark mode via prefers-color-scheme)

## Content

All terminal output, file structures, and code examples live in `src/content/snippets.ts` to avoid transcription drift across pages. Components use `set:html` props (not slots) to preserve whitespace in `<pre>` blocks.

Key naming: the replay command is `repro run` (not `repro replay`), metadata is `meta.json` (not `env.lock`), assertions file is `assertions.json` (not `assertion.json`).
