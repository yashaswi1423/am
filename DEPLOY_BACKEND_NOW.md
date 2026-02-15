# Deploy Backend Manually to Vercel

Your backend needs to be redeployed with the diagnostic endpoint. Since Git auto-deploy isn't working, let's do it manually.

## Option 1: Using Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy Backend
```bash
cd "C:\Users\dwira\Downloads\am-main (1)\am-main\admin-dashboard\server"
vercel --prod
```

Follow the prompts:
- Link to existing project? **Yes**
- Select your backend project (am)
- Deploy? **Yes**

---

## Option 2: Using Vercel Dashboard (Manual Upload)

### Step 1: Create a ZIP file
1. Go to: `C:\Users\dwira\Downloads\am-main (1)\am-main\admin-dashboard\server`
2. Select all files in the server folder
3. Right-click → Send to → Compressed (zipped) folder
4. Name it: `backend-server.zip`

### Step 2: Deploy via Vercel Dashboard
1. Go to: https://vercel.com/new
2. Click "Deploy" without selecting a template
3. Drag and drop the `backend-server.zip` file
4. Wait for deployment

---

## Option 3: Fix Git Connection

### Step 1: Check Current Git Settings
1. Vercel Dashboard → Your backend project
2. Settings → Git
3. Check if connected to `yashaswi1423/am`

### Step 2: Reconnect if Needed
1. Click "Disconnect" if connected to wrong repo
2. Click "Connect Git Repository"
3. Select `yashaswi1423/am`
4. Set Root Directory to: `admin-dashboard/server`
5. Save and redeploy

---

## Verify It Worked

After deploying, visit:
```
https://am-seven-coral.vercel.app/api/test/db-info
```

Should show database info, not 404 error.
