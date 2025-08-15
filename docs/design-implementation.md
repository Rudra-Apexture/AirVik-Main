# Airvik Hotel System Design Implementation Guide

This guide establishes design tokens, styling patterns, and UI development rules for the Airvik Hotel System. It ensures consistent, maintainable, and accessible UI components across the application.

## Design Tokens

### CSS Variables

```css
:root {
  --color-primary: #E61E4D;
  --color-text: #222222;
  --color-muted: #6a6a6a;
  --color-neutral: #dddddd;
  --color-gray-bg: #f7f7f7;
  --radius: 0.5rem;   /* 8 px */
  --space: 1rem;     /* Tailwind 4-scale */
}
```

## Shadcn UI Integration

The project uses Shadcn UI for component library with custom theming to match our brand colors.

### HSL Color System

Shadcn UI uses HSL color format in CSS variables. Our primary color (#E61E4D) is converted to HSL format:

```css
:root {
  /* Primary brand color in HSL format */
  --primary: 348 76% 51%;
  --primary-foreground: 0 0% 100%;
  
  /* Other Shadcn UI system colors */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... other color variables ... */
}
```

### Tailwind Configuration

The Tailwind configuration extends the theme using both our custom CSS variables and Shadcn UI's HSL variables:

```javascript
theme: {
  extend: {
    colors: {
      /* Shadcn UI components use these HSL variables */
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      /* Our custom color tokens */
      text: 'var(--color-text)',
      muted: {
        DEFAULT: 'var(--color-muted)',
        foreground: 'hsl(var(--muted-foreground))'
      },
      neutral: 'var(--color-neutral)',
      'gray-bg': 'var(--color-gray-bg)',
      /* ... other Shadcn UI colors ... */
    },
    borderRadius: {
      DEFAULT: 'var(--radius)',
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    },
    spacing: {
      DEFAULT: 'var(--space)',
    },
  },
},
```

## Component Usage Guide

### Shadcn UI Components

When using Shadcn UI components, import them from the components/ui directory:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
```

### Icon Libraries


The project supports both React Icons and Lucide Icons:

```tsx
// React Icons
import { FaHotel, FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

// Lucide Icons
import { Search, Home, Settings } from 'lucide-react';
```

### Toast Notifications

We use Sonner for toast notifications with custom styling that matches our design system. The toast component is configured in the root layout and can be used throughout the application.

#### Setup

1. **Provider Setup** (in `app/layout.tsx`):

```tsx
import { Toaster } from 'sonner';

// Inside your root layout component
<Toaster 
  position="top-right"
  toastOptions={{
    classNames: {
      toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground',
      description: 'group-[.toast]:text-muted-foreground',
      error: 'group-[.toast]:border-red-500 group-[.toast]:bg-red-50',
      icon: 'hidden',
    },
    className: '!p-0',
  }}
  closeButton={false}
/>
```

2. **Usage in Components**:

```tsx
import { toast } from 'sonner';
import { FaExclamation } from 'react-icons/fa';

// Example error toast
const showError = (message: string) => {
  toast.error(
    <div className="flex items-start p-2">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center size-10 rounded-full bg-red-500">
          <FaExclamation className="text-white text-lg" />
        </div>
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-gray-900">Let's try that again</h3>
        <div className="mt-1 text-sm text-gray-500">
          <p>{message}</p>
        </div>
      </div>
    </div>,
    {
      duration: 4000,
      className: 'p-2 bg-white',
      style: {
        border: '1px solid #DDDDDD',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        padding: '1rem',
      },
      icon: null,
    }
  );
};
```

### Using Brand Colors

Apply brand colors using Tailwind classes:

```tsx
// Primary brand color
<Button>Primary Button</Button>

// Text colors
<p className="text-text">Main text</p>
<p className="text-muted">Secondary text</p>

// Background colors
<div className="bg-neutral">Neutral background</div>
<div className="bg-gray-bg">Light gray background</div>
```

## Allowed Actions

- Add or replace class names with token-based alternatives
- Wrap JSX in shared atomic components
- Edit CSS variables for theming
- Create new component variants using existing tokens
- Use Shadcn UI components with our brand color system
- Add new tokens following the established pattern

## Forbidden Actions

- Rename functions, methods, or components
- Alter API calls or data flow
- Change file paths or directory structure
- Delete tests or test coverage
- Use arbitrary values in Tailwind classes (e.g., `text-[#ff0000]`)
- Hardcode hex colors in CSS or inline styles

## Prompt Template for Developers

```yaml
### Windsurf UI-Update Request
1. Feature / Branch: <branch-name>
2. Target files: <glob>
3. Reference screenshot: <path>
4. Behaviour unchanged: YES
```

## Guard-Rails

### ESLint Configuration

- `tailwindcss/no-arbitrary-value`: Prevents arbitrary values in Tailwind classes
- Configuration in `.eslintrc.js`

### Stylelint Configuration

- `color-no-hex`: Prevents hardcoded hex colors
- `selector-class-pattern`: Enforces naming conventions
- Configuration in `stylelint.config.js`

### Storybook & Visual Testing

- Storybook with design-token addon for token visualization
- Chromatic visual diff testing to prevent UI regressions

### Accessibility

- WCAG contrast reminder (4.5:1 minimum contrast ratio)
- Use token-based colors that meet accessibility standards

## Dark Mode Support

Dark mode can be implemented by adding a `.dark` class variant to the `:root` selector:

```css
.dark:root {
  --color-primary: #FF385C;
  --color-text: #FFFFFF;
  --color-muted: #A0A0A0;
  --color-neutral: #555555;
  --color-gray-bg: #333333;
}
```

## Implementation Checklist

- [ ] CSS variables defined in tokens.css
- [ ] Tailwind config extended with CSS variables
- [ ] ESLint plugin for Tailwind with no-arbitrary-value rule
- [ ] Stylelint with color-no-hex rule
- [ ] Storybook with design-token addon
- [ ] GitHub Actions for Stylelint & visual tests
