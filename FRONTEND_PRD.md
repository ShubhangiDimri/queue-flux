# QueueFlux Frontend PRD (React)

## 1) Summary
Build a professional React frontend for the existing QueueFlux backend (Node/Express + MongoDB) that implements the functionality available today:
- Patient registration and login
- Admin creates users (doctor/admin/patient)
- Patient books appointments (FIFO queue)
- Doctor views their waiting queue and marks appointments as completed

Visual direction: match the clean teal/blue-green gradient look in the provided reference screenshots (teal navbar + hero, white/light sections, rounded cards).

## 2) Goals
- Implement all backend capabilities end-to-end in the UI with role-based screens.
- Provide a polished, responsive experience (desktop-first, but works on mobile).
- Keep the frontend simple and stable: minimal moving parts, predictable flows, clear empty/error states.

## 3) Non-goals (explicitly out of scope)
These are **not** supported by the current backend and should not be “invented” in the frontend:
- Listing doctors/patients from the database (no endpoint exists yet)
- “My appointments” list, rescheduling, cancellation
- Appointment status transitions other than Waiting → Completed
- Payments, notifications, chat

(We can propose backend additions later, but the delivered UI must work with the current API.)

## 4) Users & Roles
### Roles (from backend)
- `patient`: can register publicly; can book appointments
- `doctor`: created by admin; can mark appointments complete; can view queue
- `admin`: created by admin (or seeded); can create users

### Auth token
- JWT returned by `POST /api/auth/login`
- Payload includes `userId` and `role`
- Expiry: 2 hours

Frontend must store token securely (MVP: `localStorage`) and attach `Authorization: Bearer <token>` to protected calls.

## 5) Information Architecture (Routes)
Public:
- `/` Landing
- `/login` Login
- `/register` Patient registration

Authenticated (all roles):
- `/app` App shell / redirect by role

Patient:
- `/app/book` Book appointment

Doctor:
- `/app/queue` View waiting queue (for the logged-in doctor)

Admin:
- `/app/admin/create-user` Create user (doctor/admin/patient)

Common:
- `/app/profile` (optional simple page: shows name/email/role + logout)

## 6) Core User Flows
### 6.1 Patient: Register → Login → Book appointment
1. Patient registers
2. Patient logs in → receives token
3. Patient books appointment by providing:
   - Doctor ID (string; required due to missing “list doctors” endpoint)
   - Date/time
4. Show success confirmation including appointment status (`Waiting`) and appointment id

### 6.2 Admin: Login → Create doctor/admin
1. Admin logs in
2. Admin creates user via create-user form
3. Show success toast + created user details (id, name, email, role)
4. UX hint: admin can copy the new doctor’s ID to share with patients

### 6.3 Doctor: Login → View queue → Complete
1. Doctor logs in
2. Doctor opens queue page
3. Frontend calls queue endpoint using doctor’s own id as `doctorId`
4. Doctor clicks “Complete” on the next appointment → status updates to `Completed` and it disappears from the waiting list after refresh

## 7) API Contract (as implemented)
Base URL: `http://localhost:5000` (configurable via env)

### 7.1 Auth
#### Register (patient only)
- `POST /api/auth/register`
- Body: `{ "name": string, "email": string, "password": string, "role"?: "patient" }`
- Success: `201` with `{ success, message, data: { id, name, email, role } }`

#### Login
- `POST /api/auth/login`
- Body: `{ "email": string, "password": string }`
- Success: `200` with `{ success, message, token, data: { id, name, email, role } }`

#### Create user (admin only)
- `POST /api/auth/create-user`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "name": string, "email": string, "password": string, "role": "patient"|"doctor"|"admin" }`
- Success: `201` with `{ success, message, data: { id, name, email, role } }`

### 7.2 Appointments
#### Book appointment (patient only)
- `POST /api/appointments/book`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "doctorId": string, "date": string | Date }`
- Success: `201` with `{ success, message, data: appointment }`

#### Get queue (FIFO)
- `GET /api/appointments/queue/:doctorId`
- Success: `200` with `{ success, count, data: appointment[] }`

Note: This route is currently not protected on the backend. The frontend should still only expose it in the Doctor UI after login.

#### Complete appointment (doctor only)
- `PUT /api/appointments/complete/:id`
- Headers: `Authorization: Bearer <token>`
- Success: `200` with `{ success, message, data: appointment }`

### Appointment shape (Mongo/Mongoose)
An appointment object includes:
- `_id`
- `patientId` (ObjectId string)
- `doctorId` (ObjectId string)
- `date` (ISO string)
- `status` (`Waiting` | `In-Progress` | `Completed`) — currently used values: `Waiting`, `Completed`
- `createdAt`, `updatedAt`

## 8) UI/UX Requirements
### 8.1 Visual theme (match reference)
Style intent: clean health-tech look with teal gradient hero and crisp white sections.

