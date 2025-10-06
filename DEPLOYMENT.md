# 🚀 CustomerEye Deployment Guide

> **Table of Contents**
> - [Quick Reference](#quick-reference)
> - [Branch Strategy](#branch-strategy)
> - [Daily Workflow](#daily-workflow)
> - [Clean Up After Merging](#5️⃣-clean-up-after-merging-a-feature)
> - [Safe Rebase](#6️⃣-safe-rebase-keep-a-feature-branch-updated)
> - [When NOT to Rebase](#7️⃣-when-not-to-rebase)
> - [Emergency Rollback](#emergency-rollback)
> - [Useful Git Flags](#useful-git-flags-cheat-sheet)
> - [Vercel CLI Tips](#vercel-cli-tips)
> - [Environment Variables](#environment-variables)

---

## Quick Reference

### URLs
- **Production**: https://demo.customereye.ai (main branch)  
- **Staging**: https://customereye-git-develop-jintusserdars-projects.vercel.app (develop branch)  
- **Feature Previews**: https://customereye-git-[feature-name]-jintusserdars-projects.vercel.app

---

## Branch Strategy
| Branch      | Purpose                       | Deployment |
|-------------|-------------------------------|------------|
| `main`      | Production (live site)        | https://demo.customereye.ai |
| `develop`   | Staging / integration         | https://customereye-git-develop-jintusserdars-projects.vercel.app |
| `feature/*` | Isolated feature branches     | `https://customereye-git-[feature]-jintusserdars-projects.vercel.app` |

---

## Daily Workflow

### 1️⃣ Start a New Feature
```bash
git switch develop
git pull --rebase origin develop
git switch -c feature/your-feature
```

### 2️⃣ Make Changes & Test
```bash
# Edit code
git add -p        # or: git add .
git commit -m "feat: description of changes"
git push -u origin feature/your-feature

# Preview URL:
# https://customereye-git-[feature]-jintusserdars-projects.vercel.app
```

### 3️⃣ Merge to Staging
```bash
# Open PR: base = develop, compare = feature/your-feature
# After review, merge → develop.
# Staging auto-updates:
# https://customereye-git-develop-jintusserdars-projects.vercel.app
```

### 4️⃣ Release to Production
```bash
git switch main
git pull --rebase origin main
git merge --no-ff develop -m "Release: <summary>"
git push origin main

# Production: https://demo.customereye.ai
```

### 5️⃣ Clean Up After Merging a Feature
```bash
git switch develop
git pull --rebase origin develop
git branch -d feature/your-feature        # delete locally
git push origin --delete feature/your-feature  # delete remotely
```

### 6️⃣ Safe Rebase (Keep a Feature Branch Updated)
```bash
git fetch origin
git rebase origin/develop      # replay commits on top of latest develop
git push --force-with-lease    # only if you had pushed before
```

> ⚠️ **Use `--force-with-lease` (never `--force`)** to avoid overwriting teammates' work.

### 7️⃣ When NOT to Rebase
- When teammates are already working off your branch
- When a PR is open and under review
- On protected branches (main, develop, releases)
- On commits owned/published by others

**Safer options:**
```bash
# Merge base into your feature instead:
git switch feature/your-feature
git fetch origin
git merge origin/develop
git push
```

---

## Emergency Rollback
```bash
git switch main
git reset --hard HEAD~1
git push origin main --force
```

---

## Useful Git Flags (Cheat Sheet)
| Flag | Meaning |
|------|---------|
| `-c` | create branch with `git switch -c` |
| `--rebase` | replay commits on top of updated branch |
| `-d` | delete local branch if merged |
| `-D` | force delete local branch |
| `-u` | set upstream for easy push/pull |
| `--no-ff` | force merge commit (preserve bubble) |
| `--force-with-lease` | safe force push |

---

## Vercel CLI Tips
```bash
# See all deployments
vercel ls

# Check deployment status
vercel inspect [deployment-url]

# View logs
vercel logs [deployment-url]

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

---

## Environment Variables

### Required Variables
| Key | Value | Description |
|-----|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string |
| `AWS_ACCESS_KEY_ID` | `AKIA...` | AWS access key for S3 |
| `AWS_SECRET_ACCESS_KEY` | `...` | AWS secret key for S3 |
| `AWS_REGION` | `us-east-1` | AWS region |
| `AWS_S3_BUCKET` | `customereye` | S3 bucket name |
| `NEXTAUTH_URL` | `https://demo.customereye.ai` | Production URL |
| `NEXTAUTH_SECRET` | `<secure-key>` | NextAuth secret |

### Optional Variables
| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `VERCEL_URL` | `auto` | Vercel deployment URL |

---

## 🚀 Current Project Status

### ✅ Production Ready Features
- **6,078 Companies** analyzed and uploaded
- **15+ Industries** with clean data
- **3 Countries** (US, CA, UK) supported
- **Complete API** with filtering, sorting, pagination
- **S3 Integration** with file proxy
- **Responsive UI** with modern design
- **Database Schema** optimized for queries

### 📊 Data Status
- **Total Reports**: 6,078
- **Data Files**: 36,468+ files in S3
- **Industries**: Beauty & Wellbeing, Vehicles & Transportation, etc.
- **Rating System**: All ratings set to 0 (no fake data)
- **File Structure**: Organized in S3 with proper naming

### 🔧 Technical Status
- **Next.js 15** with App Router
- **Prisma ORM** with PostgreSQL
- **AWS S3** for file storage
- **Vercel** deployment ready
- **TypeScript** fully implemented
- **Tailwind CSS** for styling

---

## 🎯 Best Practices

### Commit Messages
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Branch Naming
- `feature/add-user-authentication`
- `fix/login-validation-error`
- `docs/update-deployment-guide`
- `refactor/optimize-database-queries`

### Pull Request Guidelines
1. **Clear Title**: Describe what the PR does
2. **Description**: Explain the changes and why
3. **Screenshots**: For UI changes
4. **Testing**: How you tested the changes
5. **Breaking Changes**: If any, clearly document them

---

## 🚨 Troubleshooting

### Common Issues

**Deployment fails:**
```bash
# Check build logs
vercel logs [deployment-url]

# Check environment variables
vercel env ls
```

**Domain not working:**
1. Check DNS records are correct
2. Wait for DNS propagation (5-10 minutes)
3. Verify domain is added in Vercel dashboard

**Build errors:**
```bash
# Test locally first
npm run build
npm run start

# Check for TypeScript errors
npm run lint
```

---

## ✅ Pre-Deployment Checklist

### 🔧 Environment Setup
- [ ] Database URL configured in Vercel
- [ ] AWS S3 credentials added to Vercel
- [ ] NEXTAUTH_SECRET generated and set
- [ ] NEXTAUTH_URL set to production domain
- [ ] All environment variables verified

### 🗄️ Database
- [ ] PostgreSQL database created and accessible
- [ ] Prisma schema deployed (`npx prisma db push`)
- [ ] Database seeded with production data
- [ ] All 6,078 companies uploaded
- [ ] S3 files accessible via API proxy

### 🧪 Testing
- [ ] Local build successful (`npm run build`)
- [ ] All API endpoints working
- [ ] File uploads/downloads working
- [ ] Search and filtering functional
- [ ] Pagination working correctly
- [ ] Mobile responsive design verified

### 🚀 Deployment
- [ ] Code committed to main branch
- [ ] Vercel project connected
- [ ] Domain configured (demo.customereye.ai)
- [ ] SSL certificate active
- [ ] Production deployment successful

### 📊 Post-Deployment
- [ ] Site loads correctly
- [ ] All companies searchable
- [ ] Reports display properly
- [ [ ] S3 files loading
- [ ] Performance acceptable
- [ ] No console errors

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Git Best Practices](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

*Last updated: $(date)*