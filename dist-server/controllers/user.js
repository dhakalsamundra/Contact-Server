"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUpUser = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _expressValidator = require("express-validator");

var _User = _interopRequireDefault(require("../models/User"));

var _secrets = require("../util/secrets");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jwtSecret = _secrets.JWT_SECRET;

const signUpUser = async (req, res) => {
  const errors = (0, _expressValidator.validationResult)(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    name,
    email,
    password
  } = req.body;

  try {
    let user = await _User.default.findOne({
      email
    });

    if (user) {
      return res.status(400).json({
        msg: 'User already exists'
      });
    }

    user = new _User.default({
      name,
      email,
      password
    });
    const salt = await _bcryptjs.default.genSalt(10);
    user.password = await _bcryptjs.default.hash(password, salt);
    await user.save();
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

exports.signUpUser = signUpUser;