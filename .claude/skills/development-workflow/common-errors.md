# Common Errors - Critical Mistakes to Avoid

This document details the **5 most critical errors** encountered in development, with real examples from the Training Templates feature implementation.

**Purpose**: Learn from past mistakes to avoid repeating them in future features.

---

## Error #1: setState in useEffect (CRITICAL)

### ❌ The Mistake

Using `setFormData()` directly in useEffect to initialize form state in edit mode.

### 💥 Why It's Wrong

1. **Violates** `react-hooks/set-state-in-effect` ESLint rule
2. **Causes cascade renders** that hurt performance
3. **useEffect is for side effects**, not state initialization
4. **Synchronous setState in effect** = anti-pattern

### 🔍 Real Example from Training Templates

**Bad Code**:
```typescript
export function TemplateForm({ template, mode }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    // ... default empty values
  });

  // ❌ WRONG: Initializing state in useEffect
  useEffect(() => {
    if (mode === "edit" && template) {
      setFormData({
        title: template.title,
        description: template.description ?? "",
        duration: template.duration,
        // ... copying all template fields
      });
    }
  }, [mode, template?.id, template]);

  // ... rest of component
}
```

**ESLint Error**:
```
Error: Calling setState synchronously within an effect can trigger cascading renders.
react-hooks/set-state-in-effect
```

**Problem**:
- Component renders with empty form
- useEffect runs → calls setFormData
- Component re-renders with template data
- **Result**: 2 renders instead of 1, cascade effect

### ✅ The Fix

Initialize state directly with props using the nullish coalescing operator (`??`).

**Good Code**:
```typescript
export function TemplateForm({ template, mode }: TemplateFormProps) {
  // ✅ CORRECT: Initialize state directly with props
  const [formData, setFormData] = useState({
    title: template?.title ?? "",
    description: template?.description ?? "",
    duration: template?.duration ?? 120,
    location: template?.location ?? "",
    maxParticipants: template?.maxParticipants ?? undefined,
    dayOfWeek: template?.dayOfWeek ?? 0,
    time: template?.time ?? "18:00",
    isActive: template?.isActive ?? true,
  });

  // No useEffect needed! State is initialized correctly on first render.

  // ... rest of component
}
```

### 🎯 Key Insight

**useEffect is NOT for initializing state from props.**

**Use Cases for useEffect**:
- Subscribing to external events
- Setting up timers/intervals
- Fetching data (but prefer Server Components for initial data)
- Cleanup operations (return function)

**Use Cases for useState with props**:
- Initializing form data from props
- Controlled inputs with default values

### 📚 Related Skills
- `.claude/skills/react-state-management/` - State management patterns
- `.claude/skills/server-components/` - Server-First for data fetching

---

## Error #2: redirect() in try-catch (CRITICAL)

### ❌ The Mistake

Placing Next.js `redirect()` inside a try-catch block in Server Actions.

### 💥 Why It's Wrong

1. **`redirect()` throws a special exception** `NEXT_REDIRECT`
2. **try-catch intercepts** this exception
3. **Next.js can't process** the redirect
4. **User stays on error page** instead of being redirected

### 🔍 Real Example from Training Templates

**Bad Code**:
```typescript
export async function createTrainingTemplateAction(
  data: CreateTrainingTemplateInput,
): Promise<ActionResult> {
  try {
    const response = await serverFetch<{ id: string }>("/training-templates", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response) {
      return {
        success: false,
        error: "Erreur lors de la création du template",
      };
    }

    revalidatePath("/trainings/templates");

    // ❌ WRONG: redirect() inside try-catch
    redirect("/trainings/templates");
    // This throws NEXT_REDIRECT which is caught below!

  } catch (error) {
    // This catch block intercepts NEXT_REDIRECT
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur",
    };
  }
}
```

**Problem**:
- `redirect()` throws `NEXT_REDIRECT` exception
- `catch` block intercepts it
- Returns `{ success: false }` instead of redirecting
- User sees error even though operation succeeded

### ✅ The Fix

Place `redirect()` **outside and after** the try-catch block.

**Good Code**:
```typescript
export async function createTrainingTemplateAction(
  data: CreateTrainingTemplateInput,
): Promise<ActionResult> {
  try {
    const response = await serverFetch<{ id: string }>("/training-templates", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response) {
      return {
        success: false,
        error: "Erreur lors de la création du template",
      };
    }

    revalidatePath("/trainings/templates");
    // ✅ CORRECT: NO redirect inside try block

  } catch (error) {
    // Only catches actual errors, not NEXT_REDIRECT
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur",
    };
  }

  // ✅ CORRECT: redirect() outside try-catch
  // If we reach here, operation succeeded
  redirect("/trainings/templates");
}
```

### 🎯 Key Insight

**`redirect()` is not a regular function call. It's a control flow mechanism that throws an exception to signal Next.js to redirect.**

**Pattern for Server Actions with redirect**:
```typescript
try {
  // Business logic
  // Data validation
  // API calls
} catch (error) {
  // Handle errors
  return { success: false, error: "..." };
}

// If no error, redirect
redirect("/success-page");
```

