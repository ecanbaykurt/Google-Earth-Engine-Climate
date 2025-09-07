import { NextResponse } from "next/server";
import { getForestLossData, getForestCoverData, testEarthEngineConnection } from "@/lib/gee";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");
    const startYear = parseInt(searchParams.get("startYear") || "2001");
    const endYear = parseInt(searchParams.get("endYear") || "2023");
    const includeCover = searchParams.get("includeCover") === "true";
    
    // Validate required parameters
    if (!country || !country.trim()) {
      return NextResponse.json(
        { 
          error: "Country parameter is required",
          message: "Please provide a country name using ?country=Brazil"
        },
        { status: 400 }
      );
    }
    
    // Validate year range
    if (startYear < 2001 || endYear > 2023 || startYear > endYear) {
      return NextResponse.json(
        { 
          error: "Invalid year range",
          message: "Years must be between 2001-2023 and startYear must be <= endYear"
        },
        { status: 400 }
      );
    }
    
    console.log(`🌍 Processing forest loss request for ${country} (${startYear}-${endYear})`);
    
    // Test Earth Engine connection first
    const connectionTest = await testEarthEngineConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        { 
          error: "Earth Engine connection failed",
          details: connectionTest.error,
          message: "Unable to connect to Google Earth Engine. Please check your service account configuration."
        },
        { status: 500 }
      );
    }
    
    // Get forest loss data
    const forestLossData = await getForestLossData(country, startYear, endYear);
    
    // Optionally get forest cover data
    let forestCoverData = null;
    if (includeCover) {
      try {
        forestCoverData = await getForestCoverData(country);
      } catch (error) {
        console.warn(`Failed to get forest cover data for ${country}:`, error);
        // Don't fail the entire request if cover data fails
      }
    }
    
    // Prepare response
    const response = {
      success: true,
      data: {
        forest_loss: forestLossData,
        forest_cover: forestCoverData
      },
      metadata: {
        country: country,
        start_year: startYear,
        end_year: endYear,
        include_cover: includeCover,
        data_source: "Hansen Global Forest Change v1.11 (2023)",
        timestamp: new Date().toISOString()
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error("Forest loss API error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Handle specific error types
    if (errorMessage.includes("not found")) {
      return NextResponse.json(
        { 
          error: "Country not found",
          message: `The country "${searchParams.get("country")}" was not found in the dataset. Please check the spelling and try again.`,
          details: errorMessage
        },
        { status: 404 }
      );
    }
    
    if (errorMessage.includes("Service account key file not found")) {
      return NextResponse.json(
        { 
          error: "Configuration error",
          message: "Earth Engine service account key file not found. Please ensure the key file is placed at /keys/gee-service.json",
          details: errorMessage
        },
        { status: 500 }
      );
    }
    
    if (errorMessage.includes("initialize")) {
      return NextResponse.json(
        { 
          error: "Earth Engine initialization failed",
          message: "Failed to initialize Google Earth Engine. Please check your service account credentials.",
          details: errorMessage
        },
        { status: 500 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: "An unexpected error occurred while processing your request.",
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
