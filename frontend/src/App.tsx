import { useState, useEffect } from "react";
import "./App.css";

// Import your components
import CopingExercises from "./CopingExercises";
import PetInteraction from './features/pet/components/PetInteraction';
import PetChat from './features/pet/components/PetChat';
import MoodCheckIn from './features/mood/components/MoodCheckIn';
import MoodChart from './features/mood/components/MoodChart';

const API_URL = "http://localhost:8080";
const USER_ID = 1; // Assuming a single user for the demo

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'pet' | 'analytics' | 'profile' | 'coping'>('pet');


  // User Profile State (Restored from teammate's code)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Load existing user data when page opens
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${USER_ID}`);
        if (res.ok) {
          const data = await res.json();
          setFirstName(data.firstName ?? "");
          setLastName(data.lastName ?? "");
          setEmail(data.email ?? "");
          setPreferences(data.preferences ?? "");
        }
      } catch (err) {
        console.warn("Could not load user profile. Is the backend running?");
      }
    };
    fetchUser();
  }, []);

  // Save changes to backend
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
          preferences,
          // Add other fields if your backend requires them
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error("Error saving profile", err);
      setStatus("error");
    }
  };

  return (
    <div className="app-shell max-w-[1200px] mx-auto p-8 flex gap-8">
      {/* SIDEBAR */}
      <aside className="w-64 flex flex-col gap-6 border-r pr-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {firstName ? firstName.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="font-bold text-gray-800">
                {firstName ? firstName : "User"}
            </h2>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab('pet')} className={`text-left p-3 rounded-xl transition ${activeTab === 'pet' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
            🐾 My Pet
          </button>
          <button
            onClick={() => setActiveTab('coping')}
              className={`text-left p-3 rounded-xl transition ${
                activeTab === 'coping' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
          🌱 Coping Exercises
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`text-left p-3 rounded-xl transition ${activeTab === 'analytics' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
            📊 Mood Analytics
          </button>
          <button onClick={() => setActiveTab('profile')} className={`text-left p-3 rounded-xl transition ${activeTab === 'profile' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
            👤 Profile Settings
          </button>
        </nav>

        {/* The Magic Button lives here for easy access */}
        <MoodCheckIn />
      </aside>

      {/* MAIN CONTENT Area */}
      <main className="flex-1">
        
        {/* TAB 1: PET */}
        {activeTab === 'pet' && (
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4">Companion</h3>
              <PetInteraction />
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4">Chat</h3>
              <PetChat />
            </div>
          </div>
        )}

        {/* TAB 2: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Emotional Trends</h2>
            <p className="text-gray-500 mb-8">Real-time analysis based on your chat history.</p>
            <MoodChart />
          </div>
        )}
        {/* TAB 3: COPING EXERCISES */}
          {activeTab === 'coping' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Coping Exercises</h2>
                <p className="text-gray-500 mb-6">
                  Guided exercises to help you manage stress and improve your well-being.
                </p>
                 <CopingExercises />
          </div>
          )}


        {/* TAB 3: PROFILE (RESTORED) */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
            
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-600">First Name</label>
                        <input 
                            className="p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            placeholder="Your name"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-600">Last Name</label>
                        <input 
                            className="p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            placeholder="Your last name"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Email</label>
                    <input 
                        className="p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="name@example.com"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-600">Mental Health Preferences</label>
                    <textarea 
                        className="p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 transition min-h-[100px]"
                        value={preferences} 
                        onChange={(e) => setPreferences(e.target.value)} 
                        placeholder="Tell us what support works best for you..."
                    />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                    <button 
                        onClick={handleSave} 
                        disabled={status === 'saving'}
                        className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition disabled:opacity-50"
                    >
                        {status === 'saving' ? 'Saving...' : 'Save Changes'}
                    </button>
                    
                    {status === 'saved' && <span className="text-green-600 font-medium">Changes saved successfully!</span>}
                    {status === 'error' && <span className="text-red-500 font-medium">Failed to save. Check backend.</span>}
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
