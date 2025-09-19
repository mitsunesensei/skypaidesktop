const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('skyparty.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        current_character TEXT DEFAULT 'kitty',
        owned_characters TEXT DEFAULT '["kitty"]',
        game_credits INTEGER DEFAULT 150,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Username mappings table
    db.run(`CREATE TABLE IF NOT EXISTS username_mappings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Conversations table
    db.run(`CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id TEXT UNIQUE NOT NULL,
        participants TEXT NOT NULL,
        last_message TEXT,
        last_message_time DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id TEXT NOT NULL,
        sender_email TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        read_status BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
    )`);

    // Mailbox table
    db.run(`CREATE TABLE IF NOT EXISTS mailbox (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipient_email TEXT NOT NULL,
        sender_email TEXT NOT NULL,
        item_type TEXT NOT NULL,
        item_data TEXT NOT NULL,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        read_status BOOLEAN DEFAULT FALSE,
        claimed_status BOOLEAN DEFAULT FALSE
    )`);

    // Inventory table
    db.run(`CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        item_type TEXT NOT NULL,
        item_name TEXT NOT NULL,
        item_icon TEXT,
        item_description TEXT,
        item_price INTEGER,
        acquired_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        source TEXT DEFAULT 'purchase',
        quantity INTEGER DEFAULT 1
    )`);

    console.log('Database tables initialized');
}

// API Routes

// Username mappings
app.post('/api/username-mappings', (req, res) => {
    const { username, email } = req.body;
    
    db.run('INSERT OR REPLACE INTO username_mappings (username, email) VALUES (?, ?)', 
        [username, email], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        });
});

app.get('/api/username-mappings', (req, res) => {
    db.all('SELECT username, email FROM username_mappings', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const mappings = {};
            rows.forEach(row => {
                mappings[row.username] = row.email;
            });
            res.json(mappings);
        }
    });
});

// Users
app.post('/api/users', (req, res) => {
    const { email, username, currentCharacter, ownedCharacters, gameCredits } = req.body;
    
    const ownedCharsJson = JSON.stringify(ownedCharacters);
    
    db.run(`INSERT OR REPLACE INTO users 
        (email, username, current_character, owned_characters, game_credits, last_updated) 
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`, 
        [email, username, currentCharacter, ownedCharsJson, gameCredits], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        });
});

app.get('/api/users/:email', (req, res) => {
    const email = req.params.email;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            const userData = {
                currentCharacter: row.current_character,
                ownedCharacters: JSON.parse(row.owned_characters),
                gameCredits: row.game_credits
            };
            res.json(userData);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// Conversations
app.post('/api/conversations', (req, res) => {
    const { conversationId, participants, lastMessage } = req.body;
    
    const participantsJson = JSON.stringify(participants);
    
    db.run(`INSERT OR REPLACE INTO conversations 
        (conversation_id, participants, last_message, last_message_time) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)`, 
        [conversationId, participantsJson, lastMessage], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        });
});

app.get('/api/conversations/:email', (req, res) => {
    const email = req.params.email;
    
    db.all(`SELECT * FROM conversations 
        WHERE participants LIKE ? 
        ORDER BY last_message_time DESC`, 
        [`%${email}%`], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                const conversations = rows.map(row => ({
                    id: row.conversation_id,
                    participants: JSON.parse(row.participants),
                    lastMessage: row.last_message,
                    lastMessageTime: row.last_message_time
                }));
                res.json(conversations);
            }
        });
});

// Messages
app.post('/api/messages', (req, res) => {
    const { conversationId, senderEmail, content } = req.body;
    
    db.run('INSERT INTO messages (conversation_id, sender_email, content) VALUES (?, ?, ?)', 
        [conversationId, senderEmail, content], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        });
});

app.get('/api/messages/:conversationId', (req, res) => {
    const conversationId = req.params.conversationId;
    
    db.all('SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC', 
        [conversationId], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json(rows);
            }
        });
});

// Mailbox
app.post('/api/mailbox', (req, res) => {
    const { recipientEmail, senderEmail, itemType, itemData, message } = req.body;
    
    const itemDataJson = JSON.stringify(itemData);
    
    db.run('INSERT INTO mailbox (recipient_email, sender_email, item_type, item_data, message) VALUES (?, ?, ?, ?, ?)', 
        [recipientEmail, senderEmail, itemType, itemDataJson, message], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        });
});

app.get('/api/mailbox/:email', (req, res) => {
    const email = req.params.email;
    
    db.all('SELECT * FROM mailbox WHERE recipient_email = ? ORDER BY timestamp DESC', 
        [email], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                const mailboxItems = rows.map(row => ({
                    id: row.id.toString(),
                    sender: row.sender_email,
                    recipient: row.recipient_email,
                    itemType: row.item_type,
                    itemData: JSON.parse(row.item_data),
                    message: row.message,
                    timestamp: row.timestamp,
                    read: row.read_status,
                    claimed: row.claimed_status
                }));
                res.json(mailboxItems);
            }
        });
});

// Inventory
app.post('/api/inventory', (req, res) => {
    const { userEmail, itemType, itemName, itemIcon, itemDescription, itemPrice, source, quantity } = req.body;
    
    db.run('INSERT INTO inventory (user_email, item_type, item_name, item_icon, item_description, item_price, source, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [userEmail, itemType, itemName, itemIcon, itemDescription, itemPrice, source, quantity], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ success: true, id: this.lastID });
            }
        });
});

app.get('/api/inventory/:email', (req, res) => {
    const email = req.params.email;
    
    db.all('SELECT * FROM inventory WHERE user_email = ? ORDER BY acquired_date DESC', 
        [email], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                const inventoryItems = rows.map(row => ({
                    id: row.id.toString(),
                    type: row.item_type,
                    name: row.item_name,
                    icon: row.item_icon,
                    description: row.item_description,
                    price: row.item_price,
                    acquiredDate: row.acquired_date,
                    source: row.source,
                    quantity: row.quantity
                }));
                res.json(inventoryItems);
            }
        });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'skyparty.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SkyParty Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: skyparty.db`);
    console.log(`🌐 Open your browser and go to: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});
