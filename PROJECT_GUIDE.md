# Qubitium - Project Complete Guide

## Project Overview

**Qubitium** is a decentralized compute platform built on the Qubic blockchain. It's a full-featured web application that enables quantum-resistant blockchain technology for distributed computing with four key user roles: **Admin**, **Creator**, **Investor**, and **Processor**.

### Key Features:
- Quantum-resistant blockchain staking system
- Decentralized task computation and execution
- Compute credit (CC) economy
- Multi-role user management system
- Real-time dashboard monitoring
- Marketplace for compute leases

---

## Technology Stack

### Frontend Framework
- **React 18+** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TanStack React Query** - Data fetching and state management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library (Radix UI based)
- **Lucide React** - Beautiful icon library
- **Class Variance Authority** - CSS class utility

### State & Data Management
- **React Query** - Server state management, caching, and synchronization
- **localStorage** - Client-side persistent storage for auth tokens and user data
- **React Hooks** - Custom hooks for API interactions and state management

### Forms & Validation
- **React Hook Form** - Efficient form management
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration between Hook Form and Zod

### Backend Integration
- **Supabase JS SDK** - Optional authentication service
- **Fetch API** - HTTP requests to backend
- **Bearer Token Authentication** - JWT-based API authentication

### Additional Libraries
- **date-fns** - Date manipulation and formatting
- **bcrypt** - Password hashing (client-side utility)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code quality and linting
- **PostCSS** - CSS processing
- **lovable-tagger** - Component tagging for development

---

## Project Structure

