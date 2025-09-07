import { NextResponse } from "next/server";
import { getBigQuery } from "@/lib/bq";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country") || "Brazil";
    
    if (!country.trim()) {
      return NextResponse.json(
        { error: "Country parameter is required" },
        { status: 400 }
      );
    }

    const query = `
      WITH hist AS (
        SELECT country, ds, loss_km2,
               NULL AS loss_km2_pred,
               NULL AS loss_km2_lo,
               NULL AS loss_km2_hi
        FROM \`qst843-ecb.climate_ds.v_forest_loss_yearly\`
        WHERE country = @country
      ),
      fc AS (
        SELECT country, ds,
               NULL AS loss_km2,
               loss_km2_pred,
               loss_km2_lo,
               loss_km2_hi
        FROM \`qst843-ecb.climate_ds.forest_loss_forecast_15y\`
        WHERE country = @country
      )
      SELECT * FROM hist
      UNION ALL
      SELECT * FROM fc
      ORDER BY ds;
    `;
    
    const bq = getBigQuery();
    const [rows] = await bq.query({ 
      query, 
      params: { country },
      location: 'US'
    });
    
    // Add metadata to response
    return NextResponse.json({
      data: rows,
      country,
      count: rows.length,
      timestamp: new Date().toISOString(),
      data_source: "BigQuery - qst843-ecb.climate_ds"
    });
    
  } catch (error) {
    console.error("Timeseries API Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: "Failed to fetch timeseries data",
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
