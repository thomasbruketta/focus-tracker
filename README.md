# FocusTracker

A single-user web application for manual time tracking, Pomodoro sessions, and lightweight analytics. All data is stored locally in your browser with optional JSON export/import functionality.

## Features

### ⏱️ Manual Timer

- Start, pause, resume, and stop functionality
- Timer state persists across page refreshes
- Automatic session logging with timestamps

### 🍅 Pomodoro Timer

- Configurable focus and break durations (1-60 minutes)
- Automatic phase transitions with desktop notifications
- Customizable session patterns (default: 25min focus / 5min short break / 15min long break)
- Auto-start next phase option

### 📊 Analytics

- 7-day bar chart showing daily focus minutes
- Consecutive days streak tracking
- Weekly average and total session counts
- Recent sessions history

### ⚙️ Settings & Data Management

- Configurable Pomodoro settings
- Dark/light/system theme toggle
- JSON data export for backup
- JSON data import for migration
- All data stored locally (no external servers)

### 🎨 Design System

FocusTracker features a comprehensive design system optimized for neurodivergent users:

- **ADHD-Friendly**: Minimalist design reduces cognitive load and distractions
- **Accessible**: WCAG 2.1 AA compliant with excellent contrast ratios
- **Dark Mode**: Automatic system preference detection with manual override
- **Consistent**: Unified color palette, typography, and spacing tokens
- **Responsive**: Works seamlessly across desktop, tablet, and mobile devices

For detailed design guidelines, see [Brand Guidelines](docs/brand_guidelines.md).

#### Design Tokens

- **Colors**: Primary blue palette with semantic success/warning/error colors
- **Typography**: Inter for UI text, JetBrains Mono for timer displays
- **Spacing**: 4px-based scale for consistent rhythm
- **Components**: Reusable button, card, and input patterns

## Getting Started

### Using the App

1. **Manual Timer**: Click "Start" to begin tracking unstructured focus time
2. **Pomodoro**: Use structured work sessions with automatic break reminders
3. **Analytics**: View your progress and patterns over the last 7 days
4. **Settings**: Customize Pomodoro durations, theme, and manage your data

### Data Privacy

- **100% Local Storage**: All your data stays in your browser
- **No Tracking**: No external analytics or tracking scripts
- **Export Anytime**: Download your data as JSON for backup
- **Import Anywhere**: Restore your data on any device

### Backup Your Data

1. Go to Settings → Data Management
2. Click "Export Data" to download `focus_data_YYYY-MM-DD.json`
3. Store this file safely for backup or migration

### Restore Your Data

1. Go to Settings → Data Management
2. Click "Choose File" and select your exported JSON file
3. Your sessions and settings will be restored

## Development

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Charts**: Chart.js + react-chartjs-2
- **Testing**: Vitest + React Testing Library + Axe for accessibility
- **Code Quality**: ESLint + Prettier + Husky

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (includes accessibility tests)
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests (includes accessibility checks)
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

### Design System Development

The design system is located in `/design-system/` with the following structure:

```
design-system/
├── assets/
│   ├── icons/          # SVG icons with 1.5px stroke
│   └── logos/          # Brand logos (placeholder)
├── tokens/
│   ├── design-tokens.json    # Complete design token definitions
│   └── tailwind.config.js    # Tailwind extension configuration
└── documentation/      # Additional design documentation
```

To use design tokens in development:

1. Import tokens from `design-system/tokens/design-tokens.json`
2. Reference the Tailwind configuration in `design-system/tokens/tailwind.config.js`
3. Follow the brand guidelines in `docs/brand_guidelines.md`

## Deployment

### One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/focus-tracker)

### Manual Deployment

1. Fork this repository
2. Connect your fork to Vercel, Netlify, or your preferred hosting platform
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Accessibility

FocusTracker is built with accessibility as a core principle:

- **WCAG 2.1 AA Compliant**: All color combinations meet contrast requirements
- **Keyboard Navigation**: Full keyboard accessibility for all features
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Clear focus indicators and logical tab order

Accessibility is tested automatically with axe-core in our test suite.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Success Metric

Our goal: Help users record ≥ 1 focus session or ≥ 30 minutes tracked time on ≥ 5 days per week during their first month of use.

---

**FocusTracker** - Simple, private, effective time tracking. Your data, your control.