```
qubit-forge-quest-main/
│
├── 📄 Configuration Files
│   ├── package.json              # Project dependencies and scripts
│   ├── vite.config.ts            # Vite bundler configuration
│   ├── tsconfig.json             # TypeScript compiler options
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── eslint.config.js          # ESLint rules
│   ├── components.json           # shadcn/ui configuration
│   └── index.html                # HTML entry point
│
├── 📁 backend/
│   └── src/
│       └── models/
│           └── ComputeTask.ts    # Backend compute task model (type definitions)
│
├── 📁 public/
│   └── robots.txt                # SEO robots file
│
└── 📁 src/
    ├── 📄 App.tsx                # Main app component with routing
    ├── 📄 main.tsx               # React entry point
    ├── 📄 App.css                # Global app styles
    ├── 📄 index.css              # Tailwind CSS imports
    ├── 📄 vite-env.d.ts          # Vite environment types
    │
    ├── 📁 pages/                 # Page-level components
    │   ├── Index.tsx             # Landing/home page
    │   ├── Auth.tsx              # Login/Register page
    │   ├── UserProfile.tsx       # User profile management
    │   ├── AdminDashboard.tsx    # Admin control panel
    │   ├── AdminLogin.tsx        # Admin login page
    │   ├── AdminUserManagement.tsx
    │   ├── AdminRoleRequests.tsx # Handle role request approvals
    │   ├── CreatorDashboard.tsx  # Creator task management
    │   ├── InvestorDashboard.tsx # Investor lease management
    │   ├── UpdatedCreatorDashboard.tsx
    │   └── NotFound.tsx          # 404 error page
    │
    ├── 📁 components/            # Reusable UI components
    │   ├── Navigation Components
    │   │   ├── Navbar.tsx        # Main navigation bar
    │   │   ├── NavLink.tsx       # Navigation link component
    │   │   ├── Footer.tsx        # Footer component
    │   │
    │   ├── Landing Page Components
    │   │   ├── Hero.tsx          # Hero section
    │   │   ├── About.tsx         # About section
    │   │   ├── Features.tsx      # Features showcase
    │   │   ├── TechStack.tsx     # Technology stack
    │   │   ├── Demo.tsx          # Demo section
    │   │   └── Contact.tsx       # Contact section
    │   │
    │   ├── Auth & User Components
    │   │   ├── ProtectedRoute.tsx      # Route protection wrapper
    │   │   ├── RoleRequestDialog.tsx   # Request new role dialog
    │   │
    │   ├── 📁 admin/             # Admin-specific components
    │   │   ├── AdminSidebar.tsx          # Admin navigation sidebar
    │   │   ├── UserManagementHeader.tsx  # Header for user management
    │   │   ├── UserTable.tsx             # Display all users
    │   │   ├── UserFilters.tsx           # Filter/search users
    │   │   ├── UserActionsMenu.tsx       # User action dropdown
    │   │   ├── AddUserDialog.tsx         # Create new user modal
    │   │   ├── EditUserDialog.tsx        # Edit user modal
    │   │   ├── ConfirmDialog.tsx         # Confirmation dialog
    │   │   ├── StatsCards.tsx            # Display admin statistics
    │   │   ├── AllStakesTable.tsx        # View all stakes
    │   │   ├── AllTasksTable.tsx         # View all tasks
    │   │   ├── ComputePools.tsx          # Manage compute pools
    │   │   └── ParameterAdjustment.tsx   # Adjust protocol parameters
    │   │
    │   ├── 📁 creator/           # Creator-specific components
    │   │   ├── CreatorNavbar.tsx             # Creator navigation
    │   │   ├── CCBalanceWidget.tsx           # Show compute credit balance
    │   │   ├── CreateComputeTaskForm.tsx    # Task creation form modal
    │   │   ├── TaskHistoryTable.tsx         # Display task history
    │   │   └── QueueStatusMonitor.tsx       # Task queue status
    │   │
    │   ├── 📁 investor/          # Investor-specific components
    │   │   ├── InvestorNavbar.tsx           # Investor navigation
    │   │   ├── LeasingDashboardStats.tsx   # Lease statistics
    │   │   ├── ActiveLeasesTable.tsx        # Display active leases
    │   │   ├── ComputeMarketplace.tsx      # Browse compute packages
    │   │   ├── LeaseCreationModal.tsx      # Create new lease
    │   │   └── CCPriceChart.tsx            # CC price trends
    │   │
    │   ├── 📁 processor/         # Processor-specific components
    │   │   ├── ProcessorStatusWidget.tsx    # Show processor status
    │   │   ├── LiveTaskStatusTable.tsx      # Real-time task status
    │   │   ├── QueuePositionIndicator.tsx  # Queue position display
    │   │   └── ExecutionHistoryModal.tsx   # Task execution history
    │   │
    │   └── 📁 ui/                # shadcn/ui component library
    │       ├── accordion.tsx
    │       ├── alert.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── dialog.tsx
    │       ├── tabs.tsx
    │       ├── table.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── toaster.tsx
    │       ├── sonner.tsx
    │       ├── tooltip.tsx
    │       └── [30+ more UI components...]
    │
    ├── 📁 hooks/                 # Custom React hooks
    │   ├── useAuth.tsx           # Authentication state management
    │   ├── useProtocol.tsx       # Protocol API interactions
    │   ├── useAdminHooks.tsx     # Admin-specific hooks
    │   ├── useAdminUsers.tsx     # User management hooks
    │   ├── useRoleRequest.ts     # Role request management
    │   ├── useProcessorMonitoring.ts  # Processor monitoring
    │   ├── use-toast.ts          # Toast notification hook
    │   └── use-mobile.tsx        # Mobile detection hook
    │
    ├── 📁 services/              # API integration layer
    │   ├── protocolAPI.ts        # Protocol/business logic API
    │   └── adminAPI.ts           # Admin-specific API calls
    │
    └── 📁 lib/                   # Utility functions
        ├── formatters.ts         # Data formatting functions
        └── utils.ts              # Common utilities (cn, etc.)
```

---

## Core Functionalities

### 1. Authentication System
**File**: `src/pages/Auth.tsx`, `src/hooks/useAuth.tsx`

#### Features:
- **Email/Password Authentication**
  - Registration for new users
  - Login for existing users
  - Zod validation for form inputs
  
- **OAuth Integration**
  - Google Sign-In with redirect flow
  - Automatic token parsing from callback URL
  
