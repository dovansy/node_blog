const Validator = require('../helpers/validate');
const response = require('../common/response');
const { error } = response;
const { apiCode } = require('@utils/constant');


const validateParams = (requestParams) => {
  return async function (req, res, next) {

    let params = { ...req.body, ...req.query };

    console.log(params);

    await Validator(params, requestParams, {}, (err, status) => {
      if (!status) {
        res.json(error(apiCode.INVALID_PARAM.code, apiCode.INVALID_PARAM.message, err));
      } else {
        next();
      }
    });
  }
};

module.exports = {
  validateParams
};
