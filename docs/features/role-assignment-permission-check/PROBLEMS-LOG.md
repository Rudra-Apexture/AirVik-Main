# Role Assignment & Permission Check Problems Log

## Purpose: AI learns from errors to prevent repeating them

<!-- Format for each problem:
Date: [date]
Task: [task name]
Problem: [what went wrong]
Root Cause: [why it happened]
Solution: [how it was fixed]
Prevention: [how to avoid in future]
-->

## Predicted Common Issues & Solutions:

### Issue 1: Self-Role Modification
**Problem:** Users trying to modify their own roles
**Root Cause:** Insufficient validation in controller/service layer
**Solution:** Check if userId === req.user.id and reject with SELF_ROLE_MODIFICATION error
**Prevention:** Add validation in both service layer and controller before processing

### Issue 2: Permission Middleware Order
**Problem:** Permission middleware called before auth middleware
**Root Cause:** Incorrect middleware order in route definitions
**Solution:** Always use requireAuth() before any requireRole() or requirePermission()
**Prevention:** Follow exact pattern: `requireAuth(), requireRole('admin'), handler`

### Issue 3: Role Hierarchy Bypass
**Problem:** Staff users trying to assign admin roles
**Root Cause:** Missing role hierarchy validation
**Solution:** Implement strict role assignment rules based on ROLE_HIERARCHY in contract
**Prevention:** Use validateRoleAssignment service method before any role changes

### Issue 4: MongoDB ObjectId Validation
**Problem:** Invalid ObjectId formats causing database errors
**Root Cause:** Frontend sending invalid user IDs
**Solution:** Validate ObjectId format in controller using mongoose.Types.ObjectId.isValid()
**Prevention:** Add ObjectId validation in all route handlers that accept userId

### Issue 5: Pagination Edge Cases
**Problem:** Page/limit parameters causing unexpected results
**Root Cause:** Missing bounds checking for pagination parameters
**Solution:** Enforce min/max limits and default values as specified in contract
**Prevention:** Use strict validation schema for all query parameters

### Issue 6: Audit Log Missing
**Problem:** Role changes not being tracked
**Root Cause:** Forgetting to create audit log entries
**Solution:** Always create audit log entry after successful role changes
**Prevention:** Include audit logging in service layer, not controller

### Issue 7: Frontend Type Mismatches
**Problem:** Frontend TypeScript errors due to API response structure changes
**Root Cause:** Not following exact API contract structure
**Solution:** Match frontend types exactly to API-CONTRACT.md specifications
**Prevention:** Copy-paste response structures from API-CONTRACT.md into types

### Issue 8: Permission Check Performance
**Problem:** Too many database queries for permission checks
**Root Cause:** Fetching user data on every permission check
**Solution:** Cache user role in JWT token or req.user object from auth middleware
**Prevention:** Extend auth middleware to include role information

### Issue 9: Rate Limiting Not Working
**Problem:** Rate limiting middleware not applied correctly
**Root Cause:** Missing rate limiting middleware on role endpoints
**Solution:** Apply rate limiting to all role management endpoints per contract
**Prevention:** Follow exact rate limiting configuration from role-api.contract.ts

### Issue 10: Circular Permission Dependencies
**Problem:** Permission checks causing infinite loops
**Root Cause:** Complex permission inheritance or circular references
**Solution:** Use simple role-based permissions without inheritance
**Prevention:** Keep ROLE_PERMISSIONS mapping flat without nested dependencies

## Error Handling Patterns:

### Service Layer Errors:
```typescript
// CORRECT Pattern:
return {
  success: false,
  error: "User not found",
  code: "USER_NOT_FOUND"
};

// WRONG - Different structure:
throw new Error("User not found");
```

### Controller Layer Errors:
```typescript
// CORRECT Pattern:
return res.status(404).json({
  success: false,
  error: "User not found",
  code: "USER_NOT_FOUND"
});

// WRONG - Different format:
return res.status(404).send("User not found");
```

### Middleware Errors:
```typescript
// CORRECT Pattern:
return res.status(403).json({
  success: false,
  error: "Access denied. Required role not found.",
  code: "ROLE_REQUIRED"
});

// WRONG - Different format:
return res.status(403).json({ error: "Forbidden" });
```

## Testing Common Failures:

### Database Connection Issues:
- **Problem:** MongoDB connection not established
- **Solution:** Verify database connection in server startup
- **Test:** Run basic user query before role operations

### JWT Token Issues:
- **Problem:** Token verification failing
- **Solution:** Ensure JWT_SECRET is consistent between auth and permission middleware
- **Test:** Verify token works with existing auth endpoints first

### Permission Logic Issues:
- **Problem:** Complex permission checks failing
- **Solution:** Start with simple role checks, then add permissions
- **Test:** Test each permission level independently

## Documentation Sync Issues:

### Contract Mismatches:
- **Problem:** Implementation differs from contracts
- **Solution:** Always reference contracts before writing code
- **Prevention:** Include contract file paths in task prompts

### API Response Variations:
- **Problem:** Different response formats between endpoints
- **Solution:** Use exact response structure from API-CONTRACT.md
- **Prevention:** Copy-paste response examples from contract
