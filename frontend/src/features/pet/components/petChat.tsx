import { useState, useRef, useEffect } from 'react';

// 1. Define Props
interface PetChatProps {
  onAnimationTrigger: (anim: string) => void; // Sends string to Dashboard -> Interaction -> Avatar
  userId?: string;
}

// 2. Define Backend Response Shape
interface AiResponse {
  reply: string;
  emotion: string; // Backend sends: "HAPPY", "SAD", "ANXIOUS"
  action: string;  // Backend sends: "BREATHE", "EAT"
}

export default function PetChat({ onAnimationTrigger, userId }: PetChatProps) {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Hello! I'm here to listen.", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- THE MAPPING LOGIC ---
  // Converts Backend "Emotions" -> Your Working Rive "Animation Names"
  const mapBackendToAnimation = (data: AiResponse): string => {
    const action = data.action?.toUpperCase();
    const emotion = data.emotion?.toUpperCase();
    const text = data.reply?.toLowerCase();

    // 1. Actions (High Priority)
    if (action === 'BREATHE' || text.includes('breathe')) return 'breathIN-OUT';
    if (action === 'EAT' || text.includes('cookie') || text.includes('food')) return 'eat-cookie';
    
    // 2. Emotions
    switch (emotion) {
      case 'HAPPY':
      case 'EXCITED':
        return 'happy';
      case 'SAD':
        return 'sad';
      case 'ANXIOUS':
      case 'FEAR':
        return 'scared_loop';
      case 'TIRED':
        return 'sadIntense';
      case 'WAVE':
      case 'GREETING':
        return 'wave';
      default:
        // Fallback: Check text for keywords if backend emotion is missing
        if (text.includes('hi') || text.includes('hello')) return 'wave';
        if (text.includes('sad')) return 'sad';
        if (text.includes('happy')) return 'happy';
        return 'idle';
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { text: userText, isUser: true }]);
    setIsLoading(true);

    try {
      // CALL SPRING BOOT BACKEND
      const response = await fetch('http://localhost:8080/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: userText, 
            userId: userId || "e9504d60-60e2-4f58-bf6e-bc13ca2adcc3" // <--- Paste your UUID if props are empty
        }), 
      });

      if (!response.ok) throw new Error('Backend error');

      const data: AiResponse = await response.json();

      // 1. Show Reply
      setMessages(prev => [...prev, { text: data.reply, isUser: false }]);

      // 2. Determine & Trigger Animation
      const animName = mapBackendToAnimation(data);
      console.log("🤖 AI Triggering Animation:", animName); // Debug log
      onAnimationTrigger(animName);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { text: "I can't reach my brain right now...", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="pb-4 border-b border-[#f3f4f6] mb-4">
        <h3 className="text-lg font-bold text-[#5c4b43]">Journal Chat</h3>
        <p className="text-xs text-[#9ca3af]">Talk to Euna</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 text-sm leading-relaxed rounded-2xl shadow-sm
              ${msg.isUser 
                ? 'bg-[#e6a394] text-white rounded-br-none' 
                : 'bg-[#f3f4f6] text-[#4b5563] rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-xs text-gray-400 italic ml-4">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="How are you feeling?"
          className="flex-1 px-5 py-3 bg-[#f9fafb] border-2 border-[#f3f4f6] rounded-full text-sm focus:outline-none focus:border-[#e6a394] focus:bg-white transition-colors text-[#4b5563]"
        />
        <button onClick={sendMessage} className="bg-[#5c4b43] text-white px-6 rounded-full font-medium text-sm hover:bg-[#4a3b36] transition-colors shadow-sm">
          Send
        </button>
      </div>
    </div>
  );
}