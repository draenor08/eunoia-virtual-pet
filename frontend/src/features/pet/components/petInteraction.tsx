import { useState } from 'react';
import PetAvatar from './petAvatar';

export default function PetInteraction() {
  const [emotion, setEmotion] = useState<'idle' | 'happy' | 'sad'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const triggerAnimation = (type: 'breathing' | 'water' | 'happy' | 'sad') => {
    if (type === 'happy') setEmotion('happy');
    if (type === 'sad') setEmotion('sad');
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000); // Speak for 2 seconds
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl">
      <PetAvatar emotion={emotion} isSpeaking={isSpeaking} />
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button onClick={() => triggerAnimation('breathing')} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
          💨 Breathing Exercise
        </button>
        <button onClick={() => triggerAnimation('water')} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
          💧 Water Reminder
        </button>
        <button onClick={() => triggerAnimation('happy')} className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition">
          😄 Happy Reaction
        </button>
        <button onClick={() => triggerAnimation('sad')} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition">
          😢 Sad Reaction
        </button>
      </div>
    </div>
  );
}