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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-50/90 shadow-sm ring-inset ring-indigo-400/80 ring-2 rounded-lg">
        <div className="px-1">
          <p className="text-sm mb-1.5 font-semibold px-3 pt-3">{label}</p>
          <div className="border-t-2 border-gray-300 mb-1.5" />
          {payload.map((entry: { dataKey: string; value: any; }, index: any) => (
            <div key={`item-${index}`} className="flex items-center">
              <div
                className={`w-1.5 h-1.5 rounded-full ml-3 mb-3 ${
                  entry.dataKey === 'Pos' ? 'bg-blue-600' : 'bg-pink-300'
                }`}
              />
              <p className="font-medium text-sm px-2 mb-3">{`$${entry.value}`}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const formatXAxis = (tickItem: string | number | Date) => {
  const date = new Date(tickItem);
  // Format the date to a month string
  return date.toLocaleDateString('en-US', { month: 'short' });
};

export function BarGraph() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 0,
          right: 0,
          left: 20,
          bottom: 0,
        }}
        barCategoryGap={'20%'}
        barGap={0}
      >
        {/* <CartesianGrid strokeDasharray="0 0" /> */}
        <XAxis dataKey="name" tickFormatter={formatXAxis} tick={{ fontSize: 12, fontWeight: 600 }} />
        <YAxis orientation="right" type="number" tick={{ fontSize: 12, fontWeight: 600 }} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#000" />

        <Brush dataKey="name" stroke="#3b82f6" height={24}
          travellerWidth={16}
        />

        <Bar dataKey="Pos" fill="#3b82f6" />
        <Bar dataKey="Neg" fill="#fda4af" />
      </BarChart>
    </ResponsiveContainer>
  );
}
