import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pricing.css";

interface Plan { id: string; name: string; price: number; interval: string; description: string; }

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/v1/billing/plans").then((response) => response.json()).then((data) => setPlans(data.plans));
  }, []);

  const choosePlan = (planTier: string) => {
    if (planTier === "free") { window.location.href = "/submit"; return; }
    if (!email) { setMessage("Enter your email to start checkout."); return; }
    fetch("/api/v1/billing/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan_tier: planTier, email }) })
      .then((response) => response.json()).then((data) => setMessage(data.message));
  };

  return <div className="win95-pricing"><h2 className="win95-title-bar">Plans and Pricing</h2><p>Start free. Paid plans are intentionally priced below typical multi-platform listing tools.</p><div className="win95-pricing-email"><label className="win95-label" htmlFor="checkout-email">Email for checkout</label><input id="checkout-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="win95-input" placeholder="owner@example.com" />{message && <p>{message}</p>}</div><div className="win95-plan-grid">{plans.map((plan) => <section className="win95-plan-card" key={plan.id}><h3 className="win95-title-bar">{plan.name}</h3><strong className="win95-plan-price">${plan.price}<small>/{plan.interval}</small></strong><p>{plan.description}</p><ul><li>Public profile URL</li><li>Listing dashboard</li><li>{plan.id === "free" ? "Core listing tools" : "SEO, media and analytics"}</li></ul><button className="win95-button" onClick={() => choosePlan(plan.id)}>{plan.id === "free" ? "Create free listing" : "Choose plan"}</button></section>)}</div><p><Link to="/submit">Continue to listing setup</Link></p></div>;
}