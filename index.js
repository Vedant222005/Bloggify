const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const cookieParser = require('cookie-parser');
const blogRoute = require('./routes/blog');
const userRoute = require('./routes/user');
const Blog = require('./models/blog');
const mongoose = require('mongoose');

const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const { checkForAuthentication } = require('./middleware/auth');

const PORT = process.env.PORT || 8000;

// ----------------------
// Session Middleware
// ----------------------
app.use(session({
  secret: process.env.SESSION_SECRET || 'vedant123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ----------------------
// Global Middleware
// ----------------------
app.use(express.static('public'));
app.use(flash());
app.use(cookieParser());
app.use(checkForAuthentication('token'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// ----------------------
// View Engine Setup
// ----------------------
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// ----------------------
// Routes
// ----------------------
app.get('/', async (req, res) => {
  try {
    const allBlogs = await Blog.find({})
      .populate('createdBy')
      .sort({ createdAt: -1 });

    return res.render('home', {
      user: req.user,
      blogs: allBlogs
    });
  } catch (err) {
    req.flash('error', 'Failed to load blogs');
    return res.render('home', {
      user: req.user,
      blogs: []
    });
  }
});

app.use('/blog', blogRoute);
app.use('/user', userRoute);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).render('404', { user: req.user });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).render('error', { 
    user: req.user, 
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message 
  });
});

// ----------------------
// MongoDB Connection + Server Start
// ----------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(PORT);
})
.catch((err) => {
  process.exit(1);
});
