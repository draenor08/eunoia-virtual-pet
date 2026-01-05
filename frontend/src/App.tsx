import { useState, useEffect } from "react";
import "./App.css";
import { USER_ID, API_URL } from './config';

// Import your components
import CopingExercises from "./CopingExercises";
import PetDashboard from './features/pet/pages/petDashboard';
import MoodCheckIn from './features/mood/components/MoodCheckIn';
import MoodChart from './features/mood/components/MoodChart';
import MentalHealthProfile from "./MentalHealthProfile";
import Login from "./Login";
import Register from "./Register";


function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'pet' | 'analytics' | 'profile' | 'coping'>('pet');
  const [showCheckIn, setShowCheckIn] = useState(false); // New state for Mood Modal

  // Exercise Filter State (from AI)
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [exerciseCategory, setExerciseCategory] = useState("all");

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);

  // Check if session exists (simplified for now)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setActiveUser(parsed);
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    setIsLoggedIn(true);
    setActiveUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveUser(null);
    localStorage.removeItem("user");
    setActiveTab('pet'); // Reset tab
  };

  // Navigate to coping with optional filters
  const handleNavigateToCoping = (query: string = "", category: string = "all") => {
    setExerciseQuery(query);
    setExerciseCategory(category);
    setActiveTab('coping');
  };

  // State for toggling between Login and Register
  const [showRegister, setShowRegister] = useState(false);

  // --- LOGIN / REGISTER SCREEN ---
  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={handleLoginSuccess}
          onGoToLogin={() => setShowRegister(false)}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => setShowRegister(true)}
      />
    );
  }

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
            onClick={() => handleNavigateToCoping()} // Simple nav
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

        {/* Logout Button (Small) */}
        <button
          onClick={handleLogout}
          className="bg-white/50 hover:bg-red-100 text-red-500 w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-xs font-bold border border-white/50"
          title="Logout"
        >
          🚪
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
            userId={activeUser?.id}
            onNavigateToCoping={handleNavigateToCoping}
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
              <CopingExercises
                userId={activeUser?.id}
                initialQuery={exerciseQuery}
                initialCategory={exerciseCategory}
              />
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
          <div className="w-full h-full overflow-y-auto custom-scrollbar p-8 pt-12">
            <MentalHealthProfile userId={activeUser?.id} onLogout={handleLogout} />
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

export default App;
