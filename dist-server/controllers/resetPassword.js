"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetPassword = exports.resetPasswordRequest = void 0;

var _mail = _interopRequireDefault(require("@sendgrid/mail"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _secrets = require("../util/secrets");

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const resetPasswordRequest = async (req, res) => {
  const {
    email
  } = req.body;
  const {
    url
  } = req.body;
  const user = await _User.default.findOne({
    email: email
  });

  if (!user) {
    return res.status(400).json({
      msg: 'This email is not associated. Please check your email address.'
    });
  } //generate and set the password reset token to the user database


  user.generatePasswordReset();
  user.save();
  console.log('this is the backend side of the reset password request', url);
  const link = `${url}/${user.resetPasswordToken}`;

  _mail.default.setApiKey(_secrets.SENDGRID_API_KEY);

  const mailOptions = {
    to: user.email,
    from: _secrets.FROM_MAIL,
    subject: 'Link to reset password',
    html: `Link to reset your password and is valid for 1 hour only: <strong><a href=${link}>link</a></strong>`
  };

  _mail.default.setApiKey(_secrets.SENDGRID_API_KEY);

  const sendMail = _mail.default.send(mailOptions);

  if (sendMail) {
    return res.json({
      msg: 'Reset link has been send to the provided email address.'
    });
  } else {
    res.status(500).send('Internal server error bro..');
  }
};

exports.resetPasswordRequest = resetPasswordRequest;

const resetPassword = async (req, res) => {
  _User.default.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }).then(user => {
    if (!user) return res.status(401).json({
      message: 'Password reset token is invalid or has expired.'
    }); // set the password in bcrypt

    const salt = _bcryptjs.default.genSaltSync(10);

    const hashed = _bcryptjs.default.hashSync(req.body.password, salt); //Set the new password


    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined; // Save

    user.save(err => {
      if (err) return res.status(500).json({
        message: err.message
      });

      _mail.default.setApiKey(_secrets.SENDGRID_API_KEY); // send email


      const mailOptions = {
        to: user.email,
        from: _secrets.FROM_MAIL,
        subject: "Your password has been changed",
        text: `Hi ${user.name} \n 
                    This is a confirmation that the password for your account ${user.email} has just been changed.\n`
      };

      _mail.default.send(mailOptions, (error, result) => {
        if (error) return res.status(500).json({
          message: error.message
        });
        res.status(200).json({
          message: 'Your password has been updated.'
        });
      });
    });
  });
};

exports.resetPassword = resetPassword;