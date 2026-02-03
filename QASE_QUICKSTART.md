# Qase.io Quick Start Guide ⚡

Get Qase.io test management integrated in 5 minutes!

## 1. Sign Up for Qase.io (2 minutes)

1. Go to [https://app.qase.io/signup](https://app.qase.io/signup)
2. Sign up for free (no credit card required)
3. Verify your email

## 2. Create Project & Get Credentials (2 minutes)

1. Log in to Qase.io
2. Click "Create new project"
   - Name: `Testing Frameworks Demo`
   - Code: `TFD` (or your choice)
3. Click on your profile (top right) → "API tokens"
4. Generate new token and copy it
5. Note your project code from URL: `https://app.qase.io/project/YOUR_CODE`

## 3. Install Dependencies (1 minute)

```bash
# Quick automated setup
./setup-qase.sh
```

Or manually:

```bash
cd jest-tests && npm install
cd ../cypress-tests && npm install
```

## 4. Configure Credentials (1 minute)

**Option A: Local Development (.env files)**

```bash
# Jest
cd jest-tests
cp .env.example .env
# Edit .env and add your token and project code

# Cypress
cd ../cypress-tests
cp .env.example .env
# Edit .env and add your token and project code
```

**Option B: GitHub Actions (Secrets)**

Go to your repository Settings → Secrets → Actions:

- Add `QASE_API_TOKEN` = your token
- Add `QASE_PROJECT_CODE` = your code (e.g., TFD)

## 5. Run Tests! (30 seconds)

```bash
# Start the app (in one terminal)
npm start

# Run Jest tests with Qase (in another terminal)
cd jest-tests
npm run test:qase

# Run Cypress tests with Qase
cd cypress-tests
npm run cy:run:qase
```

## 6. View Results (instantly)

1. Go to [https://app.qase.io](https://app.qase.io)
2. Select your project
3. Click "Test runs"
4. See your test results! 🎉

## What You Get

✅ **Automatic test reporting** to Qase dashboard
✅ **Test case management** - organize all your tests
✅ **Run history** - track trends over time
✅ **Pass/fail metrics** - see what's working
✅ **Defect linking** - connect failures to bugs
✅ **Team collaboration** - share results with team
✅ **CI/CD integration** - automatic reporting from GitHub Actions

## GitHub Actions Integration

Already configured! Just add secrets:

1. Go to GitHub repo → Settings → Secrets → Actions
2. Add:
   - `QASE_API_TOKEN`
   - `QASE_PROJECT_CODE`
3. Push code or create PR
4. Tests automatically report to Qase! ✨

Workflow file: `.github/workflows/qase-integration.yml`

## Troubleshooting

**Tests run but don't appear in Qase?**

- Check `QASE_MODE=testops` is set
- Verify API token is correct
- Check project code matches your Qase project

**Authentication error?**

- Regenerate API token in Qase settings
- Update your .env files or GitHub secrets

**Need help?**

- Full guide: [QASE_SETUP.md](./QASE_SETUP.md)
- Qase docs: https://help.qase.io/
- Support: support@qase.io

## Quick Commands Reference

```bash
# Setup
./setup-qase.sh

# Run with Qase
npm run test:qase              # Jest
npm run cy:run:qase            # Cypress

# Debug
QASE_DEBUG=true npm run test:qase
```

## Next Steps

1. ✅ Tests running and reporting to Qase
2. 📝 Read full guide: [QASE_SETUP.md](./QASE_SETUP.md)
3. 🎯 Add test case IDs for better tracking
4. 📊 Explore Qase dashboard features
5. 🔗 Connect to Jira, Slack, etc.

---

**That's it!** Your tests are now integrated with Qase.io test management. 🚀

For detailed configuration and advanced features, see [QASE_SETUP.md](./QASE_SETUP.md).
