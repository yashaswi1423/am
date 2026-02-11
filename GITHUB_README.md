# 🛍️ AM Fashions - E-commerce Platform

A full-stack e-commerce platform for fashion retail with customer website, admin dashboard, and Supabase PostgreSQL backend.

## 🌟 Features

### Customer Website
- 🏠 Modern, responsive product catalog
- 🛒 Shopping cart with real-time updates
- 💳 UPI payment integration with screenshot upload
- 📱 Mobile-friendly design
- 💬 AI chatbot for customer support
- 📧 Email notifications for orders

### Admin Dashboard
- 📊 Real-time analytics and statistics
- 📦 Order management and tracking
- 👥 Customer management
- 🏷️ Product and inventory management
- 💰 Payment verification system
- 🎟️ Coupon and discount management
- 📈 Sales reports and trends
- 🔐 Secure admin authentication with email approval

### Backend API
- ⚡ Express.js REST API
- 🗄️ Supabase PostgreSQL database
- 🔒 JWT authentication
- 📧 Gmail SMTP email service
- 🖼️ File upload handling for payment screenshots
- 🔄 Real-time data synchronization

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE CLOUD                       │
│              PostgreSQL Database (Cloud)                │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │
                          │
┌─────────────────────────┼───────────────────────────────┐
│                         │                               │
│  ┌──────────────────────▼─────────────────────┐        │
│  │  Backend API (Node.js + Express)           │        │
│  │  Port: 5000                                 │        │
│  │  - REST API endpoints                       │        │
│  │  - PostgreSQL connection                    │        │
│  │  - Email service                            │        │
│  │  - File uploads                             │        │
│  └─────────────────────────────────────────────┘        │
│                         ▲                               │
│                         │                               │
│         ┌───────────────┴───────────────┐               │
│         │                               │               │
│  ┌──────▼──────────┐          ┌────────▼──────────┐    │
│  │  Customer Site  │          │  Admin Dashboard  │    │
│  │  (React)        │          │  (React + Vite)   │    │
│  │  Port: 3000     │          │  Port: 3001       │    │
│  └─────────────────┘          └───────────────────┘    │
│                                                         │
│                    LOCAL DEVELOPMENT                    │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
am_fashiona-main/
├── src/                          # Customer website (React)
│   ├── components/               # Reusable components
│   ├── pages/                    # Page components
│   ├── services/                 # API services
│   └── data/                     # Static data
│
├── admin-dashboard/
│   ├── client/                   # Admin dashboard (React + Vite)
│   │   ├── src/
│   │   │   ├── components/       # Dashboard components
│   │   │   ├── pages/            # Dashboard pages
│   │   │   └── services/         # API services
│   │   └── package.json
│   │
│   ├── server/                   # Backend API (Node.js + Express)
│   │   ├── config/               # Database configuration
│   │   ├── controllers/          # Route controllers
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Auth middleware
│   │   ├── services/             # Email service
│   │   └── package.json
│   │
│   └── database/                 # SQL scripts
│       └── postgresql_setup.sql  # Database schema
│
├── public/                       # Static assets
├── .env.example                  # Environment variables template
└── package.json                  # Main website dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free tier works)
- Gmail account for email notifications

### 1. Clone Repository
```bash
git clone https://github.com/am-fashions/aaaaaa.git
cd aaaaaa
```

### 2. Set Up Supabase Database

1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor in Supabase dashboard
3. Copy contents from `admin-dashboard/database/postgresql_setup.sql`
4. Run the SQL script in Supabase SQL Editor
5. Note your database credentials from Settings → Database

### 3. Configure Environment Variables

#### Backend Server
Create `admin-dashboard/server/.env`:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=postgresql://postgres:your_password@db.your_project.supabase.co:5432/postgres

# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your_random_secret_key

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Your Name <your_email@gmail.com>
ADMIN_EMAIL=admin_email@gmail.com
```

#### Admin Dashboard
Create `admin-dashboard/client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Main Website
Create `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Install Dependencies

```bash
# Install main website dependencies
npm install

# Install admin dashboard dependencies
cd admin-dashboard/client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 5. Start All Services

Open 3 terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd admin-dashboard/server
npm start
```

**Terminal 2 - Admin Dashboard:**
```bash
cd admin-dashboard/client
npm run dev
```

**Terminal 3 - Main Website:**
```bash
npm start
```

### 6. Access Applications

- **Customer Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:5000/api

### 7. Default Admin Login

- **Email**: admin@amfashions.com
- **Password**: admin123

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create new app password for "Mail"
3. Use the generated password in `EMAIL_PASS` environment variable

## 🗄️ Database Schema

The platform uses 12 PostgreSQL tables:

- **customers** - Customer accounts
- **products** - Product catalog
- **product_variants** - Product variations (size, color, stock)
- **product_images** - Product photos
- **orders** - Customer orders
- **order_items** - Order line items
- **payments** - Payment records
- **payment_verifications** - UPI payment screenshots
- **payment_verification_logs** - Verification audit trail
- **coupons** - Discount codes
- **admin_users** - Admin accounts
- **login_requests** - Admin login approval system

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Admin login approval via email
- CORS protection
- SQL injection prevention with parameterized queries
- Environment variable protection (.env files in .gitignore)

## 📱 API Endpoints

### Public Endpoints
- `POST /api/customers` - Create customer account
- `POST /api/orders` - Place order
- `POST /api/payment-verification/submit` - Submit payment screenshot
- `GET /api/products` - Get products
- `POST /api/coupons/validate` - Validate coupon code

### Admin Endpoints (Requires Authentication)
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/customers` - Get all customers
- `GET /api/analytics/*` - Analytics endpoints
- `POST /api/payment-verification/:id/verify` - Verify payment
- `POST /api/payment-verification/:id/reject` - Reject payment

## 🎨 Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Vite (for admin dashboard)
- Axios for API calls

### Backend
- Node.js
- Express.js
- PostgreSQL (via Supabase)
- JWT for authentication
- Nodemailer for emails
- Multer for file uploads

### Database
- Supabase (PostgreSQL 15)
- Triggers for auto-updates
- Views for complex queries

## 📦 Deployment

### Deploy to Vercel

1. **Backend API**:
   - Deploy `admin-dashboard/server` folder
   - Add environment variables in Vercel dashboard
   - Use `vercel.json` configuration

2. **Admin Dashboard**:
   - Deploy `admin-dashboard/client` folder
   - Add `VITE_API_URL` environment variable

3. **Main Website**:
   - Deploy root folder
   - Add `REACT_APP_API_URL` environment variable

### Environment Variables for Production

Update all `.env` files with production URLs:
- Change `localhost` to your deployed URLs
- Use production database credentials
- Update CORS settings in backend

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure IP is whitelisted in Supabase (or use connection pooler)

### Email Not Sending
- Verify Gmail App Password is correct
- Check 2FA is enabled on Gmail
- Ensure `EMAIL_USER` and `EMAIL_PASS` are set

### CORS Errors
- Check `VITE_API_URL` and `REACT_APP_API_URL` are correct
- Verify backend CORS configuration includes frontend URLs

## 📄 License

This project is private and proprietary to AM Fashions.

## 👥 Support

For issues or questions, contact: madasumiteesh@gmail.com

---

**Built with ❤️ by AM Fashions Team**
