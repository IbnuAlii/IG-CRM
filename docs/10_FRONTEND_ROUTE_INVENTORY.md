# Frontend Route Inventory

**Generated:** 2026-06-04
**Total routes:** 95

This inventory maps every Next.js App Router page to its portal, purpose, and QA status.
Regenerate with: `node scripts/generate-route-inventory.mjs`

Related: [Frontend Gap Tracker](../issue/10_FRONTEND_GAP_AUDIT_AND_FIX_TRACKER.md) | [UI/UX Design](./04_UI_UX_Design_Document.md)

## Status legend

| Status | Meaning |
| --- | --- |
| implemented | UI present and wired to demo/mock data |
| needs QA | Implemented; awaiting visual/functional QA |
| placeholder | Shell only or redirect stub |
| needs design | Requires design sign-off |
| out of scope | Not in current release |

## Route inventory

### Root / Auth

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Root / Auth | Root redirect / landing | Navigate to login or role home | loading, redirect | needs QA | TBD |

### Auth

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/forgot-password` | Auth | Password recovery request | Submit email | loading, error, success | needs QA | TBD |
| `/login` | Auth | User authentication | Sign in, forgot password link | loading, error, validation | needs QA | TBD |
| `/reset-password` | Auth | Set new password | Submit new password | loading, error, validation | needs QA | TBD |
| `/two-factor` | Auth | Two-factor verification | Enter OTP code | loading, error | needs QA | TBD |
| `/verify-email` | Auth | Email verification | Confirm verification | loading, error, success | needs QA | TBD |

### Admin

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/admin` | Admin | Admin portal index redirect | Redirect to dashboard | redirect | implemented | TBD |
| `/admin/analytics` | Admin | Analytics dashboards | Review charts | loading, error | needs QA | TBD |
| `/admin/customers` | Admin | Customer directory | Search, filter, open customer | loading, empty, error, permission denied | needs QA | TBD |
| `/admin/customers/[id]` | Admin | Customer detail | View profile, related tabs | loading, error, not found, permission denied | needs QA | TBD |
| `/admin/dashboard` | Admin | Admin operations overview | Review KPIs, open modules | loading, empty, error | needs QA | TBD |
| `/admin/dispatch` | Admin | Dispatch board | View map, assign routes | loading, error | needs QA | TBD |
| `/admin/drivers` | Admin | Driver roster (admin) | Browse drivers | loading, empty, error | needs QA | TBD |
| `/admin/jobs` | Admin | Job list | Filter jobs, open job | loading, empty, error | needs QA | TBD |
| `/admin/jobs/[id]` | Admin | Job detail | View timeline, assign technician | loading, error, not found | needs QA | TBD |
| `/admin/quotes` | Admin | Quote list | Filter quotes, open detail | loading, empty, error | needs QA | TBD |
| `/admin/quotes/[id]` | Admin | Quote detail | Review line items, status | loading, error, not found | needs QA | TBD |
| `/admin/reports` | Admin | Admin reports | Select report, export | loading, empty, error | needs QA | TBD |
| `/admin/rides` | Admin | Rides overview | Monitor rides | loading, empty, error | needs QA | TBD |
| `/admin/settings` | Admin | Company settings | Update preferences | loading, error, validation | needs QA | TBD |
| `/admin/team` | Admin | Team management | View technicians, roles | loading, empty, error | needs QA | TBD |
| `/admin/tickets` | Admin | Support tickets | Filter, open ticket | loading, empty, error | needs QA | TBD |
| `/admin/tickets/[id]` | Admin | Ticket conversation | Reply, update status | loading, error, not found | needs QA | TBD |

