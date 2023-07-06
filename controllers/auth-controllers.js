const bcrypt = require("bcrypt");
require("dotenv").config();
const {nanoid} = require("nanoid");

const { SECRET_KEY, BASE_URL } = process.env;

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { ctrlWrapper } = require("../decorators");

const { HttpError, sendEmail } = require("../helpers");

const gravatar = require("gravatar");

const fs = require("fs/promises");

const path = require("path");

const Jimp = require("jimp");

const avatarDir = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const userAvatar = gravatar.url(email, { s: "250", d: "404" }, false);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: userAvatar,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({verificationToken});
  if(!user) {
    throw HttpError(401, 'User not found');
  }
  await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ''})

  res.status(200).json({
    message: 'Verification successful'
  })
};

const resendVerifyEmail = async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user){
    throw HttpError(404, 'User not found');
  };

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  };

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);
   
  res.json({
    message: "Verification email sent"
  });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if(!user.verify){
    throw HttpError(401, "Email not register");
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({
    message: "Logout success",
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });
  res.json({
    message: "Update success",
  });
};

const updateAvatar = async (req, res) => {
  const { path: oldPath, filename } = req.file;

  await Jimp.read(oldPath)
    .then((avatar) => {
      return avatar.resize(250, 250).write(oldPath);
    })
    .catch((err) => {
      console.error(err);
    });

  const newPath = path.join(avatarDir, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
