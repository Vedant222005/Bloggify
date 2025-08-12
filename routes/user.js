const {Router}=require("express");
const path = require('path');
const router=Router();
const User=require('../models/user');
const { validateToken,createToken} = require("../services/auth");
const multer = require('multer');

router.get('/signin',(req,res)=>{
    return res.render('signin')
})
router.get('/signup',(req,res)=>{
     return res.render('signup')
})
router.get('/profile',(req,res)=>{
  res.render('profile', {
    user: req.user 
  });
})

 

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/profile', upload.single('profileImage'), async (req, res, next) => {
  try {
    const updatedUsername = req.body.username;
    const imagePath = req.file ? `/images/${req.file.filename}` : req.user.profileImageURL;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        username: updatedUsername,
        profileImageURL: imagePath
      },
      { new: true }
    );
    //creating new token
    const newToken = await createToken(updatedUser); // Or however you generate JWT
    req.flash('success', 'Profile updated successfully!');
    return res.cookie("token", newToken).redirect('/user/profile');
  } catch (err) {
    console.error('Profile update error:', err);
    req.flash('error', 'Something went wrong!');
    return res.redirect('/user/profile');
  }
});


router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await User.create({ username, email, password });
    req.flash('success', 'Account created successfully');
    return res.redirect('/user/signin');
  } catch (err) {
    if (err.code === 11000) {
      req.flash('error', 'Email is already registered. Please use a different one.');
    } else {
      req.flash('error', err.message || 'Something went wrong');
    }
    return res.redirect('/user/signup');
  }
});


 router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.ismatchedAndGenrateToken(email, password);
    req.flash('success', 'Successfully signed in!');
    return res.cookie("token",token).redirect('/');
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('/home');
  }
});

router.get("/logout",(req,res)=>{
  res.clearCookie("token").redirect("/home")
})

router.post('/follow/:id', async (req, res) => {
  const followerId = req.user._id;
  const followingId = req.params.id;
  try {
    const user = await User.findById(followerId);
    await User.findByIdAndUpdate(
        followerId,
        { $addToSet: { following: followingId } },
        { new: true }
      );
    req.flash('success', 'You are now following this blogger!');
    res.redirect(req.get('referer'));
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    res.redirect('/home');
  }
});


router.post('/unfollow/:id', async (req, res) => {
  const followerId = req.user._id;
  const followingId = req.params.id;
  try {
    const user = await User.findById(followerId);
    await User.findByIdAndUpdate(followerId, {
        $pull: { following: followingId }
      });
    req.flash('error', 'Unfollowed successfully.');
    res.redirect(req.get('referer'));
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/home');
  }
});


router.get('/followed-bloggers', async (req, res) => {
  try {
    // Populate the users that the current user is following
    const currentUser = await User.findById(req.user._id)
      .populate('following', 'username profileImageURL'); // Only get the necessary fields

    res.render('following',{
      followedBloggers: currentUser.following,
      user: req.user,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    res.redirect('/home');
  }
});




module.exports=router