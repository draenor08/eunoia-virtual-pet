import { useState } from 'react';
import PetInteraction from '../components/petInteraction'; // Ensure correct path
import PetChat from '../components/petChat';               // Ensure correct path

export default function PetDashboard() {
  // Shared state: "What is the pet doing right now?"
  const [currentAnim, setCurrentAnim] = useState('idle');

  return (
    <div className="min-h-screen bg-[#f8f5f2] p-6 font-sans text-[#4a403a]">
      <header className="mb-8 text-center pt-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#5c4b43] mb-2">
          Eunoia <span className="text-[#e6a394]">Companion</span>
        </h1>
        <p className="text-[#8c7e76] font-medium">Your cozy safe space</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Pet Area */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-4 border-[#efeae6] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#fff5f0] rounded-full blur-3xl -z-0"></div>
            
            <div className="relative z-10 min-h-[400px] flex items-center justify-center">
               {/* 1. Pass state down to the visuals */}
               <PetInteraction 
                 currentAnimation={currentAnim} 
                 onManualTrigger={setCurrentAnim} // Allow buttons to update state
               />
            </div>
          </div>
        </div>

        {/* RIGHT: Chat Area */}
        <div className="lg:col-span-5 h-full">
            <div className="bg-white rounded-[2rem] shadow-lg border-4 border-[#efeae6] h-full min-h-[600px] overflow-hidden">
                {/* 2. Chat updates the state when AI responds */}
                <PetChat 
                  onAnimationTrigger={(anim) => setCurrentAnim(anim)} 
                />
            </div>
        </div>

      </div>
    </div>
  );
}