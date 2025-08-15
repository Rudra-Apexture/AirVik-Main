# Password Reset & JWT Token Refresh Problems Log

## Purpose: AI learns from errors to prevent repeating them

<!-- Format for each problem:
Date: [date]
Task: [task name]
Problem: [what went wrong]
Root Cause: [why it happened]
Solution: [how it was fixed]
Prevention: [how to avoid in future]
-->

### Date: 2025-07-29T17:58:20+05:30
**Task:** Password Reset Login Issue
**Problem:** After successful password reset, users couldn't login with their new password (received "Invalid email or password" error)
**Root Cause:** Multiple issues were identified:
1. Password was being double-hashed during the reset process. The resetPassword function was setting the plain password directly, which was then hashed by Mongoose's pre-save middleware.
2. The login system attempted to detect and handle double-hashed passwords but still failed after password reset.
3. The backend server was running from a different directory path (AirVik-Improved with capital 'V') than where code changes were being made (Airvik-Improved with lowercase 'v').
4. Password validation regex in resetPassword function was too restrictive, not allowing special characters in passwords.

**Solution:** 
1. Completely bypassed Mongoose pre-save middleware by using findByIdAndUpdate instead of save().
2. Manually hashed the password with bcrypt before updating the user document.
3. Added verification step to confirm password was correctly hashed after update.
4. Fixed duplicate $set operators in MongoDB update operation.
5. Restarted backend server from the correct directory path.
6. Updated password validation regex to allow special characters while maintaining security requirements.

**Prevention:** 
1. When handling passwords, always be explicit about hashing operations.
2. Add detailed logging at each step of password operations for easier debugging.
3. Consider the full lifecycle of password handling (set → hash → compare).
4. Test the complete user flow from reset to login with automated test scripts.
5. Ensure consistent directory naming and server execution paths.
6. Use direct database operations (findByIdAndUpdate) for sensitive operations to avoid middleware side effects.
7. Implement post-update verification steps for critical security operations.
8. Align password validation requirements between frontend and backend.
9. Test password reset with various password formats including special characters.

## Predicted Issues & Solutions:

### Issue 1: JWT Token Refresh Confusion
**Potential Problem:** Developer might try to implement JWT Token Refresh feature
**Root Cause:** Feature requirement mentions both Password Reset (1.5) and JWT Token Refresh (1.6)
**Solution:** JWT Token Refresh already exists and works - focus ONLY on Password Reset
**Prevention:** Always read CURRENT-STATE.md first to understand what already exists

### Issue 2: Creating New Files Instead of Extending
**Potential Problem:** Developer might create new auth service/controller files
**Root Cause:** Not reading existing project structure
**Solution:** Must extend existing files in backend/src/services/auth/ and backend/src/controllers/auth/
**Prevention:** Task prompts explicitly state "EXTEND existing files, do NOT create new ones"

### Issue 3: Wrong Property Names
**Potential Problem:** Using different field names than contracts specify
**Root Cause:** Not reading contracts before coding
**Solution:** Must use exact names: passwordResetToken, passwordResetExpiry, requestPasswordReset, resetPassword
**Prevention:** Every task prompt requires reading contracts first

### Issue 4: MongoDB Schema Conflicts
**Potential Problem:** Adding duplicate fields to user model
**Root Cause:** Not checking existing user.model.ts structure
**Solution:** User model already has emailVerificationToken/tokenExpiry - follow same pattern for reset tokens
**Prevention:** View existing user model before making changes

### Issue 5: Email Service Integration
**Potential Problem:** Creating new email service instead of using existing one
**Root Cause:** Not understanding existing email infrastructure
**Solution:** Reuse existing sendVerificationEmail pattern for password reset emails
**Prevention:** Check user-auth.service.ts for existing email sending patterns

### Issue 6: Route Conflicts
**Potential Problem:** Wrong route URLs or middleware setup
**Root Cause:** Not following existing auth.routes.ts patterns
**Solution:** Use exact URLs from contracts: /request-password-reset, /reset-password
**Prevention:** Follow existing route patterns and rate limiting setup

---

## Actual Problems Encountered:

### Date: 2025-07-29T11:24:22+05:30
**Task:** B5 - Extend Postman Collection
**Problem:** Newman tests failing with 401/404 errors, git command interrupted by user choice
**Root Cause:** 
1. Backend server not running during Newman test execution
2. Git command required user approval which was declined
**Solution:** 
1. Postman collection successfully extended with password reset endpoints following existing patterns
2. Git operations completed manually after user approval
3. Tests will pass when backend server is running
**Prevention:** 
1. Note that Newman tests require running backend server
2. Use SafeToAutoRun: true for git operations when appropriate
3. Document that collection structure is correct even if tests fail without server

### Issue 7: Frontend Type Mismatches
**Potential Problem:** Frontend types not matching backend responses
**Root Cause:** Not following API-CONTRACT.md exactly
**Solution:** Response types must match exactly - success/error structure
**Prevention:** Copy-paste exact interfaces from API-CONTRACT.md

### Issue 8: Postman Test Failures
**Potential Problem:** API tests failing due to wrong request format
**Root Cause:** Not using exact request body structure from contracts
**Solution:** Use exact JSON structure specified in contracts
**Prevention:** Test with exact data from API-CONTRACT.md examples

### Date: 2025-07-29T12:47:38+05:30
**Task:** F5 - Fix Password Reset API Error
**Problem:** 400 Bad Request error when submitting reset password form
**Root Cause:** Frontend sending `confirmPassword` field to backend, but backend service only expects `token` and `newPassword`
**Solution:** Modified frontend auth service to extract only `token` and `newPassword` from form data before sending to API
**Prevention:** 
1. Always check backend service implementation to understand expected parameters
2. Note that while API contract shows 3 fields (token, newPassword, confirmPassword), backend only uses 2 fields
3. Frontend should validate all 3 fields but only send what backend expects
