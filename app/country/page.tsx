"use client";
import { useEffect, useState } from "react";
import CountryChart from "@/components/CountryChart";

export default function CountryPage() {
  const [data, setData] = useState<any[]>([]);
  const [country, setCountry] = useState("Brazil");
  const [kpis, setKpis] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load(c: string) {
    setLoading(true); setErr(null);
    try {
      const [tsRes, kpRes] = await Promise.all([
        fetch(`/api/timeseries?country=${encodeURIComponent(c)}`),
        fetch(`/api/kpis?country=${encodeURIComponent(c)}`)
      ]);
      setData(await tsRes.json());
      setKpis(await kpRes.json());
    } catch (e: any) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(country); }, []);

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>Country timeline</h1>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country name e.g. Brazil" />
        <button onClick={() => load(country)}>Load</button>
      </div>
      {loading && <p>loading…</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {kpis && (
        <div style={{ display: "flex", gap: 24 }}>
          <div>Last year: <b>{Number(kpis.last_year_km2 ?? 0).toFixed(2)}</b> km²</div>
          <div>5y Δ: <b>{((kpis.delta_pct_5y ?? 0) * 100).toFixed(1)}%</b></div>
          <div>Next 15y total: <b>{Number(kpis.forecast_15y_total_km2 ?? 0).toFixed(0)}</b> km²</div>
        </div>
      )}
      {data.length > 0 && <CountryChart data={data} />}
    </main>
  );
}
