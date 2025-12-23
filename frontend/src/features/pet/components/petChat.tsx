import { useState } from 'react';

// Keep the pseudo-AI for the demo so it feels "alive" while you collect data
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
        headers: { 'Content-Type': 'text/plain' }, // We used @RequestBody String in Java
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type here..."
          className="flex-1 p-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500"
        />
        <button onClick={sendMessage} className="bg-purple-600 text-white px-6 rounded-xl hover:bg-purple-700 transition">
          Send
        </button>
      </div>
    </div>
  );
}