const User = require('../models/user');

const { ctrlWrapper } = require('../decorators');

const { HttpError } = require('../helpers');

const register = async ( req, res ) => {

}

module.exports = {
    register: ctrlWrapper(register),
}