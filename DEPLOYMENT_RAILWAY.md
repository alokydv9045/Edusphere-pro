# 🚂 Railway Deployment Guide: EduSphere ERP

To deploy this project to Railway, you need to set up **two separate Railway Services** (one for the Client and one for the Server) within your Railway project.

---

## 🏗️ Step 1: Deploy the Backend (Server)

1.  **New Service:** Click "New" -> "GitHub Repo" -> Select this repository.
2.  **Root Directory:** In the Service Settings, set **Root Directory** to `server`.
3.  **Build Command:** `npm run build && npx prisma generate`
4.  **Environment Variables:** Add the following (from `server/.env.example`):
    *   `DATABASE_URL`: Your PostgreSQL connection string (use Railway's built-in Postgres).
    *   `JWT_SECRET`: A secure random string.
    *   `COOKIE_SECRET`: A secure random string.
    *   `NODE_ENV`: `production`
    *   `ALLOWED_ORIGINS`: The URL of your Railway Client (once deployed).
    *   `SCHOOL_ID`, `SCHOOL_NAME`, etc.

---

## 🎨 Step 2: Deploy the Frontend (Client)

1.  **New Service:** Click "New" -> "GitHub Repo" -> Select this repository.
2.  **Root Directory:** In the Service Settings, set **Root Directory** to `client`.
3.  **Environment Variables:**
    *   `NEXT_PUBLIC_API_URL`: The URL of your Railway Server (from Step 1) + `/api`.
    *   `NODE_ENV`: `production`

---

## 🛠️ Solutions to Common Issues

### 1. "npm: not found"
I have added a `nixpacks.toml` to the project root. This tells Railway to include the Node.js environment even if it doesn't find a `package.json` in the root folder. **However, setting the "Root Directory" to `server` or `client` as described above is the recommended way to fix this.**

### 2. Database Integration
Railway makes it easy to add a PostgreSQL database:
1.  Click **New** -> **Database** -> **Add PostgreSQL**.
2.  Once created, go to the **Connect** tab.
3.  Copy the **Connection URL** and use it as `DATABASE_URL` for your server service.

### 3. File Storage (Uploads)
Railway has an ephemeral filesystem.
- **Issue:** Files uploaded to `server/uploads/` will disappear when the service restarts.
- **Solution:** While Railway supports "Volumes" for persistent storage, it's better to use **Cloudinary** for scalable file management (already in your dependencies).

---

## 🛠️ Verification Command
To check if your server builds correctly before pushing:
```bash
cd server
npm install
npm run build
```
