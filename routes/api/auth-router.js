const express = require("express");

const {validateData} = require("../../decorators");

const authControllers = require('../../controllers/users-controllers');

const userSchemas = require("../../schemas/users");

const authRouter = express.Router();

authRouter.post('/register', validateData(userSchemas.userRegisterSchema), authControllers.register);

module.exports = authRouter;