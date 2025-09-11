# 🚀 CustomerEye Deployment Guide

## Quick Reference

### URLs
- **Production**: https://demo.customereye.ai (main branch)
- **Staging**: https://customereye-git-develop-jintusserdars-projects.vercel.app (develop branch)
- **Feature Previews**: https://customereye-git-[feature-name]-jintusserdars-projects.vercel.app

### Daily Workflow

#### 1. Start New Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

#### 2. Make Changes & Test
```bash
# Make your changes
git add .
git commit -m "feat: description of changes"
git push origin feature/your-feature-name

# Vercel automatically creates preview URL
# Test on: https://customereye-git-[feature-name]-jintusserdars-projects.vercel.app
```

#### 3. Deploy to Staging
```bash
# Create Pull Request on GitHub
# After review, merge to develop branch
# Staging automatically updates: https://customereye-git-develop-jintusserdars-projects.vercel.app
```

#### 4. Deploy to Production
```bash
git checkout main
git merge develop
git push origin main

# Production automatically updates: https://demo.customereye.ai
```

### Emergency Rollback
```bash
# If something goes wrong, revert to previous commit
git checkout main
git reset --hard HEAD~1
git push origin main --force
```

### Useful Commands
```bash
# See all deployments
vercel ls

# Check deployment status
vercel inspect [deployment-url]

# View logs
vercel logs [deployment-url]
```

## Branch Strategy
- `main` → Production (demo.customereye.ai)
- `develop` → Staging (for testing)
- `feature/*` → Feature branches (for development)

## Environment Variables
Set these in Vercel dashboard:
- `NODE_ENV=production`
- `DATABASE_URL` (when you set up database)
- `NEXTAUTH_URL=https://demo.customereye.ai`
- `NEXTAUTH_SECRET` (generate secure key)
