import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";

// Your original homepage code
function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async () => {
    if (!url || url.trim() === "") {
      alert("Please enter a URL!");
      return;
    }
    try {
      const response = await fetch("https://hari-ly.onrender.com/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url }),
      });
      const result = await response.text();

      if (result.startsWith("http")) {
        // Success - backend returns the full frontend URL
        setShortUrl(result);
      } else {
        // Error message from backend
        setShortUrl("");
        alert(result);
      }
    } catch (error) {
      alert("Failed to shorten URL");
      console.error(error);
    }
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

// FIXED: This component handles redirects when someone visits /shortcode
function RedirectPage() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the long URL from your backend API
    fetch(`https://hari-ly.onrender.com/${shortcode}`)
      .then((response) => {
        // Check if the response is a redirect (status 3xx)
        if (response.redirected) {
          // Backend sent a redirect, use the redirected URL
          window.location.href = response.url;
        } else {
          // Not a redirect, check the response text
          return response.text().then((text) => {
            if (text.includes("Link not found")) {
              alert("Short link not found");
              navigate("/");
            } else {
              // If it's a URL, redirect to it
              if (text.startsWith("http")) {
                window.location.href = text;
              } else {
                alert("Invalid response from server");
                navigate("/");
              }
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching link:", error);
        alert("Error fetching link");
        navigate("/");
      });
  }, [shortcode, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <p>Redirecting...</p>
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto",
          }}
        ></div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:shortcode" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
