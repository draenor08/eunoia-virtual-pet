import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import PetAvatar from './petAvatar'; 

interface PetInteractionProps {
  forcedMood?: string; 
  currentAnimation?: string; 
  onManualTrigger?: Dispatch<SetStateAction<string>>;
}

export default function PetInteraction({ 
  forcedMood, 
  currentAnimation, 
  onManualTrigger 
}: PetInteractionProps) {
  
  const [localAnimation, setLocalAnimation] = useState('idle');
  const activeAnimation = currentAnimation ?? localAnimation;

  const triggerAnimation = (animationName: string) => {
    // 1. Update state (Parent or Local)
    if (onManualTrigger) {
      onManualTrigger(animationName);
    } else {
      setLocalAnimation(animationName);
    }

    // 2. Reset logic: "idle" is the baseline, don't reset if we are already there.
    //    Also, 'breathIN-OUT' might be a loop, so maybe don't auto-reset that one? 
    //    For now, we reset "actions" like wave or reactions after 5s.
    if (animationName !== 'idle' && animationName !== 'breathIN-OUT') {
      setTimeout(() => {
        if (onManualTrigger) onManualTrigger('idle');
        else setLocalAnimation('idle');
      }, 5000);
    }
  };

  useEffect(() => {
    if (!forcedMood) return;

    // UPDATED: Using exact names from your console log
    switch (forcedMood) {
      case 'HAPPY':
      case 'EXCITED':
        triggerAnimation('happy'); // Was 'anim_happy'
        break;
      case 'SAD':
      case 'ANXIOUS':
        triggerAnimation('sad');   // Was 'anim_sad'
        break;
      case 'ANGRY':
        triggerAnimation('angry');
        break;
      case 'NEUTRAL':
      default:
        triggerAnimation('idle');  // Was 'anim_idle'
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forcedMood]); 

  return (
    <div className="w-full h-full flex flex-col items-center justify-between">
      <div className="flex-1 flex items-center justify-center w-full min-h-[300px]">
        <PetAvatar animation={activeAnimation} />
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 mt-6 w-full max-w-lg">
        {/* UPDATED: Using exact names from your console log */}
        <button 
          onClick={() => triggerAnimation('breathIN-OUT')} 
          className="bg-[#dbe7e4] text-[#2f3e46] px-5 py-3 rounded-full font-bold text-sm hover:bg-[#cadbd7] transition"
        >
          💨 Breathe
        </button>
        
        <button 
          onClick={() => triggerAnimation('wave')} 
          className="bg-[#dbe7e4] text-[#2f3e46] px-5 py-3 rounded-full font-bold text-sm hover:bg-[#cadbd7] transition"
        >
          👋 Wave
        </button>
      </div>
    </div>
  );
}