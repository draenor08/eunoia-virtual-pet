import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { API_URL } from '../../../config';
interface MoodEntry {
  timestamp: string;
  overallSentiment: number;
}

interface ChartData {
  time: string;
  score: number;
}

// 1. ADD: Same User ID

interface MoodChartProps {
  userId?: string;
}

export default function MoodChart({ userId }: MoodChartProps) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/mood/history?userId=${userId}`);

        if (!res.ok) return;

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

  if (data.length === 0) {
    return (
      <div className="h-64 w-full mt-4 flex flex-col gap-2 items-center justify-center bg-[#fdfbf9] rounded-xl border-2 border-dashed border-[#efeae6] text-[#8c7e76] text-sm font-bold">
        <span>📉 No mood history found</span>
        <span className="text-xs font-normal opacity-70">Try chatting with your pet first!</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            stroke="#8c7e76"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[-1, 1]}
            stroke="#8c7e76"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'Nunito' }}
            cursor={{ stroke: '#e6a394', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}