# 🏗️ AM FASHIONS - ARCHITECTURE OVERVIEW

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CUSTOMERS                           │
│                  (Your Domain Visitors)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   MAIN WEBSITE (Frontend)                   │
│              https://yourdomain.com                         │
│                                                             │
│  📂 Location: am_fashiona/ (root folder)                   │
│  🛠️  Tech: React + Create React App                        │
│  🚀 Hosted: Vercel                                          │
│  📦 Build: npm run build → build/                          │
│                                                             │
│  Features:                                                  │
│  • Product catalog                                          │
│  • Shopping cart                                            │
│  • Checkout form                                            │
│  • Payment screenshot upload                                │
│  • Order confirmation                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (Server)                     │
│         https://am-fashions-backend.vercel.app              │
│                                                             │
│  📂 Location: am_fashiona/admin-dashboard/server/          │
│  🛠️  Tech: Node.js + Express                               │
│  🚀 Hosted: Vercel Serverless Functions                     │
│  📦 Entry: server.js                                        │
│                                                             │
│  Features:                                                  │
│  • REST API endpoints                                       │
│  • Authentication (JWT)                                     │
│  • Email notifications (Nodemailer)                         │
│  • File uploads (Multer)                                    │
│  • CORS configuration                                       │
│  • Database queries                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ SQL Queries
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE DATABASE                          │
│              https://xxxxx.supabase.co                      │
│                                                             │
│  🛠️  Tech: PostgreSQL 15                                    │
│  🚀 Hosted: Supabase Cloud                                  │
│  💾 Storage: 500MB (Free Tier)                             │
│                                                             │
│  Tables:                                                    │
│  • products (product catalog)                               │
│  • product_variants (sizes, colors)                         │
│  • customers (customer info)                                │
│  • orders (order records)                                   │
│  • order_items (order details)                              │
│  • payments (payment screenshots)                           │
│  • payment_verifications (verification status)              │
│  • admins (admin users)                                     │
│  • login_approval_requests (admin login)                    │
│  • coupons (discount codes)                                 │
│  • returns (return requests)                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ SQL Queries
                         ↑
┌─────────────────────────────────────────────────────────────┐
│                 ADMIN DASHBOARD (Frontend)                  │
│          https://am-fashions-admin.vercel.app               │
│                                                             │
│  📂 Location: am_fashiona/admin-dashboard/client/          │
│  🛠️  Tech: React + Vite                                     │
│  🚀 Hosted: Vercel                                          │
│  📦 Build: npm run build → dist/                           │
│                                                             │
│  Features:                                                  │
│  • Dashboard analytics                                      │
│  • Order management                                         │
│  • Payment verification                                     │
│  • Customer management                                      │
│  • Product management                                       │
│  • Inventory tracking                                       │
│  • Coupon management                                        │
│  • Return management                                        │
└─────────────────────────────────────────────────────────────┘
                         ↑
                         │
┌────────────────────────┴────────────────────────────────────┐
│                      ADMIN USERS                            │
│                 (Store Managers)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Examples

### Example 1: Customer Places Order

```
1. Customer fills checkout form on website
   ↓
2. Website sends POST to /api/orders
   ↓
3. Backend validates data
   ↓
4. Backend saves to Supabase:
   - customers table (customer info)
   - orders table (order record)
   - order_items table (products ordered)
   - payments table (payment screenshot)
   ↓
5. Backend sends email via Nodemailer
   ↓
6. Website shows success message
```

### Example 2: Admin Verifies Payment

```
1. Admin logs into dashboard
   ↓
2. Dashboard fetches orders from /api/orders
   ↓
3. Backend queries Supabase orders table
   ↓
4. Dashboard displays orders with payment screenshots
   ↓
5. Admin clicks "Approve" or "Reject"
   ↓
6. Dashboard sends PATCH to /api/payments/:id
   ↓
7. Backend updates payment_verifications table
   ↓
8. Backend sends email to customer
   ↓
9. Dashboard shows updated status
```