### 📚 Related Skills
- `.claude/skills/server-actions/` - Server Actions patterns

---

## Error #3: API Response Structure Mismatch

### ❌ The Mistake

Returning the full API response envelope instead of extracting the data property.

### 💥 Why It's Wrong

1. **Type mismatch**: Component expects `TrainingTemplate` but gets `{success, data, message}`
2. **Incorrect property access**: `template.title` is `undefined`, should be `template.data.title`
3. **Runtime errors**: Type system can't catch this at compile time

### 🔍 Real Example from Training Templates

**Backend returns** (envelope structure):
```json
{
  "success": true,
  "data": {
    "id": "cmhhwyy2100014rdwk1um25oe",
    "title": "Mardi - test",
    "description": "",
    "duration": 120,
    "location": "Gymnase de Montcul"
  },
  "message": "Opération réussie"
}
```

**Bad Code**:
```typescript
// ❌ WRONG: Returns full envelope
export async function getTrainingTemplate(
  id: string,
): Promise<TrainingTemplate | null> {
  const response = await serverFetch<{
    success: boolean;
    data: TemplateDetailResponse;
  }>(`/training-templates/${id}`, {
    next: { revalidate: REVALIDATE_SHORT },
  });

  // Returns {success, data, message}
  return response || null;
}
```

**Component receives**:
```typescript
const template = await getTrainingTemplate(id);
// template = {success: true, data: {...}, message: "..."}

// ❌ WRONG: Accessing template.title returns undefined!
<h1>{template.title}</h1> // undefined

// Should be: template.data.title
```

### ✅ The Fix

Extract the `data` property before returning.

**Good Code**:
```typescript
// ✅ CORRECT: Extracts data property
export async function getTrainingTemplate(
  id: string,
): Promise<TrainingTemplate | null> {
  const response = await serverFetch<{
    success: boolean;
    data: TrainingTemplate; // Use actual type, not wrapper
  }>(`/training-templates/${id}`, {
    next: { revalidate: REVALIDATE_SHORT },
  });

  // Extract data property
  return response?.data || null;
}
```

**Component receives**:
```typescript
const template = await getTrainingTemplate(id);
// template = {id: "...", title: "Mardi - test", ...}

// ✅ CORRECT: Direct property access
<h1>{template.title}</h1> // "Mardi - test"
```

### 🎯 Key Insight

**Always verify the exact API response structure BEFORE writing frontend code.**

**Checklist**:
1. Check backend controller response format
2. Test with curl/Postman to see actual JSON
3. Identify if using envelope pattern (`{success, data}`) or direct data
4. Extract accordingly in API layer functions

**Pattern**:
```typescript
// If backend uses envelope:
const response = await serverFetch<{success, data: T}>(url);
return response?.data || null;

// If backend returns data directly:
const response = await serverFetch<T>(url);
return response || null;
```

### 📚 Related Skills
- `.claude/skills/api-contracts/` - Frontend-Backend contracts

---

## Error #4: Unused Variables and Imports

### ❌ The Mistake

Leaving unused variables, imports, and functions in the code.

### 💥 Why It's Wrong

1. **Violates** `.claude/skills/zero-warnings/` principle
2. **Code bloat**: Increases bundle size
3. **Confusion**: Suggests functionality that doesn't exist
4. **Maintainability**: Harder to understand actual dependencies

### 🔍 Real Examples from Training Templates

**Example 1: Unused function**
```typescript
// ❌ WRONG: handleToggle defined but never used
import { toggleTrainingTemplateAction } from "../actions";

export function TemplateCard({ template }: TemplateCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Function defined but never called
  const handleToggle = async () => {
    await toggleTrainingTemplateAction(template.id);
  };

  const handleDelete = async () => {
    // ...
  };

  return (
    <div>
      {/* No button calls handleToggle */}
      <button onClick={handleDelete}>Supprimer</button>
    </div>
  );
}
```

**ESLint Warning**:
```
'handleToggle' is assigned a value but never used  @typescript-eslint/no-unused-vars
```

**Example 2: Unused import**
```typescript
// ❌ WRONG: Importing useEffect but not using it
import { useState, useEffect } from "react";

export function TemplateForm({ template, mode }: TemplateFormProps) {
  const [formData, setFormData] = useState({...});

  // No useEffect in component anymore

  return <form>...</form>;
}
```

**ESLint Warning**:
```
'useEffect' is declared but its value is never read.
```

**Example 3: Unused catch parameter**
```typescript
// ❌ WRONG: catch parameter not used
try {
  await createTrainingTemplateAction(data);
} catch (err) {
  // err parameter defined but not used
  setError("Une erreur est survenue");
}
```

**ESLint Warning**:
```
'err' is defined but never used  @typescript-eslint/no-unused-vars
```

### ✅ The Fix

Remove unused code immediately.

