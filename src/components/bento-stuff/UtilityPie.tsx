"use client"
import { PieChart, Pie, Sector, Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMediaQuery } from 'usehooks-ts'
import { useState, useEffect } from 'react'


function SelectTime() {
  return (
    <Select defaultValue="month">
      <SelectTrigger className="w-36 cursor-default">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="month">This month</SelectItem>
        <SelectItem value="year">This year</SelectItem>
        <SelectItem value="all">All time</SelectItem>
      </SelectContent>
    </Select>
  );
}

const data = [
  { name: "Water", value: 0.001 },
  { name: "Gas", value: 0.001 },
  { name: "Electricity", value: 0.001 },
  { name: "Other", value: 0.001 }
];
const COLORS = [
  "rgba(59, 130, 246, 0.7)",  // #3b82f6
  "rgba(16, 185, 129, 0.7)",  // #10b981
  "rgba(250, 204, 21, 0.7)",  // #facc15
  "rgba(232, 121, 249, 0.7)"  // #e879f9
];

export function UtilityPie() {
  const [smallPie, setSmallPie] = useState(true)
  const isDesktop = useMediaQuery('(min-width: 1536px)')
  useEffect(() => {
    if (isDesktop) {
      setSmallPie(false)
    } else {
      setSmallPie(true)
    }
  }, [isDesktop])

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>

    <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
        <SelectTime />
      </div>
    <ResponsiveContainer width='100%' height="100%">
    <PieChart>
      <Pie
        data={data}
        cx='50%'
        cy='100%'
        startAngle={180}
        endAngle={0}
        innerRadius={smallPie ? 100 : 120}
        outerRadius={smallPie ? 140 : 160}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{outline: 'none'}} />
        ))}
      </Pie>
      <Tooltip contentStyle={{
                  fontSize: '13px',
                  fontWeight: 500,
                  backgroundColor: 'rgba(250, 250, 250, 0.9)', // Light background with a bit of transparency
                  border: 'none', // No border
                  borderRadius: '10px', // Rounded corners
                  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)', // Slight shadow for depth
                  padding: '10px' // Inner spacing
      }}
        formatter={(value, name, props) => [Number(value).toFixed(2), name]}
      />
    </PieChart>
    </ResponsiveContainer>
    </div>
  );
}
