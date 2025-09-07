"use client";
import { useEffect, useState } from "react";
import CountryChart from "@/components/CountryChart";
import Link from "next/link";

interface KPIData {
  last_year_km2?: number;
  delta_pct_5y?: number;
  forecast_15y_total_km2?: number;
  country?: string;
  timestamp?: string;
  data_source?: string;
}

interface TimeseriesResponse {
  data: any[];
  country: string;
  count: number;
  timestamp: string;
  data_source: string;
}

export default function CountryPage() {
  const [data, setData] = useState<any[]>([]);
  const [country, setCountry] = useState("Brazil");
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "error">("unknown");

  async function testConnection() {
    try {
      const response = await fetch("/api/test-connection");
      const result = await response.json();
      setConnectionStatus(result.success ? "connected" : "error");
      return result.success;
    } catch (error) {
      setConnectionStatus("error");
      return false;
    }
  }

  async function load(c: string) {
    if (!c.trim()) {
      setErr("Please enter a country name");
      return;
    }

    setLoading(true); 
    setErr(null);
    
    try {
      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        setErr("Unable to connect to BigQuery. Please check your environment configuration.");
        return;
      }

      // Load data from both BigQuery and Earth Engine
      const [tsRes, kpRes, geeRes] = await Promise.all([
        fetch(`/api/timeseries?country=${encodeURIComponent(c)}`),
        fetch(`/api/kpis?country=${encodeURIComponent(c)}`),
        fetch(`/api/forest-loss?country=${encodeURIComponent(c)}&includeCover=true`)
      ]);

      if (!tsRes.ok || !kpRes.ok) {
        const errorData = await tsRes.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${tsRes.status}: ${tsRes.statusText}`);
      }

      const tsData: TimeseriesResponse = await tsRes.json();
      const kpiData: KPIData = await kpRes.json();
      
      // Handle Earth Engine data (optional - don't fail if it's not available)
      let geeData = null;
      if (geeRes.ok) {
        try {
          geeData = await geeRes.json();
        } catch (e) {
          console.warn("Failed to parse Earth Engine data:", e);
        }
      } else {
        console.warn("Earth Engine data not available:", geeRes.status);
      }

      setData(tsData.data || []);
      setKpis(kpiData);
      
      if (tsData.count === 0) {
        setErr(`No data found for country "${c}". Please try a different country.`);
      }
    } catch (e: any) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(country); 
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🌍 Country Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore forest loss data, trends, and forecasts for any country
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            connectionStatus === "connected" 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : connectionStatus === "error"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              connectionStatus === "connected" 
                ? "bg-green-500"
                : connectionStatus === "error"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`} />
            {connectionStatus === "connected" 
              ? "Connected to BigQuery" 
              : connectionStatus === "error"
              ? "Connection Error"
              : "Checking connection..."
            }
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country Name
              </label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="Enter country name (e.g., Brazil, Indonesia, Colombia)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                onKeyPress={e => e.key === 'Enter' && load(country)}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => load(country)}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  "Load Data"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {err && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error Loading Data
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {err}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPIs Display */}
        {kpis && !err && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              📊 Key Performance Indicators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Last Year Forest Loss</div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {Number(kpis.last_year_km2 ?? 0).toFixed(2)} km²
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-sm font-medium text-green-600 dark:text-green-400">5-Year Trend</div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {((kpis.delta_pct_5y ?? 0) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {((kpis.delta_pct_5y ?? 0) * 100) > 0 ? "↗ Increasing" : "↘ Decreasing"}
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <div className="text-sm font-medium text-orange-600 dark:text-orange-400">15-Year Forecast</div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {Number(kpis.forecast_15y_total_km2 ?? 0).toFixed(0)} km²
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Total projected loss
                </div>
              </div>
            </div>
            {kpis.timestamp && (
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(kpis.timestamp).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* Chart Display */}
        {data.length > 0 && !err && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              📈 Forest Loss Timeline & Forecast
            </h2>
            <CountryChart data={data} />
          </div>
        )}

        {/* No Data Message */}
        {!loading && !err && data.length === 0 && kpis && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <div className="text-yellow-600 dark:text-yellow-400 text-lg font-medium mb-2">
              No chart data available
            </div>
            <div className="text-yellow-700 dark:text-yellow-300">
              KPIs are available but chart data could not be loaded.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
