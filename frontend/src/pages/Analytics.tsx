import { useEffect, useState } from "react";
import type { AdCampaign } from "../types";
import "../styles/analytics.css";

interface TrafficData {
  business_id: number;
  source: string;
  total_visits: number;
  date: string;
}

export default function Analytics() {
  const [traffic, setTraffic] = useState<TrafficData[]>([]);
  const [ads, setAds] = useState<AdCampaign[]>([]);

  useEffect(() => {
    fetch("/api/v1/analytics/")
      .then((res) => res.json())
      .then(setTraffic)
      .catch(console.error);

    fetch("/api/v1/ads")
      .then((res) => res.json())
      .then(setAds)
      .catch(console.error);
  }, []);

  const totalVisits = traffic.reduce((sum, t) => sum + t.total_visits, 0);
  const totalAds = ads.length;
  const activeAds = ads.filter((a) => a.status === "active").length;
  const totalRevenue = ads
    .filter((a) => a.status === "active")
    .reduce((sum, a) => sum + a.budget, 0);

  return (
    <div className="win95-analytics">
      <h2 className="win95-title-bar">Traffic Analytics Dashboard</h2>

      <div className="win95-stats-grid">
        <div className="win95-stat-card">
          <h3>Total Visits</h3>
          <div className="win95-stat-value">{totalVisits}</div>
        </div>
        <div className="win95-stat-card">
          <h3>Active Ads</h3>
          <div className="win95-stat-value">{activeAds}</div>
        </div>
        <div className="win95-stat-card">
          <h3>Total Campaigns</h3>
          <div className="win95-stat-value">{totalAds}</div>
        </div>
        <div className="win95-stat-card">
          <h3>Ad Revenue</h3>
          <div className="win95-stat-value">${totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="win95-section">
        <h3 className="win95-title-bar">Traffic by Source</h3>
        <div className="win95-table-container">
          <table className="win95-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Visits</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {traffic.map((t) => (
                <tr key={`${t.business_id}-${t.source}`}>
                  <td>{t.source}</td>
                  <td>{t.total_visits}</td>
                  <td>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="win95-section">
        <h3 className="win95-title-bar">Ad Campaigns</h3>
        <div className="win95-table-container">
          <table className="win95-table">
            <thead>
              <tr>
                <th>Business ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Impressions</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id}>
                  <td>{ad.business_id}</td>
                  <td>{ad.title}</td>
                  <td>{ad.status}</td>
                  <td>${ad.budget}</td>
                  <td>{ad.impressions}</td>
                  <td>{ad.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
