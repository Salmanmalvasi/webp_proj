require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the main directory
app.use(express.static(path.join(__dirname, '')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tesla-clone';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define Order Schema
const orderSchema = new mongoose.Schema({
  customerDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zipCode: String
  },
  items: Array,
  totalAmount: Number,
  // Deposit booking support
  depositAmount: { type: Number, default: 0 },
  depositPaid: { type: Boolean, default: false },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Confirmed' }
});

const Order = mongoose.model('Order', orderSchema);

// Define User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const JWT_SECRET = process.env.JWT_SECRET || 'tesla-super-secret-key-1234';

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

const authenticateAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access denied' });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// --- AUTH API Endpoints ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    // First user created becomes admin automatically for testing, otherwise false
    const isFirstUser = (await User.countDocuments({})) === 0;
    const newUser = new User({ email, password: hashedPassword, firstName, lastName, isAdmin: isFirstUser });
    const savedUser = await newUser.save();
    
    // Create token
    const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ success: true, token, user: { id: savedUser._id, email, firstName, lastName, isAdmin: savedUser.isAdmin } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    
    // Create token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get user profile (with orders)
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const orders = await Order.find({ 'customerDetails.email': user.email }).sort({ orderDate: -1 });
    res.json({ success: true, user, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- ADMIN API Endpoints ---
app.get('/api/admin/orders', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const usersCount = await User.countDocuments();
    res.json({ success: true, orders, totalRevenue, usersCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/admin/orders/:id/status', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/admin/orders/:id', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Inventory override schema
const inventorySchema = new mongoose.Schema({
  modelId: String,
  stock: Number
});
const Inventory = mongoose.model('Inventory', inventorySchema);

app.get('/api/inventory', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json({ success: true, inventory: items });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.put('/api/admin/inventory/:modelId', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    let item = await Inventory.findOne({ modelId: req.params.modelId });
    if (!item) {
      item = new Inventory({ modelId: req.params.modelId, stock });
    } else {
      item.stock = stock;
    }
    await item.save();
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// API Endpoints
// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    // Support deposit booking: if depositPaid is true and depositAmount provided,
    // set initial status to 'Reserved' to indicate booking rather than full purchase.
    const body = req.body || {};
    if (body.depositPaid) {
      body.status = 'Reserved';
    }
    const newOrder = new Order(body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, orderId: savedOrder._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get order details
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Serve frontend for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Wrap the listen in a check so Vercel doesn't crash when it imports the app
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app for Vercel Serverless
module.exports = app;