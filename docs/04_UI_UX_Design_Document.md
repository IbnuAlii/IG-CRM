# 🎨 UI/UX Design Document
## CRM Enterprise Level System (SaaS)

**Document Version:** 1.0  
**Date:** 2024  
**Author:** System Architecture Team  
**Status:** Draft

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Design System](#2-design-system)
3. [Layout Structure](#3-layout-structure)
4. [Screen Wireframes & Descriptions](#4-screen-wireframes--descriptions)
5. [Navigation Flow](#5-navigation-flow)
6. [Responsive Design](#6-responsive-design)
7. [Mobile App Design](#7-mobile-app-design)
8. [Accessibility Guidelines](#8-accessibility-guidelines)
9. [Design Tools & Resources](#9-design-tools--resources)
10. [Role Portal Screen Maps](#10-role-portal-screen-maps)
11. [Frontend Route Inventory](./10_FRONTEND_ROUTE_INVENTORY.md)
12. [Frontend QA Matrices](./11_FRONTEND_QA_MATRICES.md)

---

## 1. Design Principles

### 1.1 Core Principles

1. **Clarity First**
   - Information hierarchy is clear and intuitive
   - Important actions are prominent
   - No unnecessary clutter

2. **Consistency**
   - Consistent patterns across all modules
   - Uniform color scheme and typography
   - Predictable navigation

3. **Efficiency**
   - Common tasks require minimal clicks
   - Keyboard shortcuts for power users
   - Bulk actions where applicable

4. **Feedback**
   - Clear success/error messages
   - Loading states for async operations
   - Real-time updates where relevant

5. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation support
   - Screen reader compatibility

6. **Mobile-First**
   - Responsive design for all screen sizes
   - Touch-friendly interface
   - Optimized for field workers

---

## 2. Design System

### 2.1 Color Palette

#### Primary Colors
- **Primary Blue**: `#2563EB` (Actions, links, primary buttons)
- **Primary Dark**: `#1E40AF` (Hover states, active states)
- **Primary Light**: `#3B82F6` (Secondary actions)

#### Secondary Colors
- **Success Green**: `#10B981` (Success messages, completed status)
- **Warning Orange**: `#F59E0B` (Warnings, pending status)
- **Error Red**: `#EF4444` (Errors, cancelled status)
- **Info Blue**: `#3B82F6` (Information messages)

#### Neutral Colors
- **Background**: `#FFFFFF` (Main background)
- **Surface**: `#F9FAFB` (Card backgrounds, sections)
- **Border**: `#E5E7EB` (Borders, dividers)
- **Text Primary**: `#111827` (Main text)
- **Text Secondary**: `#6B7280` (Secondary text)
- **Text Muted**: `#9CA3AF` (Disabled, placeholder text)

#### Status Colors
- **Pending**: `#F59E0B` (Orange)
- **In Progress**: `#3B82F6` (Blue)
- **Completed**: `#10B981` (Green)
- **Cancelled**: `#EF4444` (Red)
- **On Hold**: `#6B7280` (Gray)

### 2.2 Typography

#### Font Family
- **Primary Font**: Inter (Web), System fonts (Mobile)
- **Monospace**: JetBrains Mono (Code, IDs)

#### Font Sizes
- **H1**: 32px / 2rem (Page titles)
- **H2**: 24px / 1.5rem (Section titles)
- **H3**: 20px / 1.25rem (Subsection titles)
- **H4**: 18px / 1.125rem (Card titles)
- **Body Large**: 16px / 1rem (Body text)
- **Body**: 14px / 0.875rem (Default text)
- **Small**: 12px / 0.75rem (Captions, labels)
- **Tiny**: 10px / 0.625rem (Metadata)

#### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

#### Line Heights
- **Tight**: 1.2 (Headings)
- **Normal**: 1.5 (Body text)
- **Relaxed**: 1.75 (Long paragraphs)

### 2.3 Spacing System

Based on 4px grid:
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **2XL**: 48px
- **3XL**: 64px

### 2.4 Components

#### Buttons
- **Primary Button**: Blue background, white text, 8px border radius
- **Secondary Button**: White background, blue border, blue text
- **Danger Button**: Red background, white text
- **Ghost Button**: Transparent background, colored text
- **Sizes**: Small (32px), Medium (40px), Large (48px)

#### Input Fields
- **Height**: 40px
- **Border**: 1px solid #E5E7EB
- **Border Radius**: 6px
- **Padding**: 12px
- **Focus State**: Blue border (#2563EB), shadow

#### Cards
- **Background**: White
- **Border**: 1px solid #E5E7EB
- **Border Radius**: 8px
- **Shadow**: 0 1px 3px rgba(0,0,0,0.1)
- **Padding**: 16px or 24px

#### Tables
- **Header**: Light gray background (#F9FAFB)
- **Row Hover**: Light blue background (#F0F9FF)
- **Border**: 1px solid #E5E7EB
- **Padding**: 12px 16px

#### Badges
- **Size**: 20px height
- **Border Radius**: 12px
- **Padding**: 4px 12px
- **Font Size**: 12px

---

## 3. Layout Structure

### 3.1 Web Application Layout

```
┌─────────────────────────────────────────────────────────┐
│  Header (Fixed)                                         │
│  [Logo] [Search]              [Notifications] [Profile] │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │  Main Content Area                          │
│ (Fixed)  │  (Scrollable)                               │
│          │                                              │
│ - Dashboard                                             │
│ - CRM                                                   │
│ - Dispatch                                              │
│ - HR                                                    │
│ - Payroll                                               │
│ - Fleet                                                 │
│ - GPS Tracking                                          │
│ - Reports                                               │
│ - Settings                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### 3.2 Header Components

1. **Logo**: Company logo (left side)
2. **Global Search**: Search across all modules (center)
3. **Notifications**: Bell icon with badge count (right)
4. **User Menu**: Profile picture, name, dropdown (right)

### 3.3 Sidebar Navigation

- **Collapsible**: Can be collapsed to icons only
- **Active State**: Highlighted background for current page
- **Icons**: Material Icons or Heroicons
- **Badges**: Show counts (e.g., pending jobs, tickets)

### 3.4 Main Content Area

- **Breadcrumbs**: Show current location
- **Page Title**: H1 with action buttons
- **Filters**: Above content (date range, status, etc.)
- **Content**: Cards, tables, forms, charts
- **Pagination**: Bottom of lists

---

## 4. Screen Wireframes & Descriptions

### 4.1 Login Screen

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│         [Company Logo]              │
│                                     │
│    Welcome Back                     │
│    Sign in to your account          │
│                                     │
│    Email Address                    │
│    [________________________]       │
│                                     │
│    Password                         │
│    [________________________]  [👁] │
│                                     │
│    [ ] Remember me    Forgot?      │
│                                     │
│    [    Sign In    ]                │
│                                     │
│    ─────────── OR ───────────      │
│                                     │
│    [  Sign in with Google  ]        │
│                                     │
│    Don't have an account? Sign up   │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Centered card layout
- Email and password fields
- Show/hide password toggle
- Remember me checkbox
- Forgot password link
- Social login option (Enterprise)
- Sign up link for new users

---

### 4.2 Dashboard

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Dashboard                    [Date Range ▼] [Export]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Revenue  │  │ Jobs     │  │ Customers│  │ Techs  ││
│  │ $45,230  │  │ 24       │  │ 1,234    │  │ 12     ││
│  │ ↑ 12%    │  │ ↑ 5      │  │ ↑ 23     │  │ Active ││
│  └──────────┘  └──────────┘  └──────────┘  └────────┘│
│                                                         │
│  ┌────────────────────────┐  ┌────────────────────────┐│
│  │ Revenue Trend          │  │ Jobs by Status         ││
│  │ [Line Chart]           │  │ [Pie Chart]            ││
│  └────────────────────────┘  └────────────────────────┘│
│                                                         │
│  ┌────────────────────────────────────────────────────┐│
│  │ Recent Jobs                          [View All →]  ││
│  │ ┌──────────────────────────────────────────────┐  ││
│  │ │ Job #1234 | Customer | Status | Technician  │  ││
│  │ │ Job #1233 | Customer | Status | Technician  │  ││
│  │ │ Job #1232 | Customer | Status | Technician  │  ││
│  │ └──────────────────────────────────────────────┘  ││
│  └────────────────────────────────────────────────────┘│
│                                                         │
│  ┌────────────────────────────────────────────────────┐│
│  │ Upcoming Jobs                        [View All →]  ││
│  │ [Calendar Widget]                                  ││
│  └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Key metrics cards (KPIs)
- Charts and graphs
- Recent activity feed
- Quick actions
- Customizable widgets (drag-and-drop)
- Role-based content

---

### 4.3 Customer List (CRM)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Customers                    [+ New Customer] [Import]  │
├─────────────────────────────────────────────────────────┤
│ [Search...] [Filter ▼] [Status ▼] [Sort ▼] [View: List]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ [ ] Name        │ Email      │ Phone    │ Status  ││
│ ├─────────────────────────────────────────────────────┤│
│ │ ☑ John Smith    │ john@...   │ 555-...  │ Active  ││
│ │ ☑ Jane Doe      │ jane@...   │ 555-...  │ Active  ││
│ │ ☑ Bob Johnson   │ bob@...    │ 555-...  │ Inactive││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ Showing 1-25 of 1,234              [< 1 2 3 ... >]     │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Search bar
- Filters (status, tags, date)
- Bulk actions (select multiple)
- Sortable columns
- View toggle (list/grid)
- Pagination
- Export button

---

### 4.4 Customer Detail Page

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ John Smith                    [Edit] [More ▼]           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────────┐  ┌──────────────────────────────────┐│
│ │              │  │ Overview                          ││
│ │ [Photo/Icon] │  │ Email: john@example.com          ││
│ │              │  │ Phone: (555) 123-4567             ││
│ │ Active       │  │ Address: 123 Main St, City, ST   ││
│ │              │  │ Since: Jan 15, 2023              ││
│ └──────────────┘  │ Tags: [VIP] [Commercial]         ││
│                   └──────────────────────────────────┘│
│                                                         │
│ [Overview] [Jobs] [Quotes] [Tickets] [History]         │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Service History                                      ││
│ │ ┌─────────────────────────────────────────────────┐ ││
│ │ │ Date      │ Service    │ Technician │ Status  │ ││
│ │ │ 01/20/24  │ Repair     │ Mike       │ Done    │ ││
│ │ │ 01/15/24  │ Install    │ Sarah      │ Done    │ ││
│ │ └─────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Recent Activity                                      ││
│ │ • Quote sent on Jan 18                              ││
│ │ • Job completed on Jan 20                           ││
│ │ • Ticket created on Jan 22                          ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Customer header with key info
- Tabbed sections
- Service history table
- Activity timeline
- Quick actions (Create Job, Send Quote, etc.)
- Notes section

---

### 4.5 Job Creation Form

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Create New Job                              [Cancel]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Customer *                                              │
│ [Search customer or create new...]        [New Customer]│
│                                                         │
│ Service Type *                                          │
│ [Select service type ▼]                                 │
│                                                         │
│ Scheduled Date & Time *                                 │
│ [Date Picker] [Time Picker]                             │
│                                                         │
│ Priority                                                │
│ ○ Low  ○ Normal  ● High  ○ Emergency                   │
│                                                         │
│ Assigned Technician                                     │
│ [Select technician ▼]                                   │
│                                                         │
│ Description                                             │
│ [Text area - 5 rows]                                    │
│                                                         │
│ Special Instructions                                    │
│ [Text area - 3 rows]                                    │
│                                                         │
│ Estimated Duration                                      │
│ [__] hours [__] minutes                                 │
│                                                         │
│ [Attach Files] [Photo] [Document]                       │
│                                                         │
│                    [Save Draft]  [Create Job]           │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Step-by-step wizard (optional)
- Customer search/autocomplete
- Date/time picker
- Priority selection
- Technician assignment with availability check
- File attachments
- Form validation
- Save as draft option

---

### 4.6 Calendar View (Dispatch)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Schedule                    [Today] [< Week >] [Month] │
├─────────────────────────────────────────────────────────┤
│ [Filter: All Techs ▼] [+ New Job]                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Time  │ Tech 1    │ Tech 2    │ Tech 3    │ Tech 4    │
├───────┼───────────┼───────────┼───────────┼───────────┤
│ 8:00  │           │           │           │           │
│ 9:00  │ [Job #1]  │           │ [Job #2]  │           │
│       │ Customer  │           │ Customer  │           │
│ 10:00 │           │ [Job #3]  │           │           │
│ 11:00 │           │           │           │ [Job #4]  │
│ 12:00 │ [Lunch]   │           │           │           │
│ 13:00 │           │           │           │           │
│ 14:00 │ [Job #5]  │           │           │           │
│ 15:00 │           │           │           │           │
│ 16:00 │           │           │           │           │
│ 17:00 │           │           │           │           │
└───────┴───────────┴───────────┴───────────┴───────────┘
```

**Features:**
- Day/Week/Month views
- Drag-and-drop rescheduling
- Color-coded by status
- Technician columns
- Time slots
- Click to view/edit job
- Conflict detection (visual warning)

---

### 4.7 GPS Tracking Map

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Live Tracking              [Refresh] [Settings]         │
├─────────────────────────────────────────────────────────┤
│ [Filter: All Vehicles ▼] [Show Routes] [Geo-fences]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │                                                      ││
│ │              [Interactive Map]                       ││
│ │                                                      ││
│ │    🚗 Vehicle 1    🚗 Vehicle 2                      ││
│ │                                                      ││
│ │         📍 Job Location                             ││
│ │                                                      ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Vehicle List                                         ││
│ │ 🚗 Vehicle 1 - John Doe    [60 mph] [Moving]        ││
│ │ 🚗 Vehicle 2 - Jane Smith [0 mph]  [Idle]          ││
│ │ 🚗 Vehicle 3 - Bob Jones  [45 mph] [Moving]        ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Interactive map (Google Maps/Mapbox)
- Real-time vehicle markers
- Vehicle info panel
- Route display
- Geo-fence visualization
- Filter by vehicle/driver
- Playback controls for history

---

### 4.8 Report Builder

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Create Custom Report                    [Save] [Cancel]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Report Name *                                           │
│ [Enter report name...]                                  │
│                                                         │
│ ┌──────────────────┐  ┌──────────────────────────────┐│
│ │ Data Sources     │  │ Report Preview               ││
│ │                  │  │                              ││
│ │ ☑ Customers      │  │ [Generated Report Table]    ││
│ │ ☑ Jobs           │  │                              ││
│ │ ☑ Employees      │  │                              ││
│ │ ☐ Vehicles       │  │                              ││
│ │                  │  │                              ││
│ │ Fields:          │  │                              ││
│ │ ☑ Name           │  │                              ││
│ │ ☑ Email          │  │                              ││
│ │ ☑ Status         │  │                              ││
│ │ ☐ Phone          │  │                              ││
│ │                  │  │                              ││
│ │ Filters:         │  │                              ││
│ │ [Add Filter]     │  │                              ││
│ │                  │  │                              ││
│ │ Group By:        │  │                              ││
│ │ [None ▼]         │  │                              ││
│ └──────────────────┘  └──────────────────────────────┘│
│                                                         │
│                    [Generate Report]                    │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Drag-and-drop interface
- Data source selection
- Field selection
- Filter builder
- Grouping options
- Real-time preview
- Save and schedule options

---

## 5. Navigation Flow

### 5.1 Main Navigation Structure

```
Dashboard
├── Overview
├── Analytics
└── Quick Actions

CRM
├── Customers
│   ├── List
│   ├── Detail
│   └── Create/Edit
├── Quotes
│   ├── List
│   ├── Detail
│   └── Create
├── Contracts
└── Tickets

Dispatch
├── Jobs
│   ├── List
│   ├── Calendar
│   ├── Map View
│   └── Create/Edit
├── Schedule
└── Routes

HR
├── Employees
├── Attendance
├── Leave
└── Performance

Payroll
├── Process Payroll
├── Payslips
└── Reports

Fleet
├── Vehicles
├── Drivers
└── Maintenance

GPS Tracking
├── Live Map
├── Route History
└── Geo-fences

Reports
├── Sales
├── Service
├── Employee
├── Financial
└── Custom Reports

Settings
├── Company
├── Users
├── Roles
├── Integrations
└── Billing
```

### 5.2 User Flow Examples

#### Flow 1: Create Job from Customer
1. CRM → Customers → Select Customer
2. Customer Detail → "Create Job" button
3. Job Form (pre-filled with customer)
4. Fill details → Save
5. Redirect to Job Detail or Calendar

#### Flow 2: Process Payroll
1. HR → Payroll → "Process Payroll"
2. Select Pay Period
3. Review Calculations
4. Make Adjustments (if needed)
5. Approve Payroll
6. View Generated Payslips

#### Flow 3: Track Vehicle
1. GPS Tracking → Live Map
2. Select Vehicle from List
3. View Vehicle on Map
4. Click Vehicle → View Details
5. View Route History (if needed)

---

## 6. Responsive Design

### 6.1 Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

### 6.2 Mobile Adaptations

- **Sidebar**: Collapsed to hamburger menu
- **Tables**: Converted to cards
- **Forms**: Full-width inputs
- **Charts**: Simplified or hidden
- **Actions**: Bottom sheet or modal

### 6.3 Tablet Adaptations

- **Sidebar**: Collapsible, icon-only when collapsed
- **Tables**: Scrollable horizontally
- **Two-column layouts**: Stacked on smaller tablets

---

## 7. Mobile App Design

### 7.1 Navigation Pattern

**Bottom Tab Navigation:**
- Home (Dashboard)
- Jobs (Assigned jobs)
- Map (GPS tracking)
- Profile (User settings)

### 7.2 Key Screens

#### Mobile: Job List
- Card-based layout
- Swipe actions (Complete, Hold, etc.)
- Pull to refresh
- Filter button (top right)

#### Mobile: Job Detail
- Header with customer info
- Status badge
- Action buttons (Start, Complete, etc.)
- Notes section
- Photo upload
- Digital signature

#### Mobile: Clock In/Out
- Large button for clock action
- Current location display
- Today's hours summary
- History button

### 7.3 Mobile-Specific Features

- **Offline Mode**: View cached data
- **GPS Tracking**: Background location updates
- **Push Notifications**: Job assignments, updates
- **Camera Integration**: Photo uploads
- **Digital Signature**: Touch signature capture

---

## 8. Accessibility Guidelines

### 8.1 Keyboard Navigation

- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons, links
- **Arrow Keys**: Navigate lists, menus
- **Escape**: Close modals, dropdowns
- **Shortcuts**: Common actions (e.g., Ctrl+K for search)

### 8.2 Screen Reader Support

- **ARIA Labels**: All interactive elements
- **Landmarks**: Navigation, main, aside
- **Live Regions**: For dynamic updates
- **Alt Text**: All images, icons

### 8.3 Color Contrast

- **Text on Background**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio
- **Interactive Elements**: Clear focus indicators

### 8.4 Focus Management

- **Visible Focus**: Clear outline on focused elements
- **Focus Trap**: In modals
- **Focus Restoration**: After closing modals

---

## 9. Design Tools & Resources

### 9.1 Recommended Tools

- **Figma**: Primary design tool for wireframes and mockups
- **Draw.io**: For flowcharts and diagrams
- **Adobe XD**: Alternative design tool
- **Storybook**: Component library documentation

### 9.2 Design Assets (current implementation)

- **Icons**: lucide-react (primary)
- **Illustrations**: Custom or Undraw.co
- **Charts**: Recharts (primary). *Alternative:* Chart.js
- **Maps**: Leaflet (primary). *Alternatives:* Google Maps, Mapbox

### 9.3 Component Library (current implementation)

- **Framework**: Next.js 16 App Router + Tailwind CSS v4
- **UI**: shadcn/ui (Radix primitives)
- **Icons**: lucide-react
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **State**: Zustand
- **Theme**: next-themes (light default, class strategy)

---

## 10. Role Portal Screen Maps

Full route list: [10_FRONTEND_ROUTE_INVENTORY.md](./10_FRONTEND_ROUTE_INVENTORY.md).

### 10.1 Customer Portal

**Routes:** `/customer/home`, `/customer/active-service`, `/customer/quotes`, `/customer/billing`, `/customer/support`, `/customer/history`, `/customer/account`, plus detail routes `/customer/service/[id]`, `/customer/ride/[id]`.

| Flow | Primary screens | Actions |
| --- | --- | --- |
| Service request | Home | Request service, pick slot |
| Active tracking | Active Service | Track technician, contact |
| Quotes | Quotes | Review, approve, decline |
| Billing | Billing | Invoices, payment methods |
| Support | Support | Open ticket, view thread |
| Account | Account | Profile, addresses, preferences |

**Navigation:** Top nav on desktop; sheet menu on mobile (`CustomerNavigation`). Theme toggle in header and mobile sheet.

### 10.2 Driver / Technician Web Portal

**Routes:** `/driver/dashboard`, `/driver/jobs`, `/driver/jobs/[id]`, `/driver/schedule`, `/driver/route`, `/driver/performance`, `/driver/earnings`, `/driver/available-rides`, `/driver/profile`.

**Web vs mobile:** Status updates, job list, route view, and schedule are supported in the **web portal**. Offline GPS, background tracking, and push notifications are **native mobile** responsibilities (see Section 7).

| Flow | Screens | Actions |
| --- | --- | --- |
| Assigned jobs | Jobs, Job detail | Filter, open job, update status |
| Field workflow | Job detail | Photos, signature, checklist (UI simulated) |
| Route | Route | Map, stop order |
| Performance | Performance | KPI review |

### 10.3 Super Admin Platform

**Routes:** `/superadmin/dashboard`, `/superadmin/tenants`, `/superadmin/tenants/[id]`, `/superadmin/registrations`, `/superadmin/subscriptions`, `/superadmin/system-health`, `/superadmin/logs`, `/superadmin/settings`.

| Area | Purpose | Warning |
| --- | --- | --- |
| Registrations | Approve new tenants | Some actions may be UI-only |
| Subscriptions | Plan management | Confirm before billing changes |
| System health | Service status | Simulated metrics in demo |
| Logs | Audit trail | Filter by severity |

### 10.4 Manager Portal

**Routes:** `/manager/dashboard`, `/manager/team`, `/manager/operations`, `/manager/schedule`, `/manager/customers`, `/manager/approvals`, `/manager/reports`, `/manager/finance`.

**Limited finance:** `/manager/finance` is read-only summary — no payment capture or payroll execution (Accountant/Admin only).

### 10.5 Accountant Portal

**Routes:** `/accountant/dashboard`, `/accountant/invoices`, `/accountant/payments`, `/accountant/payroll`, `/accountant/customers`, `/accountant/reports`.

| Workflow | Screens |
| --- | --- |
| AR | Invoices, Payments |
| Payroll visibility | Payroll (read/review) |
| Customer billing | Customer Billing |
| Reporting | Reports |

### 10.6 Theme and dark mode

See [11_FRONTEND_QA_MATRICES.md](./11_FRONTEND_QA_MATRICES.md#theme-acceptance-criteria). Implementation uses `next-themes`, CSS variables in `app/globals.css`, and `ThemeToggle` in all major shells.

---

## 11. Design Deliverables Checklist

- [ ] Design system documentation
- [ ] Component library
- [ ] Wireframes for all major screens
- [ ] High-fidelity mockups
- [ ] Interactive prototypes
- [ ] Mobile app designs
- [ ] Responsive breakpoint designs
- [ ] Accessibility audit
- [ ] Design handoff documentation
- [ ] Style guide

---

## 12. Next Steps

1. Create detailed wireframes in Figma
2. Develop high-fidelity mockups
3. Build interactive prototypes
4. Conduct user testing
5. Iterate based on feedback
6. Create design system documentation
7. Hand off to development team

---

**Document Status:** ✅ Complete  
**Next Document:** System Architecture Document
