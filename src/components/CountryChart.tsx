"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, ResponsiveContainer, Legend } from "recharts";

type Row = {
  ds: string;
  loss_km2?: number | null;
  loss_km2_pred?: number | null;
  loss_km2_lo?: number | null;
  loss_km2_hi?: number | null;
};

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  } catch {
    return dateStr;
  }
};

const formatValue = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toFixed(1);
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {formatDate(label)}
        </p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {entry.name}:
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {entry.value ? `${formatValue(entry.value)} km²` : 'N/A'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CountryChart({ data }: { data: Row[] }) {
  // Filter out null values and prepare data
  const chartData = data.map(row => ({
    ...row,
    ds: formatDate(row.ds),
    loss_km2: row.loss_km2 || 0,
    loss_km2_pred: row.loss_km2_pred || 0,
    loss_km2_lo: row.loss_km2_lo || 0,
    loss_km2_hi: row.loss_km2_hi || 0,
  }));

  return (
    <div className="w-full">
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        <p>📊 Historical data (solid line) and 15-year forecast (dashed line) with confidence intervals</p>
      </div>
      
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              className="dark:stroke-gray-600" 
            />
            <XAxis 
              dataKey="ds" 
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              fontSize={12}
              tickFormatter={formatValue}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Confidence interval area */}
            <Area
              type="monotone"
              dataKey="loss_km2_hi"
              stackId="1"
              stroke="none"
              fill="#16a34a"
              fillOpacity={0.1}
              name="Confidence Interval"
            />
            <Area
              type="monotone"
              dataKey="loss_km2_lo"
              stackId="1"
              stroke="none"
              fill="#16a34a"
              fillOpacity={0.1}
            />
            
            {/* Historical data line */}
            <Line
              type="monotone"
              dataKey="loss_km2"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Historical Data"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
            />
            
            {/* Forecast line */}
            <Line
              type="monotone"
              dataKey="loss_km2_pred"
              stroke="#16a34a"
              strokeWidth={3}
              strokeDasharray="8 8"
              name="15-Year Forecast"
              dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#16a34a", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-blue-500"></div>
          <span>Historical forest loss data</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-500 border-dashed border border-green-500"></div>
          <span>15-year forecast with confidence intervals</span>
        </div>
      </div>
    </div>
  );
}
