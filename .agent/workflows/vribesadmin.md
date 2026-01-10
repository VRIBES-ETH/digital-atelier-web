---
description: Procedures for working with the local-only /vribesadmin path to avoid Cloudflare Worker size limits.
---

# Admin Panel (Local-Only) Workflow

The `/vribesadmin` directory contains heavy dependencies (Tiptap, Chart.js, etc.) that exceed Cloudflare's 3 MiB worker limit. Therefore, this path must remain local-only and must NOT be deployed to production.

## 1. Preparation for Editing
Before starting any work on the admin panel:
1. Open `.gitignore`.
2. Temporarily comment out or remove the line `src/app/vribesadmin`.
3. Save `.gitignore`.

## 2. Development
- Perform the required coding tasks within `src/app/vribesadmin`.
- Test changes locally at `http://localhost:3000/vribesadmin`.

## 3. Preparation for Deployment
Once work is complete and verified locally:
1. Open `.gitignore`.
2. Add back the line `src/app/vribesadmin` if it was removed.
3. Save `.gitignore`.

// turbo
4. Run the following command to remove the admin directory from git tracking (without deleting local files):
```bash
git rm --cached -r src/app/vribesadmin
```

## 4. Finalizing
1. Commit and push the changes (which will include `.gitignore` and any other modified files, but NOT the `vribesadmin` directory).
2. Verify that the production build on Cloudflare succeeds.
