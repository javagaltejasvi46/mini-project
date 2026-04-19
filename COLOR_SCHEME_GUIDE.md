# Route Color Scheme Guide

## Overview

Each route has a distinct color to make them easy to identify on the map. When you select a route, it changes to a traffic-based color (green/orange/red).

## Color System

### Non-Selected Routes (Default State)

Each route has its own unique color:

**Route 1 (Shortest):**
- Color: Blue (#3b82f6)
- RGB: (59, 130, 246)
- Visual: 🔵 Bright Blue

**Route 2 (Alternative):**
- Color: Purple (#8b5cf6)
- RGB: (139, 92, 246)
- Visual: 🟣 Bright Purple

**Route 3 (Alternative 2):**
- Color: Pink (#ec4899)
- RGB: (236, 72, 153)
- Visual: 🔴 Bright Pink

### Selected Route (Traffic-Based Colors)

When you click on a route, it changes color based on traffic level:

**Light Traffic (<30%):**
- Color: Bright Green (#10b981)
- RGB: (16, 185, 129)
- Visual: 🟢 Smooth flow, minimal delays

**Moderate Traffic (30-60%):**
- Color: Bright Orange (#f59e0b)
- RGB: (245, 158, 11)
- Visual: 🟠 Some congestion, moderate delays

**Heavy Traffic (>60%):**
- Color: Bright Red (#ef4444)
- RGB: (239, 68, 68)
- Visual: 🔴 Significant congestion, major delays

## Visual Examples

### Scenario 1: Three Routes Available

```
Map View:
┌─────────────────────────────────┐
│                                 │
│  🟢 Start                       │
│    │                            │
│    ├─── 🔵 Route 1 (Blue)      │
│    │                            │
│    ├─── 🟣 Route 2 (Purple)    │
│    │                            │
│    └─── 🔴 Route 3 (Pink)      │
│                                 │
│                          🔴 End │
└─────────────────────────────────┘

All routes visible with distinct colors
```

### Scenario 2: Route 1 Selected (Light Traffic)

```
Map View:
┌─────────────────────────────────┐
│                                 │
│  🟢 Start                       │
│    │                            │
│    ├─── 🟢 Route 1 (GREEN)     │ ← Selected, light traffic
│    │                            │
│    ├─── 🟣 Route 2 (Purple)    │ ← Faded
│    │                            │
│    └─── 🔴 Route 3 (Pink)      │ ← Faded
│                                 │
│                          🔴 End │
└─────────────────────────────────┘

Selected route is bright green (light traffic)
Other routes are semi-transparent
```

### Scenario 3: Route 2 Selected (Heavy Traffic)

```
Map View:
┌─────────────────────────────────┐
│                                 │
│  🟢 Start                       │
│    │                            │
│    ├─── 🔵 Route 1 (Blue)      │ ← Faded
│    │                            │
│    ├─── 🔴 Route 2 (RED)       │ ← Selected, heavy traffic
│    │                            │
│    └─── 🔴 Route 3 (Pink)      │ ← Faded
│                                 │
│                          🔴 End │
└─────────────────────────────────┘

Selected route is bright red (heavy traffic)
Other routes are semi-transparent
```

## Route Cards

Each route card shows a color indicator circle matching the route's map color:

```
┌─────────────────────────────────────────┐
│ 🔵 Route 1          ⭐ Best Route      │
│                                         │
│ ⭐ Best route! Saves 3.2 min...        │
│                                         │
│ 📏 5.2 km  ⏱️ 15 min  🚦 35%  ⏳ +2.6  │
│                                         │
│ ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │ ← Blue bar
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🟣 Route 2                              │
│                                         │
│ ⚠️ 3.2 min slower than best route...   │
│                                         │
│ 📏 6.1 km  ⏱️ 18 min  🚦 45%  ⏳ +4.1  │
│                                         │
│ ▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░   │ ← Purple bar
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🔴 Route 3                              │
│                                         │
│ ⚠️ 5.8 min slower than best route...   │
│                                         │
│ 📏 7.3 km  ⏱️ 22 min  🚦 55%  ⏳ +6.1  │
│                                         │
│ ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░   │ ← Pink bar
└─────────────────────────────────────────┘
```

## Opacity Levels

**Selected Route:**
- Opacity: 90% (0.9)
- Line Weight: 6px
- Very visible and prominent

**Non-Selected Routes:**
- Opacity: 50% (0.5)
- Line Weight: 3px
- Visible but less prominent

## Implementation Details

### JavaScript (RouteMap.jsx)

```javascript
const getRouteColor = (index, trafficLevel) => {
  if (index === selectedRoute) {
    // Selected route - traffic-based colors
    if (trafficLevel < 30) return '#10b981' // Green
    if (trafficLevel < 60) return '#f59e0b' // Orange
    return '#ef4444' // Red
  }
  
  // Non-selected routes - distinct colors
  const routeColors = [
    '#3b82f6',  // Blue for route 1
    '#8b5cf6',  // Purple for route 2
    '#ec4899',  // Pink for route 3
  ];
  
  return routeColors[index % routeColors.length]
}

const getRouteOpacity = (index) => {
  return index === selectedRoute ? 0.9 : 0.5
}

const getRouteWeight = (index) => {
  return index === selectedRoute ? 6 : 3
}
```

### CSS (RouteMap.css)

```css
.route-color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

## User Interaction Flow

1. **Initial State:**
   - All routes shown with distinct colors (Blue, Purple, Pink)
   - Route 1 selected by default
   - Route 1 shows traffic-based color

2. **Click Route 2:**
   - Route 2 becomes bright and thick
   - Route 2 changes to traffic-based color
   - Route 1 returns to blue (faded)
   - Route 3 stays pink (faded)

3. **Click Route 3:**
   - Route 3 becomes bright and thick
   - Route 3 changes to traffic-based color
   - Route 1 returns to blue (faded)
   - Route 2 returns to purple (faded)

4. **Hover Over Route:**
   - Popup shows route details
   - Route remains in current color
   - No color change on hover

## Accessibility

### Color Blindness Considerations

The color scheme is designed to be distinguishable for most types of color blindness:

**Protanopia (Red-Blind):**
- Blue vs Purple: ✅ Distinguishable
- Blue vs Pink: ✅ Distinguishable
- Purple vs Pink: ⚠️ May be similar

**Deuteranopia (Green-Blind):**
- Blue vs Purple: ✅ Distinguishable
- Blue vs Pink: ✅ Distinguishable
- Purple vs Pink: ✅ Distinguishable

**Tritanopia (Blue-Blind):**
- Blue vs Purple: ⚠️ May be similar
- Blue vs Pink: ✅ Distinguishable
- Purple vs Pink: ✅ Distinguishable

### Additional Indicators

To help with accessibility:
- ✅ Route numbers (Route 1, 2, 3)
- ✅ Line thickness (selected vs non-selected)
- ✅ Opacity differences
- ✅ Color indicator circles in cards
- ✅ Text descriptions in recommendations

## Testing Checklist

- [ ] Three routes show different colors (Blue, Purple, Pink)
- [ ] Clicking route 1 makes it green/orange/red based on traffic
- [ ] Clicking route 2 makes it green/orange/red based on traffic
- [ ] Clicking route 3 makes it green/orange/red based on traffic
- [ ] Non-selected routes are semi-transparent
- [ ] Selected route is bright and thick
- [ ] Color indicator circles match route colors
- [ ] Traffic bars match route colors
- [ ] Colors are visible on light and dark backgrounds

## Troubleshooting

### All routes are the same color
- Check if `selectedRoute` state is being set correctly
- Verify `getRouteColor` function is being called with correct index
- Check browser console for errors

### Colors not changing when clicking routes
- Verify `setSelectedRoute(index)` is being called on click
- Check if `selectedRoute` state is updating
- Ensure Polyline `eventHandlers` are set correctly

### Colors too similar
- Increase contrast by adjusting hex values
- Consider using more distinct colors
- Add border or outline to routes

### Colors not visible on map
- Increase opacity values
- Make lines thicker
- Use brighter colors
- Check map tile colors (light vs dark)

---

**Color Scheme Version:** 2.0
**Last Updated:** April 19, 2026
**Status:** ✅ Implemented
