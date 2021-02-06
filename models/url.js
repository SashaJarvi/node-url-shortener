const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const { Schema } = mongoose;
const shortLinkLength = 5;

const shortUrlSchema = new Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: () => nanoid(shortLinkLength),
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  }
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
