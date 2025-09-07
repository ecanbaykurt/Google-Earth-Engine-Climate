import { NextResponse } from "next/server";
import { testEarthEngineConnection } from "@/lib/gee";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("🔍 Testing Earth Engine connection...");
    
    const result = await testEarthEngineConnection();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Earth Engine connection successful",
        timestamp: new Date().toISOString(),
        status: "connected"
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: "Earth Engine connection failed",
        timestamp: new Date().toISOString(),
        status: "error"
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Earth Engine test error:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "Failed to test Earth Engine connection",
      timestamp: new Date().toISOString(),
      status: "error"
    }, { status: 500 });
  }
}
