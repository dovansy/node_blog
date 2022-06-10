module.exports = {
  authorize: require('./authorize.middleware'),
  authenticated: require('./authenticated.middleware'),
  paging: require('./paging.middleware'),
  validation: require('./validation.middleware'),
};
