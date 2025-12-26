import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodEntry {
  timestamp: string;
  overallSentiment: number;
}

interface ChartData {
  time: string;
  score: number;
}

export default function MoodChart() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/mood/history');
        if (!res.ok) return; // Silent fail if backend is down
        
        const history: MoodEntry[] = await res.json();
        
        const formatted = history.map((entry) => ({
          time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          score: entry.overallSentiment
        })).reverse();
        
        setData(formatted);
      } catch (err) {
        console.error("Failed to load chart", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  // FIX: If no data, show a placeholder instead of breaking Recharts
  if (data.length === 0) {
    return (
        <div className="h-64 w-full mt-4 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-bold">
            No mood history yet. Start chatting!
        </div>
    );
  }

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis domain={[-1, 1]} stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} 
            cursor={{ stroke: '#e6a394', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#8b5cf6" 
            strokeWidth={4} 
            dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}