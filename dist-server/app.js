"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _auth = _interopRequireDefault(require("./routers/auth"));

var _user = _interopRequireDefault(require("./routers/user"));

var _contact = _interopRequireDefault(require("./routers/contact"));

var _password = _interopRequireDefault(require("./routers/password"));

var _secrets = require("./util/secrets");

require("@babel/polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
const mongoUrl = _secrets.MONGODB_URI;

_mongoose.default.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(() => {
  /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
}).catch(err => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
  process.exit(1);
});

app.set('port', process.env.PORT || 3002);
app.use(_express.default.json({
  extended: false
}));
app.use(_express.default.static(_path.default.join(__dirname, '../client/build')));
app.use('/api/users', _user.default);
app.use('/api/auth', _auth.default);
app.use('/api/contacts', _contact.default);
app.use('/api/resetPassword', _password.default);
app.get('*', (req, res) => {
  res.send(_express.default.static(_path.default.join(__dirname, '../client/build/index.html')));
});
var _default = app;
exports.default = _default;