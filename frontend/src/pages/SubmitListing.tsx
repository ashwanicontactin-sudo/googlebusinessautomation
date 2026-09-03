import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/submit.css";

export default function SubmitListing() {
  const navigate = useNavigate();
  const [categories] = useState<string[]>(["Restaurant", "Retail", "Services", "Healthcare", "Professional"]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [platform, setPlatform] = useState("google");
  const [currentStep, setCurrentStep] = useState(1);
  const [submitMessage, setSubmitMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
    email: "",
    website: "",
    category: "",
    plan_tier: "free",
    logo_url: "",
  });

  useEffect(() => {
    fetch("/api/v1/ads/keywords")
      .then((res) => res.json())
      .then((data) => {
        setKeywords(data.map((k: { keyword: string }) => k.keyword));
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "description_seo" || name === "description") {
      const text = value as string;
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    }
  };

  const handleKeywordToggle = (kw: string) => {
    if (selectedKeywords.includes(kw)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== kw));
    } else {
      setSelectedKeywords([...selectedKeywords, kw]);
    }
  };

  const addCustomKeyword = () => {
    if (keywordInput.trim() && !selectedKeywords.includes(keywordInput.trim())) {
      setSelectedKeywords([...selectedKeywords, keywordInput.trim()]);
    }
    setKeywordInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      description_seo: seoDescription,
      keywords: selectedKeywords,
      is_paid: formData.plan_tier !== "free",
    };

    setSubmitMessage("Saving your listing...");
    fetch("/api/v1/businesses/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || "Business details could not be saved.");
        }
        return res.json();
      })
      .then((business) => fetch("/api/v1/listings/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: business.id, platform }),
      }).then(async (res) => {
        if (!res.ok) throw new Error("Listing could not be queued.");
        return res.json();
      }).then((listing) => {
        setSubmitMessage(`Listing queued for ${listing.platform}. Opening your public page...`);
        navigate(`/listing/${business.public_slug}`);
      }))
      .catch((error: Error) => setSubmitMessage(error.message));
  };

  const goNext = () => setCurrentStep((step) => Math.min(step + 1, 4));
  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 1));

  return (
    <div className="win95-submit">
      <h2 className="win95-title-bar">Submit a New Listing</h2>
      <div className="win95-step-indicator">Step {currentStep} of 4: {["Business details", "Location & contact", "SEO & plan", "Publish listing"][currentStep - 1]}</div>
      <form className="win95-form" onSubmit={handleSubmit}>
        <fieldset hidden={currentStep !== 1} disabled={currentStep !== 1}><legend>Business details</legend>
          <div className="win95-form-row"><label className="win95-label">Business Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="win95-input" required /></div>
          <div className="win95-form-row"><label className="win95-label">Short Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="win95-textarea" rows={3} /></div>
        </fieldset>
        <fieldset hidden={currentStep !== 2} disabled={currentStep !== 2}><legend>Location and contact</legend>
          <div className="win95-form-row"><label className="win95-label">Address *</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="win95-input" required /></div>
          <div className="win95-form-row win95-form-row-inline">
            <div className="win95-form-group"><label className="win95-label">City *</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="win95-input" required /></div>
            <div className="win95-form-group"><label className="win95-label">State *</label><input type="text" name="state" value={formData.state} onChange={handleChange} className="win95-input" required /></div>
            <div className="win95-form-group"><label className="win95-label">Postal Code *</label><input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className="win95-input" required /></div>
          </div>
          <div className="win95-form-row win95-form-row-inline">
            <div className="win95-form-group"><label className="win95-label">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="win95-input" /></div>
            <div className="win95-form-group"><label className="win95-label">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="win95-input" /></div>
            <div className="win95-form-group"><label className="win95-label">Website</label><input type="url" name="website" value={formData.website} onChange={handleChange} className="win95-input" /></div>
          </div>
        </fieldset>
        <fieldset hidden={currentStep !== 3} disabled={currentStep !== 3}><legend>SEO and plan</legend>
          <div className="win95-form-row"><label className="win95-label">SEO-Optimized Description (min 50 words)</label><textarea name="description_seo" value={seoDescription} onChange={(e) => { setSeoDescription(e.target.value); setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length); }} className="win95-textarea" rows={4} /><span className="win95-word-count">{wordCount} words</span></div>
          <div className="win95-form-row"><label className="win95-label">Category</label><select name="category" value={formData.category} onChange={handleChange} className="win95-select"><option value="">Select a category</option>{categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select></div>
          <div className="win95-form-row"><label className="win95-label">Plan Tier</label><select name="plan_tier" value={formData.plan_tier} onChange={handleChange} className="win95-select"><option value="free">Free (Basic listing)</option><option value="premium">Premium ($15/month)</option><option value="enterprise">Enterprise ($49/month)</option></select></div>
          <div className="win95-form-row"><label className="win95-label">Logo URL (optional)</label><input type="url" name="logo_url" value={formData.logo_url} onChange={handleChange} className="win95-input" placeholder="https://example.com/logo.png" /></div>
          <div className="win95-form-row"><label className="win95-label">SEO Keywords</label><div className="win95-keyword-selector">{keywords.slice(0, 10).map((kw) => <button key={kw} type="button" className={`win95-keyword-chip ${selectedKeywords.includes(kw) ? "selected" : ""}`} onClick={() => handleKeywordToggle(kw)}>{kw}</button>)}</div><div className="win95-form-row-inline"><input type="text" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} className="win95-input" placeholder="Custom keyword..." /><button type="button" onClick={addCustomKeyword} className="win95-button-small">Add</button></div></div>
        </fieldset>
        <fieldset hidden={currentStep !== 4} disabled={currentStep !== 4}><legend>Publish listing</legend>
          <div className="win95-form-row"><label className="win95-label">Listing Platform</label><select name="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} className="win95-select"><option value="google">Google Business Profile</option><option value="bing">Bing Places</option><option value="justdial">JustDial</option><option value="indiamart">IndiaMart</option><option value="yelp">Yelp</option><option value="apple">Apple Business Connect</option></select></div>
          <p>Select the platform where this listing submission should be queued.</p>
        </fieldset>
        {submitMessage && <p role="status">{submitMessage}</p>}
        <div className="win95-form-actions">{currentStep > 1 && <button type="button" className="win95-button" onClick={goBack}>Back</button>}{currentStep < 4 ? <button type="button" className="win95-button" onClick={goNext}>Next</button> : <button type="submit" className="win95-button">Submit Listing</button>}<button type="reset" className="win95-button" onClick={() => setCurrentStep(1)}>Clear</button></div>
      </form>
    </div>
  );
}