---

## 📁 Folder Structure

```
am_fashiona/                          ← ROOT (Main Website)
│
├── src/                              ← Website source code
│   ├── components/                   ← React components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Chatbot.jsx
│   │   └── ...
│   ├── pages/                        ← Website pages
│   │   ├── Home.jsx
│   │   ├── Cart.jsx
│   │   ├── Payment.jsx
│   │   └── ...
│   ├── services/
│   │   └── api.js                    ← API calls
│   └── App.js                        ← Main app
│
├── public/                           ← Static assets
│   └── *.jpeg                        ← Product images
│
├── .env.production                   ← Website environment
├── package.json                      ← Website dependencies
├── vercel.json                       ← Website Vercel config
│
└── admin-dashboard/                  ← ADMIN FOLDER
    │
    ├── client/                       ← Admin Dashboard
    │   ├── src/
    │   │   ├── components/           ← Dashboard components
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   ├── Table.jsx
    │   │   │   └── ...
    │   │   ├── pages/                ← Dashboard pages
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Orders.jsx
    │   │   │   ├── PaymentVerifications.jsx
    │   │   │   └── ...
    │   │   ├── services/
    │   │   │   └── api.js            ← API calls
    │   │   └── App.jsx               ← Main app
    │   │
    │   ├── .env.production           ← Admin environment
    │   ├── package.json              ← Admin dependencies
    │   └── vercel.json               ← Admin Vercel config
    │
    ├── server/                       ← Backend API
    │   ├── config/
    │   │   ├── database.js           ← MySQL config
    │   │   └── database-postgres.js  ← PostgreSQL config
    │   │
    │   ├── controllers/              ← Business logic
    │   │   ├── authController.js
    │   │   ├── ordersController.js
    │   │   ├── productsController.js
    │   │   └── ...
    │   │
    │   ├── routes/                   ← API routes
    │   │   ├── auth.js
    │   │   ├── orders.js
    │   │   ├── products.js
    │   │   └── ...
    │   │
    │   ├── middleware/
    │   │   └── authMiddleware.js     ← JWT verification
    │   │
    │   ├── services/
    │   │   └── emailService.js       ← Email sending
    │   │
    │   ├── server.js                 ← Main server file
    │   ├── package.json              ← Backend dependencies
    │   ├── vercel.json               ← Backend Vercel config
    │   └── .env.example              ← Environment template
    │
    └── database/                     ← SQL files
        ├── postgresql_setup.sql      ← PostgreSQL schema
        └── complete_setup.sql        ← MySQL schema
```

---

## 🔌 API Endpoints

### Public Endpoints (No Auth Required)

```
GET    /api/health                    → Health check
GET    /api/products                  → Get all products
GET    /api/products/:id              → Get single product
POST   /api/orders                    → Create order
POST   /api/customers                 → Create customer
POST   /api/payments                  → Upload payment screenshot
POST   /api/auth/request-login        → Request admin login
GET    /api/auth/approve-login/:token → Approve admin login
```

### Protected Endpoints (Auth Required)

```
GET    /api/admin/dashboard           → Dashboard stats
GET    /api/admin/orders              → Get all orders
GET    /api/admin/orders/:id          → Get single order
PATCH  /api/admin/orders/:id          → Update order status
GET    /api/admin/customers           → Get all customers
GET    /api/admin/payment-verifications → Get pending payments
PATCH  /api/admin/payments/:id        → Verify payment
POST   /api/admin/products            → Create product
PUT    /api/admin/products/:id        → Update product
DELETE /api/admin/products/:id        → Delete product
```

---

## 🔐 Security Features

### Authentication Flow

```
1. Admin requests login
   ↓
2. Backend generates JWT token
   ↓
3. Backend sends approval email with token link
   ↓
4. Admin clicks link
   ↓
5. Backend verifies token
   ↓
6. Backend creates session token
   ↓
7. Frontend stores token in localStorage
   ↓
8. All subsequent requests include token in Authorization header
```

