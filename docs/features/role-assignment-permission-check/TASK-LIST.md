# Role Assignment & Permission Check Task List

## Backend Tasks (Do First):
- [ ] B1: Create MongoDB Schema Extensions
- [ ] B2: Create Role Service Layer  
- [ ] B3: Create Permission Middleware
- [ ] B4: Create Role Controller
- [ ] B5: Create Role Routes
- [ ] B6: Create Postman Tests

## Frontend Tasks (Do After Backend):
- [ ] F1: Create TypeScript Types
- [ ] F2: Create API Service
- [ ] F3: Create Role Management Components
- [ ] F4: Create Admin Pages/Routes
- [ ] F5: Connect to Backend & Integration

## Current Task: B1

## Task Dependencies:
### Backend Phase Dependencies:
- B1 → B2 (Service needs schema)
- B2 → B3 (Middleware needs service for validation)
- B2 → B4 (Controller needs service)
- B4 → B5 (Routes need controller)
- B5 → B6 (Tests need routes)

### Frontend Phase Dependencies:
- All Backend (B1-B6) → F1 (Types need API contracts)
- F1 → F2 (API service needs types)
- F2 → F3 (Components need API service)
- F3 → F4 (Pages need components)
- F4 → F5 (Integration needs pages)

## Critical Requirements:
1. **Single developer** completes entire feature
2. **Backend MUST be complete** before starting frontend
3. **Test each backend task** with Postman before moving on
4. **Maximum 400 lines per file** for AI optimization
5. **Follow contracts exactly** - no variations allowed
6. **Git commit after each task** with descriptive messages
7. **AI updates CURRENT-STATE.md** after each task completion
