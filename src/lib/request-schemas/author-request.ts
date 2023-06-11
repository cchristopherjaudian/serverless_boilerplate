import joi from 'joi';

const createAuthorSchema = {
  body: joi.object().keys({
    id: joi.string().required(),
    firstname: joi.string().required(),
    middlename: joi.string().optional(),
    authorUniqueReference: joi.string().required(),
    lastname: joi.string().required(),
    address: joi.string().optional(),
    contactNumber: joi.string().length(11).required(),
    emailAddress: joi.string().email().required(),
  }),
};

export { createAuthorSchema };
