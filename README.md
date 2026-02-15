# 🛍️ AM Fashions - E-Commerce Platform

A full-stack e-commerce platform with admin dashboard, payment verification system, and email approval workflow.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Build](https://img.shields.io/badge/build-passing-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

### Customer-Facing Website
- 🛒 Product catalog with categories
- 🛍️ Shopping cart functionality
- 💳 UPI payment integration (QR Code + Manual)
- 📸 Payment screenshot upload
- 🔢 12-digit transaction ID capture
- 📧 Contact form with EmailJS
- 💬 WhatsApp integration
- 📱 Fully responsive design
- 🎨 Modern UI with animations

### Admin Dashboard
- 🔐 Secure login with email approval (2FA)
- 📊 Dashboard with real-time statistics
- 💰 Payment verification system
- 🖼️ View payment screenshots
- ✅ Approve/reject payments
- 👥 Customer management
- 📦 Order management
- 📈 Analytics and reports
- 🎟️ Coupon management

### Backend API
- ⚡ RESTful API with Express.js
- 🗄️ MySQL database
- 📧 Email service with Gmail
- 📤 File upload handling
- 🔒 Authentication system
- 🛡️ CORS configured
- ⚠️ Error handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/am-fashions.git
cd am-fashions
```

2. **Install dependencies**
```bash
# Main website
npm install

# Admin dashboard
cd admin-dashboard/client
npm install

# Backend server
cd ../server
npm install
```

3. **Set up database**
```bash
# Import database schema
mysql -u root -p < admin-dashboard/database/complete_setup.sql
```

4. **Configure environment variables**
```bash
# Backend server
cd admin-dashboard/server
cp .env.example .env
# Edit .env with your configuration
```

5. **Start development servers**
```bash
# Terminal 1 - Main website (port 3000)
npm start

# Terminal 2 - Admin dashboard (port 3001)
cd admin-dashboard/client
npm run dev

# Terminal 3 - Backend server (port 5000)
cd admin-dashboard/server
npm start
```

## 📁 Project Structure

```
am-with-emailjs/
├── src/                          # Main website source
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── data/                     # Product data
│   └── services/                 # API services
├── admin-dashboard/
│   ├── client/                   # Admin dashboard frontend
│   │   └── src/
│   │       ├── components/       # Dashboard components
│   │       ├── pages/            # Dashboard pages
│   │       └── services/         # API services
│   ├── server/                   # Backend API
│   │   ├── config/               # Configuration
│   │   ├── controllers/          # Route controllers
│   │   ├── middleware/           # Express middleware
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   └── uploads/              # File uploads
│   └── database/                 # SQL scripts
├── public/                       # Static assets
└── build/                        # Production build
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_admin
DB_PORT=3306
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@yourdomain.com
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 Documentation

- [Deployment Guide](./README_DEPLOYMENT.md) - Complete deployment instructions
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- [Production Config](./PRODUCTION_CONFIG.md) - Production configuration reference
- [Admin Login Guide](./ADMIN_LOGIN_APPROVAL_GUIDE.md) - Admin authentication system

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- EmailJS
- Axios

### Backend
- Node.js
- Express.js
- MySQL2
- Nodemailer
- Multer (file uploads)
- bcryptjs (password hashing)
- JWT (authentication)

### Database
- MySQL 8
- 13 tables with relationships
- Stored procedures
- Views for complex queries

## 🔐 Security Features

- ✅ Two-factor authentication for admin
- ✅ Email approval workflow
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ File upload validation
- ✅ Environment variable protection

## 📦 Build & Deploy

### Build for Production
```bash
# Main website
npm run build

# Admin dashboard
cd admin-dashboard/client
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy main website
vercel --prod

# Deploy admin dashboard
cd admin-dashboard/client
vercel --prod
```

### Deploy Backend to Railway
1. Push code to GitHub
2. Connect Railway to your repository
3. Select `admin-dashboard/server` folder
4. Add environment variables
5. Deploy!

## 🧪 Testing

### Run Tests
```bash
# Main website
npm test

# Admin dashboard
cd admin-dashboard/client
npm test
```

### Manual Testing Checklist
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] Order placement works
- [ ] Payment verification works
- [ ] Admin login works
- [ ] Email notifications work
- [ ] Contact form works
- [ ] Mobile responsive

## 📊 Database Schema

### Main Tables
- `admins` - Admin users
- `customers` - Customer accounts
- `products` - Product catalog
- `product_variants` - Product variations
- `orders` - Order records
- `order_items` - Order line items
- `payments` - Payment transactions
- `payment_verifications` - Payment verification requests
- `login_requests` - Admin login approval tracking
- `coupons` - Discount coupons
- `returns` - Return requests

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**AM Fashions**
- Email: madasumiteesh@gmail.com
- WhatsApp: +91 91009 11697
- Instagram: [@am_fashions.official](https://www.instagram.com/am_fashions.official)
- Location: Anantapur, Andhra Pradesh 515001

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- EmailJS for email service
- All open-source contributors

## 📈 Roadmap

- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add multiple payment gateways
- [ ] Implement real-time order tracking
- [ ] Add push notifications
- [ ] Implement advanced analytics
- [ ] Add multi-language support
- [ ] Implement PWA features

## 🐛 Known Issues

See [Issues](https://github.com/yourusername/am-fashions/issues) for a list of known issues and feature requests.

## 📸 Screenshots

### Main Website
![Homepage](./screenshots/homepage.png)
![Products](./screenshots/products.png)
![Cart](./screenshots/cart.png)

### Admin Dashboard
![Dashboard](./screenshots/admin-dashboard.png)
![Payment Verification](./screenshots/payment-verification.png)

---

**Built with ❤️ by AM Fashions Team**

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Last Updated**: February 2026
