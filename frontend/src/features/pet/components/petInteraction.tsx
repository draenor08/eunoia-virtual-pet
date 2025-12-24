import { useState } from 'react';
import PetAvatar from './PetAvatar';

export default function PetInteraction() {
  const [currentAnimation, setCurrentAnimation] = useState('idle');

  const triggerAnimation = (animationName: string) => {
    setCurrentAnimation(animationName);
    // Optional: Reset to idle after 5 seconds
    setTimeout(() => setCurrentAnimation('idle'), 5000);
  };

  return (
    // Wrapper is transparent now, filling the "Room" container
    <div className="w-full h-full flex flex-col items-center justify-between">
      
      {/* Avatar Container - Flexible height to fill the center space */}
      <div className="flex-1 flex items-center justify-center w-full min-h-[300px]">
        {/* Pass animation name to PetAvatar */}
        <PetAvatar animation={currentAnimation} />
      </div>
      
      {/* Interaction "Toys" - Styled as soft, clickable 3D pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-6 w-full max-w-lg">
        <button 
          onClick={() => triggerAnimation('breathIN-OUT')} 
          className="bg-[#dbe7e4] text-[#2f3e46] px-5 py-3 rounded-full font-bold text-sm shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-[#cadbd7] flex items-center gap-2"
        >
          💨 Breathe
        </button>
        
        <button 
          onClick={() => triggerAnimation('wave')} 
          className="bg-[#e0f2fe] text-[#0369a1] px-5 py-3 rounded-full font-bold text-sm shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-[#bae6fd] flex items-center gap-2"
        >
          👋 Wave
        </button>
        
        <button 
          onClick={() => triggerAnimation('happy')} 
          className="bg-[#fef9c3] text-[#a16207] px-5 py-3 rounded-full font-bold text-sm shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-[#fde047] flex items-center gap-2"
        >
          😄 Praise
        </button>
        
        <button 
          onClick={() => triggerAnimation('sad')} 
          className="bg-[#f4f4f5] text-[#52525b] px-5 py-3 rounded-full font-bold text-sm shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-[4px] transition-all hover:bg-[#e4e4e7] flex items-center gap-2"
        >
          😢 Comfort
        </button>
      </div>
    </div>
  );
}