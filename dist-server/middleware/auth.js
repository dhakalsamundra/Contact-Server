"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = authJwt;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _secrets = require("../util/secrets");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jwtSecret = _secrets.JWT_SECRET;

async function authJwt(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token'); // Check if not token

  if (!token) {
    return res.status(401).json({
      msg: 'No token, authorization denied'
    });
  }

  try {
    const decoded = _jsonwebtoken.default.verify(token, jwtSecret);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      msg: 'Token is not valid'
    });
  }
}