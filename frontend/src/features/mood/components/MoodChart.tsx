import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MoodChart() {
  const [data, setData] = useState([]);

  // Fetch data every 5 seconds to keep it "live" for the demo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/mood/history');
        const history = await res.json();
        
        // Format for Recharts
        const formatted = history.map((entry: any) => ({
          time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          score: entry.overallSentiment
        })).reverse(); // Show oldest to newest
        
        setData(formatted);
      } catch (err) {
        console.error("Failed to load chart", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#888" fontSize={12} />
          <YAxis domain={[-1, 1]} stroke="#888" fontSize={12} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#8b5cf6" 
            strokeWidth={3} 
            dot={{ fill: '#8b5cf6' }} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}