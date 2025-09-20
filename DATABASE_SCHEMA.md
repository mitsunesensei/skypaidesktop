# SkyParty Database Schema Documentation

## 📋 **Current Database Collections (Version 1.0)**

### **Collection 1: `skypai2` (Users)**
- `username` (Text, Required) - User's display name
- `email` (Text, Required) - Firebase authentication email
- `createdAt` (Date) - Account creation date
- `lastLogin` (Date) - Last login timestamp

**Purpose**: Core user management and authentication

---

### **Collection 2: `inventory` (User Items)**
- `userId` (Text, Required) - Links to user
- `itemId` (Text, Required) - Item identifier
- `itemType` (Text, Required) - "character", "credits", "item"
- `itemName` (Text, Required) - Display name
- `itemIcon` (Text) - Emoji/icon
- `quantity` (Number) - How many owned
- `acquiredDate` (Date) - When obtained
- `source` (Text) - "purchase", "gift", "reward"

**Purpose**: User's owned items and characters

---

### **Collection 3: `gifts` (Gift System)**
- `giftId` (Text, Required) - Unique gift ID
- `senderId` (Text, Required) - Who sent it
- `recipientId` (Text, Required) - Who receives it
- `itemType` (Text, Required) - What was gifted
- `itemData` (Text) - Item details (JSON)
- `message` (Text) - Gift message
- `status` (Text) - "pending", "accepted", "rejected"
- `sentDate` (Date) - When sent
- `processedDate` (Date) - When accepted/rejected

**Purpose**: Gift exchange system between users

---

### **Collection 4: `messages` (Direct Messages)**
- `messageId` (Text, Required) - Unique message ID
- `conversationId` (Text, Required) - Conversation group
- `senderId` (Text, Required) - Who sent
- `recipientId` (Text, Required) - Who receives
- `content` (Text, Required) - Message text
- `timestamp` (Date) - When sent
- `read` (Boolean) - Read status
- `messageType` (Text) - "text", "image", "gift"

**Purpose**: Direct messaging system

---

### **Collection 5: `shop_items` (Store Items)**
- `itemId` (Text, Required) - Item identifier
- `itemName` (Text, Required) - Display name
- `itemType` (Text, Required) - "character", "credits", "item"
- `itemIcon` (Text) - Emoji/icon
- `price` (Number) - Cost in GC
- `description` (Text) - Item description
- `category` (Text) - "characters", "credits", "items"
- `available` (Boolean) - In stock
- `createdDate` (Date) - When added to shop

**Purpose**: Store catalog and pricing

---

### **Collection 6: `user_credits` (Game Credits)**
- `userId` (Text, Required) - User identifier
- `credits` (Number) - Current balance
- `lastUpdated` (Date) - Last transaction
- `transactionHistory` (Text) - JSON array of transactions

**Purpose**: User's game currency and transaction history

---

## 🔧 **Current Wix Functions (Version 1.0)**

### **User Functions**
- `getUsernames()` - Get all username mappings
- `storeUsername(username, email)` - Store new username
- `getUserByEmail(email)` - Get username by email

### **Messaging Functions**
- `getMessages(conversationId)` - Get conversation messages
- `sendMessage(conversationId, senderId, recipientId, content, messageType)` - Send message

### **Shop Functions**
- `getShopItems(category)` - Get shop items by category

### **Inventory Functions**
- `getUserInventory(userId)` - Get user's items
- `addToInventory(userId, itemId, itemType, itemName, itemIcon, quantity, source)` - Add item

### **Credits Functions**
- `getUserCredits(userId)` - Get user's credit balance
- `updateUserCredits(userId, amount, transactionType)` - Update credits

### **Gift Functions**
- `sendGift(senderId, recipientId, itemType, itemData, message)` - Send gift
- `getUserGifts(userId)` - Get user's received gifts

---

## 🚀 **Future Expansion Plans**

### **Version 1.1 - Games System (Future)**
- `games` collection
- `user_games` collection
- Functions: `getGames()`, `purchaseGame()`, `getUserGames()`

### **Version 1.2 - Activation Codes (Future)**
- `activation_codes` collection
- Functions: `activateCode()`, `createActivationCode()`

### **Version 1.3 - Achievements (Future)**
- `user_achievements` collection
- Functions: `getAchievements()`, `unlockAchievement()`

---

## 📝 **Modification History**

- **2025-01-XX**: Initial database schema created
- **Version 1.0**: Core system (Users, Inventory, Gifts, Messages, Shop, Credits)

---

## ⚠️ **Important Notes**

1. **NEVER modify existing functions** - only add new ones
2. **Always test new collections** in Wix first
3. **Keep backups** of working `.web.js` files
4. **Add new functions at the end** of the file
5. **Update this documentation** when adding new collections

---

## 🔗 **Related Files**

- `skyparty.html` - Main application file
- `main.js` - Electron main process
- `package.json` - Project dependencies
- `railway.json` - Deployment configuration
