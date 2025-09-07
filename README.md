# 🌍 Google Earth Engine Climate Dashboard

A modern Next.js application for visualizing forest loss data and climate trends across different countries using Google BigQuery and Google Earth Engine integration.

## ✨ Features

- **Interactive Data Visualization**: Beautiful charts showing historical forest loss data and 15-year forecasts
- **Country Analysis**: Explore data for any country with detailed KPIs
- **Real-time Connection Status**: Monitor BigQuery connection health
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Automatic dark/light theme switching
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud Platform account with BigQuery access
- BigQuery dataset with forest loss data

### 1. Clone and Install

```bash
cd climate-app
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the `climate-app` directory:

```bash
# BigQuery Configuration
BIGQUERY_PROJECT_ID=your-project-id
BIGQUERY_CREDENTIALS_JSON={"type":"service_account","project_id":"your-project-id",...}

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Climate Data Dashboard
```

### 3. BigQuery Setup

#### Option A: Service Account (Recommended for Production)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable BigQuery API
4. Create a service account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Give it a name like "climate-dashboard"
   - Grant "BigQuery Data Viewer" role
5. Create and download JSON key
6. Copy the entire JSON content to `BIGQUERY_CREDENTIALS_JSON`

#### Option B: Application Default Credentials (Development)

```bash
# Install Google Cloud CLI
gcloud auth application-default login
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Data Structure

The application expects the following BigQuery tables:

### `qst843-ecb.climate_ds.v_forest_loss_yearly`
```sql
-- Historical forest loss data
country: STRING
ds: DATE
loss_km2: FLOAT64
```

### `qst843-ecb.climate_ds.forest_loss_forecast_15y`
```sql
-- 15-year forecast data
country: STRING
ds: DATE
loss_km2_pred: FLOAT64
loss_km2_lo: FLOAT64  -- Lower confidence bound
loss_km2_hi: FLOAT64  -- Upper confidence bound
```

## 🛠️ API Endpoints

### `/api/kpis?country=Brazil`
Returns key performance indicators for a country:
- Last year forest loss
- 5-year trend percentage
- 15-year forecast total

### `/api/timeseries?country=Brazil`
Returns historical and forecast data for chart visualization.

### `/api/test-connection`
Tests BigQuery connection and returns status.

## 🎨 Customization

### Styling
The app uses Tailwind CSS for styling. Customize colors and themes in:
- `app/globals.css` - Global styles
- Component files - Component-specific styles

### Charts
Charts are built with Recharts. Customize in:
- `src/components/CountryChart.tsx` - Main chart component

### Data Sources
Modify BigQuery queries in:
- `app/api/kpis/route.ts` - KPIs endpoint
- `app/api/timeseries/route.ts` - Timeseries endpoint

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker containers

## 🔧 Development

### Project Structure
```
climate-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── country/           # Country analysis page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # React components
│   └── lib/              # Utility libraries
├── public/               # Static assets
└── package.json         # Dependencies
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues

1. **BigQuery Connection Error**
   - Verify environment variables are set correctly
   - Check service account permissions
   - Ensure BigQuery API is enabled

2. **No Data Found**
   - Verify country name spelling
   - Check if data exists in BigQuery tables
   - Test with known countries like "Brazil"

3. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=climate-app:*
```

## 📈 Performance

- **Caching**: BigQuery results are cached for 5 minutes
- **Optimization**: Charts use ResponsiveContainer for better performance
- **Bundle Size**: Optimized with Next.js automatic code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Data provided by Google Earth Engine
- Built with Next.js, React, and Recharts
- Styled with Tailwind CSS
- Powered by Google BigQuery

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review BigQuery documentation

---

**Happy analyzing! 🌱📊**

---

## About

Google Alpha Earth Climate at Woodwell Climate Research Center with Sundai Club MIT

**Live Demo**: [google-earth-engine-climate.vercel.app](https://google-earth-engine-climate.vercel.app)
