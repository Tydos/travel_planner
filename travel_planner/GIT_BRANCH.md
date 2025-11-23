# Create GitHub Branch

## Create and Push a New Branch to GitHub

### Option 1: Create Branch Locally and Push

```bash
# Navigate to your project
cd travel_planner

# Create a new branch
git checkout -b your-branch-name

# Or if you want to create from a specific branch
git checkout -b your-branch-name main
# or
git checkout -b your-branch-name master

# Make your changes, then commit
git add .
git commit -m "Your commit message"

# Push the branch to GitHub
git push -u origin your-branch-name
```

### Option 2: Create Branch and Switch in One Command

```bash
# Create and switch to new branch
git checkout -b feature/simplified-oauth

# Or using newer git switch command
git switch -c feature/simplified-oauth
```

### Option 3: Create Branch Without Switching

```bash
# Create branch but stay on current branch
git branch your-branch-name

# Switch to it later
git checkout your-branch-name
```

## Common Branch Names

- `feature/simplified-oauth` - For new features
- `bugfix/fix-mongodb-connection` - For bug fixes
- `main` or `master` - Main branch
- `develop` - Development branch

## Push Existing Branch to GitHub

```bash
# If branch already exists locally
git push -u origin your-branch-name
```

## View All Branches

```bash
# Local branches
git branch

# Remote branches
git branch -r

# All branches (local + remote)
git branch -a
```

## Switch Between Branches

```bash
# Switch to existing branch
git checkout branch-name

# Or using newer command
git switch branch-name
```

## Delete Branch

```bash
# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name
```

