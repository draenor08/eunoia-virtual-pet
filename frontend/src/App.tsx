import { useState, useEffect } from "react";
import "./App.css";
import { USER_ID, API_URL } from './config';

// Import your components
import CopingExercises from "./CopingExercises";
import PetDashboard from './features/pet/pages/petDashboard';
import MoodCheckIn from './features/mood/components/MoodCheckIn';
import MoodChart from './features/mood/components/MoodChart';


function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'pet' | 'analytics' | 'profile' | 'coping'>('pet');
  const [showCheckIn, setShowCheckIn] = useState(false); // New state for Mood Modal

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

  // --- THE NEW FULL SCREEN LAYOUT ---
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#b8e3ea] font-sans">
      
      {/* 1. GLOBAL HUD NAVIGATION (TOP RIGHT) */}
      <div className="absolute top-6 right-6 z-50 flex flex-col gap-4 items-end">
        
        {/* Navigation Group */}
        <div className="flex flex-col gap-3 bg-white/30 backdrop-blur-md p-3 rounded-full border border-white/40 shadow-xl">
            <HudButton 
                active={activeTab === 'pet'} 
                onClick={() => setActiveTab('pet')} 
                icon="🐾" 
                label="My Room" 
            />
            <HudButton 
                active={activeTab === 'coping'} 
                onClick={() => setActiveTab('coping')} 
                icon="🌱" 
                label="Coping" 
            />
            <HudButton 
                active={activeTab === 'analytics'} 
                onClick={() => setActiveTab('analytics')} 
                icon="📊" 
                label="Mood Trends" 
            />
            <HudButton 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')} 
                icon="👤" 
                label="Profile" 
            />
        </div>

        {/* Check-In Action Button */}
        <button 
            onClick={() => setShowCheckIn(!showCheckIn)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition border-2 border-white/50"
            title="Daily Check-In"
        >
            ✨
        </button>
      </div>

      {/* 2. MOOD CHECK-IN MODAL (OVERLAY) */}
      {showCheckIn && (
          <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative max-w-md w-full">
                  <button 
                    onClick={() => setShowCheckIn(false)}
                    className="absolute -top-4 -right-4 bg-white text-gray-800 w-10 h-10 rounded-full font-bold shadow-lg hover:bg-gray-100 z-50"
                  >
                      ✕
                  </button>
                  <MoodCheckIn />
              </div>
          </div>
      )}

      {/* 3. MAIN CONTENT AREA */}
      <main className="w-full h-full relative">
        
        {/* --- TAB: PET ROOM (Default) --- */}
        {activeTab === 'pet' && (
           <PetDashboard 
             onNavigateToCoping={() => setActiveTab('coping')} 
           />
        )}

        {/* --- TAB: COPING EXERCISES --- */}
        {activeTab === 'coping' && (
           <div className="w-full h-full overflow-y-auto custom-scrollbar p-8 pt-12">
             <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-lg rounded-[3rem] p-8 shadow-2xl border-4 border-white">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#5c4b43]">Breathing & Grounding</h2>
                        <p className="text-[#8c7e76]">Take a moment for yourself.</p>
                    </div>
                    <span className="text-4xl">🌱</span>
                </div>
                <CopingExercises />
             </div>
           </div>
        )}

        {/* --- TAB: ANALYTICS --- */}
        {activeTab === 'analytics' && (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-8 pt-12 flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white/90 backdrop-blur-lg rounded-[3rem] p-10 shadow-2xl border-4 border-white">
              <h2 className="text-3xl font-extrabold text-[#5c4b43] mb-2">Emotional Trends</h2>
              <p className="text-[#8c7e76] mb-8">Visualizing your journey over time.</p>
              <div className="bg-[#fdfbf9] p-6 rounded-[2rem] border-4 border-[#efeae6]">
                 <MoodChart />
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: PROFILE --- */}
        {activeTab === 'profile' && (
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-8 pt-12 flex items-center justify-center">
            <div className="max-w-3xl w-full bg-white/90 backdrop-blur-lg rounded-[3rem] p-10 shadow-2xl border-4 border-white">
               
               {/* Header */}
               <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#efeae6]">
                    <div className="w-24 h-24 bg-[#e6a394] rounded-full flex items-center justify-center text-white font-extrabold text-4xl shadow-inner border-4 border-white">
                        {firstName ? firstName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#5c4b43]">Profile Settings</h2>
                        <p className="text-[#8c7e76]">Manage your account details</p>
                    </div>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          placeholder="How can we help you better?"
                      />
                  </div>

                  <div className="pt-6 flex items-center gap-4">
                      <button 
                          onClick={handleSave} 
                          disabled={status === 'saving'}
                          className="bg-[#5c4b43] text-white px-10 py-4 rounded-full font-bold hover:bg-[#4a3b36] transition shadow-lg disabled:opacity-50 text-lg"
                      >
                          {status === 'saving' ? 'Saving...' : 'Save Changes'}
                      </button>
                      {status === 'saved' && <span className="text-[#a3b899] font-bold text-lg animate-pulse">✓ Saved!</span>}
                  </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

interface HudButtonProps {
    active: boolean;
    onClick: () => void;
    icon: string;
    label: string;
}

const HudButton = ({ active, onClick, icon, label }: HudButtonProps) => (
    <button 
      onClick={onClick}
      className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-sm
        ${active 
            ? 'bg-[#5c4b43] text-white scale-110 shadow-md' 
            : 'bg-white text-[#8c7e76] hover:bg-[#f0ebe8]'
        }
      `}
    >
        <span className="text-xl">{icon}</span>
        
        {/* Tooltip on Hover */}
        <span className="absolute right-full mr-3 bg-black/75 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
            {label}
        </span>
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
        className="p-4 rounded-2xl bg-white border-2 border-[#efeae6] focus:border-[#e6a394] focus:outline-none transition text-[#5c4b43] w-full shadow-sm"
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
);

export default App;