# Cloudflare Pages Setup Checklist

## ✅ Pre-Deployment Checklist

### 1. Service Account Setup
- [ ] Create Google Cloud Service Account
- [ ] Download JSON credentials
- [ ] Grant BigQuery permissions:
  - BigQuery Data Viewer
  - BigQuery Job User
- [ ] Test credentials locally

### 2. Repository Setup
- [x] Git repository initialized
- [x] Initial commit created
- [x] Cloudflare configuration files added
- [ ] Push to GitHub/GitLab (next step)

### 3. Cloudflare Pages Configuration
- [ ] Create Cloudflare account
- [ ] Connect Git repository
- [ ] Set build settings:
  - Framework: Next.js
  - Build command: `npm run build`
  - Build output: `.next`
- [ ] Add environment variables
- [ ] Deploy and test

## 🚀 Deployment Steps

### Step 1: Push to Git Repository
```bash
# If you haven't created a GitHub repo yet:
# 1. Go to github.com and create a new repository
# 2. Then run these commands:

git remote add origin https://github.com/YOUR_USERNAME/climate-app.git
git branch -M main
git push -u origin main
```

### Step 2: Cloudflare Pages Setup
1. **Login to Cloudflare**: Go to [dash.cloudflare.com](https://dash.cloudflare.com/)
2. **Navigate to Pages**: Click "Pages" in the sidebar
3. **Create Project**: Click "Create a project"
4. **Connect Git**: Choose "Connect to Git"
5. **Select Repository**: Choose your climate-app repository
6. **Configure Build**:
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/` (leave empty)

### Step 3: Environment Variables
In your Pages project settings:
1. Go to **Settings** → **Environment variables**
2. Add these variables:

| Variable | Value |
|----------|-------|
| `BIGQUERY_PROJECT_ID` | `qst843-ecb` |
| `BIGQUERY_CREDENTIALS_JSON` | `{"type":"service_account",...}` (your full JSON) |

### Step 4: Deploy
1. Click **Save and Deploy**
2. Wait for build to complete
3. Test your deployed app

## 🔍 Testing Your Deployment

### Test URLs
- Main app: `https://your-project.pages.dev`
- Country page: `https://your-project.pages.dev/country`
- API endpoints:
  - `https://your-project.pages.dev/api/timeseries?country=Brazil`
  - `https://your-project.pages.dev/api/kpis?country=Brazil`

### Test Countries
Try these countries in your deployed app:
- Brazil
- United States
- India
- Indonesia
- Colombia

## 🎯 Next Steps After Deployment

1. **Custom Domain**: Add your own domain in Pages settings
2. **Analytics**: Enable Cloudflare Analytics
3. **Performance**: Monitor Core Web Vitals
4. **Security**: Review security headers in `_headers` file

## 🆘 Support

If you encounter issues:
1. Check Cloudflare Pages build logs
2. Verify environment variables are set correctly
3. Test BigQuery credentials locally first
4. Check Cloudflare Pages documentation
