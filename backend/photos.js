const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  imagePath: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credential', // Adjust this to match your actual user model name
    required: true,
  },
});

const UserPhoto = mongoose.model('UserPhoto', photoSchema);

module.exports = UserPhoto;
