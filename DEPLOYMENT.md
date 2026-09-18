# Host on Cloudflare Pages with GitHub

GitHub stores the source; Cloudflare Pages builds and hosts the website. This is not GitHub Pages. Use Cloudflare's built-in GitHub connection, not GitHub Actions or the earlier API-token helper.

No terminal, local Node.js installation, Cloudflare API token, or account-ID variable is required for these steps. Supabase is hosted separately from the frontend and needs the database setup described below. Cloudflare Pages provides a free HTTPS `pages.dev` address; a purchased domain is optional. Supabase has its own separate plan limits.

## Fix: No static files detected

If the log shows **Executing user deploy command: npx wrangler deploy** followed by **Could not detect a directory containing static files**, the project is running through the Workers deployment flow, not the Pages Git integration described here. If there is no preceding Vite build, `dist/` has not been generated in that build environment.

This is a deployment configuration problem, not a Supabase error. A Workers static-assets deployment is also possible, but do not mix its deploy-command settings with the Pages settings below.

1. Check the connected GitHub branch contains the actual source, not just a ZIP or README. `package.json`, `index.html`, `vite.config.ts`, and `src/` must be present.
2. If those files are inside a folder such as `a-little-note-for-you/`, set that folder as the Root directory. Otherwise leave Root directory blank. Do not point Root directory at `src/` or `dist/`.
3. Return to **Workers & Pages > Create application** and select **Pages**. Some dashboard versions show a small **Looking to deploy Pages? Get started** link below the Worker setup choices.
4. Inside the Pages flow, choose **Connect to Git** / **Import an existing Git repository**, select the same repository, and use a new available project name. You can leave the failed Worker unchanged; deleting it is not required.
5. Set framework **React (Vite)**, build command **`npm run build`**, and build output directory **`dist`**. A Pages Git setup asks for an output directory; it does not need a user-supplied `npx wrangler deploy` command. If that command is still shown, you are in the Workers flow.
6. Add the three build variables from step 6 below, then select **Save and Deploy**.

In the new build log, confirm that dependency installation and `npm run build` run, Vite creates `dist/index.html`, and Pages reports a successful deployment. Do not commit `dist/` or upload the source `index.html` as a substitute for building the React app.

## 1. Secure the previous token

Revoke the Cloudflare API token previously shared in chat. You do not need a replacement for GitHub integration. Never upload `.cloudflare.env` to GitHub, even if the repository is private.

## 2. Download the source

Use your editor's Download/Export option, then unzip the project on your computer. Find the folder containing `package.json`, `index.html`, `vite.config.ts`, and `src/`.

Keep the local `.env` file on your computer so you can copy the two Supabase values into Cloudflare later. Do not upload it to GitHub.

## 3. Create a GitHub repository

