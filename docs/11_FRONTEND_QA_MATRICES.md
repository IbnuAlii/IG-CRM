# Frontend QA Matrices

**Last updated:** 2026-06-04  
**Related:** [Route Inventory](./10_FRONTEND_ROUTE_INVENTORY.md) | [Gap Tracker](../issue/10_FRONTEND_GAP_AUDIT_AND_FIX_TRACKER.md)

---

## Theme acceptance criteria

- [x] First visit defaults to light mode (`defaultTheme="light"`, `enableSystem={false}`)
- [x] User can switch to dark mode from dashboard shell, customer nav, driver nav, and auth shells
- [x] Theme choice persists after refresh (`next-themes` localStorage)
- [ ] No page remains visually light-only in dark mode (ongoing — customer portal semantic tones applied; driver/manager/accountant token migration applied)
- [ ] Text contrast passes WCAG 2.1 AA in both themes (manual + axe)
- [ ] Tables, cards, sheets, dialogs, maps, and charts legible in both themes
- [ ] Screenshots captured for representative pages in both themes (`e2e/screenshots/`)

---

## Frontend QA matrix (by portal)

| Portal | Smoke navigation | Forms | Tables | Maps/charts | Responsive | A11y | Theme |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Admin | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Super Admin | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Dispatcher | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Customer | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [x] |
| Driver/Technician | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| HR | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Fleet | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Manager | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Accountant | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

Automated smoke coverage: `npm run test:e2e` runs chromium + mobile (iPhone viewport on Chromium). Use `npm run test:e2e:chromium` for desktop-only.

---

## Responsive acceptance (by portal)

| Portal | Mobile (<640px) | Tablet (640–1024px) | Desktop (>1024px) | Notes |
| --- | --- | --- | --- | --- |
| Admin | Sidebar sheet; table horizontal scroll | Sidebar + tables | Full sidebar | Sticky header must not cover content |
| Super Admin | Same as Admin | Same | Full | Tenant tables scroll on mobile |
| Dispatcher | Schedule cards stack | Map + board split | Full dispatch board | Map min-height 320px |
| Customer | Bottom/sheet nav | Top nav wraps | Full top nav | Long labels truncate |
| Driver | Sheet nav | Top nav | Full top nav | Job cards stack |
| HR / Fleet / Manager / Accountant | Dashboard shell sheet | Tables scroll | Full layout | Finance tables scroll |

**Minimum viewports:** 390×844, 768×1024, 1366×768, 1440×900, 1920×1080.

---

## Accessibility checklist

- [ ] Keyboard navigation for all nav systems (Tab, Enter, Escape)
- [ ] Focus trap in dialogs, sheets, command menu
- [ ] `aria-label` on icon-only buttons (logout, theme, menu)
- [ ] Table headers associated with cells
- [ ] Form labels and error messages linked
- [ ] Color contrast in light and dark (axe on `/customer/home`, `/admin/dashboard`)
- [ ] Map screens: text fallback when map unavailable
- [ ] Charts: summary text or data table fallback
- [ ] Automated axe scan in CI (`@axe-core/playwright`)

---

## Frontend states matrix (pilot routes)

| Route | Loading | Empty | Error | Permission denied | Not found |
| --- | --- | --- | --- | --- | --- |
| `/admin/customers` | skeleton table | no customers found | retry panel (pattern) | redirect/403 | N/A |
| `/admin/customers/[id]` | detail skeleton (planned) | N/A | retry panel (planned) | redirect/403 | customer not found |
| `/driver/jobs` | job cards skeleton | no assigned jobs | retry panel (planned) | redirect/403 | N/A |
| `/driver/jobs/[id]` | detail skeleton | N/A | retry panel (planned) | redirect/403 | job not found |

**Shared components:** `RouteLoadingSkeleton`, `RouteEmptyState`, `RouteErrorPanel` in `components/common/`.

Expand this matrix to all routes in [10_FRONTEND_ROUTE_INVENTORY.md](./10_FRONTEND_ROUTE_INVENTORY.md) incrementally.
