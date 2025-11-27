# Deployment Guide for Hostingar

## Overview
This guide covers deploying the Givora e-commerce platform to Hostingar hosting with both database options (SQLite and MySQL) and image storage options (Cloudinary and local).

## Pre-Deployment Checklist

### ✅ Backend Ready
- [x] Node.js backend with Express
- [x] Prisma ORM configured
- [x] SQLite database (development)
- [x] MySQL support (production)
- [x] JWT authentication
- [x] Cloudinary integration
- [x] Local file upload fallback
- [x] All API endpoints tested

### ✅ Frontend Ready
- [x] React application
- [x] API service layer created
- [x] Axios installed
- [x] Environment configuration

## Database Options

### Option 1: SQLite (Simpler, File-Based)

**Pros:**
- No database server setup required
- Single file database (`dev.db`)
- Perfect for small to medium traffic
- Easy backup (just copy the file)

**Cons:**
- Not ideal for high concurrent writes
- File must be uploaded with deployment

**Setup:**
1. Keep `prisma/schema.prisma` with `provider = "sqlite"`
2. Upload `dev.db` file to server
3. Ensure file permissions allow read/write

### Option 2: MySQL (Production-Grade)

**Pros:**
- Better for high traffic
- Concurrent connections
- Industry standard
- Hostingar provides MySQL

**Cons:**
- Requires database setup
- Connection configuration needed

**Setup:**
1. Create MySQL database in Hostingar cPanel
2. Note: username, password, database name, host
3. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
4. Update `.env`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```
5. Run migrations:
```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db push
node prisma/seed.js
```

## Image Storage Options

### Option 1: Cloudinary (Recommended)

**Pros:**
- Automatic image optimization
- CDN delivery (faster loading)
- Automatic cleanup when products deleted
- No server storage used
- Free tier available

**Cons:**
- Requires external account
- Monthly upload limits on free tier

**Setup:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get credentials from dashboard
3. Add to backend `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=givora/products
```

### Option 2: Local Storage (Fallback)

**Pros:**
- No external dependencies
- No monthly limits
- Full control

**Cons:**
- Uses server storage
- No CDN
- Manual cleanup required
- Slower delivery

**Setup:**
1. Leave Cloudinary env vars empty
2. Ensure `backend/uploads/products/` directory exists
3. Set proper permissions: `chmod 755 uploads`
4. Configure web server to serve static files

## Hostingar Deployment Steps

### Step 1: Prepare Files

1. **Backend:**
```bash
cd backend
npm install --production
```

2. **Frontend:**
```bash
cd frontend
# Update .env with production API URL
echo "VITE_API_URL=https://yourdomain.com/api" > .env
npm run build
```

### Step 2: Upload Files

**Via FTP/SFTP:**
1. Upload `backend/` to `/home/username/backend/`
2. Upload `frontend/dist/` contents to `/home/username/public_html/`

**Via Git (if available):**
```bash
git clone your-repo-url
cd Givora
```

### Step 3: Backend Setup on Server

```bash
cd ~/backend

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Database setup (choose one)
# For SQLite: upload dev.db file
# For MySQL: run migrations
npx prisma migrate deploy
npx prisma generate
node prisma/seed.js

# Start server with PM2
npm install -g pm2
pm2 start src/server.js --name givora-api
pm2 save
pm2 startup
```

### Step 4: Configure Web Server

**Apache (.htaccess in public_html):**
```apache
# Frontend SPA routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/api
  RewriteRule . /index.html [L]
</IfModule>

# API Proxy
<IfModule mod_proxy.c>
  ProxyPass /api http://localhost:5000/api
  ProxyPassReverse /api http://localhost:5000/api
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

