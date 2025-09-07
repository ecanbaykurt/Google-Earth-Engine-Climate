"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area } from "recharts";

type Row = {
  ds: string;
  loss_km2?: number | null;
  loss_km2_pred?: number | null;
  loss_km2_lo?: number | null;
  loss_km2_hi?: number | null;
};

export default function CountryChart({ data }: { data: Row[] }) {
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <LineChart width={900} height={360} data={data}>
        <XAxis dataKey="ds" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <Line type="monotone" dataKey="loss_km2" stroke="#4f46e5" name="History" dot={false} />
        <Line type="monotone" dataKey="loss_km2_pred" stroke="#16a34a" strokeDasharray="6 6" name="Forecast" dot={false} />
        <Area type="monotone" dataKey="loss_km2_hi" fill="#16a34a" fillOpacity={0.08} />
        <Area type="monotone" dataKey="loss_km2_lo" fill="#16a34a" fillOpacity={0.08} />
      </LineChart>
    </div>
  );
}
