"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MONGODB_URI = exports.JWT_SECRET = exports.FROM_MAIL = exports.SENDGRID_API_KEY = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_fs.default.existsSync('.env')) {
  console.debug('Using .env file to supply config environment variables');

  _dotenv.default.config({
    path: '.env'
  });
}

const SENDGRID_API_KEY = process.env['SENDGRID_API_KEY'];
exports.SENDGRID_API_KEY = SENDGRID_API_KEY;
const FROM_MAIL = process.env['FROM_MAIL'];
exports.FROM_MAIL = FROM_MAIL;
const JWT_SECRET = process.env['JWT_SECRET'];
exports.JWT_SECRET = JWT_SECRET;
const MONGODB_URI = process.env['MONGODB_URI'];
exports.MONGODB_URI = MONGODB_URI;