- **Token Management**
  - JWT tokens stored in localStorage
  - Bearer token authentication for API calls
  - Token-based authorization checks

#### Flow:
1. User lands on `/auth` page
2. Can sign up with email/password or use Google OAuth
3. Token and user data stored in localStorage
4. Token sent in `Authorization: Bearer <token>` header for API calls
5. Auto-redirect if token exists

---

### 2. User Roles & Access Control
**Files**: `src/components/ProtectedRoute.tsx`, `src/hooks/useAuth.tsx`

#### Four User Roles:
1. **Admin** (`/admin/*`)
   - Manage all users
   - Monitor system statistics
   - Adjust protocol parameters
   - View all stakes and tasks
   - Approve role requests

2. **Creator** (`/creator/dashboard`)
   - Create compute tasks
   - Submit tasks to queue
   - Monitor task execution
   - Track compute credit usage
   - View task history and results

3. **Investor** (`/investor/dashboard`)
   - Create stakes (lock QX tokens)
   - Receive compute credits from stakes
   - Create compute leases
   - Monitor lease performance
   - View CC pricing trends

4. **Processor** (via Processor components)
   - Accept and execute tasks
   - Monitor queue position
   - Report execution status
   - View execution history

#### Access Control:
- Routes protected by role check in `ProtectedRoute` component
- Auto-redirect to `/auth` if not authenticated
- Auto-redirect to `/` if wrong role

---

### 3. Admin Dashboard
**Files**: `src/pages/AdminDashboard.tsx`, `src/components/admin/*`

#### Components:
1. **AdminSidebar** - Navigation and stats
2. **StatsCards** - Key metrics display
3. **UserTable** - All registered users
4. **UserFilters** - Search and filter users
5. **AllStakesTable** - Monitor all stakes
6. **AllTasksTable** - Monitor all tasks
7. **ComputePools** - Manage compute resources
8. **ParameterAdjustment** - Configure protocol settings

#### Features:
- **User Management**
  - View all users with filtering
  - Search by email/name
  - Filter by role, status, date
  - Create/edit/delete users
  - Bulk user operations

- **Monitoring**
  - Real-time task status updates
  - Stake monitoring and analytics
  - Vault statistics
  - Pool health metrics

- **Configuration**
  - Adjust CC per QX ratio
  - Set pool parameters
  - Configure reward distribution

#### Data Fetching:
```typescript
- useGetAllStakes(page, limit)    // Fetch all stakes
- useGetAllTasks(page, limit)     // Fetch all tasks
- useGetVaultStats()              // Fetch system statistics
```

---

### 4. Creator Dashboard
**Files**: `src/pages/CreatorDashboard.tsx`, `src/components/creator/*`

#### Components:
1. **CreatorNavbar** - Creator-specific navigation
2. **CCBalanceWidget** - Show available/used compute credits
3. **CreateComputeTaskForm** - Modal form to create tasks
4. **TaskHistoryTable** - Display all creator's tasks
5. **QueueStatusMonitor** - Real-time queue status

#### Features:
- **Task Creation**
  - Define task name, description, type
  - Set compute cost in CC
  - Set priority (Low/Medium/High)
  - Estimate task duration
  - Validate available CC balance

- **Task Monitoring**
  - View task status (queued/running/completed/failed)
  - See computation results
  - Track timestamp and completion
  - Pagination support

- **CC Management**
  - Calculate total CC from stakes
  - Track used and available CC
  - Monitor CC burn rate

#### Data Fetching:
```typescript
- useGetMyTasks(page, limit)         // Fetch creator's tasks
- useGetUserStakes(userId)           // Get CC balance from stakes
- useCreateComputeTask()             // Create new task
```

#### Task Creation Form Fields:
```
- Task Name (required, 100 char max)
- Task Description (optional)
- Compute Cost CC (required, validated against balance)
- Priority (Low/Medium/High)
- Task Type (DataAnalysis/Training/Processing/General/Other)
- Estimated Duration (in seconds)
```

