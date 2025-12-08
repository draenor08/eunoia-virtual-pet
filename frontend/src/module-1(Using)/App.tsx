import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080";
const USER_ID = 1; // change this to the id you saw in Postman

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState("");
  const [password, setPassword] = useState("");  // change_password field
  const [progress, setProgress] = useState("");  // progress field
  const [updates, setUpdates] = useState("");    // updates field
  const [status, setStatus] =
    useState<"idle" | "saving" | "saved" | "error">("idle");

  // Load existing user data when page opens
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${USER_ID}`);
        if (!res.ok) {
          console.warn("User not found or error loading user");
          return;
        }
        const data = await res.json();
        setFirstName(data.firstName ?? "");
        setLastName(data.lastName ?? "");
        setEmail(data.email ?? "");
        setPreferences(data.preferences ?? "");
        setProgress(data.progress ?? "");
        setUpdates(data.updates ?? "");
        // do not auto-fill password for security
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch(`${API_URL}/api/users/${USER_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber: null,
          password: password || "secret123", // use new password if provided
          preferences,
          progress,
          updates,
        }),
      });

      if (!res.ok) {
        console.error("Failed to save profile", await res.text());
        setStatus("error");
        return;
      }

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      console.error("Error saving profile", err);
      setStatus("error");
    }
  };

  return (
    <div className="app-shell">
      {/* Left: avatar + basic info */}
      <aside className="profile-sidebar">
        <div>
          <div className="profile-avatar">
            {firstName ? firstName.charAt(0).toUpperCase() : "U"}
          </div>
          <button type="button" className="change-photo-btn">
            Change photo
          </button>
        </div>

        <div>
          <h1 className="profile-title">Profile</h1>
          <p className="profile-subtitle">
            Edit your personal details, security and mental health preferences.
          </p>
        </div>
      </aside>

      {/* Right: main form */}
      <section className="profile-content">
        <div>
          <div className="section-label">Basic info</div>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
              />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Your last name"
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="section-label">Security</div>
          <div className="field">
            <label htmlFor="password">Change password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a new password"
            />
          </div>
        </div>

        <div>
          <div className="section-label">Preferences</div>
          <div className="field">
            <label htmlFor="preferences">Mental health preferences</label>
            <textarea
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Tell us what type of support, content or communication style works best for you."
            />
          </div>
        </div>

        <div>
          <div className="section-label">Your journey</div>
          <div className="two-column">
            <div className="field">
              <label htmlFor="progress">Progress</label>
              <textarea
                id="progress"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                placeholder="Track milestones, reflections or recent check-ins."
              />
            </div>
            <div className="field">
              <label htmlFor="updates">Updates</label>
              <textarea
                id="updates"
                value={updates}
                onChange={(e) => setUpdates(e.target.value)}
                placeholder="Notes from your coach, therapist or app."
              />
            </div>
          </div>
        </div>

        <footer className="profile-footer">
          <div className="status-text-wrapper">
            {status === "saved" && (
              <span className="status-text saved">Changes saved.</span>
            )}
            {status === "error" && (
              <span className="status-text error">
                Could not save. Please try again.
              </span>
            )}
            {status === "saving" && (
              <span className="status-text">Saving…</span>
            )}
          </div>

          <button
            type="button"
            className="primary-btn"
            onClick={handleSave}
            disabled={status === "saving"}
          >
            <span className="icon">✓</span>
            <span>{status === "saving" ? "Saving…" : "Save changes"}</span>
          </button>
        </footer>
      </section>
    </div>
  );
}

export default App;
