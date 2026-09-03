import { useState, useEffect } from "react";
import "../styles/analytics-config.css";

interface AnalyticsConfig {
  business_id: number;
  google_analytics_id?: string;
  google_ads_conversion_id?: string;
  meta_pixel_id?: string;
  apple_search_ads_id?: string;
}

interface AdPlatform {
  name: string;
  label: string;
}

export default function AnalyticsConfig() {
  const [config, setConfig] = useState<AnalyticsConfig>({
    business_id: 1,
    google_analytics_id: "",
    google_ads_conversion_id: "",
    meta_pixel_id: "",
    apple_search_ads_id: "",
  });
  const [platforms, setPlatforms] = useState<AdPlatform[]>([]);

  useEffect(() => {
    fetch("/api/v1/ads/platforms")
      .then((res) => res.json())
      .then((data) => setPlatforms(data.platforms))
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/v1/ads/analytics-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })
      .then((res) => res.json())
      .then(() => alert("Analytics configuration saved!"))
      .catch(console.error);
  };

  return (
    <div className="win95-analytics-config">
      <h2 className="win95-title-bar">Ad Platform Integrations</h2>

      <div className="win95-section">
        <h3 className="win95-title-bar">Supported Platforms</h3>
        <div className="win95-platform-list">
          {platforms.map((p) => (
            <div key={p.name} className="win95-platform-item">
              <span className="win95-platform-name">{p.label}</span>
              <span className="win95-status-available">Available</span>
            </div>
          ))}
        </div>
      </div>

      <div className="win95-section">
        <h3 className="win95-title-bar">Tracking Configuration</h3>
        <form className="win95-form" onSubmit={handleSubmit}>
          <div className="win95-form-row">
            <label className="win95-label">Business ID</label>
            <input
              type="number"
              name="business_id"
              value={config.business_id}
              onChange={handleChange}
              className="win95-input"
              required
            />
          </div>

          <div className="win95-form-row">
            <label className="win95-label">Google Analytics ID (G-XXXXXXXXXX)</label>
            <input
              type="text"
              name="google_analytics_id"
              value={config.google_analytics_id}
              onChange={handleChange}
              className="win95-input"
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <div className="win95-form-row">
            <label className="win95-label">Google Ads Conversion ID (AW-XXXXXXXXX)</label>
            <input
              type="text"
              name="google_ads_conversion_id"
              value={config.google_ads_conversion_id}
              onChange={handleChange}
              className="win95-input"
              placeholder="AW-XXXXXXXXX"
            />
          </div>

          <div className="win95-form-row">
            <label className="win95-label">Meta Pixel ID</label>
            <input
              type="text"
              name="meta_pixel_id"
              value={config.meta_pixel_id}
              onChange={handleChange}
              className="win95-input"
              placeholder="XXXXXXXXXX"
            />
          </div>

          <div className="win95-form-row">
            <label className="win95-label">Apple Search Ads ID</label>
            <input
              type="text"
              name="apple_search_ads_id"
              value={config.apple_search_ads_id}
              onChange={handleChange}
              className="win95-input"
              placeholder="YYYYYYYYYY"
            />
          </div>

          <div className="win95-form-actions">
            <button type="submit" className="win95-button">Save Configuration</button>
          </div>
        </form>
      </div>
    </div>
  );
}