1. Sign in at [GitHub](https://github.com/) and open [New repository](https://github.com/new).
2. Choose a repository name, such as `a-little-note-for-you`.
3. Select **Private** if you do not want to publish the source. Cloudflare supports both private and public repositories.
4. Enable **Add a README file**, then select **Create repository**.
5. In the repository, select **Add file > Upload files**.
6. Upload the source folders and files listed below. Preserve the `src/` folder structure; do not upload a ZIP or the outer project folder.
7. Review the upload list, then select **Commit changes** on `main`.

### Files to upload

- `src/` and all its contents.
- `public/`, if present.
- `package.json` and `package-lock.json`, if a lockfile is present.
- `index.html`, `vite.config.ts`, and `tsconfig.json`.
- `.gitignore`, `.node-version`, `.env.example`, and `DEPLOYMENT.md`.

The `scripts/cloudflare.mjs` helper and `.cloudflare.env.example` are not needed for GitHub deployment. They can remain on your computer.

### Do not upload

- `.env`, `.env.local`, `.env.production`, or any other real environment file.
- `.cloudflare.env` or any file containing a Cloudflare API token.
- `.dev.vars`, `.wrangler/`, `node_modules/`, or `dist/`.

The included `.gitignore` protects normal Git-based uploads, but **GitHub's browser uploader does not enforce it**. Manually leave these files out. If a secret was previously committed, deleting the file does not erase the Git history; revoke the credential.

After uploading, `package.json` must be visible directly on the repository's main page, next to the `src/` folder. If it is inside an extra folder, move the source to the root or set that folder as Cloudflare's Root directory.

## 4. Connect Cloudflare to GitHub

1. Sign in to [Cloudflare](https://dash.cloudflare.com/).
2. Open **Workers & Pages > Create application > Pages**.
3. Choose **Connect to Git** or **Import an existing Git repository**, depending on the dashboard version.
4. Select GitHub and authorize Cloudflare to access the new repository. Grant access only to the intended repository where possible.
5. Select the repository and choose **Begin setup**.

Choose a **Pages** application, not a Worker. If Pages is not a tab, look for **Looking to deploy Pages? Get started** below the Worker choices. The Pages setup should include **Build output directory**, not a separate Wrangler **Deploy command**. You do not need to enable GitHub Pages or create a GitHub Actions workflow.

If you already made a Direct Upload Pages project with the earlier helper, create a new Git-connected Pages project with a different available name. An existing Direct Upload project cannot be switched to Git integration. You do not need to delete the old project to continue.

## 5. Set the build configuration

| Setting | Value |
| --- | --- |
| Project name | An available name, such as `a-little-note-for-you-sahasra` |
| Production branch | `main`, or the branch containing your source |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Leave blank when `package.json` is at the repository root |

If the React (Vite) preset is not shown, choose **None** and enter the same build command and output directory manually. Do not use `exit 0`; this project must be built.

## 6. Add build environment variables

Before selecting **Save and Deploy**, add these variables in the setup screen:

| Variable | Value |
| --- | --- |
| `NODE_VERSION` | `22` |
| `VITE_SUPABASE_URL` | `https://sftoifjyuomucchejejs.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | The replacement project's `sb_publishable_...` key from the local `.env` |

The included `.node-version` also selects Node.js 22 when it is uploaded with the source.

Copy only the value after `=` from `.env`, without extra spaces or quotes. Do not copy placeholders from `.env.example`. If the local `.env` was not included in the export, retrieve the publishable key from the replacement Supabase project's dashboard. Do not reuse a key from the deleted project.

The Supabase publishable key is **not** the Cloudflare API token. Never use a Supabase service-role key, secret key, or database password.

Set these for **Production**. Add the same values to **Preview** only if preview deployments should access the same real notes; preview receiving will claim real notes too.

After project creation, these settings are available under **Settings > Environment variables** or **Variables and Secrets**. If you add or change variables after the initial build, trigger a new deployment.

Vite embeds `VITE_` variables in the frontend at build time. They are intentionally visible in the browser. The existing Supabase RLS policies and `claim_random_note()` RPC protect the data; hiding the publishable key is not a security mechanism.

### Switching from the deleted Supabase project

The local `.env` now targets the replacement project `sftoifjyuomucchejejs`. This updates the frontend connection only; it does not recover data, recreate database objects, or change Cloudflare dashboard settings.

1. Replace both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Cloudflare's **build environment variables**. For Pages, use the project's environment-variable settings; for a Workers Git build, use **Settings > Build > Build variables and secrets**, not only runtime Variables and Secrets.
2. Update Preview variables as well if previews should use the replacement project. Cloudflare's build environment takes precedence over a local `.env` value, so an old dashboard value can keep the deployed app connected to the deleted project.
3. Save the changes and trigger a fresh build/deployment. Previously built JavaScript will not pick up new values until it is rebuilt.
4. In the replacement Supabase dashboard, verify the database requirements below. If anything is missing, restore it from a trusted backup or the original setup SQL before testing notes. Do not overwrite tables or functions that already exist.

Required database setup:

- `public.notes` with `id` (uuid), `content` (text), `created_at` (timestamptz), `claimed_at` (nullable timestamptz), and `status` (text: `available` or `claimed`). `id` and `created_at` need defaults because the frontend inserts only `content` and `status`.
- RLS enabled, with an anonymous INSERT grant/policy that allows valid, nonempty notes of at most 500 characters and the initial `available` status. Do not enable public browsing or arbitrary UPDATE/DELETE access.
- The existing zero-argument `public.claim_random_note()` RPC, callable by the anonymous role, which atomically locks one available row, marks it claimed, sets `claimed_at`, and returns only that claimed note. Receiving must continue to use this RPC, not direct frontend updates.

A new project does not inherit the deleted project's table, policies, RPC, or note records. The publishable key cannot administer or restore the schema. This configuration update does not run SQL against either project, and a successful frontend build does not verify that the replacement database is ready.

## 7. Save and deploy

Select **Save and Deploy**. Cloudflare installs dependencies, builds the app, and deploys it. Open the production `pages.dev` URL shown when deployment succeeds.

You do not need to run `scripts/cloudflare.mjs`, supply the Cloudflare account ID, or configure Cloudflare API credentials. Supabase continues to work from the deployed browser using the build variables above.

To update the site later, commit updated source files to the production branch on GitHub. Cloudflare automatically rebuilds and publishes them. There is no need to recreate the repository or Pages project.

## Before sharing publicly

- Confirm the Willow scene and the `created by Sahasra` graphic appear on desktop and mobile.
- Test leaving a note and check the confirmed insert in the existing Supabase table. Test RECEIVE > UNTIE > OPEN from another browser. Receiving consumes a real note, so do not repeatedly use it as a health check.
- Keep RLS enabled. Do not grant public note-list access to resolve permissions errors.
- The existing `seedIfEmpty()` in `src/lib/supabase.ts` uses a per-browser marker and can insert duplicate seeds for new visitors. Replace it with operator-run, one-time seeding before a public launch. This hosting guide update does not change database behavior.
- Notes kept in localStorage belong to the current browser and origin. Notes saved locally or on preview URLs do not automatically move to the production URL.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| `npx wrangler deploy` cannot detect static files | Follow **Fix: No static files detected** above. Use the Pages Git flow and ensure Vite builds `dist/` from the correct source root. |
| Repository not listed | Update the Cloudflare GitHub app's repository access and reload the setup screen. |
| `package.json` not found | Move source to the repository root or set the correct Root directory in Cloudflare. |
| Node.js version error | Set `NODE_VERSION=22` and rebuild. |
| Missing build output | Use `npm run build` and `dist`, not `src`, `public`, or the repository root. |
| Scene loads but notes fail | Verify both Supabase build variables, rebuild, and check that the existing Supabase project and RPC/RLS permissions are active. |
| Unexpected token prompt | Do not run the earlier helper. Use Cloudflare Pages' GitHub integration directly. |

A successful local build is not proof that Cloudflare has deployed the site. Confirm deployment success in the Cloudflare dashboard and test the live URL before sharing it.

## Official references

- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [React/Vite build settings and variables](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Direct Upload migration limitation](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Cloudflare Pages Free plan limits](https://developers.cloudflare.com/pages/platform/limits/)