#### Color palette (tokens)
Define these as CSS variables or Tailwind theme tokens (do not scatter hard-coded hex values in components):
- Primary teal: `#0F8A9D`
- Deep teal: `#0A6E7C`
- Light teal: `#6FB9C3`
- Background: `#F5FAFC`
- Surface/card: `#FFFFFF`
- Text primary: `#0F172A`
- Text secondary: `#475569`
- Border: `#E2E8F0`
- Success: `#16A34A`
- Danger: `#DC2626`

#### Gradients
- Navbar/hero gradient: left deep teal → right primary teal (subtle)

#### Typography
- Use system font stack or a single modern sans (e.g., Inter). Keep it consistent.
- Headings: bold, high-contrast.
- Body: 14–16px equivalent.

#### Layout style
- Max content width ~1100–1200px.
- Big hero section with centered product name + short tagline and 1 primary CTA.
- Sections with generous whitespace.
- Cards: rounded (12–16px), soft shadow, light border.
- Buttons: rounded, primary teal background, hover slightly darker.

### 8.2 Navigation
- Top navbar fixed or sticky (optional). Contains:
  - Brand/logo (text OK)
  - Right-aligned links based on role
  - Logged-in state shows user name/role + logout

Role-based links:
- Patient: Book Appointment
- Doctor: Queue
- Admin: Create User

### 8.3 Forms
- Client-side validation (required fields, email format, password min length 6).
- Show field-level error messages.
- Disable submit button while request is in flight.

### 8.4 Empty/loading/error states
- Loading: skeleton or spinner in cards
- Empty queue: “No patients waiting.”
- Errors: banner/toast with backend message if available
- Auth expiry/401: auto-logout and redirect to `/login`

## 9) Screen-by-Screen Requirements
### 9.1 Landing (`/`)
- Hero with gradient background
- Primary CTA button:
  - If logged out: “Login”
  - If logged in: “Open App” (redirect by role)
- Minimal “About” section explaining queue + roles

### 9.2 Register (Patient) (`/register`)
Fields: name, email, password
- On submit: call register
- On success: redirect to login with success message

### 9.3 Login (`/login`)
Fields: email, password
- On success: store token + user object
- Redirect by role:
  - patient → `/app/book`
  - doctor → `/app/queue`
  - admin → `/app/admin/create-user`

### 9.4 Patient: Book Appointment (`/app/book`)
Fields:
- Doctor ID (text input)
- Appointment date/time (datetime-local)

Actions:
- “Book Appointment” (calls booking endpoint)

Success UI:
- Show confirmation card with appointment id, doctorId, date, status

### 9.5 Doctor: Queue (`/app/queue`)
- Fetch queue using logged-in doctor id: `GET /api/appointments/queue/{doctorUserId}`
- Table or list cards showing:
  - Created time (optional)
  - Appointment date/time
  - Patient ID (since patient details are not populated)
  - Status (Waiting)
  - Action: “Complete” → calls `PUT /complete/:id`

Queue ordering:
- Must reflect FIFO (backend sorts by `createdAt` ascending)

### 9.6 Admin: Create User (`/app/admin/create-user`)
Fields: name, email, password, role (select)
- On submit: `POST /api/auth/create-user`
- On success: show created user id prominently with “Copy” button

## 10) Technical Requirements
### 10.1 Recommended stack
- React (Vite) — **JavaScript/JSX only** (no TypeScript)
- React Router
- HTTP client: `fetch` or `axios`
- Styling: Tailwind CSS recommended to hit the design quickly, with a theme config for the palette

Implementation notes:
- Use `.jsx` files for React components/pages/hooks.
- Do **not** introduce TypeScript config (`tsconfig.json`) or `.tsx` files.

### 10.2 State management
- Minimal global state: auth (token + user)
- Store in `localStorage` and also in memory (React context)

### 10.3 Environment variables
- `VITE_API_BASE_URL` (e.g., `http://localhost:5000`)

### 10.4 API client rules
- Centralize API calls in one module
- Attach `Authorization` header when token exists
- Parse error payloads with `message` when present

## 11) Security & Privacy (MVP)
- Never store passwords anywhere except transient form state.
- Token in `localStorage` is acceptable for MVP; do not log tokens to console.
- On `401 Not authorized` responses, clear auth and redirect to login.

## 12) Acceptance Criteria (Definition of Done)
- Patient can register and then login successfully.
- Patient can book an appointment and see success confirmation.
- Admin can login and create a doctor user successfully.
- Doctor can login, see their waiting queue, and complete an appointment.
- UI matches the requested teal/gradient styling direction with consistent spacing/cards/buttons.
- App is responsive and has clear loading/empty/error states.

## 13) Known limitations (current backend)
- No endpoint to list doctors; booking requires manual doctor id entry.
- Queue endpoint is not protected on backend; frontend must still hide it behind doctor login.
- Patient/doctor names are not available in queue; only ObjectIds are shown unless backend adds population.

## 14) Optional next backend enhancements (do NOT block frontend)
These are suggested improvements after the MVP frontend ships:
- `GET /api/users?role=doctor` to populate doctor dropdown
- Populate patient/doctor names in appointment queue
- Protect `GET /api/appointments/queue/:doctorId` with `protect` + role check
- Add “My appointments” endpoint for patients
