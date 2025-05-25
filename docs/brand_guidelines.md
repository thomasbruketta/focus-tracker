# FocusTracker Brand Guidelines

## 1. Brand Overview

FocusTracker is a minimalist, ADHD-friendly time tracking application designed to reduce cognitive load while maintaining visual appeal and accessibility. The brand emphasizes clarity, focus, and neurodivergent-friendly design principles.

### Core Values

- **Simplicity**: Clean, uncluttered interfaces that reduce distractions
- **Accessibility**: WCAG 2.1 AA compliant with excellent contrast ratios
- **Privacy**: Local-first data storage with no external tracking
- **Focus**: Design that supports concentration and productivity

## 2. Color Palette

### Primary Colors

The primary blue palette provides a calming, professional appearance while maintaining excellent contrast.

- **Primary 50**: `#f0f9ff` - Lightest tint for backgrounds
- **Primary 500**: `#0ea5e9` - Main brand color
- **Primary 600**: `#0284c7` - Primary button color
- **Primary 700**: `#0369a1` - Hover states
- **Primary 950**: `#082f49` - Darkest shade

### Semantic Colors

#### Success (Green)

Used for positive feedback, completed sessions, and success states.

- **Success 500**: `#22c55e`
- **Success 600**: `#16a34a`

#### Warning (Amber)

Used for caution states and important notifications.

- **Warning 500**: `#f59e0b`
- **Warning 600**: `#d97706`

#### Error (Red)

Used for error states, stop actions, and focus timer phases.

- **Error 500**: `#ef4444`
- **Error 600**: `#dc2626`

#### Neutral (Gray)

Used for text, borders, and background elements.

- **Neutral 50**: `#fafafa` - Light backgrounds
- **Neutral 100**: `#f5f5f5` - Card backgrounds
- **Neutral 500**: `#737373` - Secondary text
- **Neutral 900**: `#171717` - Primary text
- **Neutral 950**: `#0a0a0a` - Dark mode backgrounds

### Dark Mode Adaptations

Dark mode uses inverted neutral scales and adjusted primary colors for better visibility in low-light conditions.

## 3. Typography

### Font Families

#### Primary: Inter

- **Usage**: All UI text, headings, body copy
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Features**: Variable font with OpenType features enabled
- **Fallback**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

#### Monospace: JetBrains Mono

- **Usage**: Timer displays, code, data
- **Weights**: 300-700
- **Features**: Excellent readability for numbers and time displays
- **Fallback**: `"Fira Code", Consolas, Monaco, "Courier New", monospace`

### Type Scale

- **xs**: 0.75rem (12px) - Small labels
- **sm**: 0.875rem (14px) - Secondary text
- **base**: 1rem (16px) - Body text
- **lg**: 1.125rem (18px) - Large text
- **xl**: 1.25rem (20px) - Small headings
- **2xl**: 1.5rem (24px) - Section headings
- **3xl**: 1.875rem (30px) - Page headings
- **6xl**: 3.75rem (60px) - Timer displays

## 4. Spacing & Layout

### Spacing Scale

Based on 0.25rem (4px) increments for consistent rhythm:

- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px) - Base unit
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

### Layout Principles

- Maximum content width: 7xl (80rem/1280px)
- Consistent padding: 4-8 units
- Card spacing: 6 units internal padding
- Component gaps: 3-4 units

## 5. Border Radius

- **sm**: 0.125rem (2px) - Small elements
- **base**: 0.25rem (4px) - Default
- **lg**: 0.5rem (8px) - Buttons, inputs
- **xl**: 0.75rem (12px) - Cards
- **2xl**: 1rem (16px) - Large cards

## 6. Iconography

### Style Guidelines

- **Stroke width**: 1.5px consistently
- **Style**: Outline/stroke based, not filled
- **Size**: 24x24px default
- **Color**: Uses `currentColor` for theme adaptation

### Icon Set

- **Timer**: Clock with hands
- **Pomodoro**: Tomato with leaf
- **Analytics**: Bar chart
- **Settings**: Gear/cog

## 7. Component Patterns

### Buttons

- **Primary**: Blue background, white text, medium padding
- **Secondary**: Gray background, dark text, same padding
- **Danger**: Red background, white text
- **Hover states**: Darker shade of base color
- **Focus states**: Ring outline for accessibility

### Cards

- **Background**: White (light) / Neutral-900 (dark)
- **Border**: Subtle neutral border
- **Shadow**: Soft drop shadow
- **Padding**: 6 units (1.5rem)
- **Radius**: xl (0.75rem)

### Inputs

- **Border**: Neutral-300 default, Primary-500 focus
- **Padding**: 3-4 units
- **Radius**: lg (0.5rem)
- **Focus ring**: 2px primary color

## 8. Animation & Motion

### Duration

- **Fast**: 150ms - Micro-interactions
- **Normal**: 300ms - Standard transitions
- **Slow**: 500ms - Complex animations

### Easing

- **Default**: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth, natural
- **Ease-out**: For entrances
- **Ease-in**: For exits

### Reduced Motion

Respects `prefers-reduced-motion` by disabling animations for users who need them reduced.

## 9. Design Tokens (JSON)

```json
{
  "colors": {
    "primary": {
      "500": "#0ea5e9",
      "600": "#0284c7"
    },
    "neutral": {
      "50": "#fafafa",
      "900": "#171717"
    }
  },
  "spacing": {
    "4": "1rem",
    "6": "1.5rem"
  },
  "borderRadius": {
    "lg": "0.5rem",
    "xl": "0.75rem"
  }
}
```

## 10. Accessibility Standards

### WCAG 2.1 AA Compliance

- **Contrast ratios**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus indicators**: Visible 2px ring on all interactive elements
- **Keyboard navigation**: Full keyboard accessibility
- **Screen readers**: Proper ARIA labels and semantic HTML

### ADHD-Friendly Features

- **Reduced visual noise**: Minimal decorative elements
- **Clear hierarchy**: Consistent heading structure
- **Predictable layouts**: Consistent component placement
- **Calming colors**: Avoid overstimulating bright colors
- **Clear focus states**: Obvious current focus location

## 11. Implementation Guidelines

### CSS Custom Properties

Use CSS variables for theme switching:

```css
:root {
  --color-primary: theme("colors.primary.500");
  --color-background: theme("colors.neutral.50");
}

.dark {
  --color-background: theme("colors.neutral.950");
}
```

### Tailwind Configuration

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#0ea5e9",
          600: "#0284c7",
        },
      },
    },
  },
};
```

## 12. Usage Examples

### Timer Display

```css
.timer-display {
  font-family: "JetBrains Mono", monospace;
  font-size: 3.75rem;
  font-weight: 700;
  color: var(--color-primary);
}
```

### Button Component

```css
.btn-primary {
  background-color: theme("colors.primary.600");
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 200ms ease-out;
}
```

## 13. Brand Voice & Tone

### Voice Characteristics

- **Clear**: Direct, unambiguous language
- **Supportive**: Encouraging without being patronizing
- **Calm**: Peaceful, stress-reducing tone
- **Focused**: Goal-oriented messaging

### Content Guidelines

- Use simple, clear language
- Avoid jargon or complex terminology
- Focus on benefits and outcomes
- Maintain a supportive, non-judgmental tone
- Emphasize privacy and user control

---

_This brand guideline ensures FocusTracker maintains a consistent, accessible, and neurodivergent-friendly design across all touchpoints._