### Super Admin

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/superadmin/dashboard` | Super Admin | Platform overview | Review tenants, health | loading, error | needs QA | TBD |
| `/superadmin/logs` | Super Admin | Platform audit logs | Filter logs | loading, empty, error | needs QA | TBD |
| `/superadmin/registrations` | Super Admin | Pending registrations | Approve or reject | loading, empty, error | needs QA | TBD |
| `/superadmin/settings` | Super Admin | Platform settings | Configure platform | loading, error | needs QA | TBD |
| `/superadmin/subscriptions` | Super Admin | Subscription management | Edit plans (UI may be simulated) | loading, empty, error | needs QA | TBD |
| `/superadmin/system-health` | Super Admin | System health monitoring | View service status | loading, error | needs QA | TBD |
| `/superadmin/tenants` | Super Admin | Tenant directory | Search tenants, open detail | loading, empty, error | needs QA | TBD |
| `/superadmin/tenants/[id]` | Super Admin | Tenant detail | Manage plan, limits | loading, error, not found | needs QA | TBD |

### Dispatcher

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/dispatcher` | Dispatcher | Dispatcher redirect | Redirect to dashboard | redirect | needs QA | TBD |
| `/dispatcher/dashboard` | Dispatcher | Dispatch overview | Monitor queue, KPIs | loading, error | needs QA | TBD |
| `/dispatcher/emergency` | Dispatcher | Emergency queue | Escalate, assign | loading, empty, error | needs QA | TBD |
| `/dispatcher/jobs` | Dispatcher | Dispatch job list | Assign, reschedule | loading, empty, error | needs QA | TBD |
| `/dispatcher/jobs/[id]` | Dispatcher | Dispatch job detail | Edit assignment | loading, error, not found | needs QA | TBD |
| `/dispatcher/reports` | Dispatcher | Dispatcher reports | Export metrics | loading, error | needs QA | TBD |
| `/dispatcher/routes` | Dispatcher | Route planning | Optimize routes | loading, error | needs QA | TBD |
| `/dispatcher/schedule` | Dispatcher | Schedule board | Drag jobs, filter | loading, error | needs QA | TBD |
| `/dispatcher/technicians` | Dispatcher | Technician availability | View capacity | loading, empty, error | needs QA | TBD |

### Customer

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/customer` | Customer | Customer portal redirect | Redirect to home | redirect | needs QA | TBD |
| `/customer/account` | Customer | Account settings | Edit profile, addresses, payments | loading, error, validation | needs QA | TBD |
| `/customer/active-rides` | Customer | Active rides (legacy alias) | View active ride | loading, empty, error | needs QA | TBD |
| `/customer/active-service` | Customer | Active service tracking | Track technician, contact support | loading, empty, error | needs QA | TBD |
| `/customer/billing` | Customer | Billing and invoices | View invoices, payment methods | loading, empty, error | needs QA | TBD |
| `/customer/history` | Customer | Service history | Browse past services | loading, empty, error | needs QA | TBD |
| `/customer/home` | Customer | Customer portal home | Request service, view appointments | loading, empty, error | needs QA | TBD |
| `/customer/quotes` | Customer | Quote review | Approve or decline quotes | loading, empty, error | needs QA | TBD |
| `/customer/ride/[id]` | Customer | Ride detail | Track ride progress | loading, error, not found | needs QA | TBD |
| `/customer/service/[id]` | Customer | Service appointment detail | View status, reschedule | loading, error, not found | needs QA | TBD |
| `/customer/support` | Customer | Support tickets | Create ticket, view history | loading, empty, error | needs QA | TBD |

### Driver / Technician

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/driver` | Driver / Technician | Driver portal redirect | Redirect to dashboard | redirect | needs QA | TBD |
| `/driver/available-rides` | Driver / Technician | Available ride offers | Accept or decline rides | loading, empty, error | needs QA | TBD |
| `/driver/dashboard` | Driver / Technician | Technician dashboard | View today jobs, stats | loading, empty, error | needs QA | TBD |
| `/driver/earnings` | Driver / Technician | Earnings summary | View payouts | loading, empty, error | needs QA | TBD |
| `/driver/jobs` | Driver / Technician | Assigned jobs list | Filter jobs, open detail | loading, empty, error | needs QA | TBD |
| `/driver/jobs/[id]` | Driver / Technician | Job detail and status workflow | Update status, photos, signature | loading, error, not found | needs QA | TBD |
| `/driver/performance` | Driver / Technician | Performance metrics | Review KPIs | loading, error | needs QA | TBD |
| `/driver/profile` | Driver / Technician | Technician profile | Edit profile, certifications | loading, error, validation | needs QA | TBD |
| `/driver/route` | Driver / Technician | Route map view | Navigate stops | loading, error | needs QA | TBD |
| `/driver/schedule` | Driver / Technician | Work schedule | View calendar | loading, empty, error | needs QA | TBD |

