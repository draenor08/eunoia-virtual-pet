import { useState, useRef, useEffect } from 'react';

// Keep the pseudo-AI for the demo so it feels "alive"
const getSimpleResponse = (text: string) => {
  if (text.includes('sad')) return "I'm here for you. Tell me more?";
  if (text.includes('happy')) return "Yay! I love seeing you happy!";
  return "I'm listening. How else are you feeling?";
};

export default function PetChat() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Hello! I'm ready to listen.", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userText = input;
    setInput(''); // Clear input immediately

    // 1. Show User Message (Optimistic UI)
    setMessages(prev => [...prev, { text: userText, isUser: true }]);

    // 2. SEND TO BACKEND (The Real Logic)
    try {
      await fetch('http://localhost:8080/api/mood/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: userText
      });
    } catch (error) {
      console.error("Backend offline? Failed to save chat:", error);
    }

    // 3. Fake Response (So it doesn't feel broken)
    setTimeout(() => {
      setMessages(prev => [...prev, { text: getSimpleResponse(userText), isUser: false }]);
    }, 600);
  };

  return (
    // Container is transparent (background handled by parent wrapper)
    <div className="flex flex-col h-full p-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#f3f4f6] mb-4">
        <h3 className="text-lg font-bold text-[#5c4b43]">Journal Chat</h3>
        <p className="text-xs text-[#9ca3af]">Talk to Euna</p>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-5 py-3 text-sm leading-relaxed rounded-2xl shadow-sm
              ${msg.isUser 
                ? 'bg-[#e6a394] text-white rounded-br-none' // Warm Terracotta for user
                : 'bg-[#f3f4f6] text-[#4b5563] rounded-bl-none' // Soft Grey for bot
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="How are you feeling?"
          className="flex-1 px-5 py-3 bg-[#f9fafb] border-2 border-[#f3f4f6] rounded-full text-sm focus:outline-none focus:border-[#e6a394] focus:bg-white transition-colors text-[#4b5563]"
        />
        <button 
          onClick={sendMessage} 
          className="bg-[#5c4b43] text-white px-6 rounded-full font-medium text-sm hover:bg-[#4a3b36] transition-colors shadow-sm"
        >
          
          Send
        </button>
      </div>
    </div>
  );
}