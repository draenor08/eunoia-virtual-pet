import { useState } from 'react';
import PetAvatar from './PetAvatar'; // Make sure import path is correct

export default function PetInteraction() {
  const [currentAnimation, setCurrentAnimation] = useState('idle');

  // These now just set the animation name, PetAvatar will handle playing it
  const triggerAnimation = (animationName: string) => {
    setCurrentAnimation(animationName);
    // Optional: Reset to idle after 3 seconds
    setTimeout(() => setCurrentAnimation('idle'), 5000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl">
      {/* Pass animation name to PetAvatar */}
      <PetAvatar animation={currentAnimation} />
      
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button 
          onClick={() => triggerAnimation('breathIN-OUT')} 
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          💨 Breathing Exercise
        </button>
        <button 
          onClick={() => triggerAnimation('wave')}  // Changed from 'water'
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          💧 wave animation
        </button>
        <button 
          onClick={() => triggerAnimation('happy')} 
          className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition"
        >
          😄 Happy Reaction
        </button>
        <button 
          onClick={() => triggerAnimation('sad')} 
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
        >
          😢 Sad Reaction
        </button>
      </div>
    </div>
  );
}