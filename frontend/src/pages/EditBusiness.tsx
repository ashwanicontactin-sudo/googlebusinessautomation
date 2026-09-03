import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Business } from "../types";
import "../styles/submit.css";

export default function EditBusiness() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [message, setMessage] = useState("Loading listing...");

  useEffect(() => {
    fetch(`/api/v1/businesses/${businessId}`).then((response) => response.json()).then((data) => { setBusiness(data); setMessage(""); }).catch(() => setMessage("Listing could not be loaded."));
  }, [businessId]);

  const update = (field: keyof Business, value: string | string[]) => setBusiness((current) => current ? { ...current, [field]: value } : current);
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!business) return;
    fetch(`/api/v1/businesses/${business.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: business.name, description: business.description, description_seo: business.description_seo, category: business.category, phone: business.phone, email: business.email, website: business.website, logo_url: business.logo_url, published: business.published, keywords: business.keywords }) }).then((response) => { if (!response.ok) throw new Error(); return response.json(); }).then(() => navigate(`/listing/${business.public_slug}`)).catch(() => setMessage("Could not save listing changes."));
  };

  if (!business) return <div className="win95-submit"><h2 className="win95-title-bar">Customize listing</h2><p>{message}</p></div>;
  return <div className="win95-submit"><h2 className="win95-title-bar">Customize listing</h2><p>Edit your public profile, then save to see the updated page.</p><form className="win95-form" onSubmit={save}><label className="win95-label">Business name<input className="win95-input" value={business.name} onChange={(e) => update("name", e.target.value)} required /></label><label className="win95-label">Category<input className="win95-input" value={business.category || ""} onChange={(e) => update("category", e.target.value)} /></label><label className="win95-label">Description<textarea className="win95-textarea" value={business.description || ""} onChange={(e) => update("description", e.target.value)} /></label><label className="win95-label">Logo URL<input className="win95-input" type="url" value={business.logo_url || ""} onChange={(e) => update("logo_url", e.target.value)} /></label><label className="win95-label">Phone<input className="win95-input" value={business.phone || ""} onChange={(e) => update("phone", e.target.value)} /></label><label className="win95-label">Website<input className="win95-input" type="url" value={business.website || ""} onChange={(e) => update("website", e.target.value)} /></label><div className="win95-form-actions"><button className="win95-button" type="submit">Save changes</button><Link className="win95-button" to={`/listing/${business.public_slug}`}>View public page</Link></div>{message && <p role="status">{message}</p>}</form></div>;
}