# ⚡ QUICK START - AM FASHIONS DEPLOYMENT

## 🎯 What You Need

- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Supabase account (free)
- [ ] Your domain name
- [ ] 45 minutes of time

---

## 📝 Deployment Order

```
1. Supabase Database    (10 min) → Get DATABASE_URL
2. Backend API          (10 min) → Get BACKEND_URL
3. Admin Dashboard      (8 min)  → Get ADMIN_URL
4. Main Website         (12 min) → Connect your domain
5. Update Backend URLs  (5 min)  → Final configuration
```

---

## 🔑 Important URLs to Save

As you deploy, save these in Notepad:

```
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

BACKEND_URL=https://am-fashions-backend.vercel.app
ADMIN_URL=https://am-fashions-admin.vercel.app
WEBSITE_URL=https://yourdomain.com
```

---

## 📂 Vercel Root Directories

When deploying to Vercel, use these Root Directories:

| Project | Root Directory |
|---------|----------------|
| Backend API | `admin-dashboard/server` |
| Admin Dashboard | `admin-dashboard/client` |
| Main Website | `./` (leave blank) |

---

## 🌐 Backend Environment Variables (12 total)

Copy these to Vercel when deploying backend:

```env
DATABASE_URL=postgresql://postgres:...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
PORT=5000
NODE_ENV=production
JWT_SECRET=random-secret-key-here
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf
ADMIN_EMAIL=madasumiteesh@gmail.com
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://admin.vercel.app
```

---

## 🎨 Frontend Environment Variables

**Admin Dashboard (.env.production):**
```env
VITE_API_URL=https://am-fashions-backend.vercel.app/api
```

**Main Website (.env.production):**
```env
REACT_APP_API_URL=https://am-fashions-backend.vercel.app/api
```

---

## 🔍 Testing Checklist

After deployment, test these:

- [ ] Backend health: `https://backend-url/api/health`
- [ ] Website loads: `https://yourdomain.com`
- [ ] Products display correctly
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can upload payment screenshot
- [ ] Receive email confirmation
- [ ] Admin login works
- [ ] Can see orders in admin
- [ ] No CORS errors in console (F12)

---

## 🚀 Quick Commands

**Push changes to deploy:**
```bash
cd C:\Users\chara\OneDrive\Documents\am_fashions\am_fashiona
git add .
git commit -m "Update"
git push origin main
```

**All services auto-deploy!**

---

## 📞 Need Help?

**Full Guide:** See `DEPLOYMENT_CHECKLIST.md`  
**Email:** madasumiteesh@gmail.com  
**Supabase:** https://supabase.com/docs  
**Vercel:** https://vercel.com/docs

---

## 💡 Pro Tips

1. **Deploy in order** - Backend first, then admin, then website
2. **Save all URLs** - You'll need them for configuration
3. **Test each step** - Don't move forward if something doesn't work
4. **DNS takes time** - Domain may take 10-60 minutes to work
5. **Check console** - Press F12 to see any errors

---

**Ready? Start with `DEPLOYMENT_CHECKLIST.md`** 🚀
