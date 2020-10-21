"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("../middleware/auth"));

var _contact = require("../controllers/contact");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get('/', _auth.default, _contact.findContact);
router.post('/', _auth.default, _contact.addContact);
router.put('/:id', _auth.default, _contact.updateContact);
router.delete('/:id', _auth.default, _contact.deleteContact);
var _default = router;
exports.default = _default;