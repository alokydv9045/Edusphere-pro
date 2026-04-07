# 🚀 EduSphere ERP: Render Deployment Guide

This guide provides both **Blueprint** and **Manual** setup instructions for your EduSphere ERP project on Render.

## 📦 Project Configuration Details
- **Repository**: `alokydv9045/Edusphere-pro`
- **Branch**: `main`
- **Region**: `Oregon (US West)`
- **Node Version**: 20 (Set via Environment Variables)

---

## ⚡ Option A: Recommended (Blueprint)
The easiest way to deploy is using the `render.yaml` file already in your repository.
1. Go to **Dashboard > New + > Blueprint**.
2. Connect your repo: `alokydv9045/Edusphere-pro`.
3. Blueprint will automatically configure the **Database**, **Redis**, **API**, and **Client**.

---

## 🛠️ Option B: Manual Web Service Setup
If you prefer setting up services one by one, use the following configurations:

### 1. Backend Service (`edusphere-api`)
| Field | Value |
| :--- | :--- |
| **Name** | `edusphere-api` (or `Edusphere-pro-backend`) |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Language** | `Node` |
| **Root Directory** | `server` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npx prisma migrate deploy && npm start` |
| **Instance Type** | `Free` (or `Starter` for better performance) |

### 2. Frontend Service (`edusphere-client`)
| Field | Value |
| :--- | :--- |
| **Name** | `edusphere-client` (or `Edusphere-pro-frontend`) |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Language** | `Node` |
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or `Starter` for Next.js builds) |

---

## 🔑 Critical Environment Variables

For each service, click the **Environment** tab and add these:

### For the Backend (`edusphere-api`):
1. `NODE_VERSION`: `20`
2. `NODE_ENV`: `production`
3. `DATABASE_URL`: (From your Render Postgres service)
4. `REDIS_URL`: (From your Render Redis service)
5. `JWT_SECRET`: (Generate a long random string)
6. `COOKIE_SECRET`: (Generate a random string)
7. `ALLOWED_ORIGINS`: `*` (or your frontend URL after deploy)
8. `SCHOOL_ID`: `edusphere-001`
9. `SCHOOL_NAME`: `EduSphere School`
10. `CLOUDINARY_CLOUD_NAME`: (Required for file uploads)
11. `CLOUDINARY_API_KEY`
12. `CLOUDINARY_API_SECRET`

### For the Frontend (`edusphere-client`):
1. `NODE_VERSION`: `20`
2. `NODE_OPTIONS`: `--max-old-space-size=450` (Crucial for 512MB RAM builds)
3. `NEXT_PUBLIC_API_URL`: `https://edusphere-api.onrender.com/api` (Replace with your actual backend URL)

---

## 🏗️ Optimizations Summary
We have pre-configured the following for `alokydv9045/Edusphere-pro`:
- **Prisma**: Binary targets set to `debian-openssl-3.0.x` for Render compatibility.
- **Next.js**: Configured to bypass heavy linting/type-checks in production to save memory.
- **Logging**: Console logging enabled in production for visibility in the Render "Logs" tab.

**Happy Deploying!** 🎒🎓
