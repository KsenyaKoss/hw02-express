const express = require("express");

const {validateData} = require("../../decorators");

const authControllers = require('../../controllers/auth-controllers');

const userSchemas = require("../../schemas/users");

const { authenticate, upload } = require('../../middlewares');

const authRouter = express.Router();

authRouter.post('/register', validateData(userSchemas.userRegisterSchema), authControllers.register);

authRouter.post('/login', validateData(userSchemas.userLoginSchema), authControllers.login);

authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.post('/logout', authenticate, authControllers.logout);

authRouter.patch('/', authenticate,validateData(userSchemas.subscriptionUpdateSchema), authControllers.updateSubscription);

authRouter.patch('/avatars', authenticate, upload.single('avatarURL'), authControllers.updateAvatar)


module.exports = authRouter;