const Sequelize = require('sequelize');
const UserService = require('../services/users.service');

const UserController = {};
UserController.create = async (req, res) => {
  let user_id = await UserService.create(req.body);

  return await UserService.getInfo({ user_id });
};

UserController.update = async (req, res) => {
  await UserService.update(req.body);
  return await UserService.getInfo({ user_id: req.body.user_id });
};

module.exports = UserController;
