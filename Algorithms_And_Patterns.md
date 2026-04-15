# SafeRide+ Algorithms and Architectural Patterns

This document details the specific algorithms, structural patterns, and logical flows implemented in the **SafeRide+** application across both the frontend and backend architectures. It is updated to match the current codebase state.

---

## 1. Backend Algorithms & Logic

### A. Transactional Penalty Scoring Algorithm (Performance Tracking)
**Location:** `backend/controllers/performanceController.js`
**Description:** Driver performance scores are managed via a manual administrative deduction process secured by database transactions.
- **Algorithm Flow:**
  1. Uses `db.runTransaction` to ensure atomicity when updating the driver's score.
  2. **Fetch Logic:** Retrieves the driver's current points from the `users` collection (Default: 100).
  3. **Calculation:** `points: Math.max(0, currentPoints - pointsToDeduct)`.
  4. **Persistence:** Simultaneously updates the driver document and creates a new record in the `penalties` collection for auditability.
  5. **Why this algorithm?** Handles concurrency issues and ensures the score never falls below zero using a floor-bounded deduction.

### B. Middleware-Based Role-Based Access Control (RBAC)
**Location:** `backend/middleware/auth.js`
**Description:** Multi-layered security pattern using Firebase Authentication and custom Firestore role checks.
- **Algorithm Flow:**
  1. **verifyToken:** Extracts and validates the JWT Bearer token using Firebase Admin `verifyIdToken()`.
  2. **checkRole:** A closure-based middleware that takes a list of `allowedRoles`.
  3. **Firestore Lookup:** Fetches the actual user record from the `users` collection to verify the `role` field matches the required permissions.
  4. **Why this pattern?** It decouples authentication (who are you?) from authorization (what can you do?), allowing simple route protection like `checkRole(['admin'])`.

### C. Server-Side Data Ordering Algorithm
**Location:** `backend/controllers/complaintsController.js`
**Description:** Optimized retrieval of user feedback to prioritize administrative focus.
- **Logic:** `orderBy('createdAt', 'desc')` operation on the `complaints` collection.
- **Why?** Offloads sorting complexity to the database engine, ensuring that Transport In-Charges and Admins always see the most recent incidents at the top of their dashboards without frontend-side processing overhead.

---

## 2. Frontend Algorithms & Patterns

### A. Observer Pattern (Authentication & Metadata Sync)
**Location:** `frontend/src/context/AuthContext.jsx`
**Description:** Real-time synchronization of the user's authentication state and their Firestore metadata.
- **Implementation:** Utilizes React Context API and Firebase's `onAuthStateChanged` listener as an observable stream.
- **Algorithm Flow:** 
  1. The `AuthProvider` subscribes to auth state changes on mount.
  2. When a user logs in, it triggers an asynchronous `getDoc` call to the `users` Firestore collection.
  3. The combined state (`user`, `userData`, `role`) is broadcasted to all child components.
- **Why?** Provides a "Single Source of Truth" for identity throughout the React component tree.

### B. Declarative Route Guarding (Interception Algorithm)
**Location:** `frontend/src/components/ProtectedRoute.jsx`
**Description:** A higher-order component pattern used to intercept navigation based on authentication and authorization state.
- **Logic Matrix Implementation:**
  - `If loading` -> Show loading state.
  - `If !user` -> Redirect to `/login`.
  - `If role not in allowedRoles` -> Redirect to `/unauthorized`.
  - `Else` -> Render `Outlet` for child components.
- **Why?** Centralizes security logic at the routing level, ensuring unauthorized users never even mount dashboard components.

### C. Service Layer Abstraction (API Interface Pattern)
**Location:** `frontend/src/services/api.js`
**Description:** Encapsulation of HTTP communication using Axios to isolate external dependencies.
- **Implementation:** All backend interactions (e.g., `submitComplaint`, `fetchPerformance`, `deductPoints`) are abstracted into standalone async functions.
- **Why this pattern?** 
  - Centralizes the `VITE_API_URL` environment variable usage.
  - Standardizes the injection of the `Authorization: Bearer <token>` header across all requests.
  - Improves maintainability by separating data operations from UI rendering logic (SRP).

---
*Prepared for technical review and mentorship evaluation.*
