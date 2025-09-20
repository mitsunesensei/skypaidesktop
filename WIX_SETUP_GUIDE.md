# 🌟 Wix Cloud Storage Setup Guide

## 📋 **Step-by-Step Setup**

### **Step 1: Enable Wix Velo**
1. Go to your Wix site editor
2. Click **Dev Mode** → **Enable Velo**
3. You'll see **Backend** and **Frontend** sections

### **Step 2: Create Database Collection**
1. Go to **Database** → **Collections**
2. Click **+ New Collection**
3. Name it: `Usernames`
4. Add these fields:
   - `username` (Text, Required)
   - `email` (Text, Required) 
   - `createdAt` (Date)
   - `lastLogin` (Date)

### **Step 3: Create Velo Functions**

#### **Function 1: `getUsernames`**
```javascript
// Backend → Functions → getUsernames
import wixData from 'wix-data';

export async function getUsernames() {
  try {
    const results = await wixData.query("Usernames").find();
    const mappings = {};
    results.items.forEach(item => {
      mappings[item.username] = item.email;
    });
    return mappings;
  } catch (error) {
    console.error("Error fetching usernames:", error);
    return {};
  }
}
```

#### **Function 2: `storeUsername`**
```javascript
// Backend → Functions → storeUsername
import wixData from 'wix-data';

export async function storeUsername(username, email) {
  try {
    // Check if username already exists
    const existing = await wixData.query("Usernames")
      .eq("username", username)
      .find();
    
    if (existing.items.length > 0) {
      return { success: false, error: "Username already exists" };
    }
    
    // Store new username
    await wixData.save("Usernames", {
      username: username,
      email: email,
      createdAt: new Date(),
      lastLogin: new Date()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error storing username:", error);
    return { success: false, error: error.message };
  }
}
```

#### **Function 3: `getUserByEmail`**
```javascript
// Backend → Functions → getUserByEmail
import wixData from 'wix-data';

export async function getUserByEmail(email) {
  try {
    const results = await wixData.query("Usernames")
      .eq("email", email)
      .find();
    
    if (results.items.length > 0) {
      return results.items[0].username;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}
```

### **Step 4: Update Railway App**
1. **Replace the WIX_SITE_URL** in your `skyparty.html`:
   ```javascript
   const WIX_SITE_URL = 'https://your-actual-wix-site.com';
   ```

2. **Deploy to Railway**:
   ```bash
   git add .
   git commit -m "Add Wix cloud storage integration"
   git push origin main
   ```

### **Step 5: Test the Connection**
1. **Visit your Railway app**
2. **Try to register** a new user
3. **Check your Wix database** - you should see the new username!
4. **Try logging in** from different browsers - usernames should be shared!

## 🎯 **How It Works**

```
🌐 Railway App (skyparty.html)
    ↓ HTTP Requests
🌐 Wix Site (Velo Functions)
    ↓ Database Queries  
🗄️ Wix Database (Usernames Collection)
```

## ✅ **Benefits**
- **Global Access**: Usernames shared worldwide
- **Real-time**: Live data sync
- **Reliable**: Wix handles the database
- **Scalable**: Wix scales automatically
- **Cost-effective**: Use existing Wix plan

## 🔧 **Troubleshooting**
- **CORS Issues**: Make sure Wix functions are public
- **Function URLs**: Check the exact function URLs in Wix
- **Database Permissions**: Ensure functions can read/write to database

## 🚀 **Next Steps**
1. Set up the Wix functions
2. Update the WIX_SITE_URL
3. Deploy to Railway
4. Test the connection!

**Your Railway app will now use Wix as the cloud database!** 🌟
