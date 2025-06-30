# Brand Visual Identity Implementation Guide

## Brand Colors

### Primary Palette
- **Carbon** `#1f1f1f` - Primary text color, headers, and dark elements
- **Rich Gold** `#dcb557` - Primary accent color for CTAs, highlights, and interactive elements
- **Deep Green** `#214937` - Secondary color for links, navigation, and complementary accents
- **Sand** `#efe8d7` - Light background color, container backgrounds

### Extended Palette
- **Gold Light** `#e6c66b` - Lighter shade of rich gold
- **Gold Dark** `#c9a249` - Darker shade for hover states
- **Green Light** `#2d5c44` - Lighter shade of deep green
- **Green Dark** `#1a3c2e` - Darker shade for hover states
- **Carbon Light** `#333333` - Lighter carbon for secondary text

## CSS Variables

### Brand Colors
```css
--brand-carbon: #1f1f1f;
--brand-rich-gold: #dcb557;
--brand-deep-green: #214937;
--brand-sand: #efe8d7;
```

### Semantic Colors
```css
--brand-primary: var(--brand-rich-gold);
--brand-secondary: var(--brand-deep-green);
--brand-text: var(--brand-carbon);
--brand-background: var(--brand-sand);
--brand-surface: #ffffff;
```

## Component Classes

### Buttons
- `.brand-btn-primary` - Primary action buttons (Rich Gold gradient)
- `.brand-btn-secondary` - Secondary actions (Deep Green)
- `.brand-btn-outline` - Outlined buttons (Rich Gold border)
- `.brand-btn-ghost` - Subtle buttons (transparent background)

### Cards
- `.brand-card` - Standard card with brand styling
- `.brand-card-header` - Card header section
- `.brand-card-body` - Card content area
- `.brand-card-footer` - Card footer with actions

### Forms
- `.brand-form` - Form container
- `.brand-form-input` - Input fields with brand styling
- `.brand-form-label` - Form labels

### Navigation
- `.brand-nav` - Navigation container
- `.brand-nav-item` - Navigation links
- `.brand-nav-item.active` - Active navigation state

### Alerts
- `.brand-alert-success` - Success messages (Deep Green)
- `.brand-alert-warning` - Warning messages (Rich Gold)
- `.brand-alert-info` - Info messages (Carbon)
- `.brand-alert-error` - Error messages (Red)

## Usage Guidelines

### Color Usage
1. **Carbon (#1f1f1f)** - Use for primary text, headers, and important content
2. **Rich Gold (#dcb557)** - Use sparingly for CTAs, highlights, and key interactive elements
3. **Deep Green (#214937)** - Use for secondary actions, links, and navigation
4. **Sand (#efe8d7)** - Use for backgrounds and subtle container areas

### Typography
- Headings: Carbon color with semi-bold weight
- Body text: Carbon color with regular weight
- Links: Deep Green color with hover transition to Rich Gold
- Accents: Rich Gold for emphasis

### Interactive Elements
- Primary buttons: Rich Gold background with Deep Green text for better contrast
- Secondary buttons: Deep Green background with white text
- Form inputs: Clean borders with Rich Gold focus states
- Cards: Subtle shadows with Rich Gold left border accent

### Accessibility
- All color combinations meet WCAG 2.1 AA contrast requirements
- Interactive elements have clear hover and focus states
- Colors are never the only way to convey information

### Text Contrast Guidelines
- **Gold Backgrounds**: Always use Deep Green (#214937) text for optimal readability
- **Green Backgrounds**: Use white or Sand (#efe8d7) text for contrast
- **Carbon Backgrounds**: Use Sand (#efe8d7) or white text
- **Sand Backgrounds**: Use Carbon (#1f1f1f) or Deep Green text

## File Structure
```
src/
├── styles/
│   ├── brand-theme.css          # Core brand variables and theme
│   ├── brand-components.css     # Component-specific styles
│   └── resume.css              # Resume-specific styles
├── App.css                     # Main application styles
└── pages/
    ├── dashboard.css           # Dashboard-specific styles
    └── Resume.css              # Resume page styles
```

## Implementation Notes

1. **CSS Variables**: All brand colors are defined as CSS custom properties for easy theming
2. **Tailwind Integration**: Brand utility classes are available for use with Tailwind
3. **Dark Theme**: Dark theme variations are included for future use
4. **Responsive**: All components are mobile-responsive
5. **Consistent Spacing**: Uses the existing spacing scale for consistency

## Quick Reference

### Most Common Classes
```css
.text-carbon         /* Carbon text color */
.text-rich-gold      /* Rich Gold text color */
.text-deep-green     /* Deep Green text color */
.bg-sand             /* Sand background */
.bg-carbon           /* Carbon background */
.brand-btn-primary   /* Primary button style */
.brand-card          /* Standard card style */
.brand-form-input    /* Form input style */
```

### Color Values for Design Tools
- Carbon: #1f1f1f (RGB: 31, 31, 31)
- Rich Gold: #dcb557 (RGB: 220, 181, 87)
- Deep Green: #214937 (RGB: 33, 73, 55)
- Sand: #efe8d7 (RGB: 239, 232, 215)
