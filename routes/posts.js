var express = require('express');
var blog = require('../services/blog');

var router = express.Router();

// Fetch post for rendering
router.param('slug', function(req, res, next, slug) {
  blog.getPostBySlug(slug).then(function(post) {
    req.blogPost = post;
    next();
  }).fail(function(errorMsg) {
    res.status(404).send(errorMsg);
  });
});

// Show the blog post page.
router.get('/:slug', function(req, res, next) {
  res.render('post', req.blogPost);
});

module.exports = router;
