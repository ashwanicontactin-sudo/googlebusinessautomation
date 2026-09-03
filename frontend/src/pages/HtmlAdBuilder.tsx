import { useState } from "react";
import "../styles/media.css";

export default function HtmlAdBuilder() {
  const [title, setTitle] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(250);
  const [businessId, setBusinessId] = useState("");
  const [embedCode, setEmbedCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/v1/media/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: Number(businessId),
        title,
        html_content: htmlContent,
        width,
        height,
        media_type: "html_ad",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setEmbedCode(data.embed_code || "");
        alert(`HTML ad created! ID: ${data.id}`);
      })
      .catch(console.error);
  };

  const generateEmbed = () => {
    if (!htmlContent) return;
    const code = `<iframe src="/embed-preview" width="${width}" height="${height}" frameborder="0">${htmlContent}</iframe>`;
    setEmbedCode(code);
  };

  return (
    <div className="win95-html-ad-builder">
      <h2 className="win95-title-bar">HTML Ad Builder</h2>

      <form className="win95-form" onSubmit={handleSubmit}>
        <div className="win95-form-row">
          <label className="win95-label">Business ID</label>
          <input type="number" value={businessId} onChange={(e) => setBusinessId(e.target.value)} className="win95-input" required />
        </div>

        <div className="win95-form-row">
          <label className="win95-label">Ad Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="win95-input" required />
        </div>

        <div className="win95-form-row win95-form-row-inline">
          <div className="win95-form-group">
            <label className="win95-label">Width (px)</label>
            <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="win95-input" />
          </div>
          <div className="win95-form-group">
            <label className="win95-label">Height (px)</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="win95-input" />
          </div>
        </div>

        <div className="win95-form-row">
          <label className="win95-label">HTML Content</label>
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="win95-textarea"
            rows={6}
            placeholder='<div class="my-ad">Special Offer! 50% off this week!</div>'
            required
          />
        </div>

        <div className="win95-form-actions">
          <button type="button" onClick={generateEmbed} className="win95-button">Generate Embed</button>
          <button type="submit" className="win95-button">Save Ad</button>
        </div>
      </form>

      {embedCode && (
        <div className="win95-form-row">
          <label className="win95-label">Embed Code (copy to your HTML):</label>
          <pre className="win95-code-block">{embedCode}</pre>
        </div>
      )}
    </div>
  );
}
