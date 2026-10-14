# Payment Integration Tasks & Roadmap

This document outlines the step-by-step tasks required to implement the Stripe Elements payment flow and webhook fulfillment in **z-academy**.

---

## 📋 Task Checklist

### Phase 1: Environment & CLI Setup
- [x] **Install Stripe SDK**: `npm install stripe`
- [x] **Add Secret Key**: Set `STRIPE_SECRET_KEY` in `.env`
- [ ] **Activate Webhook Secret**: Uncomment `STRIPE_WEBHOOK_SECRET` in `.env`
- [x] **Start Stripe CLI Listener**: 
  ```bash
  stripe listen --forward-to localhost:5000/api/v1/payment/webhook
  ```

---

### Phase 2: Core Models & Configuration
- [x] **Task 1: Stripe Client Instance**
  - **File:** `src/config/stripe.ts`
  - **Goal:** Initialize and export the Stripe SDK instance using `process.env.STRIPE_SECRET_KEY`.

- [x] **Task 2: Enrollment Model**
  - **File:** `src/models/enrollmentModel.ts`
  - **Goal:** Store course purchases and student access.
  - **Fields:**
    - `student`: ObjectId (ref: `User`)
    - `course`: ObjectId (ref: `Course`)
    - `pricePaid`: Number
    - `paymentIntentId`: String (unique)
    - `status`: String (`"active" | "cancelled" | "refunded"`)
    - `enrolledAt`: Date

---

### Phase 3: Create Payment Intent API (Student Flow)
- [x] **Task 3: Validation Schema**
  - **File:** `src/validations/paymentValidation.ts`
  - **Goal:** Validate request body has valid `courseId` (MongoDB ObjectId).

- [x] **Task 4: Payment Service (`createPaymentIntent`)**
  - **File:** `src/services/paymentService.ts`
  - **Goal:**
    1. Verify student is not already enrolled.
    2. Fetch course from MongoDB to get the true price (never trust frontend price).
    3. Call `stripe.paymentIntents.create()` with amount in cents (`price * 100`), currency `usd`, and metadata (`courseId`, `studentId`).
    4. Return `clientSecret` and `paymentIntentId`.

- [x] **Task 5: Payment Controller**
  - **File:** `src/controllers/paymentController.ts`
  - **Goal:** Handler for `POST /api/v1/payment/create-intent` wrapped in `catchAsync`.

---

### Phase 4: Webhook & Raw Body Fulfillment (Stripe -> Backend)
- [x] **Task 6: Support Raw Body in Security Config**
  - **File:** `src/config/security.ts`
  - **Goal:** Allow Stripe webhook signature verification by capturing `req.rawBody` Buffer before JSON parsing.

- [x] **Task 7: Webhook Handler Service**
  - **File:** `src/services/paymentService.ts`
  - **Goal:**
    1. Verify signature using `stripe.webhooks.constructEvent()`.
    2. Listen for `payment_intent.succeeded`.
    3. Extract `studentId` and `courseId` from metadata.
    4. Create Enrollment record in MongoDB (idempotent / avoid duplicates).

- [x] **Task 8: Payment Routes**
  - **File:** `src/routes/paymentRoutes.ts`
  - **Goal:**
    - `POST /create-intent` (protected by `protectMiddleware`, student only)
    - `POST /webhook` (public endpoint receiving events from Stripe)

- [x] **Task 9: Register Route in App**
  - **File:** `src/config/routes.ts`
  - **Goal:** Mount `app.use("/api/v1/payment", paymentRouter)`.

---

### Phase 5: Verification & Testing
- [ ] **Test 1: Postman Test (Payment Intent)**
  - Request: `POST http://localhost:5000/api/v1/payment/create-intent`
  - Auth: Student Bearer token
  - Body: `{ "courseId": "<VALID_COURSE_ID>" }`
  - Expect: `200 OK` with `{ clientSecret: "pi_..._secret_..." }`.

- [ ] **Test 2: Stripe CLI Test (Webhook Trigger)**
  - Command: `stripe trigger payment_intent.succeeded`
  - Expect: Stripe CLI terminal logs `200 OK`, server logs successful processing.

- [ ] **Test 3: Database Verification**
  - Check MongoDB Compass / Mongo shell for new document in `enrollments` collection.
