# Host Culinary Console on Netlify

This project serves the website from Netlify and its `/api/*` routes from a Netlify Function. MongoDB must be online; a local URI such as `mongodb://127.0.0.1:27017/foodhub` only works on your own computer and cannot be used by Netlify.

## A. Prepare the Atlas database once

1. Create an Atlas cluster and a **database user** with read/write access to the `foodhub` database. This is separate from your Atlas website login.
2. In **Database & Network Access → IP Access List**, add your current IP address temporarily so your computer can seed the menu.
3. In VS Code, open this project folder and `.env`. Set `MONGODB_URI` to the Atlas **Drivers → Node.js** connection string. Replace all placeholders; do not leave angle brackets. Keep `.env` private.
4. Set `JWT_SECRET` to a long random value and add private `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` values (at least 12 characters for the password).
5. In the VS Code terminal, run:

   ```sh
   npm ci
   npm run seed:both
   ```

   `npm ci` replaces an incomplete `node_modules` folder using the lockfile. `npm run seed:both` creates or updates the existing 19 dishes in both the `ldce_foodhub` and `restaurant` databases on this Atlas cluster, plus the first admin account when the admin settings are present. To seed only the database named in `MONGODB_URI`, use `npm run seed`. It does not import old PHP user/order history.

## B. Deploy the site

1. Put the project in a GitHub repository. Keep `.env` and `node_modules` out of the repository; `.gitignore` already excludes them.
2. In Netlify, choose **Add new site → Import an existing project**, connect GitHub, and select the repository. If the repository contains this project inside a subfolder, set the Base directory to `food_project_web_ready2`; if this project folder is the repository root, leave Base directory blank.
3. Use the build settings from `netlify.toml`: build command `npm run build`, publish directory `public`, functions directory `netlify/functions`.
4. In the Netlify site settings, add these runtime environment variables under **Environment variables**:
   - `MONGODB_URI` — the same Atlas connection string used in `.env`.
   - `JWT_SECRET` — the same long random secret used to seed the admin.
5. In Atlas, Netlify's serverless requests do not come from your home IP. For a quick classroom demo, the simple network rule is `0.0.0.0/0`; it allows connections from any IP, so only use it with a strong, unique database password, a database user limited to `foodhub`, and demo data. A stricter IP allowlist is preferable when you have fixed egress IPs.
6. Trigger a Netlify deploy. After it succeeds, open your Netlify URL. Check `https://YOUR-SITE.netlify.app/api/health`; it should return JSON with `"status":"ok"` and `"database":"connected"`.

Netlify reads function environment variables from the site settings, not from `netlify.toml`. After changing a variable, trigger a new deploy. See [Netlify function environment variables](https://docs.netlify.com/build/functions/environment-variables/) and [MongoDB Atlas IP access lists](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

## Local preview

With MongoDB running locally and `.env` set to `mongodb://127.0.0.1:27017/ldce_foodhub`, run `npm ci` once, `npm run seed:both` once, then `npm start`. Open `http://127.0.0.1:3000`; don't use VS Code's **Go Live** button because it doesn't run the Node API.
