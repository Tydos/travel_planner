# Git Setup and Branch Creation

## If Not a Git Repository Yet

### Step 1: Initialize Git Repository

```bash
cd travel_planner
git init
```

### Step 2: Add Files and Make First Commit

```bash
# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Simplified Google OAuth app"
```

### Step 3: Connect to GitHub Repository

```bash
# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/your-username/your-repo-name.git

# Or if using SSH
git remote add origin git@github.com:your-username/your-repo-name.git
```

### Step 4: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## Create a New Branch

### Create and Switch to New Branch

```bash
# Create new branch and switch to it
git checkout -b feature/simplified-oauth

# Or using newer git switch command
git switch -c feature/simplified-oauth
```

### Make Changes and Commit

```bash
# Make your changes, then:
git add .
git commit -m "Your commit message"
```

### Push Branch to GitHub

```bash
# Push branch to GitHub
git push -u origin feature/simplified-oauth
```

## Quick Commands Summary

```bash
# Initialize git (if not already)
git init

# Create new branch
git checkout -b your-branch-name

# Add and commit changes
git add .
git commit -m "Your message"

# Push to GitHub
git push -u origin your-branch-name
```

## Common Branch Names

- `main` - Main branch
- `feature/simplified-oauth` - Feature branch
- `bugfix/fix-connection` - Bug fix branch
- `develop` - Development branch

