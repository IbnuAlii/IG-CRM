# Technology Stack Summary
## CRM Enterprise Level System (SaaS)

**Last Updated:** 2024  
**Status:** Final

---

## Technology Stack Overview

### Frontend (current repository)
- **Framework**: Next.js 16.2 (App Router)
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS v4 + CSS variables (`app/globals.css`)
- **Components**: shadcn/ui (Radix UI)
- **Icons**: lucide-react
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **Charts**: Recharts (*alternative:* Chart.js)
- **Maps**: Leaflet (*alternatives:* Google Maps API, Mapbox)
- **Theme**: next-themes (light-first, dark mode toggle in portal shells)

### Backend
- **Framework**: **Frappe Framework** (Python-based)
- **ERP Platform**: **ERPNext** (built on Frappe)
- **API Style**: RESTful API (Frappe's built-in REST API)
- **WebSocket**: Frappe's built-in WebSocket support
- **Custom Apps**: Custom Frappe apps for CRM modules
- **Multi-tenancy**: Frappe's multi-site architecture (each tenant = one site)

### Database
- **Type**: **MariaDB 10.11+** (AWS RDS for MariaDB)
- **Note**: Using **AWS RDS for MariaDB** (managed service), NOT ERPNext's default local MariaDB
- **ORM**: Frappe's built-in ORM (based on SQLAlchemy)
- **Migrations**: Frappe's migration system (`bench migrate`)
- **Architecture**: Database-per-tenant (each Frappe site = separate database)

### Infrastructure
- **Cloud Provider**: AWS (Amazon Web Services)
- **Database Service**: AWS RDS for MariaDB
- **Compute**: AWS ECS (Fargate) or AWS EKS
- **Storage**: AWS S3
- **CDN**: AWS CloudFront
- **Load Balancing**: AWS Application Load Balancer (ALB)

### Mobile Applications
- **iOS**: Swift + SwiftUI (Native)
- **Android**: Kotlin + Jetpack Compose (Native)
- **Alternative**: React Native (if cross-platform preferred)

### Third-Party Integrations
- **Payment**: Stripe API
- **SMS**: Twilio API
- **Email**: AWS SES
- **Maps**: Google Maps API or Mapbox API

---

## Key Architecture Decisions

### Why Frappe/ERPNext for Backend?
1. **Open-source framework**: Built on Python, well-documented
2. **Built-in multi-tenancy**: Native support for multi-tenant architecture via sites
3. **Rapid development**: Pre-built modules, DocType system for quick development
4. **RESTful API**: Built-in REST API framework
5. **Permission system**: Robust role-based access control
6. **Extensibility**: Easy to create custom apps and modules
7. **Active community**: Large community and marketplace
8. **ERPNext integration**: Can leverage ERPNext modules if needed

### Why MariaDB (AWS RDS)?
1. **Frappe compatibility**: Frappe/ERPNext natively supports MariaDB/MySQL
2. **AWS managed service**: RDS for MariaDB provides managed database service
3. **High availability**: Multi-AZ deployment for failover
4. **Automated backups**: Built-in backup and point-in-time recovery
5. **Scalability**: Easy to scale up/down
6. **Cost-effective**: Pay for what you use
7. **Important**: Using AWS RDS for MariaDB (managed), NOT ERPNext's default local MariaDB

### Why Database-Per-Tenant?
1. Maximum security and isolation
2. Easier compliance (data residency)
3. Better performance (no cross-tenant queries)
4. Easier backup/restore per tenant
5. Frappe supports multi-site architecture (each tenant = one Frappe site = one database)

---

## Frappe-Specific Architecture

### Frappe Sites (Multi-Tenancy)
- Each tenant = One Frappe site
- Each site = One MariaDB database (on AWS RDS)
- Sites are completely isolated
- Frappe bench manages multiple sites

### Frappe DocTypes
- Data models are defined as Frappe DocTypes
- Automatic REST API generation
- Built-in validation and permissions
- Automatic form generation

### Frappe Apps
- Custom modules are created as Frappe apps
- Apps can be installed/uninstalled per site
- Apps can extend ERPNext functionality
- Apps are version-controlled

### Frappe API
- Standard REST API: `/api/resource/{DocType}`
- Custom methods: `/api/method/{app}.{module}.{function}`
- Built-in authentication and authorization
- WebSocket support for real-time updates

---

## Development Workflow

### Frappe Development
1. Set up Frappe bench: `bench init`
2. Create new site: `bench new-site {site-name}`
3. Create custom app: `bench new-app {app-name}`
4. Create DocTypes: Via Frappe UI or JSON files
5. Write custom methods: Python files in app directory
6. Run migrations: `bench migrate`
7. Start development server: `bench start`

### Frontend Development
1. Next.js app connects to Frappe API
2. Use Frappe's REST API endpoints
3. Handle authentication via Frappe's auth system
4. Real-time updates via Frappe WebSocket

---

## Important Notes

1. **Database**: Using AWS RDS for MariaDB (managed service), not ERPNext's default local MariaDB installation
2. **Multi-tenancy**: Each tenant is a separate Frappe site with its own database
3. **API**: Frappe primarily uses REST APIs (GraphQL can be added as custom implementation if needed)
4. **Frontend**: Next.js 16+ and React 19+ for the web frontend, separate from Frappe's default UI
5. **Mobile**: Native iOS and Android apps that connect to Frappe API

---

## Updated Documents

All project documents have been updated to reflect:
- ✅ Frappe/ERPNext as the backend framework
- ✅ MariaDB (AWS RDS) as the database
- ✅ Frappe's multi-site architecture for multi-tenancy
- ✅ Frappe's REST API structure
- ✅ Frappe's development workflow

---

**Document Status:** ✅ Complete
