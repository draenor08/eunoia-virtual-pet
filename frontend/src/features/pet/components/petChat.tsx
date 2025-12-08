import { useState } from 'react';

// SIMPLE PSEUDO-AI LOGIC - NO DATABASE NEEDED
const getPetResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();
  if (msg.includes('breath') || msg.includes('stress')) return "Let's do a 4-7-8 breathing exercise. Breathe in for 4...";
  if (msg.includes('water') || msg.includes('thirst')) return "💧 Remember to drink water! Staying hydrated helps your mood.";
  if (msg.includes('sad') || msg.includes('down')) return "I'm here for you. Want to talk about it?";
  if (msg.includes('happy') || msg.includes('good')) return "That's wonderful! Your positivity is contagious!";
  return "I'm listening. How are you feeling today?";
};

export default function PetChat() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Hello! I'm your Eunoia pet. How can I support you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    
    // Get AI response after delay
    setTimeout(() => {
      const response = getPetResponse(input);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 800);
    
    setInput('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl h-[400px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.isUser ? 'bg-purple-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type how you're feeling..."
          className="flex-1 p-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500"
        />
        <button onClick={sendMessage} className="bg-purple-600 text-white px-6 rounded-xl hover:bg-purple-700 transition">
          Send
        </button>
      </div>
    </div>
  );
}