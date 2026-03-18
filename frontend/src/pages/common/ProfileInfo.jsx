import React from "react";

function ProfileInfo({ user }) {
  if (!user) return null;

  const links = [];

  if (user.googleScholar) {
    links.push(user.googleScholar);
  }

  if (user.scopusId) {
    links.push(user.scopusId);
  }

  if (user.vidwanId) {
    links.push(user.vidwanId);
  }

  return (
    <div style={container}>
      <h3 style={nameStyle}>{user.name}</h3>
      <p style={designationStyle}>{user.designation}</p>

      <div style={{ marginTop: 12 }}>
        {links.map((link, index) => (
          <a
            key={index}
            href={
              link.startsWith("http")
                ? link
                : `https://${link}`
            }
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}

export default ProfileInfo;

/* ===== Styles ===== */

const container = {
  marginTop: 18,
  textAlign: "center",
};

const nameStyle = {
  margin: 0,
  fontWeight: 800,
  fontSize: 20,          // 🔥 Increased
  letterSpacing: "0.5px",
};

const designationStyle = {
  margin: "6px 0",
  fontSize: 15,          // 🔥 Increased
  fontWeight: 500,
  opacity: 0.85,
};

const linkStyle = {
  display: "block",
  background: "black",
  color: "white",
  padding: "8px 12px",   // 🔥 Bigger padding
  borderRadius: 8,
  marginTop: 8,
  textDecoration: "none",
  fontSize: 14,          // 🔥 Increased
  fontWeight: 500,
  wordBreak: "break-word",
};