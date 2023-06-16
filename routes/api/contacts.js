const express = require("express");

const contactsControllers = require('../../controllers/contacts-controllers');

const {validateData} = require("../../decorators");

const { isValidId } = require('../../middlewares');

const { isFavoriteExist } = require('../../middlewares');

const schemas = require("../../schemas/contacts");

const router = express.Router();


router.get("/", contactsControllers.listContacts);

router.get("/:contactId",isValidId, contactsControllers.getById);

router.post("/", validateData(schemas.contactAddSchema), contactsControllers.add);

router.delete("/:contactId", isValidId, contactsControllers.removeContact);

router.put("/:contactId", isValidId, validateData(schemas.contactAddSchema), contactsControllers.update);

router.patch("/:contactId/favorite", isValidId, isFavoriteExist, validateData(schemas.contactUpdateFavoriteSchema), contactsControllers.updateStatusContact);

module.exports = router;
