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
  { name: '1', 'Pos': 300, Neg: 456 },
  { name: '2', 'Pos': -145, Neg: 230 },
  { name: '3', 'Pos': -100, Neg: 345 },
  { name: '4', 'Pos': -8, Neg: 450 },
  { name: '5', 'Pos': 100, Neg: 321 },
  { name: '6', 'Pos': 9, Neg: 235 },
  { name: '7', 'Pos': 53, Neg: 267 },
  { name: '8', 'Pos': 252, Neg: -378 },
  { name: '9', 'Pos': 79, Neg: -210 },
  { name: '10', 'Pos': 294, Neg: -23 },
  { name: '12', 'Pos': 43, Neg: 45 },
  { name: '13', 'Pos': -74, Neg: 90 },
  { name: '14', 'Pos': -71, Neg: 130 },
  { name: '15', 'Pos': -117, Neg: 11 },
  { name: '16', 'Pos': -186, Neg: 107 },
  { name: '17', 'Pos': -16, Neg: 926 },
  { name: '18', 'Pos': -125, Neg: 653 },
  { name: '19', 'Pos': 222, Neg: 366 },
  { name: '20', 'Pos': 372, Neg: 486 },
  { name: '21', 'Pos': 182, Neg: 512 },
  { name: '22', 'Pos': 164, Neg: 302 },
  { name: '23', 'Pos': 316, Neg: 425 },
  { name: '24', 'Pos': 131, Neg: 467 },
  { name: '25', 'Pos': 291, Neg: -190 },
  { name: '26', 'Pos': -47, Neg: 194 },
  { name: '27', 'Pos': -415, Neg: 371 },
  { name: '28', 'Pos': -182, Neg: 376 },
  { name: '29', 'Pos': -93, Neg: 295 },
  { name: '30', 'Pos': -99, Neg: 322 },
  { name: '31', 'Pos': -52, Neg: 246 },
  { name: '32', 'Pos': 154, Neg: 33 },
  { name: '33', 'Pos': 205, Neg: 354 },
  { name: '34', 'Pos': 70, Neg: 258 },
  { name: '35', 'Pos': -25, Neg: 359 },
  { name: '36', 'Pos': -59, Neg: 192 },
  { name: '37', 'Pos': -63, Neg: 464 },
  { name: '38', 'Pos': -91, Neg: -2 },
  { name: '39', 'Pos': -66, Neg: 154 },
  { name: '40', 'Pos': -50, Neg: 186 },
];

export function BarGraph() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <ReferenceLine y={0} stroke="#000" />
        <Brush dataKey="name" height={30} stroke="#8884d8" />
        <Bar dataKey="Pos" fill="#34d399" />
        <Bar dataKey="Neg" fill="#fda4af" />
      </BarChart>
    </ResponsiveContainer>
  );
}
