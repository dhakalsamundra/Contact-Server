"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _resetPassword = require("../controllers/resetPassword");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.post('/', _resetPassword.resetPasswordRequest);
router.post('/:token', _resetPassword.resetPassword);
var _default = router;
exports.default = _default;