import { useEffect, useState } from "react";

function Sidebar({ menu = [], onSelect = () => {}, profile = null, bottom = null }) {
  const [open, setOpen] = useState(() => {
    try {
      return typeof window !== "undefined" && window.innerWidth >= 1000;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const handler = () => setOpen((v) => !v);
    window.addEventListener("toggleSidebar", handler);
    return () => window.removeEventListener("toggleSidebar", handler);
  }, []);

  // Reflect sidebar state on <body> so other components (header icon)
  // can animate based on the presence of the `sidebar-open` class.
  useEffect(() => {
    try {
      if (open) document.body.classList.add("sidebar-open");
      else document.body.classList.remove("sidebar-open");
    } catch (e) {
      // noop
    }
  }, [open]);

  return (
    <>
      <div className={`sidebar ${open ? "open" : "closed"}`}>
        <div style={{ padding: 12, display: "flex", justifyContent: "flex-end" }}>
          <button className="hamburger" onClick={() => setOpen(false)} aria-label="Close menu">✕</button>
        </div>

        {profile && <div style={{ padding: 12 }}>{profile}</div>}

        <nav style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {menu.map((m) => (
            <div
              key={m.key}
              onClick={() => { onSelect(m.key); setOpen(false); }}
              style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", color: "white" }}
            >
              {m.label}
            </div>
          ))}
        </nav>

        {bottom && <div style={{ padding: 12, marginTop: 12 }}>{bottom}</div>}
      </div>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}

export default Sidebar;
