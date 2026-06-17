# 👤 User Stories / Use Case Document
## CRM Enterprise Level System (SaaS)

**Document Version:** 1.0  
**Date:** 2024  
**Author:** System Architecture Team  
**Status:** Draft

---

## Table of Contents

1. [User Stories Overview](#1-user-stories-overview)
2. [User Stories by Module](#2-user-stories-by-module)
3. [Use Cases by Role](#3-use-cases-by-role)
4. [User Journey Maps](#4-user-journey-maps)

---

## 1. User Stories Overview

### User Story Format
**As a** [role]  
**I want to** [action]  
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

---

## 2. User Stories by Module

### 2.1 Authentication & User Management

#### US-1.1: User Registration
**As a** new company administrator  
**I want to** register my company and create an account  
**So that** I can start using the CRM system

**Acceptance Criteria:**
- [ ] User can enter company name, email, and password
- [ ] System validates email format and password strength
- [ ] System sends verification email
- [ ] User must verify email before accessing system
- [ ] System creates tenant database upon verification
- [ ] User receives welcome email with onboarding steps

**Priority:** High  
**Story Points:** 5

---

#### US-1.2: User Login
**As a** system user  
**I want to** log in with my email and password  
**So that** I can access the CRM system

**Acceptance Criteria:**
- [ ] User can enter email and password
- [ ] System validates credentials
- [ ] System creates secure session token
- [ ] System redirects to dashboard after login
- [ ] System logs login attempt
- [ ] System locks account after 5 failed attempts

**Priority:** High  
**Story Points:** 3

---

#### US-1.3: Two-Factor Authentication
**As a** security-conscious user  
**I want to** enable 2FA on my account  
**So that** my account is more secure

**Acceptance Criteria:**
- [ ] User can enable 2FA from settings
- [ ] System generates QR code for authenticator app
- [ ] User must enter 2FA code during login
- [ ] System provides backup codes
- [ ] User can disable 2FA with password confirmation

**Priority:** Medium  
**Story Points:** 5

---

#### US-1.4: Password Reset
**As a** user who forgot password  
**I want to** reset my password via email  
**So that** I can regain access to my account

**Acceptance Criteria:**
- [ ] User can request password reset from login page
- [ ] System sends reset link to registered email
- [ ] Reset link expires after 1 hour
- [ ] User can set new password via reset link
- [ ] System invalidates old password upon reset
- [ ] System sends confirmation email

**Priority:** High  
**Story Points:** 3

---

### 2.2 CRM Module

#### US-2.1: Create Customer Profile
**As a** sales representative  
**I want to** create a new customer profile  
**So that** I can track customer information and history

**Acceptance Criteria:**
- [ ] User can enter customer name, email, phone, address
- [ ] System validates email and phone format
- [ ] System checks for duplicate customers (email/phone)
- [ ] User can add multiple addresses
- [ ] User can add notes and tags
- [ ] System saves customer and displays success message
- [ ] Customer appears in customer list immediately

**Priority:** High  
**Story Points:** 3

---

#### US-2.2: View Customer Service History
**As a** customer service representative  
**I want to** view a customer's complete service history  
**So that** I can understand their relationship with us

**Acceptance Criteria:**
- [ ] User can search for customer by name/email/phone
- [ ] System displays all past jobs/services for customer
- [ ] Services are sorted by date (newest first)
- [ ] User can filter by date range, service type, status
- [ ] Each service shows: date, technician, description, cost, status
- [ ] User can click service to view full details

**Priority:** High  
**Story Points:** 3

---

#### US-2.3: Create and Send Quote
**As a** sales representative  
**I want to** create a quote and send it to a customer  
**So that** the customer can review and approve pricing

**Acceptance Criteria:**
- [ ] User can create quote linked to customer
- [ ] User can add line items with description, quantity, price
- [ ] System calculates subtotal, tax, and total
- [ ] User can add notes and terms
- [ ] User can send quote via email
- [ ] System tracks quote status (Sent, Viewed, Accepted, Rejected)
- [ ] System generates PDF quote with company branding
- [ ] User receives notification when customer views/accepts quote

**Priority:** High  
**Story Points:** 5

---

#### US-2.4: Convert Quote to Job
**As a** dispatcher  
**I want to** convert an accepted quote to a job  
**So that** I can schedule the service

**Acceptance Criteria:**
- [ ] User can view accepted quotes
- [ ] User can click "Convert to Job" on quote
- [ ] System creates job with quote details pre-filled
- [ ] User can modify job details before saving
- [ ] System links job to original quote
- [ ] Quote status changes to "Converted"
- [ ] Customer receives job confirmation email

**Priority:** High  
**Story Points:** 3

---

#### US-2.5: Create Support Ticket
**As a** customer service representative  
**I want to** create a support ticket for a customer complaint  
**So that** we can track and resolve the issue

**Acceptance Criteria:**
- [ ] User can create ticket linked to customer
- [ ] User can set priority (Low, Medium, High, Urgent)
- [ ] User can add description and attach files
- [ ] User can assign ticket to staff member
- [ ] System sends notification to assigned staff
- [ ] System tracks ticket status and resolution time
- [ ] Customer receives email confirmation

**Priority:** Medium  
**Story Points:** 5

---

### 2.3 Dispatch & Scheduling Module

#### US-3.1: Create Job
**As a** dispatcher  
**I want to** create a new job  
**So that** I can schedule service for a customer

**Acceptance Criteria:**
- [ ] User can select customer from list or create new
- [ ] User can enter job details: service type, description, priority
- [ ] User can set scheduled date and time
- [ ] User can set estimated duration
- [ ] User can add special instructions
- [ ] System validates date/time is in future
- [ ] System saves job with status "Pending"
- [ ] Job appears in calendar view

**Priority:** High  
**Story Points:** 3

---

#### US-3.2: Assign Job to Technician
**As a** dispatcher  
**I want to** assign a job to a technician  
**So that** the technician knows what work to do

**Acceptance Criteria:**
- [ ] User can view unassigned jobs
- [ ] User can view available technicians with their skills and location
- [ ] User can assign job to technician
- [ ] System checks technician availability (no conflicts)
- [ ] System sends notification to technician (email/SMS/app)
- [ ] Job status changes to "Assigned"
- [ ] Job appears in technician's schedule

**Priority:** High  
**Story Points:** 5

---

#### US-3.3: View Calendar Schedule
**As a** dispatcher  
**I want to** view all jobs in calendar format  
**So that** I can see the schedule at a glance

**Acceptance Criteria:**
- [ ] User can view calendar in Day, Week, Month views
- [ ] Jobs are displayed as blocks on calendar
- [ ] User can filter by technician, customer, job type, status
- [ ] User can drag and drop jobs to reschedule
- [ ] System shows conflicts when scheduling
- [ ] User can click job to view/edit details
- [ ] Calendar updates in real-time

**Priority:** High  
**Story Points:** 8

---

#### US-3.4: Optimize Routes
**As a** dispatcher  
**I want to** optimize routes for multiple jobs  
**So that** technicians can complete jobs efficiently

**Acceptance Criteria:**
- [ ] User can select multiple jobs for a technician
- [ ] User can click "Optimize Route"
- [ ] System calculates optimal route considering distance, traffic, time windows
- [ ] System displays route on map with turn-by-turn directions
- [ ] System shows estimated travel time and distance
- [ ] User can accept or modify suggested route
- [ ] System updates job order in technician's schedule

**Priority:** Medium  
**Story Points:** 8

---

#### US-3.5: Update Job Status (Mobile)
**As a** technician  
**I want to** update job status from my mobile app  
**So that** the office knows the job progress

**Acceptance Criteria:**
- [ ] Technician can view assigned jobs in mobile app
- [ ] Technician can change status: In Progress, Completed, On Hold
- [ ] When marking "In Progress", system records start time
- [ ] When marking "Completed", system records completion time
- [ ] Technician can add notes and photos
- [ ] System sends notification to dispatcher
- [ ] Job status updates in real-time on web dashboard

**Priority:** High  
**Story Points:** 5

---

### 2.4 HR Management Module

#### US-4.1: Create Employee Profile
**As an** HR officer  
**I want to** create an employee profile  
**So that** we can manage employee information

**Acceptance Criteria:**
- [ ] User can enter employee personal information
- [ ] User can set employee role and permissions
- [ ] User can upload employee documents (ID, contract)
- [ ] User can set employment start date
- [ ] System creates employee account
- [ ] System sends welcome email to employee
- [ ] Employee appears in employee list

**Priority:** High  
**Story Points:** 5

---

#### US-4.2: Clock In/Out
**As a** technician  
**I want to** clock in and out from mobile app  
**So that** my hours are tracked accurately

**Acceptance Criteria:**
- [ ] Employee can clock in from mobile app
- [ ] System records clock-in time and GPS location
- [ ] Employee can clock out from mobile app
- [ ] System records clock-out time and GPS location
- [ ] System calculates hours worked
- [ ] Employee can view clock in/out history
- [ ] System prevents clocking in twice without clocking out

**Priority:** High  
**Story Points:** 5

---

#### US-4.3: Request Leave
**As an** employee  
**I want to** submit a leave request  
**So that** I can take time off work

**Acceptance Criteria:**
- [ ] Employee can create leave request from portal
- [ ] Employee can select leave type (vacation, sick, personal)
- [ ] Employee can select start and end dates
- [ ] Employee can add reason/notes
- [ ] System checks available leave balance
- [ ] System sends notification to manager for approval
- [ ] Employee receives notification when approved/rejected
- [ ] System updates leave balance upon approval

**Priority:** Medium  
**Story Points:** 5

---

#### US-4.4: Approve Leave Request
**As a** manager  
**I want to** approve or reject leave requests  
**So that** I can manage team schedules

**Acceptance Criteria:**
- [ ] Manager can view pending leave requests
- [ ] Manager can see employee's leave balance
- [ ] Manager can approve or reject request
- [ ] Manager can add comments
- [ ] System sends notification to employee
- [ ] System updates leave balance if approved
- [ ] System blocks dates in employee's calendar if approved

**Priority:** Medium  
**Story Points:** 3

---

### 2.5 Payroll Module

#### US-5.1: Process Payroll
**As an** HR officer  
**I want to** process payroll for all employees  
**So that** employees get paid on time

**Acceptance Criteria:**
- [ ] User can select pay period (weekly, bi-weekly, monthly)
- [ ] System calculates hours from attendance data
- [ ] System calculates overtime (over 40 hours/week)
- [ ] System applies tax calculations
- [ ] System applies deductions (insurance, 401k, etc.)
- [ ] User can review and adjust calculations
- [ ] User can approve payroll
- [ ] System generates payslips for all employees
- [ ] System emails payslips to employees

**Priority:** High  
**Story Points:** 13

---

#### US-5.2: View Payslip
**As an** employee  
**I want to** view my payslip  
**So that** I can see my earnings and deductions

**Acceptance Criteria:**
- [ ] Employee can access payslips from employee portal
- [ ] Employee can view payslips by pay period
- [ ] Payslip shows: gross pay, deductions, net pay, hours worked
- [ ] Employee can download payslip as PDF
- [ ] Employee can view payslip history

**Priority:** Medium  
**Story Points:** 3

---

### 2.6 Fleet Management Module

#### US-6.1: Add Vehicle
**As a** fleet manager  
**I want to** add a new vehicle to the fleet  
**So that** I can track and manage it

**Acceptance Criteria:**
- [ ] User can enter vehicle information (make, model, year, VIN, license plate)
- [ ] User can set vehicle status (Active, In Maintenance)
- [ ] User can upload registration and insurance documents
- [ ] User can set insurance and registration expiration dates
- [ ] System saves vehicle
- [ ] System sends reminders before expiration dates

**Priority:** Medium  
**Story Points:** 3

---

#### US-6.2: Log Maintenance
**As a** fleet manager  
**I want to** log vehicle maintenance  
**So that** I can track maintenance history and costs

**Acceptance Criteria:**
- [ ] User can select vehicle
- [ ] User can enter maintenance type (oil change, repair, inspection)
- [ ] User can enter date, cost, vendor, description
- [ ] User can upload receipts/invoices
- [ ] System saves maintenance record
- [ ] System updates vehicle maintenance history
- [ ] System calculates total maintenance cost per vehicle

**Priority:** Medium  
**Story Points:** 3

---

### 2.7 GPS & Tracking Module

#### US-7.1: View Real-time Vehicle Location
**As a** dispatcher  
**I want to** view real-time vehicle locations on a map  
**So that** I can see where technicians are

**Acceptance Criteria:**
- [ ] User can view map with all active vehicles
- [ ] Vehicle locations update every 30 seconds
- [ ] User can click vehicle to see driver name and status
- [ ] User can see vehicle speed and direction
- [ ] User can filter by vehicle or driver
- [ ] Map shows vehicle's assigned jobs

**Priority:** High  
**Story Points:** 8

---

#### US-7.2: View Route History
**As a** manager  
**I want to** view historical routes for a vehicle  
**So that** I can analyze driver behavior and efficiency

**Acceptance Criteria:**
- [ ] User can select vehicle and date range
- [ ] System displays route on map with timeline
- [ ] User can play back route with timestamps
- [ ] System shows stops and durations
- [ ] System calculates total distance and time
- [ ] User can export route data

**Priority:** Medium  
**Story Points:** 5

---

#### US-7.3: Create Geo-fence
**As a** dispatcher  
**I want to** create a geo-fence around a customer location  
**So that** I get notified when technician arrives

**Acceptance Criteria:**
- [ ] User can create geo-fence on map (circular or polygonal)
- [ ] User can link geo-fence to job or customer
- [ ] User can set alert type (entry, exit, both)
- [ ] System sends notification when vehicle enters/exits
- [ ] System records geo-fence events in job history

**Priority:** Low  
**Story Points:** 8

---

### 2.8 Reports & Analytics Module

#### US-8.1: Generate Sales Report
**As a** manager  
**I want to** generate a sales report  
**So that** I can analyze revenue and performance

**Acceptance Criteria:**
- [ ] User can select report type (Revenue, Conversion, Sales Performance)
- [ ] User can select date range
- [ ] User can filter by customer, service type, employee
- [ ] System generates report with charts and tables
- [ ] User can export report as PDF or Excel
- [ ] Report shows: revenue, number of jobs, average job value, trends

**Priority:** High  
**Story Points:** 5

---

#### US-8.2: Create Custom Report
**As an** admin  
**I want to** create a custom report  
**So that** I can analyze specific metrics

**Acceptance Criteria:**
- [ ] User can access report builder
- [ ] User can select data sources (customers, jobs, employees, etc.)
- [ ] User can add filters and grouping
- [ ] User can select metrics and calculations
- [ ] User can preview report
- [ ] User can save report for future use
- [ ] User can schedule report to run automatically

**Priority:** Medium  
**Story Points:** 13

---

#### US-8.3: View Dashboard
**As a** manager  
**I want to** view a dashboard with key metrics  
**So that** I can quickly see business performance

**Acceptance Criteria:**
- [ ] Dashboard displays key metrics: revenue, jobs today, active customers, etc.
- [ ] Metrics update in real-time
- [ ] Dashboard shows charts and graphs
- [ ] User can customize dashboard widgets
- [ ] User can filter dashboard by date range
- [ ] Dashboard is role-based (shows relevant metrics)

**Priority:** High  
**Story Points:** 8

---

## 3. Use Cases by Role

### 3.1 Super Admin Use Cases

#### UC-SA-1: Onboard New Tenant
**Actor:** Super Admin  
**Goal:** Register a new company/tenant in the system

**Preconditions:**
- Super Admin is logged in
- New company has completed registration form

**Main Flow:**
1. Super Admin receives notification of new registration
2. Super Admin reviews company information
3. Super Admin approves registration
4. System creates tenant database
5. System sends welcome email to company admin
6. System provisions subscription (trial or paid)

**Postconditions:**
- Tenant database is created
- Company admin can access system
- Subscription is active

---

#### UC-SA-2: Monitor System Health
**Actor:** Super Admin  
**Goal:** Monitor overall system performance and health

**Preconditions:**
- Super Admin is logged in

**Main Flow:**
1. Super Admin navigates to system monitoring dashboard
2. System displays: server status, database status, API response times, error rates
3. Super Admin reviews metrics
4. If issues detected, Super Admin investigates and resolves

**Postconditions:**
- System health is monitored
- Issues are identified and resolved

---

### 3.2 Admin Use Cases

#### UC-A-1: Manage Users
**Actor:** Admin  
**Goal:** Add, edit, or remove users from the system

**Preconditions:**
- Admin is logged in
- Admin has user management permissions

**Main Flow:**
1. Admin navigates to Users page
2. Admin clicks "Add User"
3. Admin enters user information (name, email, role)
4. System validates email (not already in use)
5. System creates user account
6. System sends invitation email to user
7. User receives email and sets password
8. User can now log in

**Alternative Flows:**
- 4a. Email already exists: System shows error, Admin enters different email
- 5a. Admin edits existing user: Admin selects user, modifies information, saves

**Postconditions:**
- New user is created and can access system
- User receives invitation email

---

#### UC-A-2: Configure System Settings
**Actor:** Admin  
**Goal:** Configure company-wide settings

**Preconditions:**
- Admin is logged in

**Main Flow:**
1. Admin navigates to Settings page
2. Admin modifies settings (company name, logo, timezone, etc.)
3. Admin saves settings
4. System validates and saves changes
5. System displays success message
6. Changes take effect immediately

**Postconditions:**
- Settings are updated
- All users see updated settings

---

### 3.3 Dispatcher Use Cases

#### UC-D-1: Schedule Job
**Actor:** Dispatcher  
**Goal:** Create and schedule a job for a customer

**Preconditions:**
- Dispatcher is logged in
- Customer exists in system

**Main Flow:**
1. Dispatcher navigates to Jobs page
2. Dispatcher clicks "Create Job"
3. Dispatcher selects customer (or creates new)
4. Dispatcher enters job details (service type, description, priority)
5. Dispatcher sets scheduled date and time
6. Dispatcher selects technician
7. System checks technician availability
8. If available, system assigns job
9. System sends notification to technician
10. System sends confirmation to customer

**Alternative Flows:**
- 7a. Technician not available: System shows conflict, Dispatcher selects different technician or time

**Postconditions:**
- Job is created and assigned
- Technician receives notification
- Customer receives confirmation

---

#### UC-D-2: Monitor Job Progress
**Actor:** Dispatcher  
**Goal:** Track real-time status of all jobs

**Preconditions:**
- Dispatcher is logged in
- Jobs exist in system

**Main Flow:**
1. Dispatcher navigates to Dispatch Dashboard
2. System displays all jobs with status (Pending, In Progress, Completed)
3. Dispatcher can see technician locations on map
4. Dispatcher receives real-time updates when job status changes
5. If job is delayed, Dispatcher can contact technician or reassign

**Postconditions:**
- Dispatcher has visibility into all jobs
- Issues are identified and resolved quickly

---

### 3.4 Technician Use Cases

#### UC-T-1: View Assigned Jobs
**Actor:** Technician  
**Goal:** See jobs assigned to me

**Preconditions:**
- Technician is logged in (mobile app)
- Jobs are assigned to technician

**Main Flow:**
1. Technician opens mobile app
2. Technician navigates to "My Jobs"
3. System displays list of assigned jobs (today and upcoming)
4. Technician can see: customer name, address, service type, scheduled time
5. Technician can tap job to view full details
6. Technician can see route to job on map

**Postconditions:**
- Technician knows what jobs to complete
- Technician can navigate to job location

---

#### UC-T-2: Complete Job
**Actor:** Technician  
**Goal:** Mark job as completed and record details

**Preconditions:**
- Technician is logged in (mobile app)
- Job is assigned to technician
- Technician is at job location

**Main Flow:**
1. Technician arrives at job location
2. Technician marks job as "In Progress" in app
3. Technician performs service
4. Technician takes photos (if needed)
5. Technician adds notes about work completed
6. Technician gets customer signature (digital)
7. Technician marks job as "Completed"
8. System records completion time
9. System sends notification to dispatcher
10. System sends completion email to customer

**Postconditions:**
- Job is marked as completed
- Job details are recorded
- Customer and dispatcher are notified

---

### 3.5 HR Officer Use Cases

#### UC-HR-1: Process Monthly Payroll
**Actor:** HR Officer  
**Goal:** Calculate and process payroll for all employees

**Preconditions:**
- HR Officer is logged in
- Pay period has ended
- Attendance data is available

**Main Flow:**
1. HR Officer navigates to Payroll page
2. HR Officer selects pay period (e.g., January 2024)
3. HR Officer clicks "Calculate Payroll"
4. System retrieves attendance data for all employees
5. System calculates: regular hours, overtime, gross pay
6. System applies taxes and deductions
7. System calculates net pay
8. HR Officer reviews calculations
9. HR Officer makes adjustments if needed
10. HR Officer approves payroll
11. System generates payslips
12. System emails payslips to employees

**Alternative Flows:**
- 9a. HR Officer needs to add bonus: HR Officer adds bonus to employee, recalculates

**Postconditions:**
- Payroll is processed
- All employees receive payslips
- Payroll records are saved

---

### 3.6 Manager Use Cases

#### UC-M-1: View Team Performance
**Actor:** Manager  
**Goal:** Analyze team performance metrics

**Preconditions:**
- Manager is logged in
- Manager has team assigned

**Main Flow:**
1. Manager navigates to Reports page
2. Manager selects "Team Performance Report"
3. Manager selects date range and team members
4. System generates report showing:
   - Jobs completed per employee
   - Average job duration
   - Customer satisfaction scores
   - On-time arrival rates
5. Manager reviews report
6. Manager exports report if needed
7. Manager uses insights for performance reviews

**Postconditions:**
- Manager has performance data
- Manager can make data-driven decisions

---

## 4. User Journey Maps

### 4.1 Customer Service Journey

**Persona:** Sarah, Customer Service Representative

1. **Morning Routine**
   - Logs in to system
   - Checks dashboard for new tickets and urgent issues
   - Reviews today's scheduled jobs

2. **Handling Customer Inquiry**
   - Customer calls with complaint
   - Searches for customer in CRM
   - Views customer service history
   - Creates support ticket
   - Assigns ticket to appropriate technician
   - Sends confirmation email to customer

3. **Follow-up**
   - Monitors ticket status
   - Receives notification when ticket is resolved
   - Contacts customer to confirm satisfaction
   - Closes ticket

**Pain Points:**
- Switching between multiple systems
- Not having complete customer history

**Solutions:**
- All information in one place
- Complete customer timeline

---

### 4.2 Technician Field Work Journey

**Persona:** Mike, Field Technician

1. **Start of Day**
   - Opens mobile app
   - Clocks in (GPS location recorded)
   - Views assigned jobs for the day
   - Reviews job details and customer information

2. **Traveling to Job**
   - Uses app navigation to job location
   - System tracks location in real-time
   - Receives notification if job is cancelled or changed

3. **At Job Site**
   - Arrives at location (geo-fence triggers notification)
   - Marks job as "In Progress"
   - Performs service
   - Takes photos of work
   - Gets customer signature
   - Marks job as "Completed"
   - Adds notes about work done

4. **End of Day**
   - Completes all assigned jobs
   - Clocks out
   - Reviews day's work summary

**Pain Points:**
- Not knowing job details until arriving
- Manual paperwork
- Communication issues with office

**Solutions:**
- All job info in mobile app
- Digital forms and signatures
- Real-time communication

---

### 4.3 Dispatcher Scheduling Journey

**Persona:** John, Dispatcher

1. **Morning Planning**
   - Logs in to system
   - Reviews jobs scheduled for today
   - Checks technician availability
   - Reviews any emergency jobs

2. **Scheduling Jobs**
   - Creates new jobs from customer requests
   - Assigns jobs to technicians based on:
     - Skills required
     - Location proximity
     - Current workload
   - Uses route optimization for multiple jobs
   - Sends job assignments to technicians

3. **Monitoring Throughout Day**
   - Watches real-time technician locations on map
   - Receives updates when jobs are completed
   - Handles emergency jobs
   - Reassigns jobs if needed
   - Communicates with customers about delays

4. **End of Day**
   - Reviews completed jobs
   - Checks for any issues
   - Plans for next day

**Pain Points:**
- Manual scheduling is time-consuming
- Don't know where technicians are
- Difficult to optimize routes

**Solutions:**
- Visual calendar with drag-and-drop
- Real-time GPS tracking
- Automated route optimization

---

## 5. Acceptance Criteria Templates

### Template for User Stories

**Given** [initial context]  
**When** [action is performed]  
**Then** [expected outcome]

**Example:**
- **Given** a customer exists in the system
- **When** a dispatcher creates a job for that customer
- **Then** the job is linked to the customer and appears in the customer's service history

---

## 6. Edge Cases & Error Scenarios

### EC-1: Duplicate Customer Creation
**Scenario:** User tries to create customer with existing email
**Expected Behavior:** System shows warning and suggests merging or using existing customer

### EC-2: Technician Double-Booking
**Scenario:** Dispatcher assigns two jobs to same technician at overlapping times
**Expected Behavior:** System shows conflict warning and prevents assignment

### EC-3: GPS Tracking Loss
**Scenario:** Technician's phone loses GPS signal
**Expected Behavior:** System shows "Last known location" and timestamp, alerts when signal returns

### EC-4: Payroll Calculation Error
**Scenario:** System encounters error calculating payroll
**Expected Behavior:** System logs error, notifies HR officer, allows manual override

---

**Document Status:** ✅ Complete  
**Next Document:** UI/UX Design Document
