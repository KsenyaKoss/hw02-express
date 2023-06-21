const { Schema, model } = require('mongoose');

const { handleMongooseError } = require('../helpers');

const { userRegexp } = require('../constants/user')

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
      },
      email: {
        type: String,
        match: userRegexp,
        required: [true, 'Email is required'],
        unique: true,
      },
      subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
      },
      token: String
}, {versionKey: false});

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

module.exports = User;

