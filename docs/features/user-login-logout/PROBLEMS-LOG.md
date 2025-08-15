# User Login Logout Problems Log

## Purpose: AI learns from errors to prevent repeating them

<!-- Format for each problem:
Date: [date]
Task: [task name]
Problem: [what went wrong]
Root Cause: [why it happened]
Solution: [how it was fixed]
Prevention: [how to avoid in future]
-->

## Problem 1: TypeScript Property Errors in Auth Service

Date: 2025-07-28
Task: user-login-logout

Problem: TypeScript errors in user-auth.service.ts due to property mismatches between the user model and service code. Properties like 'firstName', 'lastName', 'isEmailVerified', 'emailVerificationToken', and 'tokenExpiry' were being accessed but didn't exist in the user model.

Root Cause: The API contract expected different field names than what was in the user model. The model used 'name' (single field) instead of separate 'firstName' and 'lastName' fields, and 'isActive' instead of 'isEmailVerified'.

Solution:
1. Extended the user model interface and schema to include missing fields like 'emailVerificationToken' and 'tokenExpiry'
2. Modified the auth service code to adapt to the user model structure:
   - Split the 'name' field into firstName and lastName parts when needed
   - Used 'isActive' field as equivalent to 'isEmailVerified'
   - Added proper type handling for all fields

Prevention:
1. Always check model interfaces before implementing services
2. Document field mappings between API and database models
3. Consider using DTOs (Data Transfer Objects) to formalize the transformation between API and database models
4. Add comments in code to clarify field mappings

## Problem 2: Missing Name Field Validation Error During Login

Date: 2025-07-28
Task: user-login-logout

Problem: Mongoose validation error "User validation failed: name: Name is required" occurring during login process. The login API was returning 500 Internal Server Error instead of processing login requests properly.

Root Cause: Legacy users in the database were created without the required 'name' field, but the user model schema requires this field. When the login process tried to save the user document after updating login tracking fields (loginAttempts, lastLoginAt, etc.), Mongoose validated the entire document and failed because the required 'name' field was undefined.

Solution:
1. Added logic in the loginUser service method to check if the name field exists
2. If name field is missing, automatically generate it from the email prefix
3. Set the name field before proceeding with the login process
4. This ensures backward compatibility with existing users while maintaining model validation

Code fix applied:
```typescript
// Fix: Ensure name field exists (handle legacy users without name)
if (!user.name) {
  // Extract name from email or set a default
  const emailPrefix = user.email.split('@')[0];
  user.name = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  console.log(`Fixed missing name field for user ${user.email}: set to '${user.name}'`);
}
```

Prevention:
1. Always handle backward compatibility when adding required fields to existing models
2. Consider database migrations when schema changes affect existing data
3. Add validation checks for required fields before document save operations
4. Test with existing database data, not just new test data
5. Use proper debugging techniques to identify root causes (console.log user document state)

## Problem 3: Next.js 14 Client Component Error

Date: 2025-07-28
Task: user-login-logout

Problem: Next.js error when loading the login page: "You're importing a component that needs useState/useEffect. It only works in a Client Component but none of its parents are marked with 'use client', so they're Server Components by default."

Root Cause: In Next.js 14, all components are Server Components by default. Components that use React hooks like useState or useEffect must be explicitly marked as Client Components using the "use client" directive. Our LoginForm.tsx and LogoutButton.tsx components were using React hooks but weren't marked as Client Components.

Solution:
1. Added "use client" directive at the top of LoginForm.tsx
2. Added "use client" directive at the top of LogoutButton.tsx
3. This tells Next.js that these components should be rendered on the client-side where React hooks are available

Code fix applied:
```tsx
// Added to the top of LoginForm.tsx and LogoutButton.tsx
"use client";

import React, { useState, useEffect } from 'react';
// Rest of the imports...
```

Prevention:
1. Always add "use client" directive to components that use React hooks in Next.js 14+
2. Consider creating a template for new components that includes this directive
3. Add this requirement to the frontend development guidelines
4. Test components in the actual Next.js app context, not just in isolation

## Problem 4: Email Verification Route Mismatch

Date: 2025-07-28
Task: user-login-logout