---

### 5. Investor Dashboard
**Files**: `src/pages/InvestorDashboard.tsx`, `src/components/investor/*`

#### Components:
1. **InvestorNavbar** - Investor navigation
2. **LeasingDashboardStats** - Lease statistics and metrics
3. **ActiveLeasesTable** - Display investor's active leases
4. **ComputeMarketplace** - Browse available compute packages
5. **LeaseCreationModal** - Create new lease agreements
6. **CCPriceChart** - Historical CC price trends

#### Features:
- **Staking**
  - Lock QX tokens to receive CC
  - Monitor stake status (active/released/claimed)
  - Track CC received from stakes

- **Lease Management**
  - Create compute leases with fixed duration
  - Set lease cost in CC
  - Monitor lease performance
  - Track lease expiration

- **Marketplace**
  - Browse available compute packages
  - View pricing and specifications
  - Purchase packages with CC
  - See marketplace trends

- **Analytics**
  - Track CC price history
  - Monitor lease ROI
  - View performance metrics

#### Data Fetching:
```typescript
- useGetUserLeases(userId, page, limit)  // Fetch investor's leases
- useGetVaultStats()                     // Get marketplace data
- useCreateLease()                       // Create new lease
```

---

### 6. Processor Components
**Files**: `src/components/processor/*`

#### Components:
1. **ProcessorStatusWidget** - Current processor status
2. **LiveTaskStatusTable** - Real-time task execution status
3. **QueuePositionIndicator** - Current position in queue
4. **ExecutionHistoryModal** - Historical task executions

#### Features:
- **Task Execution**
  - Accept tasks from queue
  - Execute compute operations
  - Report results back to network

- **Monitoring**
  - View assigned tasks
  - Track execution progress
  - Monitor queue position
  - See performance metrics

- **History**
  - View past task executions
  - Track completion times
  - Monitor uptime and reliability

---

### 7. API Layer
**Files**: `src/services/protocolAPI.ts`, `src/services/adminAPI.ts`

#### Base Configuration:
```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
const token = localStorage.getItem("token")
// All requests include: Authorization: Bearer <token>
```

#### protocolAPI.ts - Main Protocol Operations

**computeTaskAPI**:
```typescript
- createTask(name, costCC, description, priority, type, duration)
- getMyTasks(page, limit)
- getAvailableTasks(page, limit)
- getAllTasks(page, limit, status)
- getTaskById(taskId)
- updateTaskStatus(taskId, status)
```

**stakeAPI**:
```typescript
- createStake(amountQX)
- getUserStakes(userId)
- getAllStakes(page, limit)
- releaseStake(stakeId)
- claimStakeRewards(stakeId)
```

**leaseAPI**:
```typescript
- createLease(computeAmount, costCC, duration)
- getUserLeases(userId, page, limit)
- getAllLeases(page, limit)
- getLeaseById(leaseId)
```

**vaultAPI**:
```typescript
- getVaultStats()  // Returns:
  // - totalLockedQX
  // - totalComputeCredits
  // - totalTasksExecuted
  // - rewardPool
  // - ccPerQX ratio
  // - successRate
```

#### adminAPI.ts - Admin Operations

**usersAPI**:
```typescript
- getAllUsers(filters: {search, role, dateFilter, page, limit})
- getUserById(userId)
- createUser(userData)
- updateUser(userId, userData)
- deleteUser(userId)
- updateUserRole(userId, newRole)
```

#### Interface Types:
```typescript
// ComputeTask
{
  _id: string;
  creatorId: string;
  taskName: string;
  computeCostCC: number;
  status: "queued" | "running" | "completed" | "failed";
  result: any;
  timestamp: string;
  createdAt: string;
}

// Stake
{
  _id: string;
  userId: { email, role };
  amountQX: number;
  computeCreditsReceived: number;
  lockPeriod: number;
  status: "active" | "released" | "claimed";
  createdAt: string;
}

// User
{
  _id: string;
  email: string;
  role: "user" | "creator" | "investor" | "admin";
  status: string;
  name: string;
  createdAt: string;
}
```

