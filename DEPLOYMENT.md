# 🚀 CustomerEye Deployment Guide

> **Current Status**: Production Ready with 6,078 companies and 42,183 files

## 📊 Platform Overview

- **Total Companies**: 6,078
- **Countries**: US (5,611), CA (451), UK (16)
- **Industries**: 22 categories
- **Files**: 42,183 stored in AWS S3
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: AWS S3 with optimized structure

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- ✅ Zero-config deployment
- ✅ Automatic scaling
- ✅ Global CDN
- ✅ Built-in analytics
- ✅ Cost-effective for Next.js
- ✅ Easy environment management

**Deployment Steps:**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/customereye
   AWS_REGION=us-west-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_S3_BUCKET_NAME=customereye
   NEXT_PUBLIC_AWS_S3_BUCKET_NAME=customereye
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```

### Option 2: Docker (Alternative)

**Use Docker for:**
- Custom server requirements
- On-premise deployment
- Complex infrastructure needs

**Deployment Steps:**

1. **Build Docker Image**
   ```bash
   docker build -t customereye .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access Application**
   - Application: http://localhost:3000
   - Database: localhost:5432

## 🗄️ Database Setup

### PostgreSQL Configuration

1. **Create Database**
   ```sql
   CREATE DATABASE customereye;
   ```

2. **Run Migrations**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Verify Data** (Optional)
   ```bash
   npx prisma studio
   ```

### Database Schema

The platform uses a comprehensive schema with:
- **Reports**: 6,078 company reports
- **ReportDataFiles**: 42,183 files (text, images, PDFs)
- **ReportSections**: Organized content sections
- **Users**: User management (future feature)

## ☁️ AWS S3 Setup

### S3 Bucket Configuration

1. **Create S3 Bucket**
   - Name: `customereye`
   - Region: `us-west-1`
   - Versioning: Enabled

2. **Set Bucket Policy** (for public file access)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::customereye/*"
       }
     ]
   }
   ```

3. **Configure CORS**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

## 🔧 Environment Variables

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/customereye"

# AWS S3
AWS_REGION="us-west-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="customereye"
NEXT_PUBLIC_AWS_S3_BUCKET_NAME="customereye"

# NextAuth (for future authentication)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Environment
NODE_ENV="production"
```

### Vercel Environment Setup

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all required variables
5. Redeploy the application

## 📊 Performance Optimization

### Database Optimization

- **Indexes**: Optimized for filtering and sorting
- **Pagination**: Server-side pagination (608 pages)
- **Caching**: API response caching
- **Queries**: Optimized Prisma queries

### S3 Optimization

- **CDN**: Global content delivery
- **Compression**: Optimized file sizes
- **Caching**: Long-term caching headers
- **Structure**: Organized file hierarchy

## 🔍 Monitoring & Analytics

### Vercel Analytics

- **Performance**: Core Web Vitals
- **Usage**: Page views and sessions
- **Errors**: Real-time error tracking
- **Speed**: Response time monitoring

### Database Monitoring

- **Query Performance**: Prisma query optimization
- **Connection Pooling**: Efficient database connections
- **Index Usage**: Query optimization

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check connection
   npx prisma db push
   ```

2. **S3 Access Issues**
   ```bash
   # Verify credentials
   aws s3 ls s3://customereye
   ```

3. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

### Debug Commands

```bash
# Check database status
npx prisma studio

# Verify S3 files
aws s3 ls s3://customereye --recursive

# Test API endpoints
curl https://your-domain.com/api/reports?page=1&limit=5
```

## 🔄 CI/CD Pipeline

### Automated Deployment

1. **Push to main branch**
2. **Vercel automatically builds and deploys**
3. **Environment variables are applied**
4. **Database migrations run automatically**

### Manual Deployment

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## 📈 Scaling Considerations

### Current Capacity

- **Database**: 6,078 reports (can handle 100K+)
- **S3 Storage**: 42,183 files (unlimited)
- **API**: Optimized for high traffic
- **CDN**: Global content delivery

### Future Scaling

- **Database**: Read replicas for high traffic
- **S3**: Multi-region replication
- **CDN**: Advanced caching strategies
- **Monitoring**: Enhanced analytics

## 🛡️ Security

### Data Protection

- **Database**: Encrypted connections
- **S3**: Secure file access
- **API**: Rate limiting and validation
- **Environment**: Secure variable storage

### Access Control

- **S3**: IAM-based access control
- **Database**: Connection pooling
- **API**: Input validation and sanitization

## 📞 Support

### Deployment Support

- **Vercel**: Built-in support and documentation
- **AWS**: Comprehensive S3 documentation
- **Database**: Prisma documentation and community

### Monitoring

- **Uptime**: Vercel status page
- **Performance**: Built-in analytics
- **Errors**: Real-time error tracking

---

**Ready for Production!** 🚀

Your CustomerEye platform is fully optimized and ready for deployment with 6,078 companies and comprehensive functionality.