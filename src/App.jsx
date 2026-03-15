import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
 
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const WORKER_URL = import.meta.env.VITE_WORKER_URL;
 
function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
 
  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    setLoading(true);
    setMessage("");
    setError("");
 
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
 
      setMessage(`Welcome, ${data.name || "User"}! Login successful.`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1>Login System</h1>
 
        {!loading && (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => setError("Google Login Failed. Please try again.")}
          />
        )}
 
        {loading && (
          <p style={{ color: "#555", fontSize: "14px" }}>Signing you in...</p>
        )}
 
        {message && (
          <p style={{ color: "green", fontWeight: 500 }}>{message}</p>
        )}
 
        {error && (
          <p style={{ color: "red", fontWeight: 500 }}>{error}</p>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
 
export default App;
 