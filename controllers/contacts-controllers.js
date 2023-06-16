const Contact = require('../models/contact');

const { ctrlWrapper} = require('../decorators');

const { HttpError } = require("../helpers");


const listContacts = async (req, res) => {
    const contacts = await Contact.find();
    res.json(contacts);
 
}

const getById = async (req, res) => {
    const { contactId } = req.params;
    console.log(contactId);
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw HttpError(404, `Not found`);
    }

    res.json(contact);

}

const add = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
}

const removeContact = async (req, res, next) => {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if(!result){
      throw HttpError(404, `Not found`);
    }
    res.json({
      "message": "contact deleted"});
}

const update = async (req, res) => {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if(!result){
      throw HttpError(404, `Not found`)
    }
    res.status(200).json(result);   
  
}

const updateStatusContact = async (req, res) => {
  const { contactId }  = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
  if(!result){
    throw HttpError(404, `Not found`)
  }
  res.status(200).json(result); 
}


module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  removeContact: ctrlWrapper(removeContact),
  update: ctrlWrapper(update),
  updateStatusContact: ctrlWrapper(updateStatusContact),
}