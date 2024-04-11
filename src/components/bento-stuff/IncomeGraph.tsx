import { set } from 'lodash';
import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Feb 3, 2023",
    Net: 4000,
  },
  {
    name: "Mar 2, 2023",
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
  const date = new Date(tickItem);
  // Format the date to a month string
  return date.toLocaleDateString('en-US', { month: 'short' });
};

const getAxisYDomain = (from: number, to: number, ref: string, offset: number) => {
  const refData = data.slice(from, to+1);
  let [bottom, top] = [(refData[0] as any)[ref], (refData[0] as any)[ref]];
  refData.forEach((d) => {
    if ((d as any)[ref] > top) top = (d as any)[ref];
    if ((d as any)[ref] < bottom) bottom = (d as any)[ref];
  });
  return [(bottom | 0) - offset, (top | 0) + offset];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-50/75 shadow-sm ring-inset ring-indigo-400/80 ring-2 rounded-lg">
        <div className="px-1">
          <p className="text-sm mb-1.5 font-semibold px-3 pt-3">{label}</p>
          <div className="border-t-2 border-gray-300 mb-1.5" />
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2" />
            <p className="font-medium text-sm px-3 pb-3">{`$${payload[0].value}`}</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function IncomeGraph() {
  const cumulativeData = getCumulativeData(data);
  const [refAreaLeft, setRefAreaLeft] = useState<number | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<number | null>(null);
  const [zoomedData, setZoomedData] = useState(cumulativeData);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(cumulativeData.length - 1);
  const [bottom, setBottom] = useState('dataMin');
  const [top, setTop] = useState('dataMax');

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaLeft === null || refAreaRight === null) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    const leftIndex = Math.min(refAreaLeft, refAreaRight);
    const rightIndex = Math.max(refAreaLeft, refAreaRight);

    setZoomedData(cumulativeData.slice(leftIndex, rightIndex + 1));
    setLeft(leftIndex);
    setRight(rightIndex);
    setBottom(String(getAxisYDomain(leftIndex, rightIndex, 'Net', 1)[0]));
    setTop(String(getAxisYDomain(leftIndex, rightIndex, 'Net', 1)[1]));
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const zoomOut = () => {
    setZoomedData(cumulativeData);
    setLeft(0);
    setRight(cumulativeData.length - 1);
    setBottom('dataMin');
    setTop('dataMax');
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const calculateTicks = (data: any[]) => {
    const maxY = Math.max(...data.map(item => item.Net || 0));
    const numberOfTicks = 4;
    const interval = Math.ceil(maxY / numberOfTicks);
    return Array.from({ length: numberOfTicks }, (_, i) => (i+1) * interval);
  };

  const ticks = calculateTicks(cumulativeData);

  return (
    <ResponsiveContainer width='100%' height="100%">
      <AreaChart
        data={zoomedData}
        margin={{
          top: 10,
          right: 0,
          left: 10,
          bottom: 0
        }}
        onMouseDown={(e) => setRefAreaLeft(e?.activeTooltipIndex || 0)}
        onMouseMove={(e) => refAreaLeft !== null && setRefAreaRight(e?.activeTooltipIndex || cumulativeData.length - 1)}
        onMouseUp={zoom}
        onClick={() => {
          zoomOut()
        }}
      >
        <CartesianGrid strokeDasharray="0 0" />
        <XAxis dataKey="name" tickFormatter={formatXAxis} tick={{ fontSize: 12, fontWeight: 600 }} domain={[left, right]} />
        <YAxis orientation="right" type="number" tick={{ fontSize: 12, fontWeight: 600 }}
          domain={[bottom, top]}
          // tickFormatter={(tick) => (tick !== 0 ? tick : '')}
          ticks={ticks}
        />
        <Tooltip content={<CustomTooltip />}
          cursor={{ stroke: '#3b82f6', strokeWidth: 1.5 }}
        />
        <Area type="monotone" connectNulls dataKey="Net" stroke="#2563eb" fill="#3b82f6"
          dot={{ stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
        />
        {refAreaLeft !== null && refAreaRight !== null && (
          <ReferenceArea 
            x1={zoomedData[refAreaLeft].name}
            x2={zoomedData[refAreaRight].name}
            strokeOpacity={0.3} 
            stroke="#2563eb"
            fill="#93c5fd"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}