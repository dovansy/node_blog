
const userService = require('./user.routers');
const postsService = require('./posts.routers');

function route(app) {
  app.use('/posts', postsService);
  app.use('/', userService);
}

module.exports = route;
