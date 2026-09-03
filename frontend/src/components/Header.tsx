import { NavLink, Link } from "react-router-dom";
import "../styles/header.css";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/businesses", label: "Businesses" },
  { to: "/platforms", label: "Platforms" },
  { to: "/ads", label: "Ads" },
  { to: "/ads/builder", label: "Ad Builder" },
  { to: "/analytics", label: "Analytics" },
  { to: "/analytics/config", label: "Ad Integrations" },
  { to: "/submit", label: "Submit Listing" },
  { to: "/login", label: "Login" },
];

export default function Header() {
  return (
    <header className="win95-title-bar">
      <div className="win95-title-bar-left">
        <Link to="/" className="win95-title">Business Listing Platform</Link>
      </div>
      <nav className="win95-menu-bar">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className="win95-menu-item">
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
