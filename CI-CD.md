# CI/CD

GitHub Actions runs `npm ci`, `npm run lint`, and `npm run build` for pull requests targeting `main`, pushes to `main`, and manual workflow runs.

Vercel preview deployments for pull requests and production deployments from `main` are available when the repository is configured with these GitHub settings:

- Repository variable `VERCEL_DEPLOY_ENABLED=true`
- Repository secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`

The Vercel project must use this repository as its source and have the required runtime environment variables configured in Vercel. Leave the variable unset to use Vercel's existing Git integration or to run CI only. Do not enable both Git-based auto-deploys and this workflow unless duplicate deployments are intended.
