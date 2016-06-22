var express = require('express');
var blog = require('../services/blog');
var router = express.Router();


router.param('id', function(req, res, next, id) {
  console.log('Fetching category and posts...');
  blog.getCategoryWithPosts(id).then(function(res) {
    req.posts = res.posts;
    req.category = res.category;
    next();
  });
});

/* Category home page. */
router.get('/:id', function(req, res, next) {
  res.render('category', {
    posts: req.posts,
    category: req.category
  });
});

module.exports = router;
