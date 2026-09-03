import { Routes, Route, useParams } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Businesses from "./pages/Businesses";
import SubmitListing from "./pages/SubmitListing";
import Platforms from "./pages/Platforms";
import Login from "./pages/Login";
import Ads from "./pages/Ads";
import Analytics from "./pages/Analytics";
import AnalyticsConfig from "./pages/AnalyticsConfig";
import HtmlAdBuilder from "./pages/HtmlAdBuilder";
import MediaGallery from "./components/MediaGallery";
import "./styles/app.css";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/businesses/:businessId/media" element={<BusinessMedia />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/submit" element={<SubmitListing />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="/ads/builder" element={<HtmlAdBuilder />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/analytics/config" element={<AnalyticsConfig />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  );
}

function BusinessMedia() {
  const { businessId } = useParams();
  return <MediaGallery businessId={Number(businessId)} />;
}

export default App;
