import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            🌍 Climate Data Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Explore forest loss data and climate trends across different countries with interactive visualizations and forecasts.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                📊 Country Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                View detailed forest loss data, trends, and 15-year forecasts for any country.
              </p>
              <Link 
                href="/country"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Explore Countries →
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                📈 Key Metrics
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Access KPIs including recent trends, historical comparisons, and future projections.
              </p>
              <Link 
                href="/country"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                View KPIs →
              </Link>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Features
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Interactive Charts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Visualize data with Recharts</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔮</div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Forecasting</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">15-year predictions</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🌐</div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Global Data</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">BigQuery integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