**Example 1 Fixed**:
```typescript
// ✅ CORRECT: Remove unused import and function
import { deleteTrainingTemplateAction } from "../actions";

export function TemplateCard({ template }: TemplateCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // ...
  };

  return (
    <div>
      <button onClick={handleDelete}>Supprimer</button>
    </div>
  );
}
```

**Example 2 Fixed**:
```typescript
// ✅ CORRECT: Remove unused import
import { useState } from "react";

export function TemplateForm({ template, mode }: TemplateFormProps) {
  const [formData, setFormData] = useState({...});

  return <form>...</form>;
}
```

**Example 3 Fixed**:
```typescript
// ✅ CORRECT: Remove unused parameter
try {
  await createTrainingTemplateAction(data);
} catch {
  // No parameter if not used
  setError("Une erreur est survenue");
}
```

### 🎯 Key Insight

**Zero tolerance for warnings. Clean up unused code immediately.**

**Workflow**:
1. Write code
2. Run `yarn lint`
3. See warning about unused variable
4. **Remove it immediately** (don't defer to later)

### 📚 Related Skills
- `.claude/skills/zero-warnings/` - Zero warnings philosophy

---

## Error #5: Component Size Violations

### ❌ The Mistake

Writing components that exceed size limits without decomposing.

### 💥 Why It's Wrong

1. **Violates** `.claude/skills/atomic-component/` limits
2. **Hard to maintain**: Too much logic in one file
3. **Hard to test**: Too many responsibilities
4. **Not reusable**: Monolithic components can't be composed

### 🔍 Real Example from Training Templates

**Bad Code**:
```bash
$ wc -l TemplateForm.tsx
274 TemplateForm.tsx
```

**Limit**: Smart Component = 100 lines max

**Problem**: 274 lines = 2.7x over limit!

**What it contains**:
- Form state management (10 lines)
- Submit handler with data cleaning (20 lines)
- Error display JSX (30 lines)
- Title input field (10 lines)
- Description textarea (10 lines)
- Day/Time selects (30 lines)
- Duration/MaxParticipants inputs (30 lines)
- Location input (10 lines)
- isActive checkbox (15 lines)
- Action buttons (15 lines)
- Spacing and structure (~100 lines)

### ✅ The Fix

Decompose into smaller sub-components following Atomic Design.

**Good Structure**:
```
TemplateForm/ (80 lines - Smart Component)
├── ErrorAlert.tsx (20 lines - Dumb)
├── BasicFieldsGroup.tsx (40 lines - Dumb)
├── ScheduleFieldsGroup.tsx (40 lines - Dumb)
├── DetailsFieldsGroup.tsx (40 lines - Dumb)
└── FormActions.tsx (30 lines - Dumb)
```

**TemplateForm (Smart Component - 80 lines)**:
```typescript
export function TemplateForm({ template, mode }: TemplateFormProps) {
  const [formData, setFormData] = useState({...});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ErrorAlert message={error} />}

      <BasicFieldsGroup
        formData={formData}
        onChange={setFormData}
      />

      <ScheduleFieldsGroup
        formData={formData}
        onChange={setFormData}
      />

      <DetailsFieldsGroup
        formData={formData}
        onChange={setFormData}
      />

      <FormActions
        mode={mode}
        isSubmitting={isSubmitting}
        onCancel={() => router.back()}
      />
    </form>
  );
}
```

**ErrorAlert (Dumb Component - 20 lines)**:
```typescript
interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded">
      <div className="flex items-start">
        <ErrorIcon className="w-5 h-5 mr-3" />
        <div>
          <p className="font-medium text-sm">Erreur</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}
```

### 🎯 Key Insight

**Plan decomposition BEFORE writing code, not after hitting the limit.**

**Pre-Development Checklist**:
1. Estimate component size (form fields, logic, etc.)
2. If > 80 lines → Plan sub-components
3. Use Atomic Design: Atoms → Molecules → Organisms
4. Smart/Dumb pattern: One Smart orchestrator, multiple Dumb presentational

**Benefits of Decomposition**:
- ✅ Easier to test (isolated components)
- ✅ Reusable (ErrorAlert can be used in other forms)
- ✅ Maintainable (changes are localized)
- ✅ Readable (clear component hierarchy)

### 📚 Related Skills
- `.claude/skills/atomic-component/` - Component decomposition

---

## Summary: Root Causes

| Error | Root Cause | Prevention |
|-------|-----------|------------|
| setState in useEffect | Confusion between state init and side effects | Read `react-state-management` skill BEFORE coding |
| redirect() in try-catch | Not understanding Next.js `redirect()` throws exception | Read `server-actions` skill BEFORE coding |
| API response mismatch | Not verifying backend response structure | Test API endpoint with curl/Postman first |
| Unused variables | Not running `yarn lint` after each file | Run lint immediately after writing code |
| Component too big | Not planning decomposition before coding | Estimate size and plan sub-components first |

**Common Pattern**: Most errors come from **not following the Pre-Development phase**. Reading Skills and planning BEFORE coding would have prevented all 5 errors.

**Action**: Always complete Phase 1 (Pre-Development) checklist before writing a single line of code.
