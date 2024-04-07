"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  {
    name: "Feb 3, 2023",
    Net: 4000,
  },
  {
    name: "March 2, 2023",
    Net: 3000,
  },
  {
    name: "Apr 1, 2023",
    Net: 2000,
  },
  {
    name: "May 2, 2023",
    // Net: 2780,
  },
  {
    name: "Jun 1, 2023",
    Net: 1890,
  },
  {
    name: "Jul 1, 2023",
    Net: 2390,
  },
  {
    name: "Aug 1, 2023",
    Net: 3490,
  },
];

const getCumulativeData = (dataArray: any[]) => {
  let cumulative = 0;
  return dataArray.map(item => {
    if (item.Net !== undefined) {
      cumulative += item.Net;
    }
    return { ...item, Net: cumulative };
  });
};

const formatXAxis = (tickItem: string | number | Date) => {
  // Create a date object from the tickItem string
  const date = new Date(tickItem);
  // Options to extract only the month in long format (e.g., "February")
  // Format the date to a month string
  return date.toLocaleDateString('en-US', { month: 'short' });
};

export function IncomeGraph() {
  const cumulativeData = getCumulativeData(data);
  
  const calculateTicks = (data: any[]) => {
    const maxY = Math.max(...data.map(item => item.Net || 0));
    const numberOfTicks = 4;
    const interval = Math.ceil(maxY / numberOfTicks);
    return Array.from({ length: numberOfTicks }, (_, i) => (i+1) * interval);
  };

  const ticks = calculateTicks(cumulativeData);

  return (
    <ResponsiveContainer width='100%' height="80%">
      <AreaChart
        data={cumulativeData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray="3 1" />
        <XAxis dataKey="name" tickFormatter={formatXAxis} tick={{ fontSize: 12, fontWeight: 600 }} />
        <YAxis orientation="right" type="number" tick={{ fontSize: 12, fontWeight: 600 }}
          domain={[0, 'dataMax']}
          tickFormatter={(tick) => (tick !== 0 ? tick : '')}
          ticks={ticks}
        />
        <Tooltip contentStyle={{
                  fontSize: '13px',
                  fontWeight: 500,
                  backgroundColor: 'rgba(250, 250, 250, 0.9)', // Light background with a bit of transparency
                  border: 'none', // No border
                  borderRadius: '10px', // Rounded corners
                  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)', // Slight shadow for depth
                  padding: '10px' // Inner spacing
        }} />
        <Area type="monotone" connectNulls dataKey="Net" stroke="#2563eb" fill="#3b82f6"
          dot={{ stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}