**Nginx (if available):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /home/username/public_html;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /uploads {
        alias /home/username/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Step 5: SSL Certificate

```bash
# Using Let's Encrypt (if available)
certbot --apache -d yourdomain.com

# Or use Hostingar's free SSL from cPanel
```

### Step 6: Environment Variables

**Backend `.env` (Production):**
```env
# Database - Choose one:
# SQLite (Development)
DATABASE_PROVIDER=sqlite
DATABASE_URL="file:./dev.db"

# MySQL (Production - Hostinger)
# DATABASE_PROVIDER=mysql
# DATABASE_URL="mysql://user:pass@localhost:3306/dbname"

# PostgreSQL (Production - Render, Railway, etc.)
# DATABASE_PROVIDER=postgresql
# DATABASE_URL="postgresql://user:password@host:5432/givora_db"

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# JWT - CHANGE THIS!
JWT_SECRET=generate-a-secure-random-string-here-min-32-chars
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_EMAIL_1=fadyW@geih@gmail.givora.com
ADMIN_PASSWORD_1=PaSS@@7821
ADMIN_EMAIL_2=FADyAdmin@gmail.givora.eg
ADMIN_PASSWORD_2=Test@1#5

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=givora/products

# File Upload (if not using Cloudinary)
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads/products
```

**Frontend `.env` (Production):**
```env
VITE_API_URL=https://yourdomain.com/api
```

## Post-Deployment Verification

### 1. Check Backend
```bash
curl https://yourdomain.com/api/health
# Should return: {"success":true,"message":"Givora API is running"}
```

### 2. Check Frontend
- Visit `https://yourdomain.com`
- Should load the homepage
- Check browser console for errors

### 3. Test API Integration
- Try logging in
- Add product to cart
- Check admin panel

### 4. Monitor Logs
```bash
pm2 logs givora-api
pm2 monit
```

## Troubleshooting

### Backend not starting
```bash
pm2 logs givora-api  # Check error logs
node src/server.js   # Run directly to see errors
```

### Database connection errors
- Verify DATABASE_URL is correct
- Check MySQL credentials
- Ensure database exists
- Check file permissions for SQLite

### Image upload not working
- Check Cloudinary credentials
- Verify upload directory permissions: `chmod 755 uploads`
- Check disk space: `df -h`

### API requests failing
- Check CORS settings in backend
- Verify FRONTEND_URL in backend .env
- Check proxy configuration
- Inspect browser network tab

### 404 errors on refresh
- Verify .htaccess rewrite rules
- Check Apache mod_rewrite is enabled
- Ensure all routes go to index.html

## Maintenance

### Backup Database
**SQLite:**
```bash
cp backend/dev.db backup/dev-$(date +%Y%m%d).db
```

**MySQL:**
```bash
mysqldump -u username -p database_name > backup-$(date +%Y%m%d).sql
```

### Update Application
```bash
cd ~/backend
git pull
npm install --production
npx prisma migrate deploy
pm2 restart givora-api
```

### Monitor Performance
```bash
pm2 monit
pm2 status
```

## Security Checklist

- [ ] Change default admin passwords
- [ ] Generate new JWT_SECRET
- [ ] Enable SSL/HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure firewall
- [ ] Regular backups
- [ ] Update dependencies: `npm audit fix`
- [ ] Monitor logs for suspicious activity

## Support

For deployment issues:
1. Check PM2 logs: `pm2 logs`
2. Check Apache/Nginx error logs
3. Verify all environment variables
4. Test API endpoints individually
5. Check database connectivity

## Recommended Hostingar Plan

- **Minimum**: Business Plan (for Node.js support)
- **Recommended**: Cloud Startup (better performance)
- **Database**: MySQL included in all plans
- **SSL**: Free Let's Encrypt included

## Performance Optimization

1. **Enable Gzip Compression** (in .htaccess or nginx.conf)
2. **Set Cache Headers** for static assets
3. **Use Cloudinary** for image optimization
4. **Enable PM2 Cluster Mode** for multiple CPU cores:
```bash
pm2 start src/server.js -i max --name givora-api
```

5. **Database Indexing** (already configured in Prisma schema)

## Conclusion

Your Givora e-commerce platform is now ready for production deployment on Hostingar with:
- ✅ Dual database support (SQLite/MySQL)
- ✅ Dual image storage (Cloudinary/Local)
- ✅ Secure authentication
- ✅ Clean, maintainable code
- ✅ Production-ready configuration
