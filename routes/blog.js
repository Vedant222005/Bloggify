const { Router } = require('express');
const router = Router();
const path = require('path');
const Blog = require('../models/blog');
const multer = require('multer');
const User=require('../models/user')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads`);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
const upload = multer({ storage });

router.get('/create', (req, res) => {
    res.render('blog', {
      user: req.user // pass the user object to the view
    });
  });
  
// Blog View Route
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate({
      path: 'comments.commentedBy',
      select: 'username'
    });
    const user = req.user ? await User.findById(req.user._id) : null; // Ensure user is fetched if logged in
    res.render('view', {
      user,
      blog
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    res.redirect('/home');
  }
});


router.post('/create', upload.single('coverImage'),async (req, res) => {
  const { title, body, coverImageURL } = req.body;
  const userId = req.user._id; // From JWT middleware
  const username=req.user.username
  try {
    const blog=await Blog.create({
      title,
      body,
      coverImageURL: req.file ? `/uploads/${req.file.filename}` : '/images/default.jpg',
      createdBy: userId,
      author:username
    });
    req.flash('success', 'Blog created successfully!');
    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    req.flash('error', 'Something went wrong while creating the blog.');
    res.redirect('/home'); // Redirect user back to the form page
  }
});


router.post('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!req.user) {
      req.flash('error', 'You must be logged in to like a blog');
      return res.redirect(`/blog/${blog._id}`);
    }

    const userId = req.user._id;
    const alreadyLiked = blog.likedBy.includes(userId);

    if (alreadyLiked) {
      blog.likedBy.pull(userId);
      blog.likes -= 1;
      req.flash('error', 'You disliked this blog');
    } else {
      blog.likedBy.push(userId);
      blog.likes += 1;
      req.flash('success', 'You liked this blog!');
    }

    await blog.save();
    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong while liking the blog');
    res.redirect('/home'); 
  }
});

  
  router.post('/:id/comments', async (req, res) => {
    try {
      // Find blog and ensure it exists
      const blog = await Blog.findById(req.params.id);
      // Check if user is logged in
      if (!req.user) {
        req.flash('error', 'You must be logged in to comment');
        return res.redirect(`/blog/${blog._id}`);
      }
      // Create new comment
      const newComment = {
        text: req.body.comment,
        commentedBy: req.user._id
      };
      // Push new comment to the blog's comment array and save the blog
      blog.comments.push(newComment);
      await blog.save();
      // Populate the comment's commentedBy field with the username after saving
      await blog.populate({
        path: 'comments',
        populate: {
          path: 'commentedBy',
          select: 'username'  // Only populate the username field
        }
      })
      // Set success flash message
      req.flash('success', 'Comment added!');
      // Redirect to the blog view page
      res.redirect(`/blog/${blog._id}`);
    } catch (err) {
      // Log the error and show an error message
      console.error(err);
      req.flash('error', 'Failed to add comment');
      res.redirect('/home');
    }
  });
  
  router.post('/delete/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const currUser = req.session.userId;
        // Find the blog by its ID and check if it exists
        const currBlog = await Blog.findById(blogId);
        // Proceed to delete the blog if the user is the author
        await Blog.deleteOne({ _id: blogId });
        req.flash('success', 'Blog deleted successfully!');
        res.redirect('/home'); // Redirect to homepage after successful deletion

    } catch (err) {
        console.error(err);
        req.flash('err', 'Something went wrong!');
        res.redirect('/home');
    }
});


router.get('/:id/blogs', async (req, res) => {
  try {
    const bloggerId = req.params.id;
    // Validate blogger existence from User model instead of Blog
    const blogger = await User.findById(bloggerId);
    if (!blogger) {
      req.flash('error', 'Blogger does not exist');
      return res.redirect('/home');
    }
    // Fetch blogs by that blogger
    const allBlogs = await Blog.find({ createdBy: bloggerId }).sort({ createdAt: -1 });
    return res.render('followedBlogs', {
      user: req.user,
      blogs: allBlogs,
      bloggerName: blogger.username  // optional: show whose blogs they are
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    return res.redirect('/home');
  }
});



module.exports = router;
