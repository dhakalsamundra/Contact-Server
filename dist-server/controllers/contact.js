"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteContact = exports.updateContact = exports.addContact = exports.findContact = void 0;

var _expressValidator = require("express-validator");

var _Contact = _interopRequireDefault(require("../models/Contact"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const findContact = async (req, res) => {
  try {
    const contacts = await _Contact.default.find({
      user: req.user.id
    }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.findContact = findContact;

const addContact = async (req, res) => {
  const errors = (0, _expressValidator.validationResult)(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    name,
    email,
    phone,
    type
  } = req.body;

  try {
    const newContact = new _Contact.default({
      name,
      email,
      phone,
      type,
      user: req.user.id
    });
    const contact = await newContact.save();
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addContact = addContact;

const updateContact = async (req, res) => {
  const errors = (0, _expressValidator.validationResult)(req);
  if (!errors.isEmpty()) return res.status(400).json({
    errors: errors.array()
  });
  const {
    name,
    email,
    phone,
    type
  } = req.body; // Build contact object

  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await _Contact.default.findById(req.params.id);
    if (!contact) return res.status(404).json({
      msg: 'Contact not found'
    }); // Make sure user owns contact

    if (contact.user.toString() !== req.user.id) return res.status(401).json({
      msg: 'Not authorized'
    });
    contact = await _Contact.default.findByIdAndUpdate(req.params.id, {
      $set: contactFields
    }, {
      new: true
    });
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateContact = updateContact;

const deleteContact = async (req, res) => {
  try {
    const contact = await _Contact.default.findById(req.params.id);
    if (!contact) return res.status(404).json({
      msg: 'Contact not found'
    }); // Make sure user owns contact

    if (contact.user.toString() !== req.user.id) return res.status(401).json({
      msg: 'Not authorized'
    });
    await _Contact.default.findByIdAndRemove(req.params.id);
    res.json({
      msg: 'Contact removed'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteContact = deleteContact;