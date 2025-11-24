# Givora E-commerce Platform

Full-stack e-commerce platform for institutional supplies with wholesale B2B functionality.

## 🏗️ Project Structure

```
Givora/
├── backend/          # Node.js + Express + Prisma API
├── frontend/         # React + Vite application
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- (Optional) Cloudinary account for image uploads
- (Optional) MySQL database for production

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
DATABASE_URL="file:./dev.db"  # SQLite for development
PORT=5000
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your-cloud-name  # Optional
CLOUDINARY_API_KEY=your-api-key        # Optional
CLOUDINARY_API_SECRET=your-api-secret  # Optional
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Seed the database:
```bash
npm run prisma:seed
```

7. Start the development server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install axios  # If not already installed
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📦 Features

- **User Authentication**: JWT-based auth with email verification
- **Product Management**: Full CRUD with image uploads
- **Shopping Cart**: Real-time cart management
- **Order Processing**: Complete checkout flow with wholesale discounts
- **B2B Wholesale**: Application and approval workflow
- **Admin Dashboard**: Manage products, orders, wholesale applications, and messages
- **Image Management**: Cloudinary integration with automatic cleanup
- **Dual Database Support**: SQLite (dev) and MySQL (production)

## 🔐 Admin Access

Default admin credentials:
- Email: `fadyW@geih@gmail.givora.com` / Password: `PaSS@@7821`
- Email: `FADyAdmin@gmail.givora.eg` / Password: `Test@1#5`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/upload-image` - Upload product image (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update quantity
- `DELETE /api/cart/:itemId` - Remove item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get order history

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/wholesale/applications` - List applications
- `PUT /api/admin/wholesale/:id/approve` - Approve application

## 🚢 Deployment to Hostinger

### Database Setup

**Option 1: MySQL (Recommended for Production)**

1. Create MySQL database on Hostinger
2. Update `backend/.env`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

3. Update `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

4. Run migrations:
```bash
npm run prisma:migrate:prod
npm run prisma:seed
```

**Option 2: SQLite (Simple, File-based)**
- Keep default configuration
- Upload `dev.db` file with your deployment

### Image Upload Setup

**Option 1: Cloudinary (Recommended)**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from dashboard
3. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Option 2: Local Storage**
- Images stored in `backend/uploads/`
- Ensure directory has write permissions
- Configure web server to serve static files

### Backend Deployment

1. Upload backend files to Hostinger
2. Install dependencies: `npm install --production`
3. Set environment variables in Hostinger panel
4. Start with PM2 or similar:
```bash
pm2 start src/server.js --name givora-api
```

### Frontend Deployment

1. Update `.env` with production API URL:
```env
VITE_API_URL=https://yourdomain.com/api
```

2. Build for production:
```bash
npm run build
```

3. Upload `dist/` folder to Hostinger public_html
4. Configure web server (Apache/Nginx) for SPA routing

### Web Server Configuration

**Apache (.htaccess)**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}

location /api {
  proxy_pass http://localhost:5000;
}
```

## 🔧 Development Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations (dev)
- `npm run prisma:seed` - Seed database
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Environment Variables Reference

### Backend (.env)
```env
# Database
DATABASE_URL="file:./dev.db"  # or MySQL connection string

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_EMAIL_1=admin@example.com
ADMIN_PASSWORD_1=password

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=givora/products

# File Upload (Fallback)
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads/products
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🛡️ Security Features

- JWT authentication with secure token storage
- bcrypt password hashing (10 rounds)
- Input validation with express-validator
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS configuration
- SQL injection protection via Prisma ORM

## 📄 License

ISC

## 👥 Support

For issues or questions, please contact the development team.
