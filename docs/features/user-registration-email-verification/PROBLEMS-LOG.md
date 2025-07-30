# User Registration & Email Verification Problems Log

## Purpose: AI learns from errors to prevent repeating them

<!-- Format for each problem:
Date: [date]
Task: [task name]
Problem: [what went wrong]
Root Cause: [why it happened]
Solution: [how it was fixed]
Prevention: [how to avoid in future]
-->

## Problems Log

### Date: 2025-07-28T09:53:21+05:30
**Task:** Postman Collection Testing
**Problem:** Backend server crashing with TypeScript compilation errors preventing API testing
**Root Cause:** 
1. Incorrect import syntax - importing `User` as named export instead of default export
2. Wrong nodemailer method name - using `createTransporter` instead of `createTransport`
3. TypeScript type issues with `_id` property being of type `unknown`

**Solution:** 
1. Fixed import: `import User, { IUser } from '../../models/user.model'`
2. Fixed method: `nodemailer.createTransport()`
3. Fixed type casting: `String(savedUser._id)` instead of `savedUser._id.toString()`

**Prevention:** 
- Always verify exports from model files match import statements
- Double-check API method names against documentation
- Use proper type casting for Mongoose ObjectId types
- Test compilation before assuming code is working

---

### Date: 2025-07-28T10:19:15+05:30
**Task:** F2: API Service - TypeScript Import Error
**Problem:** TypeScript compilation error: "Cannot find module '@/types/auth.types' or its corresponding type declarations" in auth.service.ts line 15
**Root Cause:** 
Incorrect TypeScript path alias usage - the import path `@/types/auth.types` was wrong because:
1. The `@` alias points to the frontend root directory (`frontend/`)
2. The actual file location is `frontend/src/types/auth.types.ts`
3. The correct import path should include the `src/` directory

**Solution:** 
Fixed the import statement from:
```typescript
} from '@/types/auth.types';
```
To:
```typescript
} from '@/src/types/auth.types';
```

**Prevention:** 
- Always verify the actual file path relative to the TypeScript baseUrl configuration
- Check tsconfig.json path aliases before using them in imports
- Test TypeScript compilation (`npx tsc --noEmit`) after creating new files with imports
- Remember that `@` alias in Next.js points to the project root, not the src directory

---

<!-- Future problems will be logged here -->
