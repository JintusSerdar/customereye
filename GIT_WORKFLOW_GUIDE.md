# 🚀 Git Workflow Guide for CustomerEye

## 📚 Understanding Git Basics

### What is Git?
Git is a version control system that tracks changes in your code. Think of it like a save system for your code, but much more powerful.

### Key Concepts:
- **Repository (repo)**: Your project folder with all the code
- **Branch**: A separate line of development (like different versions)
- **Commit**: A saved snapshot of your code
- **Remote**: The version on GitHub (cloud storage)

---

## 🌳 Branch Structure

### Your Current Setup:
```
main (production) → https://demo.customereye.ai
dev (development) → https://dev.customereye.ai
```

### Branch Purposes:
- **`main`**: Production code (live website)
- **`dev`**: Development code (testing website)
- **`feature/*`**: New features being worked on

---

## 🔧 Essential Git Commands

### 1. **Checkout/Switch** - Moving Between Branches
```bash
# Switch to dev branch
git checkout dev
# OR (newer syntax)
git switch dev

# Switch to main branch
git checkout main
git switch main
```

### 2. **Fetch** - Get Latest Info from GitHub
```bash
# Get latest info from GitHub (doesn't change your code)
git fetch origin

# Get latest info AND update your local branch
git pull origin dev
```

### 3. **Rebase** - Clean Up History
```bash
# Rebase your feature branch onto dev
git rebase dev

# Continue after fixing conflicts
git rebase --continue
```

### 4. **Merge** - Combine Branches
```bash
# Merge feature branch into dev
git checkout dev
git merge feature/your-feature-name
```

---

## 🚀 Your Workflow

### Step 1: Start New Feature
```bash
# 1. Make sure you're on dev
git checkout dev

# 2. Get latest changes
git pull origin dev

# 3. Create new feature branch
git checkout -b feature/your-feature-name
```

### Step 2: Work on Feature
```bash
# Make your changes, then:
git add .
git commit -m "Add your feature description"
```

### Step 3: Update Feature Branch
```bash
# If dev has new changes, update your feature
git checkout dev
git pull origin dev
git checkout feature/your-feature-name
git rebase dev
```

### Step 4: Merge to Dev
```bash
# 1. Switch to dev
git checkout dev

# 2. Merge your feature
git merge feature/your-feature-name

# 3. Push to GitHub
git push origin dev
```

### Step 5: Deploy to Production
```bash
# 1. Switch to main
git checkout main

# 2. Merge dev into main
git merge dev

# 3. Push to GitHub
git push origin main
```

---

## 🔄 Common Scenarios

### Scenario 1: "Publish Branch" Message
**What it means**: You have a local branch that doesn't exist on GitHub yet.

**Solution**:
```bash
# Push your branch to GitHub
git push origin your-branch-name
```

### Scenario 2: Behind Remote
**What it means**: Your local branch is older than GitHub.

**Solution**:
```bash
# Get latest changes
git pull origin dev
```

### Scenario 3: Merge Conflicts
**What it means**: Git can't automatically combine changes.

**Solution**:
```bash
# 1. Open the conflicted files
# 2. Look for <<<<<<< HEAD markers
# 3. Choose which code to keep
# 4. Remove the markers
# 5. git add .
# 6. git commit
```

---

## 🎯 Your Specific Workflow

### For New Features:
1. **Create feature branch**: `git checkout -b feature/feature-name`
2. **Work on feature**: Make changes, commit
3. **Test on dev**: Merge to dev, test on dev.customereye.ai
4. **Deploy to production**: Merge to main when ready

### For Quick Fixes:
1. **Work directly on dev**: Make changes, commit
2. **Push to dev**: `git push origin dev`
3. **Test on dev.customereye.ai**
4. **Deploy to production**: Merge to main

---

## 🚨 Important Rules

### ✅ DO:
- Always test on dev before main
- Use descriptive commit messages
- Keep dev up to date
- Create feature branches for big changes

### ❌ DON'T:
- Work directly on main (except for emergency fixes)
- Force push to main
- Merge broken code to main
- Forget to test on dev first

---

## 🔧 Troubleshooting

### "Your branch is behind"
```bash
git pull origin dev
```

### "Your branch is ahead"
```bash
git push origin dev
```

### "Merge conflicts"
1. Open conflicted files
2. Resolve conflicts manually
3. `git add .`
4. `git commit`

### "Detached HEAD"
```bash
git checkout dev
```

---

## 📱 Vercel Deployment

### Automatic Deployments:
- **main branch** → https://demo.customereye.ai
- **dev branch** → https://dev.customereye.ai

### Manual Deployment:
1. Push to GitHub
2. Vercel automatically detects changes
3. Builds and deploys automatically

---

## 🎯 Quick Reference

### Daily Commands:
```bash
# Check status
git status

# See branches
git branch -a

# Switch to dev
git checkout dev

# Get latest changes
git pull origin dev

# Create new feature
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Your message"

# Push to GitHub
git push origin dev
```

### Emergency Commands:
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (lose changes)
git reset --hard HEAD~1

# Force push (be careful!)
git push origin dev --force
```

---

## 🎉 You're Ready!

Now you understand:
- ✅ How to create feature branches
- ✅ How to merge to dev
- ✅ How to deploy to production
- ✅ How to handle common issues

**Remember**: Always test on dev.customereye.ai before pushing to main!