---

### 8. State Management & Data Fetching
**Files**: `src/hooks/useProtocol.tsx`, `src/hooks/useAdminHooks.tsx`, `src/hooks/useAuth.tsx`

#### React Query Setup:
```typescript
const queryClient = new QueryClient();
// Wrapped in QueryClientProvider in App.tsx

// Cache settings:
- staleTime: 30-60 seconds (data freshness)
- retry: 1 (retry failed requests once)
- enabled: conditional fetching based on dependencies
```

#### Query Hooks:
```typescript
// Creator
useGetMyTasks(page, limit)
useGetUserStakes(userId)
useCreateComputeTask()

// Investor
useGetUserLeases(userId, page, limit)
useCreateLease()

// Admin
useGetAllStakes(page, limit)
useGetAllTasks(page, limit, status)
useGetVaultStats()

// Shared
useGetVaultStats()
```

#### Mutation Hooks:
```typescript
useCreateComputeTask()
useCreateStake()
useCreateLease()
```

---

### 9. UI Components Library (shadcn/ui)
**Files**: `src/components/ui/*`

#### Key Components Used:
- **Tabs** - Tab navigation interface
- **Table** - Data display tables
- **Dialog** - Modal dialogs
- **Button** - Interactive buttons
- **Input** - Text input fields
- **Label** - Form labels
- **Card** - Content containers
- **Badge** - Status labels
- **Avatar** - User avatars
- **Toaster/Sonner** - Notifications
- **Tooltip** - Help text
- **Alert** - Alert messages
- **Accordion** - Collapsible sections
- **Select** - Dropdown selects
- **Checkbox** - Checkboxes
- **ScrollArea** - Scrollable containers

All components:
- Built on Radix UI primitives
- Styled with Tailwind CSS
- Support dark mode
- Accessible (WCAG compliant)

---

### 10. Utility Functions
**Files**: `src/lib/formatters.ts`, `src/lib/utils.ts`

#### Formatters (formatters.ts):
```typescript
formatCurrency(amount, currency)        // "1,500.50 CC"
formatNumber(num)                       // "1,234,567"
formatPercentage(value)                 // "92.5%"
formatDate(date)                        // "Dec 6, 2024 10:30 AM"
formatDuration(seconds)                 // "2 hours, 30 minutes"
formatRelativeTime(date)                // "2 hours ago"
```

#### Utils (utils.ts):
```typescript
cn(...classes)                          // Class name combiner (clsx wrapper)
```

---

## Data Flow

### Authentication Flow
```
User → Auth Page → Email/Password or Google OAuth
                 → API call to /api/auth/login or /api/auth/google
                 → Receive token + user data
                 → Store in localStorage
                 → Redirect to "/" or role-specific dashboard
```

### Task Creation Flow (Creator)
```
Creator → Create Task Form → Fill task details
                           → Validate CC balance
                           → API call to /api/compute/tasks
                           → Task queued
                           → Update local cache with React Query
                           → Show success toast
```

### Task Execution Flow (Processor)
```
System Queue → Processor accepts task
             → Execute computation
             → Report status updates
             → Complete with results
             → Creator views results
```

### Staking Flow (Investor)
```
Investor → Select stake amount (QX)
         → API call to /api/stakes
         → QX locked
         → Receive CC credits
         → Can create leases or sell CC
```

---

## Routing Structure

```
/                          → Index (Landing page - redirects to /auth if not logged in)
/auth                      → Authentication (login/register)
/profile                   → User profile page
/creator/dashboard         → Creator dashboard (requires creator role)
/investor/dashboard        → Investor dashboard (requires investor role)
/admin/login              → Admin login page
/admin/dashboard          → Admin control panel (requires admin role)
/admin/users              → Admin user management
/admin/role-requests      → Approve role requests
/*                        → 404 Not Found page
```

---

## Environment Variables

