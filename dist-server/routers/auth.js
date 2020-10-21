"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressValidator = require("express-validator");

var _auth = _interopRequireDefault(require("../middleware/auth"));

var _auth2 = require("../controllers/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get('/', _auth.default, _auth2.findUserById);
router.post('/', [(0, _expressValidator.check)('email', 'Please include a valid email').isEmail(), (0, _expressValidator.check)('password', 'Password is required').exists()], _auth2.signIn);
var _default = router;
exports.default = _default;