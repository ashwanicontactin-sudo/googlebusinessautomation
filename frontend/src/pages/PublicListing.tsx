import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Business } from "../types";
import "../styles/public-listing.css";

export default function PublicListing() {
  const { slug } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/businesses/public/${slug}`)
      .then((response) => {
        if (!response.ok) throw new Error("not-found");
        return response.json();
      })
      .then(setBusiness)
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <div className="win95-public-listing"><h2 className="win95-title-bar">Listing not found</h2><Link to="/businesses">Back to businesses</Link></div>;
  if (!business) return <div className="win95-public-listing"><h2 className="win95-title-bar">Loading listing...</h2></div>;

  return (
    <article className="win95-public-listing">
      <header className="win95-public-hero">
        {business.logo_url && <img src={business.logo_url} alt={`${business.name} logo`} />}
        <div><p className="win95-public-category">{business.category || "Local business"}</p><h1>{business.name}</h1><p>{business.description_seo || business.description}</p></div>
      </header>
      <section className="win95-public-section"><h2 className="win95-title-bar">Contact and location</h2><p>{business.address}, {business.city}, {business.state} {business.postal_code}</p>{business.phone && <p>Phone: {business.phone}</p>}{business.email && <p>Email: {business.email}</p>}{business.website && <p><a href={business.website}>{business.website}</a></p>}</section>
      <section className="win95-public-section"><h2 className="win95-title-bar">Services and keywords</h2><div className="win95-public-tags">{business.keywords?.map((keyword) => <span key={keyword}>{keyword}</span>)}</div></section>
    </article>
  );
}