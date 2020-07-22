exports.formatSearchText = (searchText = '') => {
  // eslint-disable-next-line no-useless-escape
  return searchText.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};
