# Contributing to Neuraloom

## Git Workflow & Best Practices

This document outlines the Git workflow and best practices to protect the project from corruption and maintain code quality.

### Branch Naming Conventions

Follow these naming conventions for different types of branches:

- **Feature branches**: `feature/feature-name` or `feat/feature-name`
  - Example: `feature/add-mindmap-visualization`
  
- **Bug fix branches**: `bugfix/bug-description` or `fix/bug-description`
  - Example: `bugfix/seed-input-validation`
  
- **Hotfix branches**: `hotfix/issue-description`
  - Example: `hotfix/database-connection-error`
  
- **Documentation branches**: `docs/documentation-update`
  - Example: `docs/api-endpoints`

- **Maintenance branches**: `chore/maintenance-task`
  - Example: `chore/update-dependencies`

### Commit Message Guidelines

Write clear, concise commit messages following this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

**Subject:**
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Max 50 characters

**Example:**
```
feat(api): add seed creation endpoint

Implement POST /api/seeds endpoint to create new seeds
with validation and error handling.

Closes #123
```

### Git Workflow Steps

#### 1. Create a New Feature Branch
```bash
git checkout -b feature/your-feature-name
```

#### 2. Make Changes Locally
```bash
git add .
git commit -m "feat: add feature description"
```

#### 3. Keep Branch Updated
```bash
git fetch origin
git rebase origin/main
```

#### 4. Push to Remote
```bash
git push origin feature/your-feature-name
```

#### 5. Create a Pull Request
- Use clear title and description
- Link related issues with `Closes #issue-number`
- Request code review from team members

#### 6. Merge After Approval
```bash
git checkout main
git pull origin main
git merge feature/your-feature-name
git push origin main
```

### Protected Main Branch Rules

The main branch is protected with the following rules:
- ✅ Require pull request reviews before merging
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require branches to be up to date before merging
- ✅ Require commit signature verification
- ✅ Include administrators in restrictions

### Pre-commit Checks

Before committing, ensure:
1. **No sensitive data** (secrets, API keys, passwords)
   - Check `.env` files are in `.gitignore`
   - Never commit files containing credentials

2. **Code quality**
   - Run linters: `npm run lint`
   - Format code: `npm run format`
   - Fix issues: `npm run lint:fix`

3. **Tests pass**
   - Run tests: `npm test`
   - Ensure new code is covered by tests

### Preventing Accidental Commits

#### Exclude sensitive files:
```bash
# Add to global .gitignore
git config --global core.excludesfile ~/.gitignore_global

# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

#### Review changes before committing:
```bash
git diff          # See unstaged changes
git diff --cached # See staged changes
```

#### Amend last commit (before pushing):
```bash
git add .
git commit --amend --no-edit
```

#### Revert last commit (not pushed):
```bash
git reset --soft HEAD~1
```

### Syncing with Remote

#### Pull latest changes:
```bash
git pull origin main
```

#### Fetch without merging:
```bash
git fetch origin
git log origin/main
```

#### Rebase to avoid merge commits:
```bash
git pull --rebase origin main
```

### Handling Conflicts

1. **Identify conflicts:**
   ```bash
   git status  # See conflicted files
   ```

2. **Resolve conflicts** in your editor, then:
   ```bash
   git add .
   git commit -m "fix: resolve merge conflicts"
   ```

3. **Rebase conflicts:**
   ```bash
   git rebase --continue  # After resolving
   git rebase --abort     # To cancel rebase
   ```

### Regular Cleanup

Keep your local repository clean:

```bash
# Delete local branches that were deleted on remote
git fetch --prune

# Delete local merged branches
git branch -d merged-branch-name

# See branches merged into main
git branch --merged main

# See branches not merged into main
git branch --no-merged main
```

### Disaster Recovery

#### View commit history:
```bash
git log --oneline -10  # Last 10 commits
git log --graph --all  # Visual branch history
```

#### Recover deleted commits:
```bash
git reflog                    # See all operations
git checkout <commit-hash>    # Go to specific commit
git checkout -b recovery      # Create branch from it
```

#### Undo pushed changes (only on non-main branches):
```bash
git revert <commit-hash>      # Create inverse commit
git push origin feature/name
```

## Code Review Checklist

Before approving a PR, verify:
- ✅ Code follows project style guide
- ✅ No hardcoded values or magic numbers
- ✅ Error handling is comprehensive
- ✅ No sensitive data in code
- ✅ Tests are included and passing
- ✅ Documentation is updated
- ✅ Commit messages are clear and descriptive

## Questions?

If you have questions or encounter issues, please:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Contact the project maintainers

Happy coding! 🚀
