"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signIn = exports.findUserById = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _secrets = require("../util/secrets");

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jwtSecret = _secrets.JWT_SECRET;

const findUserById = async (req, res) => {
  try {
    const user = await _User.default.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.findUserById = findUserById;

const signIn = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
    let user = await _User.default.findOne({
      email
    });

    if (!user) {
      return res.status(400).json({
        msg: 'Invalid Credentials'
      });
    }

    const isMatch = await _bcryptjs.default.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        msg: 'Invalid Credentials'
      });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    _jsonwebtoken.default.sign(payload, jwtSecret, {
      expiresIn: 360000
    }, (err, token) => {
      if (err) throw err;
      res.json({
        token
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.signIn = signIn;