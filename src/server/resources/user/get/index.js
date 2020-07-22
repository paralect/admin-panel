const Joi = require('@hapi/joi');

const userService = require('resources/user/user.service');
const regexp = require('helpers/regexp.helper');
const validate = require('middlewares/validate');


const schema = Joi.object({
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
});

const handler = async (ctx) => {
  const {
    searchText,
    page,
    pageSize,
    sortBy,
    sortDirection,
  } = ctx.validatedData;

  const query = {};

  if (searchText) {
    const text = new RegExp(regexp.formatSearchText(searchText), 'i');
    query.$or = [
      { firstName: text },
      { lastName: text },
      { email: text },
    ];
  }

  const options = { page, perPage: pageSize };

  options.sort = sortBy.reduce((acc, field) => {
    acc[field] = sortDirection;
    return acc;
  }, {});

  const { results: users, count: totalAmount } = await userService.find(query, options);

  ctx.body = {
    results: users.map(userService.getPublic),
    totalAmount,
  };
};

module.exports.register = (router) => {
  router.get('/', validate(schema), handler);
};
