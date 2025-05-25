# FocusTracker Deployment Guide

This guide will help you deploy FocusTracker to production using GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Git installed locally

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `focus-tracker`
3. Make it public
4. Don't initialize with README (we already have one)

## Step 2: Push Code to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/focus-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: One-Click Deploy (Recommended)

1. Click this button: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/focus-tracker)
2. Connect your GitHub account if needed
3. Select your `focus-tracker` repository
4. Click "Deploy"

### Option B: Manual Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your `focus-tracker` repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy"

## Step 4: Configure Auto-Deployment

Vercel automatically deploys when you push to the `main` branch. No additional configuration needed!

## Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables

FocusTracker doesn't require any environment variables as it's a client-side only application.

## Build Verification

Your deployment should:

- ✅ Build successfully (check Vercel build logs)
- ✅ Pass all tests in GitHub Actions
- ✅ Load the app at your Vercel URL
- ✅ Allow timer functionality
- ✅ Store data locally
- ✅ Export/import data

## Troubleshooting

### Build Fails

- Check GitHub Actions for detailed error logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### App Doesn't Load

- Check browser console for errors
- Verify Vercel deployment logs
- Ensure `dist` folder is being deployed

### Timer Doesn't Work

- Check browser permissions for notifications
- Verify localStorage is enabled
- Test in incognito mode to rule out extensions

## Performance Optimization

The app is already optimized with:

- Tree-shaking for minimal bundle size
- Lazy loading of Chart.js components
- Efficient localStorage usage
- Tailwind CSS purging

## Monitoring

- Use Vercel Analytics (free tier available)
- Monitor Core Web Vitals in Vercel dashboard
- Check GitHub Actions for CI/CD health

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/YOUR_USERNAME/focus-tracker/issues)
2. Review Vercel deployment logs
3. Test locally with `npm run dev`

---

**Live URL**: Your app will be available at `https://focus-tracker-YOUR_USERNAME.vercel.app`
