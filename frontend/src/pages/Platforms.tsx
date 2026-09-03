import { useEffect, useState } from "react";
import "../styles/platforms.css";

interface Platform {
  name: string;
  label: string;
}

export default function Platforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/listings/platforms")
      .then((res) => res.json())
      .then((data) => setPlatforms(data.platforms))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="win95-platforms">
      <h2 className="win95-title-bar">Supported Listing Platforms</h2>
      {loading && <p>Loading platforms...</p>}
      <div className="win95-platform-grid">
        {platforms.map((p) => (
          <div key={p.name} className="win95-window win95-platform-card">
            <h3 className="win95-title-bar">{p.label}</h3>
            <p>Integration status: <strong>Available</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}
