# Changelog

## 0.0.1 · Phase 0: Setup (2026-11-15)

- Vite 8 + React 19 + TypeScript 6 (strict, `noUncheckedIndexedAccess`), `@/` import alias.
- Tailwind CSS v4 with the Garbh Saathi theme tokens for day and night, soft radii and shadows,
  breathe and float-in animations, `prefers-reduced-motion` support, and text-size hooks.
- Accessibility: `text-muted` darkened from `#8C7F90` to `#6E6173` so it passes WCAG AA on cream
  and white. Night tokens already passed. Text on pastel fills uses `--on-fill`.
- Self-hosted Nunito and Noto Sans Devanagari via `@fontsource`.
- ESLint (flat config, typescript-eslint, react-hooks, `no-alert`) + Prettier (with Tailwind class sorting).
- Vitest + Testing Library (jsdom). `npm run check` runs typecheck, lint, format check and tests.
- Folder structure from the spec, an i18n skeleton (`t()` with English fallback), and a soft-themed
  placeholder screen with a night-mode preview button.
- README, CHANGELOG and CONTENT_GUIDE skeletons.
