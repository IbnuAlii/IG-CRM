# Frontend Handoff Rules

Use this file as the starting context when continuing the CRM SaaS frontend work in a new chat.

## Project Context

This is an existing v0-generated Next.js frontend project. Do not recreate the project from scratch. The goal is to fix, improve, and complete the generated frontend so it matches the requirements in `docs/`.

The user is responsible for frontend only. Backend behavior can be mocked in the UI, but the screens, flows, data shape, and user experience should match the documents as closely as possible.

Always refer back to:

- `docs/00_TECHNOLOGY_STACK_SUMMARY.md`
- `docs/01_Idea_Concept_Document.md`
- `docs/02_Requirements_Document_SRS.md`
- `docs/03_User_Stories_Use_Cases.md`
- `docs/04_UI_UX_Design_Document.md`
- `docs/05_System_Architecture_Document.md`
- `docs/06_Database_Design_Document.md`
- `docs/08_Security_Risk_Document.md`
- `docs/09_Testing_Plan_Document.md`

## Main Working Rules

- Read the relevant docs before implementing each module.
- Do not guess requirements when the docs already describe the expected behavior.
- Reuse existing UI and shared components instead of rebuilding the same thing repeatedly.
- Keep route `page.tsx` files as page composition files.
- Do not dump large unrelated sections, dialogs, forms, and table logic all inside `page.tsx`.
- Extract meaningful page-level parts into `components/<module>/<page-or-feature>/...`.
- Any page section that is longer than 30 lines of JSX/code must be extracted into a named component under `components/<module>/<page-or-feature>/...`. Keep `page.tsx` responsible for data selection, state orchestration, and composing those named sections.
- Each extracted section must live in its own file. Do not group several large section components into a single `*-sections.tsx` file.
- Do not move an entire page into one imported component just to make `page.tsx` tiny.
- Use shadcn/ui components already present in `components/ui`.
- Use the reusable data table in `components/common/data-table.tsx` for tables unless there is a strong reason not to.
- Keep mock data centralized in `lib/mock-data.ts` and types in `types/index.ts`.
- Run `node_modules\.bin\tsc.cmd --noEmit --pretty false` after meaningful changes.
- `npm.cmd run build` may need network access because the app uses Google Fonts through `next/font`.

## Responsive Layout Rules

- Every module must be designed and checked at normal laptop widths, not only on a large external monitor.
- Pages must not create browser-level horizontal scrolling. If wide content is unavoidable, keep the horizontal scroll inside the specific table/board/card that needs it.
- Dashboard shells, sidebars, headers, page wrappers, grids, cards, and table toolbars must use `min-w-0` where flex/grid children can otherwise force overflow.
- KPI/stat cards must wrap cleanly across breakpoints. Prefer `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-*` over forcing five or six cards into one row at laptop widths.
- Large two-column analytical layouts should generally switch at `2xl` instead of `xl` unless the content has already been verified to fit well on laptop screens.
- Text inside KPI cards, headers, filters, buttons, and badges must wrap or shrink naturally; do not rely on truncation when it hides important operational data.
- Filter rows, table toolbars, and pagination controls must wrap into multiple rows on narrower screens while keeping search/filter controls readable.
- Reusable tables should keep their desktop table layout inside a contained `overflow-x-auto` area and provide the existing mobile card layout where appropriate.
- Before calling a module frontend-complete, review the main pages for page-level horizontal overflow and cramped KPI cards.

## Reusable Components To Prefer

- Tables: `components/common/data-table.tsx`
- Table toolbar: `components/common/data-table-toolbar.tsx`
- Table pagination: `components/common/data-table-pagination.tsx`
- Status badges: `components/common/status-badge.tsx`
- Layout shell/sidebar: `components/layout/dashboard-shell.tsx`, `components/layout/app-sidebar.tsx`
- Super Admin KPI cards: `components/superadmin/dashboard/dashboard-stat-card.tsx`
- shadcn UI: `components/ui/*`

The reusable table already supports:

- search
- sorting
- pagination
- column visibility
- CSV export
- row click navigation
- desktop table layout
- mobile card layout

## Component Splitting Rule

Good extraction examples:

- dialogs
- forms
- table column-heavy sections
- page cards/sections that are large
- settings panels
- repeated blocks
- wizard/review flows

Avoid extracting:

- one small title block
- a tiny paragraph
- the entire page as one component

Preferred structure:

```txt
components/
  superadmin/
    tenants/
      add-tenant-dialog.tsx
      tenant-export-dialog.tsx
    dashboard/
      dashboard-controls.tsx
    settings/
      two-factor-settings-card.tsx
```

