# EduSphere ERP - Render Deployment Guide

This document provides a step-by-step guide to deploying the EduSphere ERP platform (Next.js + Express + Supabase) on [Render](https://render.com).

## Prerequisites
- A **GitHub** account with your code pushed to a repository.
- A **Render** account (Free tier is sufficient).
- Your **Supabase** Project credentials (already configured in `render.yaml`).

## Deployment Steps

### 1. Connect to Render
1. Log in to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file in your root directory.

### 2. Service Configuration
Render will show you a list of services to be created based on the blueprint:
- **edusphere-api** (Web Service/Backend)
- **edusphere-client** (Web Service/Frontend)

Click **Apply** to start the build process.

### 3. PostgreSQL & Prisma Migrations
The backend service is configured to run `npx prisma migrate deploy` automatically before starting. 
- Ensure your `DATABASE_URL` and `DIRECT_URL` (Supabase) are correctly set in the Render Environment Variables if you want to override the ones in `render.yaml`.

### 4. Post-Deployment Optimization (CRITICAL)
Once the deployment finishes, you will get two URLs (e.g., `https://edusphere-api.onrender.com` and `https://edusphere-client.onrender.com`).

1. Go to the **edusphere-client** (Frontend) service settings in Render.
2. In **Environment Variables**, check the `NEXT_PUBLIC_API_URL`.
3. Ensure it matches your actual **Backend** URL (e.g., `https://edusphere-api.onrender.com/api`).
4. If they don't match, update it and Render will rebuild the frontend with the correct link.

1. Go to the **edusphere-api** (Backend) service settings in Render.
2. In **Environment Variables**, update `ALLOWED_ORIGINS` to include your frontend URL (replace `*` with `https://edusphere-client.onrender.com`).
3. Save changes. The backend will restart.

## Maintenance
- **Logs**: View real-time logs in the "Logs" tab of each service.
- **Scaling**: If you experience slow response times on the Free tier, consider upgrading the Backend to the "Starter" plan to prevent spin-down delays.

---
*Created by Antigravity AI*
