import { NextResponse } from "next/server";
import { getBigQuery } from "@/lib/bq";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "Brazil";
  const sql = `
  WITH last_obs AS (
    SELECT country, MAX(ds) AS last_ds
    FROM \`qst843-ecb.climate_ds.v_forest_loss_yearly\`
    WHERE country = @country
    GROUP BY country
  ),
  hist AS (
    SELECT h.country, h.ds, h.loss_km2
    FROM \`qst843-ecb.climate_ds.v_forest_loss_yearly\` h
    JOIN last_obs lo USING(country)
  ),
  recent5 AS (
    SELECT AVG(loss_km2) AS avg_recent5
    FROM hist, last_obs lo
    WHERE ds > DATE_SUB(lo.last_ds, INTERVAL 5 YEAR)
  ),
  prev5 AS (
    SELECT AVG(loss_km2) AS avg_prev5
    FROM hist, last_obs lo
    WHERE ds BETWEEN DATE_SUB(lo.last_ds, INTERVAL 10 YEAR)
                 AND  DATE_SUB(lo.last_ds, INTERVAL 5 YEAR)
  ),
  next15 AS (
    SELECT SUM(loss_km2_pred) AS sum_next15
    FROM \`qst843-ecb.climate_ds.forest_loss_forecast_15y\`
    WHERE country = @country
  )
  SELECT
    (SELECT loss_km2 FROM hist ORDER BY ds DESC LIMIT 1) AS last_year_km2,
    (SELECT avg_recent5 FROM recent5) AS avg_recent5,
    (SELECT avg_prev5 FROM prev5) AS avg_prev5,
    SAFE_DIVIDE((SELECT avg_recent5 FROM recent5) - (SELECT avg_prev5 FROM prev5),
                (SELECT avg_prev5 FROM prev5)) AS delta_pct_5y,
    (SELECT sum_next15 FROM next15) AS forecast_15y_total_km2
  `;
  const bq = getBigQuery();
  const [rows] = await bq.query({ query: sql, params: { country } });
  return NextResponse.json(rows[0] ?? {});
}
