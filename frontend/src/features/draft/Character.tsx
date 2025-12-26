import { type CharacterAction, type Direction } from './types';

type Props = {
  action: CharacterAction;
  direction: Direction;
};

export const CharacterModel = ({ action, direction }: Props) => {
  const isWalking = action === 'walking';
  const isSleeping = action === 'sleeping';
  const isSitting = action === 'sitting';
  const isDrinking = action === 'drinking';
  
  // Direction Flip Logic
  const isFlipped = direction === 'left' || direction === 'up';

  // --- EYES LOGIC ---
  const getEyeStyle = () => {
    switch(action) {
      // ACTIONS
      case 'drinking': return 'h-1 w-2 rounded-t-lg mt-1 bg-black/70'; // Content/closed
      case 'sleeping': return 'h-[1px] w-2 bg-black/60 translate-y-1'; // Closed flat
      
      // EMOTIONS
      case 'happy': return 'h-2 w-2 rounded-full -mt-1'; // Raised high
      case 'joyous': return 'h-2 w-2 rounded-full -mt-2 scale-110'; // Wide open high
      case 'sad': return 'h-1.5 w-2 rounded-t-full mt-1 rotate-12 bg-black/80'; // Slanted down
      case 'crying': return 'h-1 w-2 rounded-t-full mt-1 bg-blue-900/80'; // Squinting wet
      case 'anxious': return 'h-1.5 w-1.5 rounded-full border border-black bg-white'; // Tiny pupils
      case 'worried': return 'h-2 w-2 rounded-full bg-black/80 -translate-y-0.5'; // Uneven (handled in container)
      
      default: return 'h-2 w-2 rounded-full bg-black';
    }
  };

  // --- MOUTH LOGIC ---
  const getMouthStyle = () => {
    switch(action) {
      case 'drinking': return 'opacity-0'; // Hidden by cup
      case 'sleeping': return 'w-2 h-1 bg-black/20 rounded-full'; // Relaxed open
      
      case 'happy': return 'w-3 h-1.5 border-b-2 border-black/80 rounded-b-full'; // Smile
      case 'joyous': return 'w-3 h-3 bg-[#5c4033] border-2 border-white rounded-full'; // Big open mouth
      case 'sad': 
      case 'crying': return 'w-3 h-1.5 border-t-2 border-black/80 rounded-t-full mt-1'; // Frown
      case 'anxious': return 'w-3 h-1 bg-black/80 rounded-full animate-pulse'; // Quivering
      case 'worried': return 'w-2 h-1 bg-black/80 rounded-full skew-x-12'; // Crooked
      
      default: return 'w-2 h-1 bg-black/80 rounded-full';
    }
  };

  return (
    <div 
      className={`relative w-16 h-24 transition-all duration-300
        ${isSleeping ? 'rotate-90 origin-bottom translate-y-4' : ''}
        ${action === 'joyous' ? 'animate-bounce' : ''}
        ${action === 'anxious' ? 'animate-[shake_0.2s_ease-in-out_infinite]' : ''}
      `}
      style={{ transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)' }} 
    >
      
      {/* --- PARTICLES LAYER (Effects) --- */}
      {isSleeping && <div className="absolute -top-8 -right-4 text-xl font-bold text-blue-500 animate-pulse z-50">Zzz</div>}
      
      {action === 'anxious' && (
        <div className="absolute -top-4 -left-2 text-2xl text-blue-600 font-bold animate-ping">!</div>
      )}

      {/* --- LEGS --- */}
      <div className={`absolute bottom-0 left-3 w-3 h-8 bg-blue-800 rounded-b-md border border-blue-900 origin-top transition-transform duration-200
        ${isWalking ? 'animate-[walkLeft_0.6s_infinite_ease-in-out]' : ''}
        ${isSitting ? 'rotate-90 -translate-y-2' : ''}
      `} />
      <div className={`absolute bottom-0 right-3 w-3 h-8 bg-blue-800 rounded-b-md border border-blue-900 origin-top transition-transform duration-200
        ${isWalking ? 'animate-[walkRight_0.6s_infinite_ease-in-out]' : ''}
        ${isSitting ? 'rotate-90 -translate-y-2' : ''}
      `} />

      {/* --- TORSO --- */}
      <div className="absolute top-8 left-1 w-14 h-12 bg-orange-600 rounded-lg border-2 border-orange-800 z-10 flex items-center justify-center shadow-lg">
        <div className="w-8 h-full bg-orange-500/30" />
      </div>

      {/* --- ARMS --- */}
      {/* Left Arm */}
      <div className={`absolute top-9 -left-2 w-3 h-10 bg-orange-700 rounded-full origin-top z-20 transition-all duration-300
        ${action === 'joyous' ? '-rotate-[135deg]' : ''}
        ${isWalking ? 'animate-[swingArmReverse_0.6s_infinite_ease-in-out]' : 'rotate-12'}
      `} />

      {/* Right Arm (Dynamic) */}
      <div className={`absolute top-9 -right-2 w-3 h-10 bg-orange-700 rounded-full origin-top transition-all duration-500
        ${isDrinking ? 'z-40 -rotate-[130deg] translate-x-1' : 'z-20'}
        ${action === 'joyous' ? 'rotate-[135deg]' : ''}
        ${isWalking ? 'animate-[swingArm_0.6s_infinite_ease-in-out]' : '-rotate-12'}
      `}>
        {isDrinking && (
          <div className="absolute bottom-0 -left-1">
             <div className="w-4 h-5 bg-white border border-gray-300 rounded-sm relative">
                <div className="absolute top-1 -right-1.5 w-1.5 h-3 border-2 border-white rounded-r-md" />
                <div className="absolute top-0 inset-x-0 h-1 bg-[#3E2723]" />
             </div>
             <div className="absolute -top-4 left-0 w-1 h-1 bg-white/60 rounded-full animate-[steam_1.5s_infinite]" />
             <div className="absolute -top-6 left-2 w-1 h-1 bg-white/40 rounded-full animate-[steam_1.5s_infinite_0.5s]" />
          </div>
        )}
      </div>

      {/* --- HEAD --- */}
      <div className={`absolute top-0 left-1 w-14 h-14 bg-[#f3d0b1] rounded-xl border-2 border-[#dcb38e] z-30 flex flex-col items-center justify-center
         ${action === 'sad' || action === 'crying' ? 'translate-y-1' : ''}
      `}>
        {/* Hair */}
        <div className="absolute -top-2 w-16 h-6 bg-[#5c4033] rounded-t-xl" />

        {/* Tears (Only visible if crying) */}
        {action === 'crying' && (
          <>
            <div className="absolute top-7 left-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-[drop_1s_infinite]" />
            <div className="absolute top-7 right-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-[drop_1s_infinite_0.5s]" />
          </>
        )}

        {/* Face Features */}
        <div className="flex flex-col items-center mt-2 space-y-1">
          <div className="flex gap-3">
             <div className={`${getEyeStyle()} ${action === 'worried' ? '-rotate-12' : ''}`} />
             <div className={`${getEyeStyle()} ${action === 'worried' ? 'rotate-12' : ''}`} />
          </div>
          <div className={getMouthStyle()} />
        </div>
      </div>

      {/* --- CSS ANIMATIONS --- */}
      <style>{`
        @keyframes steam {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-10px) scale(2); opacity: 0; }
        }
        @keyframes drop {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        @keyframes walkLeft { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(20deg); } }
        @keyframes walkRight { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-20deg); } }
        @keyframes swingArm { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
        @keyframes swingArmReverse { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
      `}</style>
    </div>
  );
};