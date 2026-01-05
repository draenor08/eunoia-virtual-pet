import { useState } from 'react';
import { API_URL } from '../../../config'; // Import from new config file

interface ApiResponse {
  overallSentiment: number;
  userMessage: string;
}

interface AnalysisResult {
  score: number;
  mood: string;
}

interface MoodCheckInProps {
  userId?: string;
}

export default function MoodCheckIn({ userId }: MoodCheckInProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!userId) return;
    setStatus('loading');

    try {
      const res = await fetch(`${API_URL}/api/mood/analyze-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId })
      });

      const text = await res.text();

      // HANDLE EMPTY RESPONSE (No Chat History)
      if (!text || text.trim().length === 0) {
        setResult({ score: 0, mood: "No Data Yet 📝" });
        setStatus('success');
        return;
      }

      const data: ApiResponse = JSON.parse(text);
      const moodLabel = data.overallSentiment > 0.2 ? "Positive 😄" :
        data.overallSentiment < -0.2 ? "Negative 😢" : "Neutral 😐";

      setResult({ score: data.overallSentiment, mood: moodLabel });
      setStatus('success');

    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg mt-6">
      <h3 className="text-xl font-bold mb-2">✨ Magic Analysis</h3>

      {status === 'idle' || status === 'error' ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-purple-100 mb-4 text-sm">Analyze your recent chats.</p>
          <button
            onClick={handleAnalyze}
            className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold hover:bg-purple-50 transition hover:scale-105"
          >
            Analyze My Chat
          </button>
        </div>
      ) : status === 'loading' ? (
        <div className="animate-pulse font-bold flex flex-col items-center">
          <span className="text-2xl mb-2">🧠</span>
          <span>Reading your journal...</span>
        </div>
      ) : (
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm animate-fade-in">
          {result?.mood === "No Data Yet 📝" ? (
            <div>
              <p className="text-lg font-bold">No chats found!</p>
              <p className="text-xs mt-1 opacity-90">Talk to your pet first.</p>
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold mb-1">{result?.mood}</p>
              <p className="text-sm opacity-80">Score: {result?.score.toFixed(2)}</p>
            </>
          )}
          <button
            onClick={() => setStatus('idle')}
            className="text-xs underline mt-3 hover:text-white/80 block w-full text-center"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}