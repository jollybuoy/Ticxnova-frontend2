# Backend Deployment Guide for Azure

## 🚀 Quick Deployment Steps

### 1. **Prepare Your Backend Repository**

Make sure your backend repository (https://github.com/jollybuoy/Ticxnova-backend2) has these files:

```
backend/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env.production           # Production environment variables
├── config/
│   └── database.js           # Database connection
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── tickets.js           # Ticket management
│   ├── chat.js              # Team chat functionality
│   └── ai.js                # AI assistant
├── socket/
│   └── socketHandler.js     # Real-time features
├── middleware/
│   └── auth.js              # JWT authentication
└── utils/
    └── logger.js            # Logging utility
```

### 2. **Azure App Service Deployment**

#### Option A: Deploy from GitHub (Recommended)

1. **Create Azure App Service:**
   ```bash
   # Using Azure CLI
   az webapp create \
     --resource-group your-resource-group \
     --plan your-app-service-plan \
     --name ticxnova-backend \
     --runtime "NODE|18-lts"
   ```

2. **Configure GitHub Deployment:**
   - Go to Azure Portal → App Service → Deployment Center
   - Select "GitHub" as source
   - Connect your repository: `jollybuoy/Ticxnova-backend2`
   - Select branch: `main`
   - Build provider: "App Service Build Service"

3. **Set Environment Variables:**
   ```bash
   az webapp config appsettings set \
     --resource-group your-resource-group \
     --name ticxnova-backend \
     --settings \
     NODE_ENV=production \
     DB_SERVER=your-azure-sql-server.database.windows.net \
     DB_DATABASE=ticxnova \
     DB_USER=your-username \
     DB_PASSWORD=your-password \
     JWT_SECRET=your-production-jwt-secret \
     FRONTEND_URL=https://ticxnova.com
   ```

#### Option B: Deploy via VS Code

1. Install "Azure App Service" extension
2. Right-click your backend folder
3. Select "Deploy to Web App"
4. Choose your subscription and create/select App Service

### 3. **Database Setup**

Your Azure SQL Database should already be configured. Make sure:

```sql
-- Verify tables exist
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

-- Check if users table has required columns
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users';
```

### 4. **Update Frontend Configuration**

Update your frontend to point to the deployed backend:

```javascript
// In src/api/axios.js
const API_BASE_URL = 'https://ticxnova-backend.azurewebsites.net/api';
```

### 5. **Test the Integration**

1. **Health Check:**
   ```bash
   curl https://ticxnova-backend.azurewebsites.net/health
   ```

2. **Test Authentication:**
   ```bash
   curl -X POST https://ticxnova-backend.azurewebsites.net/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@ticxnova.com","password":"admin123"}'
   ```

3. **Test from Frontend:**
   - Try logging in with test credentials
   - Check browser network tab for API calls
   - Verify chat and AI features work

## 🔧 **Configuration Files Needed**

### **package.json** (Backend)
```json
{
  "name": "ticxnova-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "mssql": "^9.1.1",
    "socket.io": "^4.7.2",
    "express-validator": "^7.0.1",
    "winston": "^3.10.0",
    "compression": "^1.7.4",
    "morgan": "^1.10.0",
    "express-rate-limit": "^6.8.1",
    "dotenv": "^16.3.1"
  }
}
```

### **web.config** (For Azure App Service)
```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="DynamicContent">
          <match url="/*" />
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <requestLimits maxAllowedContentLength="1073741824" />
      </requestFiltering>
    </security>
  </system.webServer>
</configuration>
```

## 🎯 **Expected Results**

After deployment, you'll have:

✅ **Backend API** running on Azure App Service
✅ **Real-time chat** with Socket.IO
✅ **AI assistant** with intelligent responses
✅ **Authentication** with JWT tokens
✅ **Database integration** with Azure SQL
✅ **CORS configured** for ticxnova.com
✅ **Production logging** and monitoring

## 🔍 **Troubleshooting**

### Common Issues:

1. **CORS Errors:**
   - Ensure `FRONTEND_URL=https://ticxnova.com` in environment variables
   - Check CORS configuration in server.js

2. **Database Connection:**
   - Verify Azure SQL firewall allows Azure services
   - Check connection string format

3. **Socket.IO Issues:**
   - Ensure WebSocket support is enabled in Azure App Service
   - Check if sticky sessions are configured

4. **Environment Variables:**
   - Verify all required variables are set in Azure App Service
   - Check for typos in variable names

## 📞 **Support**

If you encounter issues:
1. Check Azure App Service logs
2. Monitor Application Insights
3. Test API endpoints individually
4. Verify database connectivity

Your backend will be fully integrated with your frontend, providing all the advanced features like team chat and AI assistant!