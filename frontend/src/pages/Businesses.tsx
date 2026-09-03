import { useEffect, useState } from "react";
import type { Business } from "../types";
import BusinessMap from "../components/BusinessMap";
import "../styles/businesses.css";

export default function Businesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    fetch("/api/v1/businesses")
      .then((res) => res.json())
      .then(setBusinesses)
      .catch(console.error);
  }, []);

  return (
    <div className="win95-businesses">
      <h2 className="win95-title-bar">All Businesses</h2>

      <div className="win95-map-wrapper">
        <h3 className="win95-subtitle">Business Locations</h3>
        <BusinessMap businesses={businesses} />
      </div>

      <div className="win95-table-container">
        <table className="win95-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>City</th>
              <th>State</th>
              <th>Category</th>
              <th>Keywords</th>
              <th>Plan</th>
              <th>Phone</th>
              <th>Media</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b, i) => (
              <tr key={b.id}>
                <td>{i + 1}</td>
                <td>{b.name}</td>
                <td>{b.city}</td>
                <td>{b.state}</td>
                <td>{b.category || "-"}</td>
                <td>{b.keywords?.join(", ") || "-"}</td>
                <td>
                  <span className={b.plan_tier === "premium" ? "win95-badge-paid" : "win95-badge-free"}>
                    {b.plan_tier || "free"}
                  </span>
                </td>
                <td>{b.phone || "-"}</td>
                <td>
                  <a href={`/businesses/${b.id}/media`} className="win95-button-small">Media</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
