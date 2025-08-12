import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";

// Your original homepage code, unchanged
function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const handleSubmit = async () => {
    if (!url || url.trim() === "") {
      alert("Please enter a URL!");
      return;
    }
    const response = await fetch("https://hari-ly.onrender.com/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
    });
    const result = await response.text();
    setShortUrl(`https://harikeerth.xyz/projects/hari-ly/${result}`);
  };

  return (
    <div className="App">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1>URL Shortener</h1>

        <input
          type="url"
          placeholder="Enter your long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Shorten URL
        </button>

        <div style={{ marginTop: "20px" }}>
          {shortUrl && (
            <p>
              Shortened URL:{" "}
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </p>
          )}
        </div>
      </div>
      <br />
      <div>
        <div
          style={{
            marginTop: "200px",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
          }}
        >
          <h3>About This App</h3>
          <p>
            This website is developed as part of my project and learning at the
            same time, not for production, there for there is limit for the
            storage, so Iam restricting to max 3 link shortening per slot for an
            ip address (that is it works in slots: slot1: 12 AM to 6 AM, slot 2:
            6AM to 12 PM,slot 3: 12 PM to 6 PM ,slot 4: 6PM to 12 AM) Also
            Maximum of 10 shortening per ipaddress, after wards that ipaddress
            will be blocked permenantly, sorry but yeah &lt;3
          </p>
        </div>
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#e8f4f8",
            borderRadius: "10px",
          }}
        >
          <h3>Contact Me</h3>
          <p>Built by HARIKEERTH P V | Connect with me:</p>
          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://linkedin.com/in/harikeerth-p-v-79667b250/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com/harikeerth.pv"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a href="mailto:harikeerthpv2@gmail.com">harikeerthpv2@gmail.com</a>
            <a
              href="https://github.com/harikeerthpv07"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// This component will run when user visits /projects/hari-ly/:shortcode
function RedirectPage() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://hari-ly.onrender.com/${shortcode}`)
      .then((res) => res.text())
      .then((longUrl) => {
        if (longUrl && !longUrl.includes("Link not found")) {
          window.location.href = longUrl; // redirect browser
        } else {
          alert("Short link not found");
          navigate("/"); // go back home
        }
      })
      .catch(() => {
        alert("Error fetching link");
        navigate("/");
      });
  }, [shortcode, navigate]);

  return (
    <p style={{ textAlign: "center", marginTop: "50px" }}>Redirecting...</p>
  );
}

// Wrap everything in Router with basename so React knows base URL path
function App() {
  return (
    <Router basename="/projects/hari-ly">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path=":shortcode" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
