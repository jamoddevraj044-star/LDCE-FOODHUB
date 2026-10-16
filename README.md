# LDCE FoodHub · Local delivery prototype

An end-to-end food ordering and delivery prototype built with Node.js, Express, MongoDB, and a responsive HTML/CSS/JavaScript frontend. The PHP/MySQL source has been moved to `legacy_php_backup/`; the app runs locally at `http://127.0.0.1:3000`.

For the beginner hosting walkthrough, follow [`HOSTING_NETLIFY.md`](HOSTING_NETLIFY.md). If `npm start` reports a missing file under `node_modules`, run `npm ci` once from this folder to reinstall the exact locked packages before starting the app.

## Customer flow

- Browse and search dishes; add items to the cart.
- Save up to 10 delivery addresses with recipient, mobile, PIN code, landmark, and drop-off instructions.
- Schedule a delivery for today or the next 14 days. Each date/window has a MongoDB-backed capacity of 12 orders, with upcoming windows shown as they fill.
- Review item total, delivery charge, platform fee, and final total. Delivery is free on orders of ₹499 or more.
- Choose cash on delivery or a clearly labelled simulated UPI payment. The simulation never charges money and does not ask for card or UPI credentials.
- Track order progress from placed through confirmed, preparing, out for delivery, and delivered. Orders can be cancelled before preparation begins.
- Table booking remains available from the customer dashboard.

## Admin flow

Admins can review new orders with the delivery address and schedule, move orders through delivery stages, approve table bookings, manage menu items and user roles, and see delivered-order revenue.

## Beginner setup in VS Code (MongoDB Atlas)

1. Install Node.js 22 or newer, then open this `food_project_web_ready2` folder in VS Code.
2. In MongoDB Atlas, open **Database & Network Access → IP Access List → Add IP Address**. Add your current IP address and confirm. Do not use `0.0.0.0/0` for this setup.
3. In Atlas, open **Database → Connect → Drivers**, choose **Node.js**, and copy the connection string. The VS Code MongoDB extension is optional; the app connects from Node itself.
4. Open `.env` in VS Code. It already exists in this project, so keep it and edit it rather than overwriting it. Set `MONGODB_URI` to the Atlas URI, replacing the example username, password, and cluster address; remove any `<` and `>` placeholder brackets. Keep or replace `JWT_SECRET` with a long random value, then add `ADMIN_USERNAME`, `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` of at least 12 characters if they are missing. (If `.env` is ever missing, copy `.env.example` first.)
5. Open **Terminal → New Terminal** in VS Code. Confirm the terminal is in this project folder, then run:

   ```sh
   npm install
   npm run seed:both
   npm start
   ```

6. Open `http://127.0.0.1:3000`. Sign in as the administrator using the username and password you put in `.env`.

`npm run seed:both` creates or updates the same 19 menu dishes, with the existing local photos, in both `ldce_foodhub` and `restaurant` on the MongoDB server named in `MONGODB_URI`. If you only want to seed the database selected by the URI, use `npm run seed`. If all three valid `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` settings are present, the seed also creates the administrator account. With all three absent, it seeds the menu only; add the admin settings and rerun it to create the admin. These commands are safe to run again: they update seeded dishes by image path instead of duplicating them. Existing MySQL customer accounts, orders, notifications, and reservations are not imported.

### Use local MongoDB instead

Install MongoDB Community Server (or start the included MongoDB with Docker Desktop), set `MONGODB_URI=mongodb://127.0.0.1:27017/ldce_foodhub` in `.env`, then run `npm ci`, `npm run seed:both`, and `npm start`. Atlas and the VS Code extension are not both required.

Keep `.env` private. Do not paste its database password or JWT secret into screenshots, chat, or GitHub.

## Local prototype limitations

- UPI is simulated for checkout and order-state demos. Real payments require a payment provider and server-side webhook verification.
- Delivery fee (₹35 below ₹499), platform fee (₹5), and slot capacity (12 per window) are demo business rules in `routes/api.js`.
- The seed script does not import existing MySQL users, orders, notifications, or reservations. Existing records need a separate migration before replacing a live database.
- Photo files are served from `public/assets/images/`. Persistent customer/admin uploads need object storage; this prototype uses existing menu photos.

## Main files

- `server.js` — localhost server entry point.
- `app.js` — Express app and static site serving.
- `routes/api.js` — auth, address book, delivery slots, orders, admin, and reservations API.
- `models/` — MongoDB schemas, including `DeliverySlot` capacity tracking.
- `public/` — storefront, menu, checkout, tracking, and admin screens.
- `scripts/seed.js` — initial categories, dishes, and administrator.
- `legacy_php_backup/` — archived PHP/MySQL source for reference.
