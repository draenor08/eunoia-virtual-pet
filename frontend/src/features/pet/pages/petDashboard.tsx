import PetInteraction from '../components/PetInteraction';
import PetChat from '../components/PetChat';

export default function PetDashboard() {
  return (
    // 1. Changed background to a warm, cozy cream color
    <div className="min-h-screen bg-[#f8f5f2] p-6 font-sans text-[#4a403a]">
      
      {/* Header Section */}
      <header className="mb-8 text-center pt-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#5c4b43] mb-2">
          Eunoia <span className="text-[#e6a394]">Companion</span>
        </h1>
        <p className="text-[#8c7e76] font-medium">Your cozy safe space</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: The "Room" (Pet & Stats) - Takes up more space now (7/12 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Pet Container - Styled to look like a frame/room */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-[#efeae6] relative overflow-hidden">
            {/* Decorative background circle for the pet */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#fff5f0] rounded-full blur-3xl -z-0"></div>
            
            <div className="relative z-10 min-h-[400px] flex items-center justify-center">
               <PetInteraction />
            </div>
          </div>

          {/* Stats HUD - Styled like game status bars */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#efeae6]">
            <h3 className="text-lg font-bold text-[#5c4b43] mb-4 flex items-center gap-2">
              <span>✨</span> Wellness Status
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Mood Pill */}
              <div className="bg-[#fff0ed] p-4 rounded-2xl flex flex-col items-center justify-center border border-[#ffe0db] transition-transform hover:scale-[1.02]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#e08d79] mb-1">Current Mood</p>
                <p className="text-2xl font-black text-[#d67c66]">😊 Good</p>
              </div>

              {/* Hydration Pill */}
              <div className="bg-[#f0f9ff] p-4 rounded-2xl flex flex-col items-center justify-center border border-[#e0f2fe] transition-transform hover:scale-[1.02]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#7dd3fc] mb-1">Hydration</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-black text-[#38bdf8]">3</p>
                    <p className="text-sm font-bold text-[#7dd3fc]">/ 8 cups</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The "Journal" (Chat) - Takes up less space (5/12 cols) */}
        <div className="lg:col-span-5 h-full">
            <div className="bg-white rounded-[2rem] shadow-lg border-4 border-[#efeae6] h-full min-h-[600px] overflow-hidden">
                {/* We wrap the chat to ensure it fits the rounded theme */}
                <PetChat />
            </div>
        </div>

      </div>
    </div>
  );
}