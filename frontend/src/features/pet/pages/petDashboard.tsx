import { useState } from 'react';
import IsometricRoom from '../../draft/IsometricRoom';
import { ROOM_ITEMS, INITIAL_POSITION } from '../../draft/roomConfig';
import { type Position, type CharacterAction } from '../../draft/types';
// 1. IMPORT FROM CONFIG (Standardize the User ID)
// Path: src/features/pet/pages/ -> ../../../config
import { USER_ID as DEFAULT_USER_ID, API_URL } from '../../../config';

interface PetDashboardProps {
  userId?: string;
  onNavigateToCoping?: (query?: string, category?: string) => void;
}

interface AiResponse {
  reply: string;
  emotion: string;
  action: string;
  targetObject: string;
}

export default function PetDashboard({ userId, onNavigateToCoping }: PetDashboardProps) {
  const [targetPos, setTargetPos] = useState<Position | null>(INITIAL_POSITION);
  const [characterAction, setCharacterAction] = useState<CharacterAction>('idle');
  const [speech, setSpeech] = useState<string>("Hi! I'm ready to listen.");

  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleApiResponse = (data: AiResponse) => {
    setSpeech(data.reply);

    if (data.targetObject && data.targetObject !== 'NONE') {
      const furniture = ROOM_ITEMS.find((i: { type: string; }) => i.type.toUpperCase() === data.targetObject.toUpperCase());
      if (furniture && furniture.interactionPoint) {
        setTargetPos(furniture.interactionPoint);
      }
    } else {
      setTargetPos(null);
    }

    const actionMap: Record<string, CharacterAction> = {
      'SLEEP': 'sleeping',
      'SIT': 'sitting',
      'DRINK': 'drinking',
      'BREATHE': 'breathe',
      'IDLE': 'idle',
      'HAPPY': 'happy',
      'SAD': 'sad'
    };

    if (data.action === 'BREATHE' && onNavigateToCoping) {
      // INFER context from reply if not provided explicitly
      // Simple heuristic: check if reply mentions specific keywords
      const replyLower = data.reply.toLowerCase();
      let query = "";
      let category = "all";

      if (replyLower.includes("anx")) { category = "all"; query = "anxiety"; }
      else if (replyLower.includes("breath")) { category = "breathing"; }
      else if (replyLower.includes("ground")) { category = "grounding"; }
      else if (replyLower.includes("stress")) { category = "relaxation"; }

      setTimeout(() => onNavigateToCoping(query, category), 2000);
      setCharacterAction('breathe');
    } else {
      const nextAction = actionMap[data.action] || 'idle';
      setCharacterAction(nextAction);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    setIsThinking(true);
    setSpeech("Thinking...");
    const message = inputValue;
    setInputValue('');

    try {
      // 2. USE API_URL AND USER_ID FROM CONFIG
      const res = await fetch(`${API_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          userId: userId || DEFAULT_USER_ID
        }),
      });

      if (!res.ok) throw new Error("API Error");

      const data: AiResponse = await res.json();
      handleApiResponse(data);

    } catch (e) {
      setSpeech("I couldn't reach my brain... try again?");
      setCharacterAction('anxious');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-[#b8e3ea] rounded-3xl">

      <IsometricRoom
        targetPos={targetPos}
        forcedAction={characterAction}
        speechText={speech}
      />

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
        <div className={`
          flex items-center gap-2 bg-white/70 backdrop-blur-lg p-2 rounded-full border border-white/50 shadow-2xl transition-all duration-300
          ${isThinking ? 'opacity-50 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
        `}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type here to talk to me..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-gray-800 placeholder-gray-500 font-medium"
            disabled={isThinking}
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#5c4b43] text-white p-3 rounded-full hover:bg-[#4a3b36] transition shadow-md"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}