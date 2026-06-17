# 🗄️ Database Design Document
## CRM Enterprise Level System (SaaS)

**Document Version:** 1.0  
**Date:** 2024  
**Author:** System Architecture Team  
**Status:** Draft

---

## Table of Contents

1. [Database Overview](#1-database-overview)
2. [Shared Database Schema](#2-shared-database-schema)
3. [Tenant Database Schema](#3-tenant-database-schema)
4. [Entity Relationship Diagrams](#4-entity-relationship-diagrams)
5. [Table Definitions](#5-table-definitions)
6. [Indexes & Performance](#6-indexes--performance)
7. [Data Migration Strategy](#7-data-migration-strategy)

---

## 1. Database Overview

### 1.1 Database Architecture

**Multi-Tenant Architecture: Database-Per-Tenant**

- **Shared Database**: Stores tenant metadata, system configuration, billing
- **Tenant Databases**: One database per tenant with complete data isolation
- **Database Type**: MariaDB 10.11+ (AWS RDS for MariaDB)
- **ORM**: Frappe's built-in ORM (based on SQLAlchemy)
- **Note**: Using AWS RDS for MariaDB (managed service), not ERPNext's default local MariaDB

### 1.2 Database Naming Conventions

- **Tables**: snake_case, plural (e.g., `customers`, `job_assignments`)
- **Columns**: snake_case (e.g., `first_name`, `created_at`)
- **Primary Keys**: `id` (UUID)
- **Foreign Keys**: `{table}_id` (e.g., `customer_id`, `user_id`)
- **Timestamps**: `created_at`, `updated_at`, `deleted_at` (soft deletes)

---

## 2. Shared Database Schema

### 2.1 Tenants Table

Stores tenant (company) information and database connection details.

```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255), -- Custom domain (Enterprise)
    database_name VARCHAR(100) NOT NULL UNIQUE,
    database_host VARCHAR(255) NOT NULL,
    database_port INTEGER DEFAULT 5432,
    subscription_plan VARCHAR(50) NOT NULL, -- 'basic', 'professional', 'enterprise'
    subscription_status VARCHAR(50) NOT NULL, -- 'active', 'suspended', 'cancelled', 'trial'
    trial_ends_at TIMESTAMP,
    billing_email VARCHAR(255),
    max_users INTEGER DEFAULT 10, -- Based on plan
    max_storage_gb INTEGER DEFAULT 10,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'deleted'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX idx_tenants_status ON tenants(status);
```

### 2.2 Tenant Users Table

Maps users to tenants (for authentication routing).

```sql
CREATE TABLE tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    user_id UUID, -- Reference to user in tenant database
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, email)
);

CREATE INDEX idx_tenant_users_tenant_id ON tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_email ON tenant_users(email);
```

### 2.3 Subscriptions Table

Tracks subscription and billing information.

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    plan VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'active', 'past_due', 'cancelled', 'trialing'
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
```

### 2.4 System Configuration Table

Stores system-wide configuration.

```sql
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Tenant Database Schema

### 3.1 Users & Authentication

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    role_id UUID REFERENCES roles(id),
    employee_id UUID REFERENCES employees(id), -- If user is an employee
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_status ON users(status);
```

#### roles
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE, -- Cannot be deleted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name, description, is_system_role) VALUES
('super_admin', 'Full system access', TRUE),
('admin', 'Company administrator', TRUE),
('manager', 'Department manager', TRUE),
('dispatcher', 'Job dispatcher', TRUE),
('technician', 'Field technician', TRUE),
('hr_officer', 'HR staff', TRUE),
('accountant', 'Financial staff', TRUE);
```

#### permissions
```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL, -- 'customers', 'jobs', 'employees', etc.
    action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'manage'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_permissions_resource_action ON permissions(resource, action);
```

#### role_permissions
```sql
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
```

#### sessions
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

---

### 3.2 CRM Module

#### customers
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    phone_alt VARCHAR(20),
    status VARCHAR(50) DEFAULT 'active', -- 'new', 'active', 'inactive', 'vip', 'do_not_contact'
    customer_type VARCHAR(50) DEFAULT 'individual', -- 'individual', 'business'
    notes TEXT,
    tags TEXT[], -- Array of tags
    custom_fields JSONB, -- Flexible custom fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_created_at ON customers(created_at);
CREATE INDEX idx_customers_tags ON customers USING GIN(tags);
```

#### customer_addresses
```sql
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_type VARCHAR(50) DEFAULT 'primary', -- 'primary', 'billing', 'shipping', 'service'
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) DEFAULT 'US',
    is_primary BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX idx_customer_addresses_location ON customer_addresses USING GIST(
    ll_to_earth(latitude, longitude)
); -- For location-based queries
```

#### quotes
```sql
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated
    customer_id UUID NOT NULL REFERENCES customers(id),
    title VARCHAR(255),
    description TEXT,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 4) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'converted'
    valid_until TIMESTAMP,
    sent_at TIMESTAMP,
    viewed_at TIMESTAMP,
    accepted_at TIMESTAMP,
    converted_to_job_id UUID, -- If converted to job
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
```

#### quote_items
```sql
CREATE TABLE quote_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    line_total DECIMAL(10, 2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quote_items_quote_id ON quote_items(quote_id);
```

#### tickets
```sql
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated
    customer_id UUID NOT NULL REFERENCES customers(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),
    first_response_at TIMESTAMP, -- SLA tracking
    resolution_time_minutes INTEGER, -- Calculated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
```

#### ticket_comments
```sql
CREATE TABLE ticket_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE, -- Internal note vs customer-visible
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
CREATE INDEX idx_ticket_comments_created_at ON ticket_comments(created_at);
```

#### contracts
```sql
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    contract_type VARCHAR(50), -- 'service', 'maintenance', 'lease', etc.
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_signature', 'active', 'expired', 'terminated'
    document_url TEXT, -- Link to signed contract PDF
    signed_at TIMESTAMP,
    signed_by VARCHAR(255), -- Signer name
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contracts_customer_id ON contracts(customer_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_end_date ON contracts(end_date); -- For expiration reminders
```

---

### 3.3 Dispatch & Scheduling Module

#### jobs
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_number VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated
    customer_id UUID NOT NULL REFERENCES customers(id),
    customer_address_id UUID REFERENCES customer_addresses(id),
    service_type VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    priority VARCHAR(50) DEFAULT 'normal', -- 'low', 'normal', 'high', 'emergency'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'on_hold', 'completed', 'cancelled'
    scheduled_start TIMESTAMP,
    scheduled_end TIMESTAMP,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    estimated_duration_minutes INTEGER,
    actual_duration_minutes INTEGER, -- Calculated
    quote_id UUID REFERENCES quotes(id), -- If converted from quote
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_scheduled_start ON jobs(scheduled_start);
CREATE INDEX idx_jobs_priority ON jobs(priority);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
```

#### job_assignments
```sql
CREATE TABLE job_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_primary BOOLEAN DEFAULT TRUE, -- Primary technician vs helper
    UNIQUE(job_id, employee_id)
);

CREATE INDEX idx_job_assignments_job_id ON job_assignments(job_id);
CREATE INDEX idx_job_assignments_employee_id ON job_assignments(employee_id);
```

#### job_notes
```sql
CREATE TABLE job_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    note TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_notes_job_id ON job_notes(job_id);
```

#### job_attachments
```sql
CREATE TABLE job_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL, -- S3 URL
    file_type VARCHAR(50),
    file_size BIGINT,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_attachments_job_id ON job_attachments(job_id);
```

#### job_status_history
```sql
CREATE TABLE job_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_status_history_job_id ON job_status_history(job_id);
CREATE INDEX idx_job_status_history_created_at ON job_status_history(created_at);
```

---

### 3.4 HR Module

#### employees
```sql
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    phone_emergency VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    hire_date DATE NOT NULL,
    termination_date DATE,
    employment_type VARCHAR(50) NOT NULL, -- 'full_time', 'part_time', 'contractor'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'on_leave', 'terminated'
    department VARCHAR(100),
    position VARCHAR(100),
    manager_id UUID REFERENCES employees(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_employee_number ON employees(employee_number);
CREATE INDEX idx_employees_manager_id ON employees(manager_id);
```

#### employee_documents
```sql
CREATE TABLE employee_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'id', 'contract', 'license', 'certification'
    document_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    expiration_date DATE,
    issued_date DATE,
    notes TEXT,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employee_documents_employee_id ON employee_documents(employee_id);
CREATE INDEX idx_employee_documents_expiration_date ON employee_documents(expiration_date);
```

#### attendance
```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    date DATE NOT NULL,
    clock_in TIMESTAMP,
    clock_out TIMESTAMP,
    clock_in_location_lat DECIMAL(10, 8),
    clock_in_location_lng DECIMAL(11, 8),
    clock_out_location_lat DECIMAL(10, 8),
    clock_out_location_lng DECIMAL(11, 8),
    total_hours DECIMAL(5, 2), -- Calculated
    regular_hours DECIMAL(5, 2),
    overtime_hours DECIMAL(5, 2),
    break_duration_minutes INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'present', -- 'present', 'absent', 'late', 'half_day'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, date)
);

CREATE INDEX idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);
```

#### leave_requests
```sql
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    leave_type VARCHAR(50) NOT NULL, -- 'vacation', 'sick', 'personal', 'unpaid'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(4, 1) NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
```

#### leave_balances
```sql
CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    leave_type VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    total_allocated DECIMAL(4, 1) DEFAULT 0,
    used DECIMAL(4, 1) DEFAULT 0,
    remaining DECIMAL(4, 1) DEFAULT 0, -- Calculated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, leave_type, year)
);

CREATE INDEX idx_leave_balances_employee_id ON leave_balances(employee_id);
```

---

### 3.5 Payroll Module

#### payroll_periods
```sql
CREATE TABLE payroll_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_name VARCHAR(100) NOT NULL, -- e.g., "January 2024"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pay_date DATE NOT NULL,
    pay_frequency VARCHAR(50) NOT NULL, -- 'weekly', 'bi_weekly', 'monthly'
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'calculated', 'approved', 'processed', 'paid'
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payroll_periods_dates ON payroll_periods(start_date, end_date);
CREATE INDEX idx_payroll_periods_status ON payroll_periods(status);
```

#### payroll_records
```sql
CREATE TABLE payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_period_id UUID NOT NULL REFERENCES payroll_periods(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    regular_hours DECIMAL(5, 2) DEFAULT 0,
    overtime_hours DECIMAL(5, 2) DEFAULT 0,
    regular_rate DECIMAL(10, 2) NOT NULL,
    overtime_rate DECIMAL(10, 2),
    gross_pay DECIMAL(10, 2) NOT NULL,
    federal_tax DECIMAL(10, 2) DEFAULT 0,
    state_tax DECIMAL(10, 2) DEFAULT 0,
    local_tax DECIMAL(10, 2) DEFAULT 0,
    social_security DECIMAL(10, 2) DEFAULT 0,
    medicare DECIMAL(10, 2) DEFAULT 0,
    total_deductions DECIMAL(10, 2) DEFAULT 0,
    net_pay DECIMAL(10, 2) NOT NULL,
    bonuses DECIMAL(10, 2) DEFAULT 0,
    commissions DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'approved', 'paid'
    payslip_generated BOOLEAN DEFAULT FALSE,
    payslip_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payroll_records_period_id ON payroll_records(payroll_period_id);
CREATE INDEX idx_payroll_records_employee_id ON payroll_records(employee_id);
```

#### payroll_deductions
```sql
CREATE TABLE payroll_deductions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_record_id UUID NOT NULL REFERENCES payroll_records(id) ON DELETE CASCADE,
    deduction_type VARCHAR(100) NOT NULL, -- 'health_insurance', '401k', 'garnishment', etc.
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payroll_deductions_payroll_record_id ON payroll_deductions(payroll_record_id);
```

#### salary_structures
```sql
CREATE TABLE salary_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    pay_type VARCHAR(50) NOT NULL, -- 'hourly', 'salary'
    base_rate DECIMAL(10, 2) NOT NULL, -- Hourly rate or annual salary
    overtime_multiplier DECIMAL(3, 2) DEFAULT 1.5, -- 1.5x for overtime
    effective_date DATE NOT NULL,
    end_date DATE, -- NULL if current
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_salary_structures_employee_id ON salary_structures(employee_id);
CREATE INDEX idx_salary_structures_effective_date ON salary_structures(effective_date);
```

---

### 3.6 Fleet Management Module

#### vehicles
```sql
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    vin VARCHAR(17) UNIQUE,
    license_plate VARCHAR(50),
    vehicle_type VARCHAR(50), -- 'truck', 'van', 'car', 'motorcycle'
    color VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'in_maintenance', 'retired'
    purchase_date DATE,
    purchase_price DECIMAL(10, 2),
    current_mileage INTEGER DEFAULT 0,
    insurance_provider VARCHAR(255),
    insurance_policy_number VARCHAR(100),
    insurance_expiration_date DATE,
    registration_expiration_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_vehicles_vehicle_number ON vehicles(vehicle_number);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_insurance_expiration ON vehicles(insurance_expiration_date);
CREATE INDEX idx_vehicles_registration_expiration ON vehicles(registration_expiration_date);
```

#### vehicle_assignments
```sql
CREATE TABLE vehicle_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    assigned_date DATE NOT NULL,
    unassigned_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    notes TEXT,
    assigned_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicle_assignments_vehicle_id ON vehicle_assignments(vehicle_id);
CREATE INDEX idx_vehicle_assignments_employee_id ON vehicle_assignments(employee_id);
CREATE INDEX idx_vehicle_assignments_current ON vehicle_assignments(is_current);
```

#### maintenance_logs
```sql
CREATE TABLE maintenance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    maintenance_type VARCHAR(100) NOT NULL, -- 'oil_change', 'repair', 'inspection', 'tire_replacement'
    maintenance_date DATE NOT NULL,
    mileage_at_service INTEGER,
    cost DECIMAL(10, 2),
    vendor VARCHAR(255),
    description TEXT,
    next_service_date DATE,
    next_service_mileage INTEGER,
    receipt_url TEXT,
    performed_by UUID REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_logs_vehicle_id ON maintenance_logs(vehicle_id);
CREATE INDEX idx_maintenance_logs_date ON maintenance_logs(maintenance_date);
```

#### fuel_logs
```sql
CREATE TABLE fuel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    fuel_date DATE NOT NULL,
    odometer_reading INTEGER NOT NULL,
    gallons DECIMAL(6, 2) NOT NULL,
    cost_per_gallon DECIMAL(5, 2),
    total_cost DECIMAL(10, 2) NOT NULL,
    fuel_type VARCHAR(50) DEFAULT 'gasoline', -- 'gasoline', 'diesel', 'electric'
    station_name VARCHAR(255),
    receipt_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fuel_logs_vehicle_id ON fuel_logs(vehicle_id);
CREATE INDEX idx_fuel_logs_date ON fuel_logs(fuel_date);
```

---

### 3.7 GPS & Tracking Module

#### gps_locations
```sql
CREATE TABLE gps_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id),
    employee_id UUID REFERENCES employees(id), -- If tracking via mobile app
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2), -- mph
    heading DECIMAL(5, 2), -- degrees
    accuracy DECIMAL(5, 2), -- meters
    altitude DECIMAL(8, 2),
    status VARCHAR(50), -- 'moving', 'idle', 'parked', 'offline'
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gps_locations_vehicle_id ON gps_locations(vehicle_id);
CREATE INDEX idx_gps_locations_employee_id ON gps_locations(employee_id);
CREATE INDEX idx_gps_locations_recorded_at ON gps_locations(recorded_at);
CREATE INDEX idx_gps_locations_location ON gps_locations USING GIST(
    ll_to_earth(latitude, longitude)
); -- For location-based queries

-- Partition by month for better performance (MariaDB partitioning)
-- CREATE TABLE gps_locations_2024_01 PARTITION OF gps_locations
-- FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

#### geo_fences
```sql
CREATE TABLE geo_fences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    fence_type VARCHAR(50) NOT NULL, -- 'circle', 'polygon'
    center_latitude DECIMAL(10, 8),
    center_longitude DECIMAL(11, 8),
    radius_meters INTEGER, -- For circle type
    polygon_coordinates JSONB, -- For polygon type: [[lat, lng], ...]
    customer_id UUID REFERENCES customers(id),
    job_id UUID REFERENCES jobs(id),
    alert_on_entry BOOLEAN DEFAULT FALSE,
    alert_on_exit BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_geo_fences_customer_id ON geo_fences(customer_id);
CREATE INDEX idx_geo_fences_job_id ON geo_fences(job_id);
```

#### geo_fence_events
```sql
CREATE TABLE geo_fence_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    geo_fence_id UUID NOT NULL REFERENCES geo_fences(id),
    vehicle_id UUID REFERENCES vehicles(id),
    employee_id UUID REFERENCES employees(id),
    event_type VARCHAR(50) NOT NULL, -- 'entry', 'exit'
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_geo_fence_events_geo_fence_id ON geo_fence_events(geo_fence_id);
CREATE INDEX idx_geo_fence_events_recorded_at ON geo_fence_events(recorded_at);
```

---

### 3.8 Communication & Notifications

#### notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'job_assigned', 'job_completed', 'ticket_created', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

#### communication_logs
```sql
CREATE TABLE communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    employee_id UUID REFERENCES employees(id),
    communication_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'phone', 'in_app'
    direction VARCHAR(50) NOT NULL, -- 'inbound', 'outbound'
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50), -- 'sent', 'delivered', 'failed', 'read'
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_communication_logs_customer_id ON communication_logs(customer_id);
CREATE INDEX idx_communication_logs_employee_id ON communication_logs(employee_id);
CREATE INDEX idx_communication_logs_created_at ON communication_logs(created_at);
```

---

### 3.9 System & Audit Tables

#### audit_logs
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', etc.
    resource_type VARCHAR(100) NOT NULL, -- 'customer', 'job', 'employee', etc.
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

#### files
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL, -- S3 URL
    file_type VARCHAR(50),
    file_size BIGINT,
    mime_type VARCHAR(100),
    entity_type VARCHAR(100), -- 'customer', 'job', 'employee', etc.
    entity_id UUID,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_files_entity ON files(entity_type, entity_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
```

---

## 4. Entity Relationship Diagrams

### 4.1 Core Relationships

```
customers ──┬── customer_addresses
            ├── quotes
            ├── tickets
            ├── contracts
            └── jobs ──┬── job_assignments ─── employees
                      ├── job_notes
                      ├── job_attachments
                      └── job_status_history

employees ──┬── attendance
            ├── leave_requests
            ├── leave_balances
            ├── salary_structures
            ├── payroll_records
            ├── vehicle_assignments
            └── employee_documents

vehicles ──┬── vehicle_assignments ─── employees
           ├── maintenance_logs
           ├── fuel_logs
           └── gps_locations

payroll_periods ─── payroll_records ─── employees
                              └── payroll_deductions
```

---

## 5. Indexes & Performance

### 5.1 Critical Indexes

Already defined in table definitions above. Key indexes:
- Foreign key columns
- Status columns (for filtering)
- Date columns (for time-based queries)
- Email/phone (for lookups)
- Location columns (for GPS queries)

### 5.2 Query Optimization

- **Composite Indexes**: For common query patterns
- **Partial Indexes**: For filtered queries (e.g., active records only)
- **Full-Text Search**: MariaDB full-text search on text fields
- **Materialized Views**: For complex reports (refresh periodically)

### 5.3 Database Maintenance

- **OPTIMIZE TABLE**: Regular table optimization for MariaDB
- **ANALYZE TABLE**: Update statistics regularly
- **Partitioning**: Partition large tables (e.g., gps_locations by month)
- **Archiving**: Move old data to archive tables/database
- **AWS RDS**: Automated maintenance windows for managed MariaDB

---

## 6. Data Migration Strategy

### 6.1 Migration Tools

- **Frappe Migrate**: Frappe's built-in migration system (`bench migrate`)
- **Custom Scripts**: For data migrations
- **Version Control**: All migrations in Git
- **Frappe Sites**: Each tenant is a separate Frappe site with its own database

### 6.2 Migration Process (Frappe)

1. Create DocType or modify existing DocType in Frappe
2. Frappe automatically generates migration
3. Test migration on development site: `bench migrate`
4. Review migration SQL
5. Apply to staging site: `bench --site staging.mydomain.com migrate`
6. Test thoroughly
7. Apply to production site (with backup): `bench --site production.mydomain.com migrate`
8. Monitor for issues

### 6.3 Backup Before Migration

- Always backup database before migrations
- Test restore process
- Have rollback plan

---

## 7. Data Retention & Archiving

### 7.1 Retention Policies

- **GPS Data**: 90 days (configurable)
- **Audit Logs**: 7 years (compliance)
- **Deleted Records**: Soft delete, hard delete after 30 days
- **Old Reports**: Archive after 1 year

### 7.2 Archiving Strategy

- Move old data to archive tables
- Compress archived data
- Store in S3 Glacier for long-term storage

---

**Document Status:** ✅ Complete  
**Next Document:** Project Plan/Timeline Document
