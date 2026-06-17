# 🏗️ System Architecture Document
## CRM Enterprise Level System (SaaS)

**Document Version:** 1.0  
**Date:** 2024  
**Author:** System Architecture Team  
**Status:** Draft

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture Patterns](#3-system-architecture-patterns)
4. [Infrastructure Architecture](#4-infrastructure-architecture)
5. [Application Architecture](#5-application-architecture)
6. [API Architecture](#6-api-architecture)
7. [Database Architecture](#7-database-architecture)
8. [Security Architecture](#8-security-architecture)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Scalability & Performance](#10-scalability--performance)

---

## 1. Architecture Overview

### 1.1 Architecture Style

**Multi-Tenant SaaS Architecture with Database-Per-Tenant Isolation**

- **Pattern**: Database-per-tenant for maximum security and isolation
- **Deployment**: Cloud-native on AWS
- **Architecture**: Microservices-oriented (modular monolith initially, can evolve to microservices)
- **Communication**: RESTful APIs (Frappe's built-in REST API)
- **Real-time**: WebSockets for live updates

### 1.2 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Web    │  │   iOS    │  │ Android  │  │   API    │  │
│  │  (Next.js│  │   App    │  │   App    │  │ Consumers │  │
│  │  React)  │  │          │  │          │  │          │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼─────────────┼─────────────┼─────────────┼─────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   AWS CloudFront (CDN)      │
        │   + AWS WAF (Security)      │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │   Application Load Balancer  │
        │        (AWS ALB)             │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │         API Gateway (AWS API Gateway)       │
        │  ┌──────────┐  ┌──────────┐                │
        │  │  REST    │  │ WebSocket│                │
        │  │   API    │  │   API    │                │
        │  │(Frappe)  │  │(Frappe)  │                │
        │  └──────────┘  └──────────┘                │
        └──────────────┬──────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │      Application Servers (ECS/EKS)         │
        │  ┌──────────────────────────────────────┐  │
        │  │   Frappe/ERPNext Backend             │  │
        │  │   - Authentication Service          │  │
        │  │   - CRM Service                      │  │
        │  │   - Dispatch Service                 │  │
        │  │   - HR Service                       │  │
        │  │   - Payroll Service                  │  │
        │  │   - Fleet Service                    │  │
        │  │   - GPS Service                       │  │
        │  │   - Reporting Service                 │  │
        │  │   - Frappe Framework Core            │  │
        │  └──────────────────────────────────────┘  │
        └──────────────┬──────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │         Message Queue (AWS SQS)            │
        │   - Job Processing                         │
        │   - Email/SMS Queue                        │
        │   - GPS Data Processing                     │
        └──────────────┬──────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │      Background Workers (AWS Lambda)        │
        │   - Email Sender (AWS SES)                  │
        │   - SMS Sender (Twilio)                     │
        │   - Report Generator                        │
        │   - GPS Data Processor                       │
        │   - Payroll Calculator                      │
        └─────────────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │         Database Layer                       │
        │  ┌──────────────────────────────────────┐  │
        │  │  Tenant Database Router              │  │
        │  │  (Routes to tenant-specific DB)       │  │
        │  └──────────────────────────────────────┘  │
        │                                             │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
        │  │ Tenant 1 │  │ Tenant 2 │  │ Tenant N │ │
        │  │  (RDS)   │  │  (RDS)   │  │  (RDS)   │ │
        │  └──────────┘  └──────────┘  └──────────┘ │
        │                                             │
        │  ┌──────────────────────────────────────┐  │
        │  │  Shared Database (RDS)              │  │
        │  │  - Tenant Metadata                  │  │
        │  │  - System Configuration             │  │
        │  │  - Billing & Subscriptions          │  │
        │  └──────────────────────────────────────┘  │
        └─────────────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │         Cache Layer (AWS ElastiCache)       │
        │   - Redis: Sessions, Rate Limiting          │
        │   - Redis: Real-time Data, GPS Cache        │
        └─────────────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │         Storage Layer                       │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
        │  │   S3     │  │   S3     │  │   S3     │ │
        │  │ Documents│  │  Images   │  │  Backups │ │
        │  └──────────┘  └──────────┘  └──────────┘  │
        └─────────────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────────────┐
        │      External Integrations                  │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
        │  │  Stripe  │  │  Twilio  │  │   Maps   │ │
        │  │  (Pay)   │  │  (SMS)   │  │   API    │ │
        │  └──────────┘  └──────────┘  └──────────┘  │
        └─────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend

#### Web Application
- **Framework**: Next.js 16+ (App Router)
- **UI Library**: React 19+
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui or Headless UI
- **State Management**: Zustand or React Query
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table
- **Charts**: Recharts or Chart.js
- **Maps**: Google Maps API or Mapbox
- **Real-time**: Socket.io client
- **HTTP Client**: Axios or Fetch API

#### Mobile Applications
- **iOS**: Swift + SwiftUI (Native)
- **Android**: Kotlin + Jetpack Compose (Native)
- **Alternative**: React Native (if cross-platform preferred)
- **State Management**: Redux or MobX
- **Maps**: Google Maps SDK / Mapbox SDK
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Offline Storage**: SQLite or Realm

### 2.2 Backend

#### API Layer (Frappe/ERPNext Backend)
- **Framework**: Frappe Framework (Python-based)
- **ERPNext**: Built on Frappe Framework
- **API Style**: RESTful API (Frappe's built-in REST API)
- **WebSocket**: Frappe's built-in WebSocket support
- **Validation**: Frappe's built-in validation framework
- **Authentication**: Frappe's authentication system
- **Authorization**: Frappe's permission system (Role-Based Access Control)
- **Custom Apps**: Custom Frappe apps for CRM modules

#### Background Jobs
- **Queue System**: AWS SQS + AWS Lambda
- **Job Processing**: Bull (Redis-based) or AWS Step Functions
- **Scheduling**: AWS EventBridge (Cron jobs)

### 2.3 Database

#### Primary Database
- **Type**: MariaDB (AWS RDS for MariaDB)
- **Version**: MariaDB 10.11+ (compatible with MySQL 8.0)
- **ORM**: Frappe's built-in ORM (based on SQLAlchemy)
- **Migrations**: Frappe's migration system (bench migrate)
- **Connection Pooling**: Built into Frappe framework
- **Note**: Using AWS RDS for MariaDB (managed service), not ERPNext's default local MariaDB

#### Cache
- **Redis**: AWS ElastiCache (Redis)
- **Use Cases**: Sessions, rate limiting, real-time data, GPS cache

#### Search
- **Full-text Search**: MariaDB Full-Text Search or AWS OpenSearch

### 2.4 Infrastructure & DevOps

#### Cloud Provider
- **Primary**: AWS (Amazon Web Services)

#### Compute
- **Containers**: AWS ECS (Fargate) or AWS EKS (Kubernetes)
- **Serverless**: AWS Lambda
- **Load Balancing**: AWS Application Load Balancer (ALB)

#### Storage
- **Object Storage**: AWS S3
- **CDN**: AWS CloudFront
- **Database**: AWS RDS for MariaDB
- **Backup Storage**: AWS S3 Glacier

#### Networking
- **VPC**: AWS Virtual Private Cloud
- **API Gateway**: AWS API Gateway
- **WAF**: AWS WAF (Web Application Firewall)
- **DNS**: AWS Route 53

#### Monitoring & Logging
- **APM**: AWS CloudWatch, Datadog, or New Relic
- **Logging**: AWS CloudWatch Logs
- **Error Tracking**: Sentry
- **Uptime Monitoring**: AWS CloudWatch Alarms

#### CI/CD
- **Version Control**: Git (GitHub/GitLab)
- **CI/CD**: GitHub Actions or AWS CodePipeline
- **Container Registry**: AWS ECR
- **Infrastructure as Code**: Terraform or AWS CDK

### 2.5 Third-Party Integrations

- **Payment**: Stripe API
- **SMS**: Twilio API
- **Email**: AWS SES
- **Maps**: Google Maps API or Mapbox API
- **Analytics**: Google Analytics, Mixpanel
- **Monitoring**: Sentry, Datadog

---

## 3. System Architecture Patterns

### 3.1 Multi-Tenancy Pattern

**Database-Per-Tenant Architecture**

```
┌─────────────────────────────────────────┐
│      Tenant Router Service              │
│  (Routes requests to correct DB)        │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐  ┌───▼───┐  ┌───▼───┐
│Tenant1│  │Tenant2│  │TenantN│
│  DB   │  │  DB   │  │  DB   │
└───────┘  └───────┘  └───────┘
```

**Benefits:**
- Complete data isolation
- Better security
- Easier backup/restore per tenant
- Scalable (can move large tenants to dedicated infrastructure)

**Implementation:**
- Shared database stores tenant metadata and connection strings
- Application layer routes requests based on tenant context
- Connection pooling per tenant database

### 3.2 Layered Architecture

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│  (Next.js Pages, React Components) │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      API Layer                      │
│  (REST Endpoints - Frappe)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Business Logic Layer           │
│  (Services, Domain Logic)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Data Access Layer              │
│  (Repositories, ORM)                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Database Layer                 │
│  (MariaDB, Redis)                   │
└──────────────────────────────────────┘
```

### 3.3 Event-Driven Architecture

For asynchronous processing:
- Job status updates → WebSocket notifications
- Email/SMS sending → Queue → Background worker
- GPS updates → Queue → Real-time map updates
- Report generation → Queue → Background worker

---

## 4. Infrastructure Architecture

### 4.1 AWS Infrastructure

#### VPC Setup
```
┌─────────────────────────────────────────┐
│           VPC (10.0.0.0/16)             │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   Public Subnet (10.0.1.0/24)      │ │
│  │   - ALB                              │ │
│  │   - NAT Gateway                      │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   Private Subnet 1 (10.0.2.0/24)   │ │
│  │   - ECS Tasks (API)                 │ │
│  │   - Application Servers              │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │   Private Subnet 2 (10.0.3.0/24)   │ │
│  │   - RDS Databases                   │ │
│  │   - ElastiCache (Redis)              │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### High Availability
- **Multi-AZ Deployment**: All critical services in multiple availability zones
- **Auto Scaling**: ECS/EKS auto-scaling based on CPU/memory
- **Load Balancing**: ALB distributes traffic across instances
- **Database**: RDS Multi-AZ for automatic failover

### 4.2 Container Architecture

#### Docker Containers
- **Web/API Container**: Next.js application
- **Worker Container**: Background job processors
- **Database**: RDS (managed, not containerized)

#### Container Orchestration
- **Option 1**: AWS ECS with Fargate (serverless containers)
- **Option 2**: AWS EKS (Kubernetes) for more control

---

## 5. Application Architecture

### 5.1 Application Structure

#### Frontend (Next.js 16+ / React 19+)
```
/app
  /(auth)
    /login
    /register
    /forgot-password
  /(dashboard)
    /dashboard
    /crm
      /customers
      /quotes
      /tickets
    /dispatch
      /jobs
      /schedule
    /hr
      /employees
      /attendance
    /payroll
    /fleet
    /gps
    /reports
    /settings
  /components
    /ui
    /layout
    /features
  /lib
    /services
    /utils
    /hooks
  /types
  /styles
```

#### Backend (Frappe/ERPNext)
```
apps/
  /erpnext/              # ERPNext core
  /crm_custom/           # Custom CRM app
    /crm_custom/
      /doctype/
        /customer/
        /job/
        /quote/
      /api/
        /v1/
          /customers.py
          /jobs.py
      /page/
        /dashboard/
      /config/
        /desktop.py
      /hooks.py
```

### 5.2 Frappe Backend Architecture

#### Frappe DocTypes (Data Models)
```
DocTypes:
  - Customer (CRM)
  - Job (Dispatch)
  - Employee (HR)
  - Payroll Entry (Payroll)
  - Vehicle (Fleet)
  - GPS Location (Tracking)
  - Quote (CRM)
  - Ticket (CRM)
  - etc.
```

#### Frappe API Endpoints
```
/api/method/crm_custom.api.v1.customers.get_list
/api/method/crm_custom.api.v1.customers.create
/api/method/crm_custom.api.v1.jobs.get_list
/api/method/crm_custom.api.v1.jobs.create
etc.
```

#### Frappe Services
- **Frappe Framework**: Core framework handling ORM, permissions, API
- **Custom Apps**: CRM, Dispatch, HR, Payroll, Fleet, GPS modules as Frappe apps
- **Built-in Features**: Authentication, authorization, file handling, email, etc.

---

## 6. API Architecture

### 6.1 RESTful API Design (Frappe)

#### Frappe API Endpoint Structure
Frappe uses `/api/method/` format for custom methods and `/api/resource/` for standard CRUD operations:

```
# Standard Frappe Resource API (CRUD)
GET    /api/resource/Customer
GET    /api/resource/Customer/{name}
POST   /api/resource/Customer
PUT    /api/resource/Customer/{name}
DELETE /api/resource/Customer/{name}

# Custom API Methods
POST   /api/method/frappe.auth.login
POST   /api/method/frappe.core.doctype.user.user.sign_up
POST   /api/method/crm_custom.api.v1.customers.get_list
POST   /api/method/crm_custom.api.v1.customers.create
POST   /api/method/crm_custom.api.v1.jobs.get_list
POST   /api/method/crm_custom.api.v1.jobs.assign
POST   /api/method/crm_custom.api.v1.payroll.process
GET    /api/method/crm_custom.api.v1.gps.get_vehicles
```

#### Frappe API Response Format
```json
{
  "message": {
    "data": { ... },
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

#### Authentication
Frappe API uses session-based or token-based authentication:
- **Session**: Cookie-based (web)
- **Token**: API key or JWT token (mobile/API clients)

### 6.2 GraphQL API (Optional)

**Note**: Frappe primarily uses REST APIs. GraphQL can be implemented as a custom Frappe app if needed for specific use cases.

#### Schema Example (If Implemented)
```graphql
type Query {
  customers(filter: CustomerFilter, pagination: Pagination): CustomerConnection
  customer(id: ID!): Customer
  jobs(filter: JobFilter, pagination: Pagination): JobConnection
  job(id: ID!): Job
}

type Mutation {
  createCustomer(input: CreateCustomerInput!): Customer
  updateCustomer(id: ID!, input: UpdateCustomerInput!): Customer
  createJob(input: CreateJobInput!): Job
  assignJob(jobId: ID!, technicianId: ID!): Job
}

type Subscription {
  jobStatusChanged(jobId: ID!): Job
  vehicleLocationUpdated(vehicleId: ID!): VehicleLocation
}
```

### 6.3 WebSocket API (Frappe)

Frappe supports WebSocket for real-time updates:
- Job status changes
- GPS location updates
- Notification delivery
- Live dashboard updates
- Real-time form updates

---

## 7. Database Architecture

### 7.1 Database Schema Overview

#### Shared Database (Tenant Metadata)
```sql
-- tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE,
  database_name VARCHAR(100) NOT NULL,
  database_host VARCHAR(255) NOT NULL,
  subscription_plan VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- tenant_users table (for tenant routing)
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID,
  email VARCHAR(255),
  role VARCHAR(50)
);
```

#### Tenant Database Schema (Per Tenant)

**Core Tables:**
- users
- customers
- jobs
- employees
- vehicles
- quotes
- tickets
- contracts
- attendance
- payroll
- gps_locations
- reports

(Detailed schema in Database Design Document)

### 7.2 Database Connection Strategy

```typescript
# Pseudo-code for tenant database routing (Frappe)
def get_tenant_database(tenant_id):
    # 1. Get tenant metadata from shared DB
    tenant = frappe.get_doc("Tenant", tenant_id)
    
    # 2. Frappe handles multi-tenancy via site configuration
    # Each tenant is a separate Frappe site with its own database
    site_name = tenant.site_name
    frappe.connect(site=site_name)
    
    return frappe.db

# Usage in Frappe DocType
def get_customer(tenant_id, customer_id):
    # Frappe automatically uses the correct site/database
    customer = frappe.get_doc("Customer", customer_id)
    return customer
```

### 7.3 Database Migrations

- **Tool**: Frappe's migration system (`bench migrate`)
- **Strategy**: Version-controlled migrations
- **Execution**: Automated in CI/CD pipeline
- **Rollback**: Support for rollback migrations

---

## 8. Security Architecture

### 8.1 Authentication Flow

```
1. User submits credentials
2. Backend validates credentials
3. Backend generates JWT token
4. Token stored in HTTP-only cookie (or returned to client)
5. Client includes token in subsequent requests
6. Backend validates token on each request
7. Backend extracts tenant context from token
8. Backend routes to tenant database
```

### 8.2 Authorization (RBAC)

```typescript
// Permission check example
async function checkPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const user = await getUser(userId);
  const role = await getRole(user.roleId);
  return role.permissions.some(
    p => p.resource === resource && p.action === action
  );
}
```

### 8.3 Data Encryption

- **In Transit**: TLS 1.3 for all communications
- **At Rest**: 
  - RDS encryption at rest (AES-256)
  - S3 server-side encryption
  - Application-level encryption for sensitive fields (SSN, etc.)

### 8.4 Security Layers

1. **Network Layer**: VPC, Security Groups, WAF
2. **Application Layer**: Authentication, Authorization, Input Validation
3. **Data Layer**: Encryption, Access Control, Audit Logs

---

## 9. Deployment Architecture

### 9.1 Deployment Pipeline

```
Developer
    │
    ├─> Git Push
    │
    ├─> GitHub/GitLab
    │
    ├─> CI/CD Pipeline (GitHub Actions / CodePipeline)
    │   ├─> Run Tests
    │   ├─> Build Docker Image
    │   ├─> Push to ECR
    │   └─> Deploy to ECS/EKS
    │
    └─> Production Environment
```

### 9.2 Environment Strategy

- **Development**: Local development with Docker Compose
- **Staging**: AWS environment for testing
- **Production**: AWS production environment with blue-green deployment

### 9.3 Deployment Strategy

- **Blue-Green Deployment**: Zero-downtime deployments
- **Canary Releases**: Gradual rollout for new features
- **Rollback**: Quick rollback to previous version if issues

---

## 10. Scalability & Performance

### 10.1 Horizontal Scaling

- **Application Servers**: Auto-scale based on CPU/memory
- **Database Read Replicas**: For read-heavy operations
- **CDN**: CloudFront for static assets
- **Caching**: Redis for frequently accessed data

### 10.2 Performance Optimization

- **Database Indexing**: Strategic indexes on frequently queried columns
- **Query Optimization**: Efficient queries, avoid N+1 problems
- **Caching Strategy**: 
  - Redis for session data
  - Redis for GPS location cache
  - CDN for static assets
- **Lazy Loading**: Load data on demand
- **Pagination**: Limit result sets

### 10.3 Monitoring & Alerting

- **Application Performance Monitoring (APM)**: Track response times, errors
- **Database Monitoring**: Query performance, connection pool usage
- **Infrastructure Monitoring**: CPU, memory, network
- **Alerting**: PagerDuty or AWS SNS for critical issues

---

## 11. Disaster Recovery & Backup

### 11.1 Backup Strategy

- **Database Backups**: 
  - Automated daily backups (RDS automated backups)
  - Retention: 30 days
  - Point-in-time recovery enabled
- **File Backups**: S3 versioning enabled
- **Configuration Backups**: Infrastructure as Code (Terraform)

### 11.2 Disaster Recovery Plan

- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour
- **Failover**: Multi-AZ deployment for automatic failover
- **Backup Restoration**: Tested monthly

---

## 12. Cost Optimization

### 12.1 AWS Cost Management

- **Reserved Instances**: For predictable workloads
- **Spot Instances**: For non-critical background jobs
- **Auto Scaling**: Scale down during low traffic
- **S3 Lifecycle Policies**: Move old data to Glacier
- **CloudWatch Cost Alerts**: Monitor spending

---

## 13. Technology Decisions Rationale

### Why Next.js for Frontend?
- Server-side rendering for SEO and performance
- Excellent developer experience with React 19+
- Strong ecosystem and community
- Modern tooling and best practices

### Why Frappe/ERPNext for Backend?
- **Open-source framework**: Built on Python, well-documented
- **Built-in multi-tenancy**: Native support for multi-tenant architecture
- **Rapid development**: Pre-built modules, DocType system for quick development
- **RESTful API**: Built-in REST API framework
- **Permission system**: Robust role-based access control
- **Extensibility**: Easy to create custom apps and modules
- **Active community**: Large community and marketplace
- **ERPNext integration**: Can leverage ERPNext modules if needed

### Why MariaDB (AWS RDS)?
- **Frappe compatibility**: Frappe/ERPNext natively supports MariaDB/MySQL
- **AWS managed service**: RDS for MariaDB provides managed database service
- **High availability**: Multi-AZ deployment for failover
- **Automated backups**: Built-in backup and point-in-time recovery
- **Scalability**: Easy to scale up/down
- **Cost-effective**: Pay for what you use
- **Note**: Using AWS RDS for MariaDB (managed), not ERPNext's default local MariaDB

### Why Database-Per-Tenant?
- Maximum security and isolation
- Easier compliance (data residency)
- Better performance (no cross-tenant queries)
- Easier backup/restore per tenant
- Frappe supports multi-site architecture (each tenant = one site)

### Why AWS?
- Comprehensive service offerings
- Global infrastructure
- Strong security and compliance
- Excellent documentation and support
- Pay-as-you-go pricing
- AWS RDS for MariaDB for managed database service

---

**Document Status:** ✅ Complete  
**Next Document:** Database Design Document
