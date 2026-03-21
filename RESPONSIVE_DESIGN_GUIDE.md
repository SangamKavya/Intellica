# Responsive Dashboard Design Guide

## Overview

This document explains how to implement the responsive dashboard design across your application.

## Quick Start

### 1. **Import the Hook & CSS**
```jsx
import { useResponsive } from "../../../hooks/useResponsive";
import "../../../styles/responsiveDashboard.css";
```

### 2. **Use the Hook**
```jsx
const responsive = useResponsive();

// Available properties:
// - responsive.isMobile (< 640px)
// - responsive.isTabletSm (640px - 1024px)
// - responsive.isTablet (1024px - 1280px)
// - responsive.isDesktop (>= 1280px)
// - responsive.width, responsive.height
// - responsive.isTabletOrSmaller (< 1024px)
// - responsive.isDesktopOrLarger (>= 1024px)
```

### 3. **Apply CSS Classes**

Instead of inline styles with fixed dimensions, use the provided CSS classes:

#### Containers
- `.dashboard-container` - Main wrapper with responsive padding
- `.dashboard-title` - Title with responsive font sizes

#### Grids & Layouts
- `.summary-row` - 1 col (mobile) → 3 col (desktop)
- `.category-grid` - Auto-fill grid with responsive card sizes
- `.filter-bar` - Stacked (mobile) → flex row (desktop)

#### Components
- `.summary-card` - Responsive stat card
- `.category-card` - Responsive category/activity card
- `.responsive-table` - Table that becomes cards on mobile
- `.table-card-list` - Card list view (mobile tables)

#### Forms
- `.filter-input`, `.filter-select` - Responsive form inputs
- `.download-btn` - Responsive button

### 4. **Mobile-Specific Logic**

For dynamic content display:

```jsx
{responsive.isMobile ? (
  <CardView items={items} />
) : (
  <TableView items={items} />
)}
```

## Breakpoint System

### Mobile-First Approach
The CSS starts with mobile defaults, then uses media queries for larger screens:

```css
/* Default: Mobile styling */
.component { 
  font-size: 14px; 
  padding: 12px;
}

/* Tablet and larger */
@media (min-width: 640px) {
  .component {
    font-size: 16px;
    padding: 16px;
  }
}

/* Desktop and larger */
@media (min-width: 1024px) {
  .component {
    font-size: 18px;
    padding: 20px;
  }
}
```

### Responsive Breakpoints

| Device | Width | Class |
|--------|-------|-------|
| Mobile | < 640px | `.isMobile` |
| Tablet (Small) | 640-1024px | `.isTabletSm` |
| Tablet (Large) | 1024-1280px | `.isTablet` |
| Desktop | ≥ 1280px | `.isDesktop` |

## Design Patterns

### Pattern 1: Responsive Grid
```jsx
<div className="summary-row">
  {items.map(item => (
    <SummaryCard key={item.id} {...item} />
  ))}
</div>
```
- Automatically: 1 col (mobile) → 2 col (tablet) → 3 col (desktop)

### Pattern 2: Responsive Table/Card View
```jsx
{responsive.isMobile ? (
  // Show cards on mobile
  <div className="table-card-list">
    {data.map(item => (
      <div key={item.id} className="table-card">
        <div className="table-card-row">
          <span className="table-card-label">Field</span>
          <span className="table-card-value">{item.value}</span>
        </div>
      </div>
    ))}
  </div>
) : (
  // Show table on desktop
  <div className="table-wrapper">
    <table className="responsive-table">
      {/* table content */}
    </table>
  </div>
)}
```

### Pattern 3: Conditional Sizing
```jsx
<button
  style={{
    fontSize: responsive.isMobile ? "14px" : "16px",
    padding: responsive.isMobile ? "10px" : "14px"
  }}
>
  Click Me
</button>
```

## Typography Scaling

The CSS includes automatic font scaling:

- **Headings**: Scale from 24px (mobile) to 32px (desktop)
- **Body text**: Scale from 13px (mobile) to 15px (desktop)
- **Small text**: Scale from 10px (mobile) to 12px (desktop)

Don't hardcode font sizes; use the responsive classes instead.

## Spacing Guidelines

### Recommended Responsive Gaps
```jsx
// Small gap
<div style={{ gap: responsive.isMobile ? "12px" : "16px" }}>

// Medium gap
<div style={{ gap: responsive.isMobile ? "16px" : "20px" }}>

// Large gap
<div style={{ gap: responsive.isMobile ? "20px" : "30px" }}>
```

### Padding & Margins
- Mobile: 12px-16px
- Tablet: 16px-20px
- Desktop: 20px-30px

The `.dashboard-container` class handles main container padding automatically.

## Touch & Mobile Optimization

### Touch-Friendly Targets
Ensure interactive elements have minimum size:

```jsx
// Good ✅
<button style={{ minHeight: "44px", minWidth: "44px" }}>
  
// Bad ❌
<button style={{ padding: "4px 8px" }}>
```

### Focus States
Interactive elements have focus states for accessibility:

```css
.filter-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

## Common Responsive Patterns

### 1. Conditional Rendering
```jsx
import { useResponsive } from "./hooks/useResponsive";

function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  if (isMobile) return <MobileLayout />;
  if (isTablet) return <TabletLayout />;
  return <DesktopLayout />;
}
```

### 2. Adaptive Columns
```jsx
// Use CSS Grid with auto-fill
<div className="category-grid">
  {/* Automatically fills columns based on container width */}
</div>
```

### 3. Horizontal Scroll on Mobile
```jsx
<div className="table-wrapper">
  {/* Automatically gets overflow-x: auto on mobile */}
  <table className="responsive-table">
    {/* content */}
  </table>
</div>
```

## Testing Checklist

- [ ] Test on iPhone 12 (390px)
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Test on iPad Pro (1024px)
- [ ] Test on Desktop (1440px)
- [ ] Test with browser DevTools (responsive view)
- [ ] Test landscape orientation
- [ ] Test with pinch zoom
- [ ] Test with keyboard navigation
- [ ] Test with screen reader (accessibility)

## Debugging

### Check Responsive State
Add a debug component:

```jsx
function DebugViewport() {
  const r = useResponsive();
  return (
    <div style={{ position: "fixed", top: 0, right: 0, fontSize: "10px", 
                  background: "rgba(0,0,0,0.8)", color: "white", padding: "5px", zIndex: 9999 }}>
      <div>{r.width}x{r.height}</div>
      <div>{r.isMobile ? "mobile" : r.isTabletSm ? "tablet-sm" : r.isTablet ? "tablet" : "desktop"}</div>
    </div>
  );
}
```

### Viewport Meta Tag
Ensure the viewport meta tag is in `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

## Performance Optimization

1. **Debounce Resize**: The `useResponsive` hook handles this internally
2. **CSS Over JS**: Prefer CSS media queries over JS conditionals when possible
3. **Optimize Images**: Use responsive image sizes
4. **Lazy Load**: Consider lazy loading for large lists

## Future Enhancements

- [ ] Dark mode responsive styles
- [ ] RTL (Right-to-Left) language support
- [ ] Haptic feedback on mobile
- [ ] Gesture-based interactions
- [ ] Print-friendly responsive styles

## Support & Issues

If you encounter responsive design issues:

1. Check browser DevTools (F12 → Device Toolbar)
2. Verify viewport meta tag in index.html
3. Clear CSS cache (hard refresh: Ctrl+Shift+R)
4. Check console for JavaScript errors
5. Verify useResponsive hook is properly imported

---

**Last Updated:** March 2026
