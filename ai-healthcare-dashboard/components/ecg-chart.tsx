"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";

interface ECGDataPoint {
  timestamp: number;
  value: number;
}

interface ECGChartProps {
  data: ECGDataPoint[];
}

export function ECGChart({ data }: ECGChartProps) {
  const minValue = Math.min(...data.map((d) => d.value), 1800);
  const maxValue = Math.max(...data.map((d) => d.value), 2800);
  const midValue = (minValue + maxValue) / 2;

  return (
    <div className="ecg-chart h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="ecgGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00ff88" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#00ff88" stopOpacity={1} />
              <stop offset="100%" stopColor="#00ff88" stopOpacity={1} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <XAxis
            dataKey="timestamp"
            tick={false}
            axisLine={{ stroke: "#2a3a4a", strokeWidth: 1 }}
            tickLine={false}
          />
          <YAxis
            domain={[minValue - 100, maxValue + 100]}
            tick={{ fill: "#4a5a6a", fontSize: 10 }}
            axisLine={{ stroke: "#2a3a4a", strokeWidth: 1 }}
            tickLine={false}
            tickCount={5}
          />
          <ReferenceLine
            y={midValue}
            stroke="#2a3a4a"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#ecgGradient)"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={true}
            animationDuration={100}
            animationEasing="linear"
            filter="url(#glow)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
