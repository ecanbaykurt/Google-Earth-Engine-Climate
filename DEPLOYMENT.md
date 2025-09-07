# Cloudflare Pages Deployment Guide

## 🚀 Quick Setup

### 1. Push to GitHub/GitLab
```bash
# Create a new repository on GitHub/GitLab, then:
git remote add origin https://github.com/yourusername/climate-app.git
git branch -M main
git push -u origin main
```

### 2. Connect to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Choose **Connect to Git**
4. Select your repository
5. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (or leave empty)

### 3. Environment Variables
In Cloudflare Pages dashboard, go to **Settings** → **Environment variables** and add:

```
BIGQUERY_PROJECT_ID = qst843-ecb
BIGQUERY_CREDENTIALS_JSON = {"type":"service_account","project_id":"your-project",...}
```

**Important**: Paste your entire service account JSON as a single line value.

### 4. Custom Domain (Optional)
- Go to **Custom domains** in your Pages project
- Add your domain
- Update DNS records as instructed
- SSL certificate will be automatically provisioned

## 🔧 Build Configuration

The project is configured with:
- `next.config.ts`: Optimized for Cloudflare Pages
- `wrangler.toml`: Cloudflare Workers configuration
- `_headers`: Security headers
- `_redirects`: Client-side routing support

## 🐛 Troubleshooting

### Build Failures
- Ensure all environment variables are set
- Check that your service account has proper BigQuery permissions
- Verify the JSON credentials are properly formatted

### Runtime Errors
- Check Cloudflare Pages Functions logs
- Ensure `export const runtime = "nodejs"` is in API routes
- Verify BigQuery client initialization

### Performance
- Cloudflare Pages provides global CDN
- Edge caching for static assets
- Serverless functions for API routes

## 📊 Monitoring

- **Analytics**: Built into Cloudflare Pages dashboard
- **Logs**: Available in Pages Functions section
- **Performance**: Real User Monitoring (RUM) available

## 🔄 Continuous Deployment

Every push to your main branch will automatically trigger a new deployment. Preview deployments are created for pull requests.
