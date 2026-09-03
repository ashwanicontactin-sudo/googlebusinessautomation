import { useState } from "react";
import "../styles/login.css";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const startSocialLogin = (provider: "google" | "meta") => {
    fetch(`/api/v1/auth/oauth/${provider}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail ?? "Social login is unavailable");
        window.location.href = data.authorization_url;
      })
      .catch((error: Error) => alert(error.message));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/v1/auth/${isRegistering ? "register" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, ...(isRegistering ? { email } : {}) }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", data.access_token);
        alert(isRegistering ? "Account created successfully!" : "Login successful!");
      })
      .catch(console.error);
  };

  return (
    <div className="win95-login">
      <h2 className="win95-title-bar">{isRegistering ? "Create Account" : "Login"}</h2>
      <form className="win95-form" onSubmit={handleSubmit}>
        <div className="win95-form-row">
          <label className="win95-label">Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="win95-input" required />
        </div>
        {isRegistering && (
          <div className="win95-form-row">
            <label className="win95-label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="win95-input" required />
          </div>
        )}
        <div className="win95-form-row">
          <label className="win95-label">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="win95-input" required />
        </div>
        <div className="win95-form-actions">
          <button type="submit" className="win95-button">{isRegistering ? "Create Account" : "Login"}</button>
          <button type="button" className="win95-button" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Back to Login" : "Sign Up / Register"}
          </button>
        </div>
        <div className="win95-social-login">
          <span>Or continue with</span>
          <button type="button" className="win95-button" onClick={() => startSocialLogin("google")}>Continue with Google</button>
          <button type="button" className="win95-button" onClick={() => startSocialLogin("meta")}>Continue with Facebook / Instagram</button>
        </div>
      </form>
    </div>
  );
}
