var cf = require('./cf');
var dateFormat = require('dateformat');
var md = require('marked');
var Q = require('q');

module.exports = {

  /**
   * Retrieves a list of blog posts.
   * @param {number} limit The number of posts to retrieve.
   * @return {Promise} The promise called once the posts are fetched an ready.
   *     This promise will take the main post list as a parameter for the
   *     resolve call.
   */
  getPostsList: function(limit) {
    var deferred = Q.defer();
    cf.api.getEntries({
      'content_type': cf.const.POST_CT,
      'limit': limit
    }).then(function (response) {
      var posts = [];
      if (response.total > 0) {
        posts = this.formatPosts_(response.items);
      }
      deferred.resolve(posts);
    }.bind(this), function(errorMsg) {
      console.error(errorMsg);
      deferred.reject(errorMsg);
    }.bind(this));

    return deferred.promise;
  },

  /**
   * Retrieves a blog post using the provided slug.
   * @param {string} slug The slug of the blog post to retrieve.
   * @return {Promise} The promise called once the post is fetched an ready.
   *     This promise will take the main post object as a parameter for the
   *     resolve call.
   */
  getPostBySlug: function(slug) {
    var deferred = Q.defer();
    cf.api.getEntries({
      'content_type': cf.const.POST_CT,
      'fields.slug': slug
    }).then(function (entries) {
      if (entries.total == 0) {
        deferred.reject('Sorry, this blog post hasn\'t been found');
      } else {
        deferred.resolve(this.formatPost_(entries.items[0]));
      }
    }.bind(this), function(errorMsg) {
      console.error(errorMsg);
      deferred.reject(errorMsg);
    }.bind(this));
    return deferred.promise;
  },

  /**
   * Fetches the list of categories.
   * @return {Promise} The promise which resolves with the list of fetched
   *     categories.
   */
  getCategories: function() {
    var deferred = Q.defer();
    cf.api.getEntries({
      'content_type': cf.const.CAT_CT,
      'include': 0
    }).then(function (response) {
      if (response.total == 0) {
        deferred.resolve([]);
      } else {
        deferred.resolve(response.items);
      }
    }.bind(this));
    return deferred.promise;
  },

  /**
   * Fetches the categories using its id.
   * @param {string} id The category id.
   * @return {Promise} The promise which resolves with the category.
   */
  getCategoryWithPosts: function(id) {
    var deferred = Q.defer();
    cf.api.getEntry(id).then(function (catResponse) {
      cf.api.getEntries({
        'content_type': cf.const.POST_CT,
        'fields.category.sys.id': id
      }).then(function(postsResponse) {
        deferred.resolve({
          category: catResponse,
          posts: this.formatPosts_(postsResponse.items)
        });
      }.bind(this), function(errorMsg) {
        console.error(errorMsg);
        deferred.reject(errorMsg);
      });
      return deferred.promise;
    }.bind(this), function(errorMsg) {
      console.error(errorMsg);
      deferred.reject(errorMsg);
    }.bind(this));
    return deferred.promise;
  },

  /**
   * Formats a list of post objects returned by the Contentful API to ease their
   * use in the subsequent views.
   * @param {array} posts The list of post objects to format.
   * @return {array} The formatted blog post object list.
   */
  formatPosts_: function(posts) {
    var result = [];
    console.log(require('util').inspect(posts, { depth: null }));
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      result.push({
        title: post.fields.title,
        slug: post.fields.slug,
        featuredImage: post.fields.featuredImage ? post.fields.featuredImage.fields : null,
        plot: post.fields.body.substr(0, 150) + '...',
        date: dateFormat(post.fields.date, 'fullDate'),
        categories: post.fields.category,
        author: {
          name: post.fields.author[0].fields.name,
          website: post.fields.author[0].fields.website
        }
      });
    }
    return result;
  },

  /**
   * Formats a post objects returned by the Contentful API to ease its use in
   * the subsequent views.
   * @return {object} The formatted blog post object.
   */
  formatPost_: function(post) {
    return {
      title: post.fields.title,
      featuredImage: post.fields.featuredImage ? post.fields.featuredImage.fields : null,
      body: md(post.fields.body),
      date: dateFormat(post.fields.date, 'fullDate'),
      categories: post.fields.category,
      author: {
        name: post.fields.author[0].fields.name,
        website: post.fields.author[0].fields.website
      }
    };
  }
};
