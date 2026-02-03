# Deployment & CI/CD Guide 🚀

Complete guide for deploying the Testing Frameworks Demo and setting up CI/CD pipelines.

## Table of Contents

- [GitHub Repository Setup](#github-repository-setup)
- [GitHub Actions Configuration](#github-actions-configuration)
- [GitHub Pages for Reports](#github-pages-for-reports)
- [Environment Variables & Secrets](#environment-variables--secrets)
- [Optional Integrations](#optional-integrations)
- [Production Deployment](#production-deployment)

## GitHub Repository Setup

### 1. Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Testing Frameworks Demo"

# Create main branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/testing-frameworks-demo.git

# Push to GitHub
git push -u origin main
```

## GitHub Actions Configuration

### Workflows Already Included

The repository includes 4 pre-configured workflows:

1. **`jest-tests.yml`** - API integration tests
2. **`cypress-tests.yml`** - UI end-to-end tests
3. **`full-test-suite.yml`** - Complete test suite
4. **`qase-integration.yml`** - Qase.io integration

### Enable GitHub Actions

1. Go to repository Settings → Actions → General
2. Set "Actions permissions" to:
   - ☑️ Allow all actions and reusable workflows
3. Set "Workflow permissions" to:
   - ☑️ Read and write permissions
   - ☑️ Allow GitHub Actions to create and approve pull requests

### Verify Workflows

```bash
# Trigger a workflow manually
gh workflow run "Full Test Suite"

# Or push a commit
git commit --allow-empty -m "Trigger CI/CD"
git push
```

Check the "Actions" tab in your GitHub repository to see workflows running.

## Environment Variables & Secrets

### GitHub Secrets

Add these secrets in Settings → Secrets and variables → Actions:

#### Required (if using optional integrations):

**Qase.io Integration:**

```
QASE_API_TOKEN=your_qase_api_token
QASE_PROJECT_CODE=your_project_code
```

## Optional Integrations

### 1. Qase.io Integration

**Setup:**

```bash
# Add reporter to Jest
cd jest-tests
npm install --save-dev jest-qase-reporter

# Add reporter to Cypress
cd ../cypress-tests
npm install --save-dev cypress-qase-reporter
```

**Update workflow files:**

In `.github/workflows/jest-tests.yml`, add:

```yaml
env:
  QASE_API_TOKEN: ${{ secrets.QASE_API_TOKEN }}
  QASE_PROJECT_CODE: ${{ secrets.QASE_PROJECT_CODE }}
```

**Configure reporters:**

Update `jest-tests/package.json`:

```json
"jest": {
  "reporters": [
    "default",
    ["jest-qase-reporter", {
      "projectCode": "YOUR_PROJECT_CODE",
      "apiToken": "$QASE_API_TOKEN"
    }]
  ]
}
```

## Production Deployment

### Deploy the Application

#### Option 1: Heroku

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main

# Open app
heroku open
```

Add `Procfile`:

```
web: node app/server.js
```

#### Option 2: Docker

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY app/ ./app/

EXPOSE 3000

CMD ["node", "app/server.js"]
```

Build and run:

```bash
docker build -t testing-demo .
docker run -p 3000:3000 testing-demo
```

#### Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

Create `vercel.json`:

```json
{
	"version": 2,
	"builds": [
		{
			"src": "app/server.js",
			"use": "@vercel/node"
		}
	],
	"routes": [
		{
			"src": "/(.*)",
			"dest": "app/server.js"
		}
	]
}
```

#### Option 4: AWS (EC2)

1. Launch EC2 instance
2. Install Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Clone and run:

```bash
git clone your-repo-url
cd testing-frameworks-demo
npm install
npm start
```

4. Use PM2 for process management:

```bash
sudo npm install -g pm2
pm2 start app/server.js --name testing-demo
pm2 startup
pm2 save
```

### Update Tests for Production

Update API URL in test configurations:

**Jest (`jest-tests/tests/api.test.js`):**

```javascript
const API_BASE_URL =
	process.env.API_URL || "https://your-production-url.com/api";
```

**Cypress (`cypress-tests/cypress.config.js`):**

```javascript
e2e: {
  baseUrl: process.env.CYPRESS_BASE_URL || 'https://your-production-url.com',
}
```

### Add Production Test Workflow

Create `.github/workflows/production-tests.yml`:

```yaml
name: Production Tests

on:
  schedule:
    - cron: "0 */6 * * *" # Every 6 hours
  workflow_dispatch:

jobs:
  test-production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20.x"

      - name: Install dependencies
        run: npm run install:all

      - name: Run API tests against production
        run: npm run test:jest
        env:
          API_URL: https://your-production-url.com/api

      - name: Run UI tests against production
        run: npm run test:cypress
        env:
          CYPRESS_BASE_URL: https://your-production-url.com
```

## Monitoring & Alerts

### 1. GitHub Status Checks

Automatically enabled via GitHub Actions.

### 2. UptimeRobot

Monitor production uptime:

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor for your production URL
3. Set up email/SMS alerts

### 3. Better Uptime

1. Sign up at [betteruptime.com](https://betteruptime.com)
2. Add status page
3. Configure incident management

### 4. Custom Alerts

Add to workflows:

```yaml
- name: Alert on Failure
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: '🚨 Production Tests Failed',
        body: 'Production tests are failing. Check logs immediately.',
        labels: ['bug', 'urgent', 'production']
      });
```

## Troubleshooting CI/CD

### Workflows Not Running

1. Check Actions permissions in Settings
2. Verify workflow syntax: `yamllint .github/workflows/*.yml`
3. Check workflow logs for errors

### Tests Failing in CI but Passing Locally

1. Check Node.js version matches
2. Verify environment variables
3. Check for race conditions
4. Add more wait time for async operations

### Artifacts Not Uploading

1. Ensure paths exist before upload
2. Check `if: always()` is set
3. Verify artifact retention policy

### GitHub Pages Not Working

1. Ensure Actions have write permissions
2. Check Pages settings are correct
3. Wait a few minutes after first deployment
4. Check Actions logs for deployment errors

## Best Practices

1. **Never commit secrets** - Use GitHub Secrets
2. **Use branch protection** - Require tests to pass
3. **Regular dependency updates** - Use Dependabot
4. **Monitor test performance** - Track execution time
5. **Keep workflows DRY** - Use reusable workflows
6. **Tag releases** - Use semantic versioning
7. **Document changes** - Keep CHANGELOG.md updated

## Next Steps

- ✅ Push code to GitHub
- ✅ Enable GitHub Actions
- ✅ Set up GitHub Pages
- ✅ Add required secrets
- ✅ Configure branch protection
- ✅ Deploy to production
- ✅ Set up monitoring
- ✅ Configure notifications

---

**Your CI/CD pipeline is ready!** 🎉
