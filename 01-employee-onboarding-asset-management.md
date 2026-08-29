# Project 1 — Employee Onboarding & Asset Management System

## 1. Project Overview

An internal company tool that manages new employee onboarding tasks and equipment requests. Employees request laptops, monitors, and other assets; managers approve or reject the requests; HR tracks onboarding checklists per new hire. Used by internal staff only, not customers.

## 2. Why I Should Build This Project

This project establishes the shape of a properly structured NestJS application before you have any other complexity competing for your attention. It's your first real exposure to dependency injection as NestJS implements it, not as Laravel's container implements it, and to the way NestJS splits request handling into more distinct layers than you're used to. Everything from Project 2 onward assumes this structure is second nature.

## 3. Difficulty Level

Intermediate. The domain is simple on purpose — the difficulty is in getting the NestJS mechanics right, not in the business rules.

## 4. What I Must Know Before Starting

- Basic NestJS: modules, controllers, providers, how a request reaches a handler
- REST API conventions
- JWT authentication conceptually (you've used it via Sanctum or Passport)
- Basic relational schema design

## 5. Main Actors

- **Employee** — requests assets, views their own onboarding checklist
- **Manager** — approves or rejects asset requests from their direct reports
- **HR Administrator** — creates onboarding checklists, manages employee records, has visibility across the company
- **System** — marks onboarding tasks overdue, flags stale requests

## 6. Business Problem

New hires need equipment and a defined onboarding path, and someone needs to approve spending on that equipment without a spreadsheet and an email chain. Today this is likely handled informally; the application exists to make requests, approvals, and accountability explicit and auditable.

## 7. Core Modules

- `AuthModule` — login, JWT issuance, token refresh
- `UsersModule` — employee records, manager relationships, roles
- `AssetsModule` — the asset catalog and current availability
- `AssetRequestsModule` — the request/approval workflow
- `OnboardingModule` — checklist templates and per-employee onboarding progress

## 8. Main Entities

- **User** — an employee, manager, or HR admin; has a role and, if applicable, a manager
- **Asset** — a piece of company equipment with a category and availability status
- **AssetRequest** — a request from an employee for a specific asset, with a status
- **OnboardingTemplate** — a reusable checklist definition (e.g., "Engineering onboarding")
- **OnboardingTask** — an instance of a checklist item assigned to a specific new hire

## 9. Important Relationships

```
User (manager) 1 → Many User (direct reports)
User 1 → Many AssetRequest
Asset 1 → Many AssetRequest (historical, only one active at a time)
OnboardingTemplate 1 → Many OnboardingTask (per employee)
User 1 → Many OnboardingTask
```

An asset can have many historical requests but only one active (approved, not yet returned) request at a time. A manager can only approve requests from users who report to them.

## 10. Database Choice

**MySQL.**

### Why this database?
It's a familiar relational engine, which keeps your attention on NestJS mechanics rather than on database-specific syntax you haven't seen before.

### What database concepts will I practice?
Foreign keys, unique constraints, basic indexing, and enough transaction awareness to keep an approval and its resulting asset-status update consistent.

### Why not use another database?
PostgreSQL's advanced features (window functions, CTEs) aren't needed yet, and introducing them here would split your attention. Save that for Project 3, where reporting actually requires them.

### What should I understand after working with this database?
How to model a request/approval workflow relationally, and how foreign key constraints protect you from orphaned records.

## 11. ORM Choice

**TypeORM.** Its decorator-based entity style is the more approachable starting point coming from Eloquent's Active Record feel, even though the underlying pattern (Data Mapper) is different. Prisma's schema-first workflow and stricter migration model are better introduced once you have a concurrency-heavy project (Project 4) that benefits from its more explicit transaction API.

## 12. Main Features

- Employee registration and login
- Browsing available assets by category
- Submitting an asset request
- Manager approval/rejection queue
- HR view of all requests and onboarding progress
- Onboarding checklist creation and per-employee task tracking

## 13. User Stories

### US-001 — Employee Requests an Asset

**User Story**
```
As an employee
I want to request a piece of company equipment
So that I have what I need to do my job
```

**Business Context**
Employees currently ask for equipment informally. A structured request gives HR and managers a queue to work from and a record of what was asked for and when.

**Preconditions**
The employee is authenticated. The requested asset exists and is currently available.

**Acceptance Criteria**
```
Given an available asset
When an employee submits a request for it
Then the request is created with status PENDING and the employee is notified it was submitted

Given an asset that is already checked out
When an employee submits a request for it
Then the request is rejected at submission time with a clear reason

Given an employee with no manager assigned
When they submit a request
Then the system flags it for HR review directly, since there is no manager to approve it
```

**Business Rules**
An asset can have at most one active (PENDING or APPROVED-and-not-returned) request at a time.

**Validation Rules**
The asset ID must reference an existing, active asset. An optional justification note is limited to a reasonable length.

**Authorization**
Any authenticated employee can create a request for themselves. Nobody can create a request on behalf of another employee.

**State Changes**
```
(none) → PENDING
```

**Edge Cases**
Two employees request the same available asset within moments of each other. The asset is deactivated by HR while a request for it is pending.

**Failure Scenarios**
The asset no longer exists by the time the request is processed. The employee's account is deactivated between request creation and approval.

**Database Impact**
Creates an `AssetRequest` row. Does not yet change the `Asset`'s availability — that happens on approval.

**API Responsibility**
An endpoint accepting an asset ID and optional note, returning the created request with its status.

**Events**
`AssetRequestSubmitted`

**Background Jobs**
None required at this stage.

**Testing Requirements**
Unit test the rule that an asset with an existing active request cannot receive a second one. Integration test the full creation path against a real database. E2E test the request appearing in the employee's own request history afterward.

**Security Considerations**
Ensure the employee ID on the request is taken from the authenticated session, never from the request body, or an employee could submit requests as someone else.

**Performance Considerations**
None significant at this scale; note it as a placeholder habit for later, larger projects.

---

### US-002 — Manager Approves or Rejects a Request

**User Story**
```
As a manager
I want to approve or reject asset requests from my direct reports
So that spending on equipment goes through someone accountable for it
```

**Business Context**
Managers are the natural approval point since they know their team's actual needs and budget constraints.

**Preconditions**
A request exists in PENDING status, and the requesting employee reports to this manager.

**Acceptance Criteria**
```
Given a pending request from a direct report
When the manager approves it
Then the request becomes APPROVED and the asset becomes unavailable to others

Given a pending request from someone who does not report to this manager
When the manager attempts to approve it
Then the action is rejected with an authorization error

Given a request that was already approved or rejected
When someone attempts to approve it again
Then the action is rejected as invalid for the current state
```

**Business Rules**
Only the requesting employee's direct manager, or an HR admin, may approve or reject a request.

**Validation Rules**
A rejection should require a reason; approval does not.

**Authorization**
Manager of the requesting employee, or HR admin.

**State Changes**
```
PENDING → APPROVED
PENDING → REJECTED
```

**Edge Cases**
The manager approves a request for an asset that became unavailable in the meantime (assigned to someone else through some other path). The employee's manager changes between request submission and approval.

**Failure Scenarios**
The asset was deactivated after the request was submitted but before approval.

**Database Impact**
Updates `AssetRequest.status`. On approval, also updates `Asset.status` to unavailable.

**API Responsibility**
Separate approve and reject actions on a specific request, restricted to the appropriate manager or HR admin.

**Events**
`AssetRequestApproved`, `AssetRequestRejected`

**Background Jobs**
None required.

**Testing Requirements**
Unit test the authorization rule (only the direct manager or HR can act). Integration test that approval correctly updates both the request and the asset in the same operation. E2E test a manager attempting to approve a report who isn't theirs and getting rejected.

**Security Considerations**
This is a broken-access-control risk if the "is this my direct report" check is missing or wrong — verify it against the actual manager relationship in the database, not a client-supplied field.

**Performance Considerations**
None significant at this scale.

---

### US-003 — HR Creates an Onboarding Checklist for a New Hire

**User Story**
```
As an HR administrator
I want to assign an onboarding checklist to a new employee
So that nothing important gets missed during their first weeks
```

**Business Context**
Onboarding steps (badge, laptop, benefits enrollment, team introductions) are easy to forget without a structured checklist tied to the specific new hire.

**Preconditions**
An onboarding template exists. The new employee's user record exists.

**Acceptance Criteria**
```
Given an existing template and a new employee
When HR assigns the template
Then a set of OnboardingTask records is created for that employee, one per template item, all marked incomplete

Given an employee who already has an active onboarding checklist
When HR attempts to assign another template
Then the system warns that an active checklist already exists rather than silently creating a duplicate set
```

**Business Rules**
Each employee should have at most one active onboarding checklist at a time.

**Validation Rules**
The template must exist and contain at least one task.

**Authorization**
HR administrators only.

**State Changes**
```
(none) → Tasks created as INCOMPLETE
INCOMPLETE → COMPLETE (handled in a separate story)
```

**Edge Cases**
A template is edited after being assigned to some employees but not others — decide whether existing assignments should reflect the edit or stay frozen at assignment time.

**Failure Scenarios**
The template is deleted after some employees were assigned it but before others were.

**Database Impact**
Creates multiple `OnboardingTask` rows from one `OnboardingTemplate`.

**API Responsibility**
An endpoint taking an employee ID and template ID, returning the created task list.

**Events**
`OnboardingAssigned`

**Background Jobs**
None required at this stage.

**Testing Requirements**
Unit test that assigning a template produces the correct number of tasks. Integration test the duplicate-active-checklist guard.

**Security Considerations**
Restrict this action to HR admins; a regular employee assigning themselves a checklist has no legitimate use case here.

**Performance Considerations**
None significant at this scale.

---

### US-004 — Employee Views Their Own Request History

**User Story**
```
As an employee
I want to see the status of my past and current asset requests
So that I know what's pending and what I already have
```

**Business Context**
Without this, employees would have no way to check on a request without asking their manager directly.

**Preconditions**
The employee is authenticated.

**Acceptance Criteria**
```
Given an employee with several requests in different states
When they view their request history
Then they see all their own requests with current status, and none belonging to anyone else
```

**Business Rules**
An employee can only ever see their own requests through this endpoint.

**Validation Rules**
None beyond authentication.

**Authorization**
The authenticated employee, scoped to their own records only.

**State Changes**
None; read-only.

**Edge Cases**
An employee with zero requests should see an empty list, not an error.

**Failure Scenarios**
None significant.

**Database Impact**
Read-only query against `AssetRequest` filtered by employee ID.

**API Responsibility**
A paginated listing endpoint scoped to the authenticated user.

**Events**
None.

**Background Jobs**
None.

**Testing Requirements**
Integration test that the query is correctly scoped and can't be manipulated via query parameters to see another employee's requests.

**Security Considerations**
This is a direct IDOR risk if the employee ID is taken from a query parameter instead of the authenticated session.

**Performance Considerations**
Add pagination even though volume is low now — the habit matters more than the current need.

---

### US-005 — System Flags Overdue Onboarding Tasks

**User Story**
```
As HR
I want overdue onboarding tasks to be automatically flagged
So that I can follow up before something important slips
```

**Business Context**
Some onboarding tasks have a natural deadline (e.g., benefits enrollment within the first week). Manual tracking doesn't scale past a handful of new hires.

**Preconditions**
Onboarding tasks have an associated due date.

**Acceptance Criteria**
```
Given a task with a due date in the past that is still incomplete
When the daily check runs
Then the task is marked OVERDUE and HR sees it in a dedicated view

Given a task that was completed before its due date
When the daily check runs
Then it is not flagged
```

**Business Rules**
Only incomplete tasks past their due date are flagged; completed tasks are never touched by this process.

**Validation Rules**
None beyond the due date being a valid date.

**Authorization**
This is a system-triggered process; the resulting view is visible to HR only.

**State Changes**
```
INCOMPLETE → OVERDUE (informational status, not a hard block)
```

**Edge Cases**
A task's due date is edited after it was already marked overdue.

**Failure Scenarios**
The scheduled check itself fails to run for a day — decide whether the next run should catch up correctly regardless.

**Database Impact**
Bulk update against `OnboardingTask` where due date has passed and status is still incomplete.

**API Responsibility**
An HR-only endpoint listing overdue tasks; the flagging itself isn't triggered by an API call.

**Events**
`OnboardingTaskOverdue`

**Background Jobs**
A scheduled job that runs daily. This is your first exposure to a time-based job — keep it simple here, you'll build real background processing in Project 5.

**Testing Requirements**
Unit test the overdue-detection logic against a fixed clock so the test isn't flaky. Integration test that completed tasks are never flagged regardless of due date.

**Security Considerations**
None significant.

**Performance Considerations**
Consider what happens when this job runs against thousands of tasks instead of a handful — it's worth thinking about now even if it's not a real problem at this project's scale.

## 14. Business Rules

- An asset can have at most one active request at a time.
- Only a direct manager or HR can approve or reject a request.
- An employee can only view or act on their own requests.
- An onboarding checklist is assigned once per employee at a time.

## 15. State Management

```
AssetRequest

PENDING
  ↓
APPROVED ─────→ RETURNED
  ↓
REJECTED
```

Invalid transitions: PENDING cannot be reached from any other state. APPROVED cannot go back to PENDING. REJECTED is terminal.

```
OnboardingTask

INCOMPLETE
  ↓
COMPLETE

INCOMPLETE
  ↓
OVERDUE (still incomplete, informational only)
  ↓
COMPLETE
```

## 16. Authentication Requirements

JWT-based authentication with a short-lived access token and a refresh token. This is a reasonable default for an internal tool and gives you a real reason to implement token refresh, which you'll reuse in every later project.

## 17. Authorization Requirements

Introduce role-based access control with three roles: employee, manager, HR admin. Manager approval additionally requires an ownership check (is this employee my direct report), which is your first taste of authorization that can't be solved by role alone. Design this distinction clearly — role answers "what kind of user is this," ownership answers "does this specific user have rights over this specific record." You'll need both again in every later project.

## 18. NestJS Concepts I Will Practice

- **Modules** — the project's five modules force you to think about what belongs where before scale makes bad boundaries expensive to fix
- **Controllers** — one per resource, thin, translating HTTP to service calls
- **Providers/Services** — where the actual business rules for requests and approvals live
- **Dependency Injection** — services depending on repositories, repositories depending on the database connection, all resolved automatically
- **DTOs** — request and response shapes, validated with `class-validator`
- **ValidationPipe** — applied globally so every DTO is checked consistently
- **Guards** — `AuthGuard` for authentication, a custom `RolesGuard` for role checks, and a custom guard or service-level check for the manager-ownership rule
- **Interceptors** — a simple response-shaping interceptor, your first exposure to the difference between a guard (can this proceed) and an interceptor (transform what goes in or out)
- **Middleware** — a request-logging middleware, to see how it differs from a guard in when it runs and what it can access
- **Exception Filters** — a global filter normalizing error responses so every endpoint fails predictably
- **Custom Decorators** — `@CurrentUser()` to pull the authenticated user out of the request cleanly
- **Configuration** — environment-based config for the database connection and JWT secret, never hardcoded

## 19. Node.js Concepts I Will Practice

- **Async/Await** — every service method touching the database is asynchronous; get comfortable with this being the default, not the exception
- **Promises** — understand what `await` is actually doing underneath, since you'll need that understanding once concurrency becomes a real problem in Project 4
- **Event Loop (conceptual introduction)** — start noticing that your request handlers don't block each other the way PHP-FPM workers would, even though you're not yet exploiting or fighting that behavior directly

## 20. Database Concepts I Will Practice

- Foreign keys and referential integrity
- Unique constraints (one active request per asset, enforced at the database level, not just in application code)
- Basic indexing on frequently filtered columns (status, employee ID)
- A first, simple transaction: approving a request and updating the asset's availability must succeed or fail together

## 21. Engineering Challenges

### Concurrency
Two employees submit a request for the same available asset within moments of each other. Investigate what actually happens in your current implementation if you don't add any protection, then decide what should stop the second request from succeeding. You don't need a sophisticated locking strategy yet — a correctly designed unique constraint may be enough here — but you do need to understand why.

### Query Performance
As you build the HR view listing all requests across the company, notice whether loading each request also triggers a separate query for its asset and its employee. Investigate what's happening and why, even though fixing it properly with joins or eager loading is something you'll get more practice with in Project 3.

## 22. Concurrency Problems

This project's concurrency exposure is intentionally light — a single unique constraint is likely sufficient. The point here isn't to solve a hard concurrency problem yet, it's to notice that concurrency is a real concern even in a simple CRUD-shaped project, so it stops feeling like a special topic reserved for "advanced" work later.

## 23. Async Processing Requirements

A single scheduled job (US-005) is the only background processing needed here. Don't reach for a queue system yet — a simple cron-style scheduled task inside the application is proportionate to this project's needs. BullMQ has a real justification starting in Project 5; introducing it here would be technology before there's a problem for it to solve.

## 24. Message Broker Requirements

Not applicable to this project.

## 25. Real-Time Requirements

Not applicable to this project.

## 26. Architecture

**Layered Architecture**: Controller → Service → Repository → Database.

This is the simplest architecture that fits the project honestly. Anything more (module boundaries beyond basic feature separation, hexagonal ports and adapters) would be solving a problem this project doesn't have yet. The simpler alternative — putting query logic directly in controllers — is worth avoiding even here, since undoing that habit later is harder than building the right one now.

## 27. Testing Requirements

### Unit Tests
Business rules that don't need a database: the one-active-request-per-asset rule, the manager-ownership authorization check, the overdue-detection logic.

### Integration Tests
The approval flow against a real (test) database, confirming the request and asset update together correctly. The onboarding-assignment flow producing the right number of tasks.

### E2E Tests
The full flow: register → login → submit request → manager approves → asset shows unavailable. A second full flow: HR assigns an onboarding template → tasks appear for the employee → completing a task updates its status.

## 28. Security Requirements

- Password hashing (bcrypt or equivalent) — never store plaintext
- JWT expiry and refresh handled correctly
- Broken access control: verify every "my own records" and "my direct report" check is enforced server-side against the authenticated session, never trusted from client input
- Input validation on every DTO, rejecting unexpected fields (mass assignment risk if you're not careful with how you map DTOs to entities)

## 29. Performance Challenges

- Notice N+1 queries in the HR listing view; you don't have to fully solve this here, but document what you noticed for comparison against Project 3
- Nothing else meaningful at this scale — this project's value is elsewhere

## 30. Production Requirements

- Environment variables for all configuration (database credentials, JWT secret)
- Basic structured logging instead of `console.log`

Docker, CI/CD, and observability tooling aren't proportionate to this project yet — they show up starting in Project 9 and 10, once you have something worth operating at that level of rigor.

## 31. Definition of Done

- Core user stories (US-001 through US-005) implemented and behaving as specified
- Role-based and ownership-based authorization enforced on every relevant endpoint
- Validation applied consistently through DTOs
- The one-active-request-per-asset rule enforced at the database level, not just in application code
- Unit, integration, and E2E tests passing for the flows described above
- Error responses consistent across the whole API
- No endpoint accessible without appropriate authentication and authorization

## 32. What I Should Understand Before Finishing

- The exact order NestJS executes middleware, guards, pipes, interceptors, and exception filters in, and why that order matters
- Why a provider is a singleton by default and what that means for storing state on a service instance
- The difference between authenticating a user and authorizing what they can do
- Why the one-active-request rule needed a database-level constraint, not just an application-level check

## 33. What I Should Understand After Finishing

### NestJS
The full request lifecycle and where each concern (validation, auth, business logic, error shaping) belongs.

### Node.js
Comfort with async/await as the default way code executes here, and an early sense that the event loop means requests can interleave in ways a PHP-FPM process never would.

### Database
How to model a request/approval workflow relationally and enforce its core invariant with a constraint, not just application logic.

### SQL
Basic joins, filtering, and enough comfort with foreign keys to design a schema without second-guessing every relationship.

### Architecture
Why a simple layered structure is the right choice at this scale, not a limitation you're temporarily stuck with.

### Testing
The practical difference between a unit test (no database) and an integration test (real database), and when each is the right tool.

### Security
Broken access control is the most likely real vulnerability in a project like this, more than anything exotic.

### Performance
An early, informal sense of what an N+1 query looks like in practice, to be revisited properly in Project 3.

### Production
Configuration should never be hardcoded, from the very first project onward.

### Senior Engineering
Getting the structure right before complexity arrives is cheaper than fixing it after complexity arrives.

## 34. What I Learned From This Project

Not "learned NestJS modules." You should now understand why NestJS separates concerns into more distinct pieces than Laravel's middleware pipeline does, and specifically what each piece (guard, interceptor, pipe, filter) is responsible for that the others aren't. You should also understand that a business rule like "only one active request per asset" isn't actually enforced until it lives in the database, not just in a service method that might get bypassed by some future code path you haven't written yet.

## 35. Senior Backend Interview Questions

1. Walk me through what happens, in order, from an HTTP request arriving to a response leaving, in a NestJS application with guards, pipes, and interceptors configured.
2. Why is a NestJS provider a singleton by default, and what problem would arise if you stored per-request data on one?
3. How is a NestJS Guard different from Middleware, and why does the framework separate them?
4. Where does authorization logic belong in this project, and why not directly inside the controller?
5. How did you prevent two employees from both claiming the same asset, and why does that protection need to exist at the database level?
6. What's the risk of validating a DTO's shape but not checking who the record actually belongs to?
7. How would you extend the role system if a fourth role were added next month, without touching every existing controller?
8. What's the difference between authentication and authorization, concretely, in this project?
9. Why did you choose a scheduled job instead of a queue for the overdue-task check?
10. What would go wrong if the JWT secret were hardcoded instead of read from configuration?
11. How would you test that a manager cannot approve a request from someone who isn't their direct report?
12. What's an N+1 query, and where did you notice one in this project even though you didn't fully fix it yet?
13. Why is TypeORM's Data Mapper pattern different from Eloquent's Active Record pattern, and does that difference actually matter here?
14. If this project needed to support a fourth actor type with entirely different permissions, what would you change first?
15. What does "mass assignment" mean, and how does using DTOs instead of raw entities protect against it?
