import { useEffect, useState } from "react";
import "../styles/media.css";

interface MediaItem {
  id: number;
  business_id: number;
  filename: string;
  file_type: string;
  url: string;
  media_type: string;
  caption?: string;
  is_ad: boolean;
  embed_code?: string;
}

interface MediaProps {
  businessId: number;
}

export default function MediaGallery({ businessId }: MediaProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState("photo");
  const [caption, setCaption] = useState("");
  const [isAd, setIsAd] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/media/business/${businessId}`)
      .then((res) => res.json())
      .then(setMediaItems)
      .catch(console.error);
  }, [businessId]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append("business_id", String(businessId));
    formData.append("file", uploadFile);
    formData.append("caption", caption);
    formData.append("media_type", uploadType);
    formData.append("is_ad", String(isAd));

    fetch("/api/v1/media/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setUploadFile(null);
        setCaption("");
        setIsAd(false);
        setUploadType("photo");
        fetch(`/api/v1/media/business/${businessId}`)
          .then((res) => res.json())
          .then(setMediaItems)
          .catch(console.error);
      })
      .catch(console.error);
  };

  return (
    <div className="win95-media-gallery">
      <h3 className="win95-title-bar">Media & Ads Gallery</h3>

      <form className="win95-form" onSubmit={handleUpload}>
        <div className="win95-form-row win95-form-row-inline">
          <div className="win95-form-group">
            <label className="win95-label">File</label>
            <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="win95-input" />
          </div>
          <div className="win95-form-group">
            <label className="win95-label">Type</label>
            <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="win95-select">
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>

        <div className="win95-form-row">
          <label className="win95-label">Caption</label>
          <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} className="win95-input" />
        </div>

        <div className="win95-form-row">
          <label className="win95-checkbox-container">
            <input type="checkbox" checked={isAd} onChange={(e) => setIsAd(e.target.checked)} />
            <span className="win95-checkmark"></span>
            This is an ad
          </label>
        </div>

        <button type="submit" className="win95-button" disabled={!uploadFile}>Upload</button>
      </form>

      <div className="win95-media-grid">
        {mediaItems.map((item) => (
          <div key={item.id} className="win95-media-item">
            {item.media_type === "photo" && (
              <img src={item.url} alt={item.caption || item.filename} className="win95-media-img" />
            )}
            {item.media_type === "video" && (
              <video src={item.url} controls className="win95-media-video" />
            )}
            {item.media_type === "html_ad" && item.embed_code && (
              <div className="win95-html-ad" dangerouslySetInnerHTML={{ __html: item.embed_code }} />
            )}
            {item.caption && <span className="win95-media-caption">{item.caption}</span>}
            {item.is_ad && <span className="win95-badge-paid">AD</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
