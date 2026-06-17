# Frontend Gap Audit and Fix Tracker

## Purpose

This document tracks frontend-facing gaps found by comparing the formal documentation in `docs/` against the current Next.js frontend implementation.

**Route inventory:** See [docs/10_FRONTEND_ROUTE_INVENTORY.md](../docs/10_FRONTEND_ROUTE_INVENTORY.md) for the full route-by-route map (regenerate with `node scripts/generate-route-inventory.mjs`).

The goal is to make client feedback actionable: each gap below includes the concern, evidence from the current repository, the expected fix, and a checklist for tracking completion.

## Audit Snapshot

- Audit date: 2026-06-04
- Frontend app: Next.js App Router, React 19, Tailwind CSS v4, shadcn/Radix UI components
- Current route surface: about 90 `page.tsx` routes across role portals and auth flows
- Formal docs reviewed:
  - `docs/00_TECHNOLOGY_STACK_SUMMARY.md`
  - `docs/02_Requirements_Document_SRS.md`
  - `docs/04_UI_UX_Design_Document.md`
  - `docs/09_Testing_Plan_Document.md`
  - related root docs such as `SYSTEM_DOCUMENTATION.md`, `FRONTEND_HANDOFF_RULES.md`, and `QUICK_START.md`

## Executive Summary

The current docs describe a broad CRM SaaS product, but they do not fully document the actual frontend now present in the repository. The biggest missing area is a role-by-role frontend implementation map: the app has separate Admin, Super Admin, Dispatcher, Customer, Driver/Technician, HR, Fleet, Manager, and Accountant experiences, but the UI/UX docs still describe mostly generic modules.

There is also a concrete theme/dark-mode gap. Theme tokens exist in CSS and `next-themes` is installed, but the root layout does not currently mount the theme provider, no theme toggle component was found, and many screens still use hard-coded light-mode classes. This should be tracked as incomplete frontend work, not treated as finished.

Finally, the existing docs mention responsive design, accessibility, loading states, and frontend testing, but they do not provide route-level acceptance criteria or visual QA checklists. That makes it hard to prove to the client that every module, page, and portal has been reviewed.

## Severity Legend

- P0: Client-visible blocker or misleading documentation.
- P1: Important frontend completeness gap that can affect acceptance.
- P2: Quality, consistency, or maintainability issue.

## Current Implemented Frontend Surface

The app currently includes these route groups:

| Route group | Approx. page count | Notes |
| --- | ---: | --- |
| `admin` | 17 | Admin dashboard, customers, jobs, quotes, tickets, dispatch, team, reports, settings, detail pages |
| `customer` | 11 | Customer portal with home, service/rides, quotes, billing, support, history, account, detail pages |
| `driver` | 10 | Technician/driver portal with dashboard, jobs, schedule, route, performance, earnings, profile |
| `fleet` | 10 | Fleet dashboard, vehicles, drivers, maintenance, fuel, tracking, routes, geofences, reports |
| `dispatcher` | 9 | Dispatcher dashboard, jobs, schedule, technicians, routes, emergency, reports, detail pages |
| `manager` | 9 | Manager dashboard, team, operations, schedule, customers, approvals, reports, limited finance |
| `superadmin` | 8 | Platform dashboard, tenants, registrations, subscriptions, health, logs, settings |
| `hr` | 8 | HR dashboard, employees, attendance, leave, payroll, training, reports |
| `accountant` | 7 | Accountant dashboard, invoices, payments, payroll, customer billing, reports |
| auth/root | 6 | Login, forgot/reset password, 2FA, verify email, root route |

Key implemented navigation sources:

- `app/admin/layout.tsx`
- `app/superadmin/layout.tsx`
- `app/dispatcher/layout.tsx`
- `app/hr/layout.tsx`
- `app/fleet/layout.tsx`
- `app/manager/layout.tsx`
- `app/accountant/layout.tsx`
- `components/customer/customer-navigation.tsx`
- `components/driver/driver-navigation.tsx`

## Gap 1: Missing Route-by-Route Frontend Inventory

Severity: P0

### Concern

The UI/UX docs do not clearly list every implemented frontend route, role portal, screen purpose, primary user actions, and acceptance criteria.

