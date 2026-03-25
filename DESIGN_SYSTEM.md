# 🎨 Design System

## Color Palette

### Primary Colors
```css
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--primary-purple: #667eea
--primary-violet: #764ba2
```

### Traffic Status Colors
```css
--traffic-low: #10b981     /* Green - Light traffic */
--traffic-medium: #f59e0b  /* Orange - Moderate traffic */
--traffic-high: #ef4444    /* Red - Heavy traffic */
```

### Neutral Colors
```css
--white: #ffffff
--gray-50: #f8f9fa
--gray-100: #e9ecef
--gray-200: #e0e0e0
--gray-300: #f0f0f0
--gray-600: #666666
--gray-700: #444444
--gray-800: #333333
```

### Accent Colors
```css
--pink-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
--warning-bg: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%)
--warning-border: #f59e0b
```

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### Font Sizes
```css
--text-xs: 11px
--text-sm: 12px
--text-base: 14px
--text-md: 15px
--text-lg: 18px
--text-xl: 20px
--text-2xl: 24px
--text-3xl: 26px
--text-4xl: 28px
--text-5xl: 32px
--text-6xl: 48px
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

---

## Spacing

### Padding/Margin Scale
```css
--space-xs: 8px
--space-sm: 10px
--space-md: 15px
--space-lg: 20px
--space-xl: 25px
--space-2xl: 30px
--space-3xl: 35px
--space-4xl: 40px
```

### Gap Scale
```css
--gap-xs: 8px
--gap-sm: 10px
--gap-md: 12px
--gap-lg: 15px
--gap-xl: 20px
--gap-2xl: 25px
```

---

## Border Radius

```css
--radius-sm: 10px
--radius-md: 12px
--radius-lg: 15px
--radius-xl: 20px
--radius-full: 50%
```

---

## Shadows

### Box Shadows
```css
--shadow-sm: 0 4px 15px rgba(102, 126, 234, 0.4)
--shadow-md: 0 5px 20px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.15)
--shadow-xl: 0 10px 40px rgba(0, 0, 0, 0.2)
--shadow-2xl: 0 20px 60px rgba(0, 0, 0, 0.3)
--shadow-button: 0 6px 20px rgba(102, 126, 234, 0.6)
```

---

## Animations

### Keyframes

#### Slide Down
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Duration: 0.6s ease-out */
```

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
/* Duration: 0.8s ease-out */
```

#### Fade In Up
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Duration: 0.6s ease-out */
```

#### Bounce
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
/* Duration: 2s infinite */
```

#### Spin
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* Duration: 1s linear infinite */
```

#### Pulse
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
/* Duration: 2s infinite */
```

#### Grow Up
```css
@keyframes growUp {
  from { height: 0 !important; }
}
/* Duration: 0.8s ease-out */
```

---

## Components

### Card Style
```css
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
```

### Button Primary
```css
.button-primary {
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}
```

### Input Field
```css
.input {
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: white;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

### Badge
```css
.badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small devices (phones) */
@media (max-width: 768px) {
  /* Mobile styles */
}

/* Medium devices (tablets) */
@media (min-width: 769px) and (max-width: 1024px) {
  /* Tablet styles */
}

/* Large devices (desktops) */
@media (min-width: 1025px) {
  /* Desktop styles */
}
```

---

## Layout Patterns

### Grid Layout
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}
```

### Flex Layout
```css
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}
```

---

## Icon System

### Emoji Icons Used
- 🚌 Bus/Transport
- 🚦 Traffic Light
- 📍 Location Pin
- 🔍 Search/Predict
- 📊 Chart/Analytics
- 🗺️ Map/Routes
- 💡 Recommendations
- ⚠️ Warning/Alert
- 🎯 Target/Accuracy
- ⏱️ Time
- 📏 Distance
- ⚡ Speed
- 📈 Trending Up
- ✓ Checkmark/Success

---

## Accessibility

### Contrast Ratios
- Text on white: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: Clear focus states

### Focus States
```css
:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
```

### Touch Targets
- Minimum size: 44x44px
- Adequate spacing between elements

---

## Design Principles

1. **Consistency**: Uniform spacing, colors, and typography
2. **Hierarchy**: Clear visual hierarchy with size and weight
3. **Feedback**: Hover states, loading indicators, animations
4. **Simplicity**: Clean, uncluttered interface
5. **Responsiveness**: Mobile-first, adaptive layouts
6. **Performance**: Smooth 60fps animations
7. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

---

## Usage Guidelines

### Do's ✅
- Use gradient backgrounds for primary actions
- Apply glass morphism to cards
- Add smooth transitions to interactive elements
- Maintain consistent spacing
- Use semantic color coding (green/yellow/red)

### Don'ts ❌
- Don't mix different gradient directions
- Don't use more than 3 font weights per component
- Don't animate too many elements at once
- Don't use colors outside the palette
- Don't create layouts that break on mobile

---

**This design system ensures consistency and maintainability across the entire application.**
