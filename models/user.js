const { Schema, model } = require('mongoose');

const { handleMongooseError } = require('../helpers');

const { userRegexp, subscriptionList } = require('../constants/user')

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
        enum: subscriptionList,
        default: "starter"
      },
      token: {
        type: String,
      }
}, {versionKey: false});

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

module.exports = User;

