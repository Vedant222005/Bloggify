const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv'); 


const cookieParser=require('cookie-parser')
const blogRoute=require('./routes/blog')
const userRoute=require('./routes/user')
const PORT = 8000;
const Blog=require('./models/blog');
const mongoose=require('mongoose');

const session = require('express-session');
const flash = require('connect-flash');
const { checkForAuthentication } = require('./middleware/auth');

dotenv.config();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(express.static('public'));
app.use(flash());
app.use(cookieParser())
app.use(checkForAuthentication('token'))
app.use(express.json()); // in case you're dealing with JSON requests


app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log("mongodb is conneted"))

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));
app.use(express.static('public'));

app.get('/home', async (req, res) => {
  try {
    const allBlogs = await Blog.find({})
      .populate('createdBy') // populates user details
      .sort({ createdAt: -1 });

    return res.render('home', {
      user: req.user,
      blogs: allBlogs
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/', async (req, res) => {
  res.render('coverpage', {
    user: req.user // ✅ pass user to avoid ReferenceError
  })
})

app.use('/blog',blogRoute);
app.use('/user',userRoute);


app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
