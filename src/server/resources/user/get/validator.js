const Joi = require('helpers/joi.adapter');


const schema = {
  searchText: Joi.string()
    .allow('')
    .default(''),
  sortBy: Joi.array()
    .items(Joi.string())
    .default(['createdOn']),
  sortDirection: Joi.number()
    .default(-1),
  page: Joi.number()
    .min(1)
    .default(1),
  pageSize: Joi.number()
    .min(0)
    .default(10),
};

module.exports = [
  Joi.validate(schema),
];