Required `.env` or `.env.local`:
```env
VITE_API_URL=http://localhost:3000  # Backend API URL
```

---

## Key Design Patterns

### 1. Hook-Based Architecture
- Custom hooks encapsulate API logic
- React Query for data fetching
- localStorage for client-side storage

### 2. Component Composition
- Small, focused components
- Props-based configuration
- Reusable UI library (shadcn/ui)

### 3. Type Safety
- TypeScript for all source files
- Zod for runtime validation
- Interfaces for all data types

### 4. Error Handling
- Toast notifications for user feedback
- Try-catch in async operations
- Validation before API calls

### 5. Performance
- React Query caching and deduplication
- Lazy loading of components
- Pagination for large datasets

---

## Development Setup

### Prerequisites:
- Node.js 18+
- npm or bun package manager

### Installation:
```bash
npm install
# or
bun install
```

### Development Server:
```bash
npm run dev
# Runs on http://localhost:8080
```

### Build for Production:
```bash
npm run build
npm run preview  # Preview production build
```

### Linting:
```bash
npm run lint
```

---

## File-by-File Key Responsibilities

| File | Responsibility |
|------|-----------------|
| `App.tsx` | Router setup, query client provider, toast/tooltip setup |
| `pages/Index.tsx` | Home/landing page, auth redirect |
| `pages/Auth.tsx` | Authentication UI and login/register logic |
| `pages/AdminDashboard.tsx` | Admin overview, stats, and tabs |
| `pages/CreatorDashboard.tsx` | Creator task management UI |
| `pages/InvestorDashboard.tsx` | Investor lease management UI |
| `hooks/useAuth.tsx` | Auth state management |
| `hooks/useProtocol.tsx` | Protocol API query hooks |
| `hooks/useAdminHooks.tsx` | Admin-specific query hooks |
| `services/protocolAPI.ts` | All protocol API endpoints |
| `services/adminAPI.ts` | Admin API endpoints |
| `lib/formatters.ts` | Data formatting utilities |
| `components/ui/*` | Reusable UI components |

---

## Common Workflows

### Adding a New Feature:
1. Create page in `src/pages/`
2. Create components in `src/components/`
3. Add API methods in `src/services/`
4. Create hooks in `src/hooks/`
5. Add route in `App.tsx`

### Adding a New API Endpoint:
1. Add method to appropriate service file
2. Create query hook in appropriate hooks file
3. Use hook in component with `useQuery` or `useMutation`

### Styling:
- Use Tailwind CSS classes
- Follow dark theme (slate-950, blue-500, etc.)
- Use shadcn/ui components for consistency

---

## Key Technologies & Why

| Technology | Purpose |
|-----------|---------|
| React + TypeScript | Type-safe, component-based UI |
| Vite | Fast dev server and build |
| React Router | Client-side routing |
| React Query | Server state, caching, synchronization |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Pre-built accessible components |
| Zod | Runtime validation |
| React Hook Form | Efficient form management |

---

## Security Considerations

1. **Authentication**: Bearer token in Authorization header
2. **Storage**: Token stored in localStorage (consider httpOnly cookie for production)
3. **Validation**: Zod schemas validate input before API calls
4. **CORS**: Backend configured for cross-origin requests
5. **Role-Based Access**: Components check user role before rendering

---

## Performance Optimizations

1. **React Query Caching**: Data cached and reused across requests
2. **Pagination**: Large datasets paginated to reduce load
3. **Lazy Loading**: Components loaded on demand
4. **Memoization**: Components wrapped with React.memo where appropriate
5. **Debouncing**: Search inputs debounced

---

## Future Enhancement Opportunities

1. Add WebSocket for real-time updates
2. Implement offline support with Service Workers
3. Add more granular role-based permissions
4. Implement dark/light theme toggle
5. Add multi-language support
6. Implement advanced analytics
7. Add task scheduling and automation
8. Implement payment integration

---

## Support & Documentation

- **Backend**: See backend repository for API documentation
- **UI Components**: https://ui.shadcn.com/
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

