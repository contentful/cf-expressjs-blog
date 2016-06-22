# Contentful ExpressJS Blog example
This example showcases usage of the Contentful Delivery API through the Node.js SDK for building the blog using the Blog demo space.

# Installation & usage
`npm install`

`npm start`

# Documentation
## Express project creation
This project was built using the following command

`express express-blog -c stylus`

## Service modules
* The [cf!](services/cf.js) module is encapsulating Contentful's specifics like the API key, as well as constants for content type identifiers
* The [blog!](services/blog.js) module is a service taking care of calling Contentful and normalizing the results from the API

## View
The main CSS structure comes from the [Bootstrap blog template](http://getbootstrap.com/examples/blog/) it is defined in the [layout!](views/layout.jade) template.

Blog posts rendering is handled in the [mixins!](views/mixins.jade), so it can be reused in the [category!](views/category.jade) and [index!](views/index.jade) views.
