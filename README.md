# PromptCraft AI

PromptCraft AI is an advanced workspace playground and community template catalog designed for crafting, optimizing, and organizing AI prompts. Powered by Google Gemini, next-generation analytics, and secure OAuth.

---

## 🛠️ Getting Started Locally

### 1. Database & Backend Setup
Navigate to the `server` directory, configure your environment, install dependencies, and run:
```bash
cd server
npm install
npm run dev
```

### 2. Frontend Setup
Navigate to the root directory, install dependencies, and run:
```bash
npm install
npm run dev
```

---

## 🚀 Production Deployment Instructions

### 1. Database Setup: MongoDB Atlas
1. Sign in to your [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas).
2. Create a new Database Cluster and click **Connect**.
3. Under **Connect to your application**, select the Driver as **Node.js** and copy the connection string (SRV URI).
4. Replace `<password>` and database name with your credentials. Keep this URL safe for Render environment variables.

### 2. Backend Deployment: Render
1. Sign in to [Render](https://render.com/).
2. Click **New** -> **Web Service** and connect your GitHub repository.
3. Configure the following service settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables** in Render settings:
   - `PORT`: `5000` (or leave default)
   - `MONGO_URI`: `mongodb+srv://...` (your MongoDB Atlas connection string)
   - `JWT_SECRET`: `your_secure_token_secret`
   - `JWT_EXPIRE`: `30d`
   - `GEMINI_API_KEY`: `your_gemini_api_key_value`
   - `GOOGLE_CLIENT_ID`: `your_google_oauth_client_id.apps.googleusercontent.com`
   - `GOOGLE_CLIENT_SECRET`: `your_google_oauth_client_secret`
   - `GOOGLE_CALLBACK_URL`: `https://your-backend-app.onrender.com/api/auth/google/callback`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app`

### 3. Frontend Deployment: Vercel
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project** and select your GitHub repository.
3. Vercel automatically detects the Next.js project. Configure the settings:
   - **Root Directory**: `./` (Root directory of the repository)
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
4. Add the following **Environment Variable** in Vercel settings:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-app.onrender.com/api` (URL of your Render backend API)
5. Click **Deploy**.
