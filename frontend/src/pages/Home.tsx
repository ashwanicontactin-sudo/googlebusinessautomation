import BusinessMap from "../components/BusinessMap";
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  return (
    <div className="win95-home">
      <h1 className="win95-title-text">Welcome to the Business Listing Platform</h1>
      <p className="win95-subtitle">Manage and publish your business listings across the web.</p>

      <div className="win95-feature-grid">
        <div className="win95-window win95-feature-card">
          <h3 className="win95-title-bar">Free & Paid Features</h3>
          <p>Basic listing free. Premium for ads, advanced SEO, and priority publishing.</p>
        </div>
        <div className="win95-window win95-feature-card">
          <h3 className="win95-title-bar">Multi-Platform</h3>
          <p>List on Google, Bing, JustDial, IndiaMart, Yelp and more.</p>
        </div>
        <div className="win95-window win95-feature-card">
          <h3 className="win95-title-bar">Open Source Maps</h3>
          <p>Built with OpenStreetMap and Nominatim for geocoding.</p>
        </div>
        <div className="win95-window win95-feature-card">
          <h3 className="win95-title-bar">Win95 Design</h3>
          <p>Unique thick-bordered Windows 95 style interface.</p>
        </div>
        <div className="win95-window win95-feature-card">
          <h3 className="win95-title-bar">Traffic Analytics</h3>
          <p>Track visits from all supported listing platforms.</p>
        </div>
        <div className="win95-window win95-feature-card">
          <h3 className="win95-title-bar">Run Ads</h3>
          <p>Create and manage ad campaigns to boost visibility.</p>
        </div>
      </div>

      <div className="win95-actions">
        <Link to="/businesses" className="win95-button">View Businesses</Link>
        <Link to="/submit" className="win95-button">Submit New Listing</Link>
        <Link to="/platforms" className="win95-button">See Platforms</Link>
        <Link to="/ads" className="win95-button">My Ads</Link>
        <Link to="/analytics" className="win95-button">Analytics</Link>
      </div>

      <div className="win95-section">
        <h2 className="win95-title-bar">Business Locations</h2>
        <div className="win95-map-container">
          <BusinessMap businesses={[]} />
        </div>
      </div>
    </div>
  );
}