The current `04_UI_UX_Design_Document.md` contains a generic navigation tree:

- Dashboard
- CRM
- Dispatch
- HR
- Payroll
- Fleet
- GPS Tracking
- Reports
- Settings

That does not match the current app surface, which has many role-specific portals and detail pages.

### Why This Matters

If the client expects "all modules, pages, and everything" to be accounted for, a generic module tree is not enough. Missing screen inventory makes it unclear whether a screen is intentionally out of scope, already implemented, or accidentally forgotten.

### Fix Checklist

- [ ] Add a frontend route inventory table to the docs.
- [ ] Include every `app/**/page.tsx` route.
- [ ] Group routes by role portal.
- [ ] Document each route's purpose.
- [ ] Document primary actions per route.
- [ ] Document empty, loading, error, and permission-denied states per route.
- [ ] Document desktop/tablet/mobile expectations per route group.
- [ ] Mark each route as one of: `implemented`, `placeholder`, `needs QA`, `needs design`, `out of scope`.

### Suggested Route Inventory Format

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/admin/dashboard` | Admin | Operations overview | Review KPIs, open modules | loading, empty, error | needs QA | TBD |
| `/customer/home` | Customer | Customer portal home | Request service, review active appointment | loading, empty, error | needs QA | TBD |
| `/driver/jobs` | Driver/Technician | Assigned jobs | Filter jobs, open job detail | loading, empty, error | needs QA | TBD |

## Gap 2: Customer Portal Is Not Fully Documented

Severity: P1

### Concern

The app includes a standalone customer portal, but the formal UI/UX docs do not provide a proper customer portal section.

Implemented customer navigation includes:

- `/customer/home`
- `/customer/active-service`
- `/customer/quotes`
- `/customer/billing`
- `/customer/support`
- `/customer/history`
- `/customer/account`

### Why This Matters

The customer portal is client-visible and customer-facing. It needs clearer design, content, and QA requirements than internal admin screens because end customers will judge the product through it.

### Fix Checklist

- [ ] Add a "Customer Portal" section to `04_UI_UX_Design_Document.md`.
- [ ] Document customer navigation behavior on desktop and mobile.
- [ ] Document service request flow.
- [ ] Document active service tracking flow.
- [ ] Document quote review and approval flow.
- [ ] Document billing/invoice/payment views.
- [ ] Document support ticket flow.
- [ ] Document account/profile/address/payment-method management.
- [ ] Add customer portal acceptance tests to `09_Testing_Plan_Document.md`.

## Gap 3: Driver/Technician Portal Is Not Fully Documented

Severity: P1

### Concern

The app includes a web technician/driver portal, while the docs mostly talk about a mobile app pattern for field workers.

Implemented driver navigation includes:

- `/driver/dashboard`
- `/driver/jobs`
- `/driver/schedule`
- `/driver/route`
- `/driver/performance`
- `/driver/profile`

The app also includes pages such as available rides, earnings, and job detail.

### Why This Matters

Field workflow is central to the CRM/dispatch product. The docs need to explain what is handled in the web portal versus what belongs to native mobile apps.

### Fix Checklist

- [ ] Add a "Driver/Technician Web Portal" section.
- [ ] Separate web portal requirements from native mobile app requirements.
- [ ] Document assigned jobs list and job detail flow.
- [ ] Document status update workflow.
- [ ] Document route view and schedule view.
- [ ] Document photo/signature/checklist expectations.
- [ ] Document offline/mobile-only features separately.
- [ ] Add driver/technician portal acceptance tests.

## Gap 4: Super Admin Platform Screens Are Under-Documented

Severity: P1

### Concern

The docs discuss multi-tenancy, tenants, subscriptions, system health, and logs at a product level, but the UI/UX docs do not fully describe the Super Admin frontend screens.

Implemented Super Admin areas include:

- `/superadmin/dashboard`
- `/superadmin/tenants`
- `/superadmin/tenants/[id]`
- `/superadmin/registrations`
- `/superadmin/subscriptions`
- `/superadmin/system-health`
- `/superadmin/logs`
- `/superadmin/settings`

### Fix Checklist

- [ ] Add Super Admin screen map.
- [ ] Document tenant onboarding and approval UI.
- [ ] Document tenant lifecycle controls.
- [ ] Document subscription management UI.
- [ ] Document system health and logs UI.
- [ ] Document warning states for UI-only or simulated actions.
- [ ] Add Super Admin acceptance tests.

## Gap 5: Manager and Accountant Portals Are Not Represented Enough

Severity: P1

### Concern

The SRS names Manager and Accountant roles, and the app has dedicated portals for both. The UI/UX docs do not give them enough screen-level treatment.

Implemented Manager areas include:

- Dashboard
- Team
- Operations
- Schedule
- Customers
- Approvals
- Reports
- Limited Finance

Implemented Accountant areas include:

- Dashboard
- Invoices
- Payments
- Payroll
- Customer Billing
- Reports

### Fix Checklist

- [ ] Add Manager portal section.
- [ ] Add Accountant portal section.
- [ ] Document limited finance permissions for managers.
- [ ] Document accounting workflows for invoices, payments, payroll visibility, and customer billing.
- [ ] Add role-specific acceptance criteria for Manager and Accountant pages.

## Gap 6: Theme and Dark Mode Are Incomplete

Severity: P0

### Concern

Dark-mode support is partially present but not complete.

Evidence:

- `next-themes` exists in `package.json`.
- `components/theme-provider.tsx` exists.
- `app/globals.css` contains `:root` and `.dark` theme tokens.
- `app/layout.tsx` currently does not mount `ThemeProvider`.
- No `ThemeToggle` component was found in the current file search.
- Several components still use hard-coded light classes such as `bg-white`, `text-slate-*`, and `border-slate-*`.

Examples of likely hard-coded light-mode surfaces:

- `components/customer/customer-navigation.tsx`
- `components/driver/driver-navigation.tsx`
- `components/driver/technician-status-workflow.tsx`
- many `app/manager/**` pages
- many `app/accountant/**` pages

### Why This Matters

If the client expects full theme support, token definitions alone are not enough. The frontend needs provider wiring, a visible toggle, token-based surfaces, and visual QA across all portals.

### Fix Checklist

- [ ] Mount `ThemeProvider` in `app/layout.tsx`.
- [ ] Add or restore a shared `ThemeToggle` component.
- [ ] Place the toggle in the shared dashboard shell.
- [ ] Place the toggle in customer navigation.
- [ ] Place the toggle in driver/technician navigation.
- [ ] Confirm default theme behavior. Current product preference is light first.
- [ ] Replace hard-coded neutral classes with token classes where appropriate:
  - [ ] `bg-white` -> `bg-card`, `bg-background`, or another tokenized surface
  - [ ] `text-slate-950` -> `text-foreground`
  - [ ] `text-slate-500` -> `text-muted-foreground`
  - [ ] `border-slate-200` -> `border-border`
  - [ ] `bg-slate-50` -> `bg-muted` or `bg-secondary`
- [ ] Keep semantic color badges, but add matching `dark:` variants.
- [ ] Test light mode across all portals.
- [ ] Test dark mode across all portals.
- [ ] Add theme acceptance criteria to docs.

### Theme Acceptance Criteria

- [ ] First visit defaults to light mode.
- [ ] User can switch to dark mode from every major navigation shell.
- [ ] Theme choice persists after refresh.
- [ ] No page remains visually light-only in dark mode.
- [ ] Text contrast passes WCAG 2.1 AA in both themes.
- [ ] Tables, cards, sheets, dialogs, dropdowns, maps, and charts remain legible in both themes.
- [ ] Screenshots are captured for representative pages in both themes.

## Gap 7: Responsive QA Is Too Generic

Severity: P1

### Concern

The docs mention responsive design, but do not provide enough route-level responsive acceptance criteria.

Current docs mention:

- Mobile: less than 640px
- Tablet: 640px to 1024px
- Desktop: greater than 1024px
- Large desktop: greater than 1440px

But the docs do not specify what each actual portal and complex table/map/chart screen should do at those sizes.

### Fix Checklist

- [ ] Add responsive acceptance criteria for each portal.
- [ ] Identify table-heavy screens that require mobile card layouts or horizontal scrolling.
- [ ] Identify map-heavy screens that require fixed height and no layout collapse.
- [ ] Identify dashboard/chart screens that need mobile stacking.
- [ ] Verify sticky headers/navs do not cover content.
- [ ] Verify dialogs/sheets fit on mobile.
- [ ] Verify long labels do not overflow buttons, cards, tabs, or nav items.

### Minimum Viewports To Test

- [ ] 390 x 844 mobile
- [ ] 768 x 1024 tablet
- [ ] 1366 x 768 desktop
- [ ] 1440 x 900 desktop
- [ ] 1920 x 1080 large desktop

## Gap 8: Accessibility Acceptance Is Too Generic

Severity: P1

### Concern

The SRS and UI docs mention WCAG 2.1 AA, keyboard navigation, screen readers, ARIA labels, landmarks, focus traps, and focus restoration. However, there is no practical frontend checklist per component/page type.

### Fix Checklist

- [ ] Add keyboard navigation checks for every nav system.
- [ ] Add focus management checks for dialogs, sheets, dropdowns, command menu, and modals.
- [ ] Add screen reader label checks for icon-only buttons.
- [ ] Add table accessibility checks.
- [ ] Add form label/error-message checks.
- [ ] Add color contrast checks for light and dark mode.
- [ ] Add map accessibility fallback content.
- [ ] Add chart accessibility fallback summaries.
- [ ] Add automated axe or equivalent accessibility check to QA plan.

## Gap 9: Loading, Empty, Error, and Permission States Need Tracking

Severity: P1

### Concern

The app has reusable empty/skeleton/spinner UI components and some table empty messages, but the docs do not require each route to define its loading, empty, error, and permission-denied states.

### Fix Checklist

- [ ] Add a "Frontend States Matrix" to docs.
- [ ] Define loading state for each data-driven route.
- [ ] Define empty state for each list/table/grid route.
- [ ] Define error state for API failures.
- [ ] Define permission-denied state for role-restricted pages.
- [ ] Define not-found state for detail pages.
- [ ] Define offline/degraded state where relevant.

### Suggested State Matrix Format

| Route | Loading | Empty | Error | Permission denied | Not found |
| --- | --- | --- | --- | --- | --- |
| `/admin/customers` | skeleton table | no customers found | retry panel | redirect/403 | N/A |
| `/admin/customers/[id]` | detail skeleton | N/A | retry panel | redirect/403 | customer not found |
| `/driver/jobs` | job cards skeleton | no assigned jobs | retry panel | redirect/403 | N/A |

## Gap 10: Frontend Testing Plan Needs Route-Level Coverage

Severity: P1

### Concern

`09_Testing_Plan_Document.md` mentions testing tools such as Playwright, Cypress, React Testing Library, Appium, and Lighthouse. It does not define a route-by-route frontend QA matrix.

### Fix Checklist

- [ ] Add frontend smoke tests for each role portal.
- [ ] Add navigation tests for each sidebar/top nav/mobile sheet.
- [ ] Add auth redirect tests per role.
- [ ] Add form validation tests for important forms.
- [ ] Add data-table filtering/sorting/pagination tests.
- [ ] Add map render tests for route/tracking screens.
- [ ] Add chart render tests for dashboard/report screens.
- [ ] Add visual regression screenshots for representative pages.
- [ ] Add light/dark screenshot comparisons.
- [ ] Add mobile viewport screenshots.
- [ ] Add Lighthouse performance/accessibility checks for key public/customer pages.

### Suggested Frontend QA Matrix

| Portal | Smoke navigation | Forms | Tables | Maps/charts | Responsive | A11y | Theme |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Admin | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Super Admin | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Dispatcher | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Customer | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Driver/Technician | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| HR | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Fleet | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Manager | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Accountant | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

## Gap 11: UI/UX Document Has Encoding Artifacts

Severity: P2

### Concern

`docs/04_UI_UX_Design_Document.md` contains corrupted characters in diagrams and arrows, such as `â”Œ`, `â”€`, and `â†’`.

### Why This Matters

This makes the document look unfinished or incorrectly exported, even if the product requirements are otherwise correct.

### Fix Checklist

- [ ] Replace corrupted box-drawing diagrams with clean ASCII diagrams.
- [ ] Replace corrupted arrows/checkmarks with plain ASCII equivalents.
- [ ] Confirm all markdown renders cleanly in the client handoff viewer.
- [ ] Avoid non-ASCII characters in future technical docs unless explicitly required.

## Gap 12: Frontend Stack Documentation Is Not Fully Aligned With Code

Severity: P2

### Concern

The docs mention some stack choices that are broader or different from what the current implementation uses.

Current implementation includes:

- Next.js 16.2.0
- React 19.2.4
- Tailwind CSS v4
- shadcn/Radix UI primitives
- lucide-react icons
- TanStack Table
- Recharts
- Leaflet
- Zustand
- React Hook Form
- Zod
- next-themes

Some docs mention choices such as Heroicons, Material Icons, Google Maps, Mapbox, or Chart.js. These may be acceptable as options, but the docs should distinguish "actual current stack" from "possible alternatives."

### Fix Checklist

- [ ] Update `00_TECHNOLOGY_STACK_SUMMARY.md` with the actual frontend packages.
- [ ] Update `04_UI_UX_Design_Document.md` component library notes to match shadcn/Radix and lucide-react.
- [ ] Update maps documentation to reflect Leaflet where currently used.
- [ ] Update chart documentation to reflect Recharts where currently used.
- [ ] Document `next-themes` only after provider/toggle implementation is complete.

## Recommended Fix Order

1. Create a route inventory and status matrix.
2. Fix the theme provider/toggle gap and document theme acceptance criteria.
3. Add customer portal and driver/technician portal docs.
4. Add Super Admin, Manager, and Accountant frontend sections.
5. Add route-level responsive, accessibility, and visual QA requirements.
6. Clean encoding artifacts in `04_UI_UX_Design_Document.md`.
7. Align stack documentation with actual package usage.

## Master Tracking Checklist

### Documentation

- [x] Add route inventory.
- [x] Add role portal screen maps.
- [x] Add customer portal docs.
- [x] Add driver/technician portal docs.
- [x] Add Super Admin frontend docs.
- [x] Add Manager frontend docs.
- [x] Add Accountant frontend docs.
- [x] Add theme/dark-mode acceptance criteria.
- [x] Add responsive QA matrix.
- [x] Add accessibility QA matrix.
- [x] Add loading/empty/error/permission state matrix.
- [x] Update frontend stack documentation.
- [x] Clean corrupted markdown characters.

### Implementation

- [x] Mount theme provider.
- [x] Add/restore theme toggle.
- [x] Place theme toggle in all required navs.
- [x] Replace hard-coded light-only classes in shared shells.
- [x] Replace hard-coded light-only classes in customer portal.
- [x] Replace hard-coded light-only classes in driver/technician portal.
- [x] Replace hard-coded light-only classes in manager portal.
- [x] Replace hard-coded light-only classes in accountant portal.
- [ ] Verify dark mode visually across role portals (manual QA).
- [x] Add missing loading states (pilot routes).
- [x] Add missing empty states (pilot routes).
- [ ] Add missing error states (pattern added; expand per route).
- [x] Add missing permission/not-found states (pilot detail routes).

### Testing and QA

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Run route smoke tests.
- [x] Run responsive viewport checks (Playwright mobile project + screenshots).
- [x] Run accessibility checks.
- [x] Run light/dark visual checks.
- [x] Capture screenshots for client-facing evidence.
- [ ] Attach QA evidence to the handoff or release notes.

## Definition of Done

This audit can be considered closed only when:

- Every implemented route has a documented purpose and status.
- Every role portal has a documented navigation and workflow map.
- Light and dark themes work across all major portals.
- Customer and driver/technician web portals are explicitly documented.
- Responsive and accessibility checks are defined and executed.
- Loading, empty, error, permission, and not-found states are tracked.
- The UI/UX markdown renders cleanly without corrupted characters.
- The frontend stack docs match the actual implementation.
- Build/lint and visual QA evidence are captured.

