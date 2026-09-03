import { useEffect, useState } from "react";
import type { AdCampaign, Keyword } from "../types";
import BusinessMap from "../components/BusinessMap";
import "../styles/ads.css";

export default function Ads() {
  const [ads, setAds] = useState<AdCampaign[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  useEffect(() => {
    fetch("/api/v1/ads")
      .then((res) => res.json())
      .then(setAds)
      .catch(console.error);

    fetch("/api/v1/ads/keywords")
      .then((res) => res.json())
      .then(setKeywords)
      .catch(console.error);
  }, []);

  const handleLaunch = (id: number) => {
    fetch(`/api/v1/ads/${id}/launch`, { method: "POST" })
      .then((res) => res.json())
      .then((updated) => {
        setAds(ads.map((a) => (a.id === id ? updated : a)));
      })
      .catch(console.error);
  };

  return (
    <div className="win95-ads">
      <h2 className="win95-title-bar">Ad Campaigns</h2>

      <div className="win95-section">
        <h3 className="win95-title-bar">Keyword Research</h3>
        <div className="win95-keyword-grid">
          {keywords.map((kw) => (
            <div key={kw.id} className="win95-keyword-card">
              <span className="win95-keyword">{kw.keyword}</span>
              <span className="win95-category">{kw.category}</span>
              <span className="win95-volume">{kw.search_volume ?? 0} searches/mo</span>
            </div>
          ))}
        </div>
      </div>

      <div className="win95-section">
        <h3 className="win95-title-bar">Your Ad Campaigns</h3>
        <div className="win95-table-container">
          <table className="win95-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Budget</th>
                <th>Daily</th>
                <th>Status</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id}>
                  <td>{ad.id}</td>
                  <td>{ad.title}</td>
                  <td>${ad.budget}</td>
                  <td>${ad.daily_budget}</td>
                  <td>{ad.status}</td>
                  <td>{ad.impressions}</td>
                  <td>{ad.clicks}</td>
                  <td>
                    {ad.status === "draft" && (
                      <button onClick={() => handleLaunch(ad.id)} className="win95-button-small">Launch</button>
                    )}
                    {ad.status === "active" && (
                      <button onClick={() => handleLaunch(ad.id)} className="win95-button-small">Pause</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {ads.some((a) => a.status === "active") && (
        <div className="win95-section">
          <h3 className="win95-title-bar">Ad Performance Map</h3>
          <div className="win95-map-container">
            <BusinessMap businesses={[]} />
          </div>
        </div>
      )}
    </div>
  );
}