### HR

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/hr` | HR | HR portal redirect | Redirect to dashboard | redirect | needs QA | TBD |
| `/hr/attendance` | HR | Attendance tracking | Review timesheets | loading, empty, error | needs QA | TBD |
| `/hr/dashboard` | HR | HR overview | Review workforce KPIs | loading, error | needs QA | TBD |
| `/hr/employees` | HR | Employee directory | Search employees | loading, empty, error | needs QA | TBD |
| `/hr/leave` | HR | Leave management | Approve requests | loading, empty, error | needs QA | TBD |
| `/hr/payroll` | HR | Payroll runs | Review payroll | loading, empty, error | needs QA | TBD |
| `/hr/reports` | HR | HR reports | Export reports | loading, error | needs QA | TBD |
| `/hr/training` | HR | Training and certifications | Track compliance | loading, empty, error | needs QA | TBD |

### Fleet

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/fleet` | Fleet | Fleet portal redirect | Redirect to dashboard | redirect | needs QA | TBD |
| `/fleet/dashboard` | Fleet | Fleet overview map | Monitor vehicles | loading, error | needs QA | TBD |
| `/fleet/drivers` | Fleet | Fleet drivers | Assign drivers | loading, empty, error | needs QA | TBD |
| `/fleet/fuel` | Fleet | Fuel logs | Record fuel entries | loading, empty, error | needs QA | TBD |
| `/fleet/geofences` | Fleet | Geofence management | Create geofences | loading, empty, error | needs QA | TBD |
| `/fleet/maintenance` | Fleet | Maintenance schedule | Log service | loading, empty, error | needs QA | TBD |
| `/fleet/reports` | Fleet | Fleet reports | Run behavior reports | loading, error | needs QA | TBD |
| `/fleet/routes` | Fleet | Route history | Review past routes | loading, empty, error | needs QA | TBD |
| `/fleet/tracking` | Fleet | Live GPS tracking | Track vehicles on map | loading, error | needs QA | TBD |
| `/fleet/vehicles` | Fleet | Vehicle directory | Add vehicle, open detail | loading, empty, error | needs QA | TBD |

### Manager

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/manager` | Manager | Manager redirect | Redirect to dashboard | redirect | needs QA | TBD |
| `/manager/approvals` | Manager | Approval queue | Approve quotes/expenses | loading, empty, error | needs QA | TBD |
| `/manager/customers` | Manager | Customer oversight | Review accounts | loading, empty, error | needs QA | TBD |
| `/manager/dashboard` | Manager | Manager overview | Review team KPIs | loading, error | needs QA | TBD |
| `/manager/finance` | Manager | Limited finance view | View summaries (read-only scope) | loading, error, permission denied | needs QA | TBD |
| `/manager/operations` | Manager | Operations board | Monitor jobs | loading, error | needs QA | TBD |
| `/manager/reports` | Manager | Manager reports | Export data | loading, error | needs QA | TBD |
| `/manager/schedule` | Manager | Team schedule | View calendar | loading, empty, error | needs QA | TBD |
| `/manager/team` | Manager | Team roster | View team performance | loading, empty, error | needs QA | TBD |

### Accountant

| Route | Role/portal | Purpose | Main actions | States required | Status | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| `/accountant` | Accountant | Accountant redirect | Redirect to dashboard | redirect | needs QA | TBD |
| `/accountant/customers` | Accountant | Customer billing | Manage billing accounts | loading, empty, error | needs QA | TBD |
| `/accountant/dashboard` | Accountant | Accounting overview | Review AR/AP KPIs | loading, error | needs QA | TBD |
| `/accountant/invoices` | Accountant | Invoice management | Create, send invoices | loading, empty, error | needs QA | TBD |
| `/accountant/payments` | Accountant | Payment processing | Record payments | loading, empty, error | needs QA | TBD |
| `/accountant/payroll` | Accountant | Payroll visibility | Review payroll runs | loading, empty, error | needs QA | TBD |
| `/accountant/reports` | Accountant | Financial reports | Export ledgers | loading, error | needs QA | TBD |
