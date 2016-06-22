var contentful = require('contentful');

// Configure Contentful
exports.const = {
  "POST_CT": '2wKn6yEnZewu2SCCkus4as',
  "CAT_CT": '5KMiN6YPvi42icqAUQMCQe',
  "AUTHOR_CT": '1kUEViTN4EmGiEaaeC6ouY'
};

exports.api = contentful.createClient({
  space: 'w7sdyslol3fu',
  accessToken: '7fae8d7e008ac19995f5e95be0e61d4308e34c83541791eeec0ccce7d2f8d8be'
});
