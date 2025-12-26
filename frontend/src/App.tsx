import { useState, useEffect } from "react";
import "./App.css";

// Import your components
import CopingExercises from "./CopingExercises";
import PetDashboard from './features/pet/pages/petDashboard';
import MoodCheckIn from './features/mood/components/MoodCheckIn';
import MoodChart from './features/mood/components/MoodChart';

const API_URL = "http://localhost:8080";
const USER_ID = "e9504d60-60e2-4f58-bf6e-bc13ca2adcc3";

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'pet' | 'analytics' | 'profile' | 'coping'>('pet');
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  // User Profile State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

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

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch(`${API_URL}/api/users/${USER_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, preferences }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error("Error saving profile", err);
      setStatus("error");
    }
  };

  // --- 1. HANDLE FOCUS MODE (FULL SCREEN IMMERSIVE) ---
  if (isFocusMode) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-[#b8e3ea]">
        {/* Use PetDashboard so logic and chat still work in focus mode */}
        <PetDashboard 
          onNavigateToCoping={() => {
            setIsFocusMode(false);
            setActiveTab('coping');
          }}
        />

        {/* Floating Back Button */}
        <button 
          onClick={() => setIsFocusMode(false)}
          className="fixed top-6 left-6 z-50 bg-white/90 text-[#5c4b43] px-6 py-3 rounded-full font-bold shadow-lg border-2 border-[#efeae6] hover:bg-white hover:scale-105 transition flex items-center gap-2"
        >
          <span>←</span> Back to Dashboard
        </button>
      </div>
    );
  }

  // --- 2. NORMAL DASHBOARD (FULL SCREEN LAYOUT) ---
  return (
    // Changed: Removed padding and centering. Now fills screen directly.
    <div className="w-screen h-screen overflow-hidden bg-white">
      
      {/* Changed: Removed max-width, shadows, and borders. Wrapper is now 100% size. */}
      <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-72 bg-[#fdfbf9] border-r-4 border-[#efeae6] flex flex-col p-6 gap-6 h-full z-20">
          
          {/* User Profile Snippet */}
          <div className="flex items-center gap-4 p-2">
            <div className="w-14 h-14 bg-[#e6a394] rounded-full flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
              {firstName ? firstName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="font-bold text-[#5c4b43] text-lg">
                {firstName ? firstName : "User"}
              </h2>
              <p className="text-xs text-[#a3b899] font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>

          <hr className="border-[#efeae6]" />

          {/* Nav Buttons */}
          <nav className="flex flex-col gap-3 flex-1">
            <NavButton 
              active={activeTab === 'pet'} 
              onClick={() => setActiveTab('pet')} 
              icon="🐾" 
              label="My Room" 
            />
            
            <button 
              onClick={() => setIsFocusMode(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-[#8c7e76] hover:bg-indigo-50 hover:text-indigo-600 group"
            >
              <span className="text-xl group-hover:scale-110 transition">🎓</span>
              Focus Room
            </button>

            <NavButton 
              active={activeTab === 'coping'} 
              onClick={() => setActiveTab('coping')} 
              icon="🌱" 
              label="Coping" 
            />
            <NavButton 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')} 
              icon="📊" 
              label="Mood Trends" 
            />
            <NavButton 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
              icon="👤" 
              label="Settings" 
            />
          </nav>

          {/* Check In Button */}
          <div className="mt-auto">
             <MoodCheckIn />
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 bg-[#fff] overflow-y-auto h-full custom-scrollbar relative">
           {/* Decorative Top Blur */}
           <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>

           <div className="p-2 md:p-8 h-full flex flex-col">
            
            {activeTab === 'coping' && (
               <div className="max-w-4xl mx-auto pt-8">
                 <h2 className="text-3xl font-extrabold text-[#5c4b43] mb-6">Breathing & Grounding</h2>
                 <CopingExercises />
               </div>
            )}

            {activeTab === 'analytics' && (
              <div className="max-w-4xl mx-auto pt-8">
                <div className="bg-[#fdfbf9] p-8 rounded-[2rem] border-4 border-[#efeae6]">
                  <h2 className="text-2xl font-bold text-[#5c4b43] mb-2">Emotional Trends</h2>
                  <p className="text-[#8c7e76] mb-8">How you've been feeling lately.</p>
                  <MoodChart />
                </div>
              </div>
            )}
            
            {/* PET DASHBOARD TAB */}
            {activeTab === 'pet' && (
               <div className="h-full w-full"> 
                  <PetDashboard 
                    onNavigateToCoping={() => setActiveTab('coping')} 
                  />
               </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto pt-8">
                <div className="bg-[#fdfbf9] p-8 rounded-[2rem] border-4 border-[#efeae6]">
                  <h2 className="text-2xl font-bold text-[#5c4b43] mb-6">Profile Settings</h2>
                  <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                          <InputField label="First Name" value={firstName} onChange={setFirstName} />
                          <InputField label="Last Name" value={lastName} onChange={setLastName} />
                      </div>
                      <InputField label="Email" value={email} onChange={setEmail} />
                      
                      <div className="flex flex-col gap-2">
                          <label className="text-sm font-bold text-[#5c4b43] ml-2">Preferences</label>
                          <textarea 
                              className="p-4 rounded-2xl bg-white border-2 border-[#efeae6] focus:border-[#e6a394] focus:outline-none transition min-h-[120px] resize-none text-[#5c4b43]"
                              value={preferences} 
                              onChange={(e) => setPreferences(e.target.value)} 
                          />
                      </div>

                      <div className="pt-4 flex items-center gap-4">
                          <button 
                              onClick={handleSave} 
                              disabled={status === 'saving'}
                              className="bg-[#5c4b43] text-white px-8 py-3 rounded-full font-bold hover:bg-[#4a3b36] transition shadow-lg disabled:opacity-50"
                          >
                              {status === 'saving' ? 'Saving...' : 'Save Changes'}
                          </button>
                          {status === 'saved' && <span className="text-[#a3b899] font-bold">Saved!</span>}
                      </div>
                  </div>
                </div>
              </div>
            )}
           </div>
        </main>
      </div>
    </div>
  );
}

// Helper Components
interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const NavButton = ({ active, onClick, icon, label }: NavButtonProps) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-bold ${
      active 
        ? 'bg-[#e6a394] text-white shadow-md' 
        : 'text-[#8c7e76] hover:bg-[#f3f4f6]'
    }`}
  >
    <span className="text-xl">{icon}</span>
    {label}
  </button>
);

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField = ({ label, value, onChange }: InputFieldProps) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-[#5c4b43] ml-2">{label}</label>
      <input 
        className="p-3 px-4 rounded-xl bg-white border-2 border-[#efeae6] focus:border-[#e6a394] focus:outline-none transition text-[#5c4b43]"
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
);

export default App;