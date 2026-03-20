import { useState } from "react";

function Header({ title = "", subtitle = "", logo = null, children }) {
  const toggleSidebar = () => {
    try {
      window.dispatchEvent(new CustomEvent("toggleSidebar"));
    } catch (e) {
      // noop
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <button className="hamburger" onClick={toggleSidebar} aria-label="Open menu">
            ☰
          </button>

          <div>
            <div className="animated-title" style={{ fontSize: 18, marginBottom: 4 }}>{title}</div>
            {subtitle && <div style={{ color: "var(--muted)", fontSize: 13 }}>{subtitle}</div>}
          </div>
        </div>

        <div className="header-buttons">
          {children}
          {logo && <img src={logo} alt="logo" style={{ height: 40, marginLeft: 12 }} />}
        </div>
      </div>
    </header>
  );
}

export default Header;