For future modules, follow the same style:

```txt
components/
  admin/
    customers/
    jobs/
    reports/
  dispatcher/
  technician/
  hr/
  accounting/
```

## Super Admin Module Status

The Super Admin frontend is mostly completed.

It has also gone through a visual refinement pass. The current preferred Super Admin style is:

- Dashboard uses the generated visual hero assets:
  - `public/images/super-admin/hero.png`
  - `public/images/super-admin/superAdminShell icon.png`
- Other Super Admin operational pages should use simple title/action headers, not the dashboard hero image.
- Cards should feel clean, lightly elevated, and restrained.
- Use subtle blue/green/amber/red accents only when they communicate state.
- Tables use the shared data table and should keep search on the left, export/columns on the right.
- Filter rows should stretch selects to fill available empty space and keep reset/actions aligned to the right.
- Tenants, Registrations, and Subscriptions use the enhanced tinted KPI card style by passing `presentation="tinted"` to `DashboardStatCard`.
- Other pages can use the simpler/default KPI card presentation unless the user explicitly asks for the tinted version.

Implemented routes:

- `/superadmin/dashboard`
- `/superadmin/tenants`
- `/superadmin/tenants/[id]`
- `/superadmin/registrations`
- `/superadmin/subscriptions`
- `/superadmin/system-health`
- `/superadmin/logs`
- `/superadmin/settings`

Implemented Super Admin features:

- Collapsible shadcn sidebar with icon-only mode and tooltips.
- Super Admin dashboard with tenant, subscription, registration, revenue, health, and alert widgets.
- Dashboard visual hero, KPI cards, colored revenue area chart, tenant plan donut chart, and uptime mini-chart.
- Dashboard date range selector.
- Dashboard widget visibility controls.
- Dashboard CSV export.
- Tenant directory with filters, status summary, and reusable data table.
- Tenant, Registration, and Subscription pages have enhanced tinted KPI cards matching the approved reference style.
- Tenant add dialog.
- Tenant export dialog.
- Tenant suspend/reactivate/terminate lifecycle dialog.
- Tenant detail page showing profile, database/isolation, plan limits, export workflow, branding, IP whitelist, and onboarding/provisioning.
- Registration queue using reusable data table.
- Registration review/approve/reject dialog.
- Subscription page using reusable data table.
- Subscription management dialog with Stripe/billing fields.
- System health dashboard/page.
- Logs page using reusable data table.
- Settings page with platform defaults, tenant defaults, security defaults, integrations, and system controls.
- Super Admin pages have consistent visual polish across Dashboard, Tenants, Tenant Detail, Registrations, Subscriptions, System Health, Logs, and Settings.
- 2FA setup card with authenticator verification, backup codes, and password-confirmed disable.
- Command palette navigation with `Ctrl+K`.
- Mobile card behavior for reusable tables.

Related auth/security frontend flows added:

- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/two-factor`

Login behavior:

- Customer and field users log in directly in demo mode.
- Admin and Super Admin are routed to `/two-factor` first.

## Known Frontend Gaps

These are not blockers for moving to other modules, but they are still production-level gaps:

- Real backend integration.
- Real email sending for reset/verification.
- Real TOTP validation.
- Real PDF/XLSX export.
- Full i18n implementation.
- Formal WCAG 2.1 AA accessibility audit.
- Real drag-and-drop dashboard widget ordering.

## Important Design Notes

- Keep layouts full-width and responsive.
- Avoid large empty gaps between sidebar and page content.
- Keep tables visually aligned: statuses, action buttons, counts, and dates should be centered when appropriate.
- Search belongs on the left side of table toolbars.
- Export and column controls belong on the right side.
- Table toolbars and pagination need padding so controls do not touch the card edges.
- Prefer restrained, clean operational UI for dashboards and admin modules.

## Before Starting The Next Module

For each new module:

1. Read the relevant docs first.
2. Identify required pages, workflows, tables, forms, dialogs, filters, and exports.
3. Compare existing v0 pages against the docs.
4. Tell the user what matches and what is missing.
5. Wait for confirmation if the user asks to analyze first.
6. Implement only after the user says to proceed.
7. Reuse existing shared components.
8. Extract meaningful components without over-extracting.
9. Run typecheck.
10. Summarize exactly what changed and what is still missing.

## Current Verification

The latest known verification after Super Admin and auth/security frontend updates:

```powershell
node_modules\.bin\tsc.cmd --noEmit --pretty false
```

Passed.

```powershell
npm.cmd run build
```

Passed when network access was allowed for Google Fonts.
