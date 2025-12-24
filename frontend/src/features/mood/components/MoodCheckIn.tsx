import { useState } from 'react';

// Define the shape of the API response
interface ApiResponse {
  overallSentiment: number;
  userMessage: string;
  // add other fields if needed, like joyScore, etc.
}

interface AnalysisResult {
  score: number;
  mood: string;
}

export default function MoodCheckIn() {
  // Explicitly type the state union
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setStatus('loading');
    try {
      const res = await fetch('http://localhost:8080/api/mood/analyze-batch', {
        method: 'POST'
      });
      
      if (!res.ok) throw new Error("Analysis failed");

      const data: ApiResponse = await res.json();
      
      // Determine mood label based on score
      const moodLabel = data.overallSentiment > 0 ? "Positive 😄" : 
                        data.overallSentiment < 0 ? "Negative 😢" : "Neutral 😐";

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
      <p className="text-purple-100 mb-4 text-sm">
        Analyze our recent chat to see your mood trend.
      </p>

      {status === 'idle' || status === 'error' ? (
        <button 
          onClick={handleAnalyze}
          className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold hover:bg-purple-50 transition"
        >
          Analyze My Chat
        </button>
      ) : status === 'loading' ? (
        <div className="animate-pulse">Thinking... 🧠</div>
      ) : (
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
          <p className="text-2xl font-bold">{result?.mood}</p>
          <p className="text-sm opacity-80">Sentiment Score: {result?.score.toFixed(2)}</p>
          <button 
            onClick={() => setStatus('idle')}
            className="text-xs underline mt-2 hover:text-white/80"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}