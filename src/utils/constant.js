"use strict";
const debug = require("debug");
class AppError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "AppError";
  }
}
Error.create = function ({ code, message }) {
  let err = new AppError(code, message);
  // err.code = code;
  return err;
};
Error.errorInvalidParam = (message) => Error.create({ code: 9, message });
module.exports = {
  // error code
  statusCode: {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 403,
    MULTIPLE_CHOICES: 300,
    FORBIDDEN: 403,
  },

  apiCode: {
    SUCCESS: Error.create({ code: 1, message: "Thành công" }),
    DB_ERROR: Error.create({ code: 2, message: "Truy vấn lỗi" }),
    WRONG_TYPE_ACCOUNT: Error.create({
      code: 3,
      message: "Không đúng loại user",
    }),
    DELETE_IMAGE_ERROR: Error.create({ code: 4, message: "Lỗi xoá ảnh" }),
    ACCOUNT_EXIST: Error.create({ code: 5, message: "Tài khoản đã tồn tại" }),
    ERROR_LOGIN: Error.create({
      code: 6,
      message: "Sai tài khoản hoặc mật khẩu",
    }),
    UPLOAD_IMAGE_ERROR: Error.create({ code: 7, message: "Lỗi upload ảnh" }),
    CREATE_USER_ERROR: Error.create({ code: 8, message: "Lỗi tạo tài khoản" }),
    INVALID_PARAM: Error.create({ code: 9, message: "Tham số không hợp lệ" }),
    REVIEW_ORDER_ERROR: Error.create({ code: 10, message: "Lỗi đánh giá" }),
    NOT_FOUND: Error.create({ code: 11, message: "Dữ liệu không tồn tại " }),
    FB_ERROR: Error.create({ code: 12, message: "" }),
    UNAUTHORIZED: Error.create({
      code: 403,
      message: "Không có quyền truy cập",
    }),
    INVALID_ACCESS_TOKEN: Error.create({
      code: 404,
      message: "Token không hợp lệ",
    }),
    NO_PERMISSION: Error.create({
      code: 13,
      message: "Không có quyền thực hiện chức năng",
    }),
    NOT_ACCOUNT_EXIST: Error.create({
      code: 14,
      message: "Tài khoản không tồn tại",
    }),
    UPDATE_USER_ERROR: Error.create({
      code: 15,
      message: "Lỗi cập nhật tài khoản",
    }),
    PAGE_ERROR: Error.create({ code: 16, message: "Lỗi truyền trang" }),
    PLACE_ERROR: Error.create({
      code: 17,
      message: "Không thể lấy được địa chỉ",
    }),
    UPDATE_FAIL: Error.create({
      code: 18,
      message: "Cập nhật không thành công",
    }),
    WRONG_PASSWORD: Error.create({
      code: 19,
      message: "Sai mật khẩu",
    }),
    DATA_EXIST: Error.create({ code: 19, message: "Dữ liệu đã tồn tại" }),
    LOGIN_FAIL: Error.create({
      code: 6,
      message: "Sai tài khoản hoặc mật khẩu",
    }),
    WRONG_PASSWORD: Error.create({
      code: 20,
      message: "Vui lòng kiểm tra lại mật khẩu",
    }),
  },

  account_state: {
    ACTIVE: 1,
    DELETED: 0,
    DEACTIVE: 2,
  },

  role: {
    ADMIN: 1,
    RECRUITER: 2,
    APPLICANT: 3,
  },

  config: {
    CRYPT_SALT: 10,
    PAGING_LIMIT: 15,
    RESET_PASSWORD: "123456",
    MAX_IMAGE: 5,
  },

  phone: {
    MIN_SEARCH_PHONE_LENGTH: 5,
    MIN_CREATE_PHONE_LENGTH: 6,
    MAX_CREATE_PHONE_LENGTH: 15,
  },

  firebase: {
    ACCOUNT: "",
  },

  debug: {
    db: debug("app:dbquery"),
    log: debug("app:log"),
    debug: debug("app:debug"),
    error: debug("app:error"),
    email: debug("app:email"),
  },
};
