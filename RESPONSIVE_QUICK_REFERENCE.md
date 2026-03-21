# Quick Reference: Responsive Dashboard Classes

## 🎯 Most Common Classes You'll Use

### Layout Container
```jsx
<div className="dashboard-container">
  {/* Main page wrapper - handles responsive padding */}
</div>
```

### Responsive Grids (Auto-Responsive)
```jsx
// Summary/Stats Cards - Adapts: 1 → 2 → 3 columns
<div className="summary-row">
  <SummaryCard />
  <SummaryCard />
  <SummaryCard />
</div>

// Category Cards - Auto-fill grid with responsive sizes
<div className="category-grid">
  <CategoryCard />
  <CategoryCard />
  {/* More cards... */}
</div>

// Filter Bar - Adapts: 1 col (mobile) → 4 col (desktop)
<div className="filter-bar">
  <input className="filter-input" />
  <select className="filter-select" />
  <button className="download-btn" />
</div>
```

### Tables (Mobile-Friendly)
```jsx
// Desktop Table (for screens >= 640px)
<div className="table-wrapper">
  <table className="responsive-table">
    <thead>
      <tr><th>Column 1</th><th>Column 2</th></tr>
    </thead>
    <tbody>
      <tr><td>Data</td><td>Data</td></tr>
    </tbody>
  </table>
</div>

// Mobile Card View (for screens < 640px)
<div className="table-card-list">
  <div className="table-card">
    <div className="table-card-row">
      <span className="table-card-label">Label</span>
      <span className="table-card-value">Value</span>
    </div>
  </div>
</div>
```

### Individual Cards
```jsx
// Summary Card (stats with large numbers)
<div className="summary-card">
  <h2>42</h2>
  <p>Total Projects</p>
</div>

// Category Card (activity cards)
<div className="category-card">
  <h3>Publications</h3>
  <p>Credits Earned</p>
  <h2>120</h2>
</div>
```

### Form Elements
```jsx
<input className="filter-input" placeholder="Search..." />
<select className="filter-select">
  <option>Option 1</option>
</select>
<button className="download-btn">Download</button>
```

---

## 🔄 Conditional Rendering for Mobile

```jsx
import { useResponsive } from "./hooks/useResponsive";

function MyComponent() {
  const responsive = useResponsive();
  
  return responsive.isMobile ? (
    <MobileLayout />
  ) : (
    <DesktopLayout />
  );
}
```

---

## 📱 Breakpoint Checks

```jsx
const { 
  isMobile,          // < 640px
  isTabletSm,        // 640-1024px
  isTablet,          // 1024-1280px
  isDesktop,         // >= 1280px
  isTabletOrSmaller, // < 1024px
  isDesktopOrLarger, // >= 1024px
  width,             // viewport width
  height             // viewport height
} = useResponsive();
```

---

## ❌ DON'T DO THIS (Old Way)

```jsx
// ❌ Fixed widths - breaks on mobile!
const card = {
  width: 220,
  padding: 20,
  marginRight: 20
};

// ❌ Hardcoded layouts - not responsive
const grid = {
  display: "flex",
  gap: 20,
  marginTop: 30
};
```

---

## ✅ DO THIS (New Way)

```jsx
// ✅ Use responsive classes
<div className="category-card">
  {/* Automatically responsive! */}
</div>

// ✅ Use CSS grid with auto-fill
<div className="category-grid">
  {/* Auto-fills columns based on viewport */}
</div>

// ✅ Use responsive hook for logic
{responsive.isMobile ? <Mobile /> : <Desktop />}
```

---

## 🎨 Responsive Typography

All text automatically scales:
- **Mobile**: 13px (body) → 24px (h2)
- **Tablet**: 14px (body) → 28px (h2)  
- **Desktop**: 15px (body) → 32px (h2)

No need to set font sizes manually!

---

## 🖇️ Spacing Values

Use these responsive spacing values:

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Small gap | 12px | 14px | 16px |
| Medium gap | 16px | 18px | 20px |
| Large gap | 20px | 24px | 30px |
| Container padding | 20px | 30px | 40px |

---

## 📋 Migration Checklist

Converting an existing component? Follow this:

```jsx
// 1. Add imports at top
import { useResponsive } from "./hooks/useResponsive";
import "./styles/responsiveDashboard.css";

// 2. Use hook in component
const responsive = useResponsive();

// 3. Replace inline styles with classes
// Before: <div style={cardGrid}>
// After:  <div className="category-grid">

// 4. Replace fixed widths with responsive
// Before: width: 220
// After:  className="category-card" (no fixed width)

// 5. Add mobile conditional rendering
{responsive.isMobile ? <CardView /> : <TableView />}

// 6. Delete old inline style constants at bottom
// Before: const cardStyle = { width: 220, ... }
// After:  Delete this! Use CSS classes instead.

// 7. Test on DevTools (F12 → responsive mode)
```

---

## 🚨 Common Mistakes to Avoid

❌ **Using fixed widths**
```jsx
<div style={{width: 220}}>  // Don't do this!
```

✅ **Use responsive classes instead**
```jsx
<div className="category-card">  // Responsive!
```

---

❌ **Hardcoded padding on mobile**
```jsx
<div style={{padding: "20px"}}>  // Too much on mobile!
```

✅ **Use container padding that scales**
```jsx
<div className="dashboard-container">  // Scales with screen
```

---

❌ **Inline styles for layout**
```jsx
<div style={{display: "flex", gap: 20, flexWrap: "wrap"}}>
```

✅ **Use responsive CSS grid classes**
```jsx
<div className="category-grid">  // Auto-responsive!
```

---

## 🧪 Quick Test

Add this to any component to see current viewport:

```jsx
function ViewportDebug() {
  const r = useResponsive();
  return (
    <div style={{position: "fixed", top: 0, right: 0, fontSize: "10px", 
                 background: "rgba(0,0,0,0.8)", color: "white", 
                 padding: "5px", zIndex: 9999}}>
      <div>{r.width}x{r.height}</div>
      <div>{r.isMobile ? "MOBILE" : r.isTabletSm ? "TABLET" : r.isDesktop ? "DESKTOP" : "TABLET+"}</div>
    </div>
  );
}
```

---

## 📞 Need Help?

1. Check `RESPONSIVE_DESIGN_GUIDE.md` (full documentation)
2. Review `ResponsiveComponentTemplate.jsx` (copy-paste template)
3. Look at `DepartmentDashboard.jsx` or `AdminHome.jsx` (working examples)
4. Test with Browser DevTools: F12 → Toggle Device Toolbar (Ctrl+Shift+M)

---

**Pro Tip:** Use the browser's responsive design mode (F12) to test at different breakpoints:
- 375px (iPhone SE)
- 414px (iPhone)
- 768px (iPad)
- 1024px (Large tablet)
- 1440px (Desktop)