### Security Measures

- ✅ JWT tokens for authentication
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Environment variables for secrets
- ✅ SQL injection prevention (parameterized queries)
- ✅ File upload validation
- ✅ HTTPS (automatic with Vercel)
- ✅ Rate limiting (Vercel built-in)

---

## 📧 Email Notifications

### Email Service: Gmail (Nodemailer)

**Emails Sent:**

1. **Order Confirmation** (to customer)
   - Trigger: New order placed
   - Contains: Order details, payment instructions

2. **Admin Login Approval** (to admin)
   - Trigger: Admin requests login
   - Contains: Approval link with JWT token

3. **Payment Verification** (to customer)
   - Trigger: Admin approves/rejects payment
   - Contains: Verification status, next steps

**Configuration:**
```
EMAIL_USER=madasumiteesh@gmail.com
EMAIL_PASSWORD=mnfc xdxe ojpi rtzf (App Password)
```

---

## 💾 Database Schema

### Key Tables

**products**
- id, name, description, price, category, image_url, stock_quantity

**orders**
- id, customer_id, total_amount, status, created_at

**order_items**
- id, order_id, product_id, quantity, price

**payments**
- id, order_id, screenshot_url, status, verified_at

**customers**
- id, name, email, phone, address

**admins**
- id, email, password_hash, created_at

---

## 🚀 Deployment Platforms

### Vercel (3 Projects)

**1. Backend API**
- Root: `admin-dashboard/server`
- Framework: Other
- Build: `npm install`
- Runtime: Node.js 18

**2. Admin Dashboard**
- Root: `admin-dashboard/client`
- Framework: Vite
- Build: `npm run build`
- Output: `dist/`

**3. Main Website**
- Root: `./` (root)
- Framework: Create React App
- Build: `npm run build`
- Output: `build/`

### Supabase (Database)

- PostgreSQL 15
- 500MB storage
- Automatic backups
- Built-in REST API
- Real-time subscriptions

---

## 🌐 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
PORT=5000
NODE_ENV=production
JWT_SECRET=random-secret
EMAIL_USER=email@gmail.com
EMAIL_PASSWORD=app-password
ADMIN_EMAIL=admin@email.com
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://admin.vercel.app
```

### Admin Dashboard (.env.production)
```
VITE_API_URL=https://backend.vercel.app/api
```

### Main Website (.env.production)
```
REACT_APP_API_URL=https://backend.vercel.app/api
```

---

## 📊 Free Tier Limits

### Supabase Free
- 500 MB database storage
- 50,000 monthly active users
- 2 GB bandwidth
- 1 GB file storage
- Unlimited API requests

### Vercel Free
- 100 GB bandwidth/month
- Unlimited deployments
- Unlimited projects
- 100 GB-hours serverless execution
- Automatic SSL certificates

**Perfect for starting out!** 🚀

---

## 🔄 CI/CD Pipeline

```
1. Developer makes changes locally
   ↓
2. git add . && git commit -m "Update"
   ↓
3. git push origin main
   ↓
4. GitHub receives push
   ↓
5. Vercel detects changes
   ↓
6. Vercel builds all 3 projects:
   - Backend API
   - Admin Dashboard
   - Main Website
   ↓
7. Vercel deploys to production
   ↓
8. All services are live!
```

**Deployment time: 3-5 minutes per project**

---

## 🎯 Performance Optimizations

- ✅ Vercel Edge Network (Global CDN)
- ✅ Automatic image optimization
- ✅ Code splitting (React lazy loading)
- ✅ Serverless functions (auto-scaling)
- ✅ Database connection pooling
- ✅ Gzip compression
- ✅ Browser caching
- ✅ Lazy loading images

---

## 📈 Monitoring & Analytics

### Vercel Analytics
- Page views
- Unique visitors
- Performance metrics
- Error tracking

### Supabase Dashboard
- Database size
- API requests
- Active connections
- Query performance

---

**This architecture is production-ready and scalable!** 🚀
