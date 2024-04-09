import { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Mar 1, 2023', 'Pos': 300, Neg: 456 },
  { name: 'Apr 2, 2023', 'Pos': -145, Neg: 230 },
  { name: 'May 1, 2023', 'Pos': -100, Neg: 345 },
  { name: 'Jun 1, 2023', 'Pos': -8, Neg: 450 },
  { name: 'Jul 1, 2023', 'Pos': 100, Neg: 321 },
  { name: 'Aug 1, 2023', 'Pos': 9, Neg: 235 },
  { name: 'Sep 1, 2023', 'Pos': 53, Neg: 267 },
  { name: 'Oct 1, 2023', 'Pos': 252, Neg: -378 },
  { name: 'Nov 1, 2023', 'Pos': 79, Neg: -210 },
  { name: 'Dec 1, 2023', 'Pos': 294, Neg: -23 },
  { name: 'Jan 1, 2024', 'Pos': 43, Neg: 45 },
];

export function BarGraph() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 0,
          right: 85,
          left: 40,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <ReferenceLine y={0} stroke="#000" />
        <Brush dataKey="name" height={24} stroke="#3b82f6"
          travellerWidth={10} 
          />
        <Bar dataKey="Pos" fill="#34d399" />
        <Bar dataKey="Neg" fill="#fda4af" />
      </BarChart>
    </ResponsiveContainer>
  );
}