Problem: 404 errors when accessing the /verify-email route. The frontend was expecting verification links to point to /auth/verify-email, but the backend was generating links that point to /verify-email.

Root Cause: Route structure mismatch between frontend and backend. The frontend implemented the email verification page at /auth/verify-email (following Next.js app router conventions), but the backend was generating verification links pointing to /verify-email.

Solution:
1. Added a redirect in next.config.js to handle the mismatch:
```javascript
async redirects() {
  return [
    {
      source: '/verify-email',
      destination: '/auth/verify-email',
      permanent: true,
    },
  ];
}
```
2. This ensures that users clicking on verification links in emails will be properly redirected to the correct route in the frontend application.

Prevention:
1. Establish a clear route naming convention across frontend and backend
2. Document all routes in API-CONTRACT.md
3. Implement automated tests for email verification flow
4. Consider using environment variables for shared route configurations

---

Date: 2025-07-28
Task: User Login Implementation
Problem: 400 Bad Request error when attempting to login with valid credentials. Users could register and verify email successfully, but login attempts with the same credentials failed with "Invalid email or password" error.

Root Cause: Double password hashing in the authentication flow. The password was being hashed twice:
1. First in the registerUser service function with bcrypt.hash using salt rounds 10
2. Then again in the User model's pre('save') hook with bcrypt.hash using salt rounds 12

This resulted in the stored password being a hash of an already hashed password. During login, when comparePassword tried to verify the user input against the stored password, it failed because it was comparing:
- User input: `password`
- Stored value: `bcrypt.hash(bcrypt.hash(password, 10), 12)`

Solution:
1. Removed password hashing from the registerUser service function:
```typescript
// Before:
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
// ...
password: hashedPassword,

// After:
// No explicit hashing in service
password: password, // Will be hashed by pre('save') hook
```
2. This ensures the password is only hashed once by the User model's pre('save') hook
3. Allows bcrypt.compare to correctly verify passwords during login

Prevention:
1. Implement clear separation of concerns between models and services
2. Add comments in the code to document where password hashing occurs
3. Create unit tests for user registration and login flows
4. Add debug logging in production for authentication failures
5. Document password handling flow in the codebase

Code fix applied:
```javascript
// Added to next.config.js
async redirects() {
  return [
    {
      source: '/verify-email',
      destination: '/auth/verify-email',
      permanent: true,
    },
  ];
},
```

Prevention:
1. Document URL structures in API-CONTRACT.md to ensure frontend and backend use consistent routes
2. Include full URLs in API documentation, not just endpoints
3. Consider creating a shared constants file for route paths used by both frontend and backend
4. Test email verification flow end-to-end before deployment

---

Date: 2025-07-28
Task: User Registration Form
Problem: When refreshing the registration page after submission or entering new registration data, the form data appears in the URL as query parameters (e.g., "http://localhost:3000/auth/register?firstName=wanaluwy&lastName=wanaluwy&email=wanaluwy%40forexnews.bg&password=Wanaluwy%40123&confirmPassword=Wanaluwy%40123"). This exposes sensitive information in the URL and creates a poor user experience.

Root Cause: The registration form was not properly preventing default form submission behavior. Although react-hook-form's `handleSubmit` wrapper was used, the form was still allowing the default HTML form behavior which appends form data to the URL as query parameters when using the default GET method.

Solution:
1. Updated the onSubmit handler to use the correct TypeScript typing with react-hook-form's SubmitHandler:
```typescript
// Before:
const onSubmit = async (data: RegistrationFormData) => {
  // No prevention of default form behavior

// After:
import { useForm, SubmitHandler } from 'react-hook-form';

const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
  // Using react-hook-form's handleSubmit already prevents default form submission
```

2. Added explicit method="post" to the form element to prevent GET requests:
```typescript
// Before:
<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

// After:
<form method="post" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
```

3. These changes ensure that react-hook-form properly handles the form submission and the browser doesn't default to GET requests that would append form data to the URL.

Prevention:
1. Always use proper form submission prevention in React applications
2. Use TypeScript to ensure correct typing of form handlers
3. Add automated tests for form submissions to catch similar issues
4. Review all forms for proper event handling
5. Consider using a form library like Formik or react-hook-form consistently across the application
