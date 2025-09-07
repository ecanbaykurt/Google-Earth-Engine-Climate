import { NextResponse } from "next/server";
import { testBigQueryConnection } from "@/lib/bq";
export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await testBigQueryConnection();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "BigQuery connection successful",
        timestamp: new Date().toISOString(),
        test_data: result.data
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Connection test error:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
