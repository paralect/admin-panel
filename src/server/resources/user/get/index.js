const userService = require('resources/user/user.service');
const regexp = require('helpers/regexp');
const validate = require('middlewares/validate');

const validator = require('./validator');


const handler = async (ctx) => {
  const {
    searchText,
    page,
    pageSize,
    sortBy,
    sortDirection,
  } = ctx.validatedRequest.value;

  const query = {};

  if (searchText) {
    const text = new RegExp(regexp.formatSearchText(searchText), 'i');
    query.$or = [
      { firstName: text },
      { lastName: text },
      { email: text },
    ];
  }

  const options = { page, pageSize };

  options.sort = sortBy.reduce((acc, field) => {
    acc[field] = sortDirection;
    return acc;
  }, {});

  const [{ results: users }, totalAmount] = await Promise.all([
    userService.find(query, options),
    userService.count(query),
  ]);

  ctx.body = {
    results: users.map(userService.getPublic),
    totalAmount,
  };
};

module.exports.register = (router) => {
  router.get('/', validate(validator), handler);
};
