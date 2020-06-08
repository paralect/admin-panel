const psl = require('psl');
const url = require('url');
const config = require('config');
const { COOKIES } = require('app.constants');

exports.setTokenCookies = ({
  ctx,
  accessToken,
  cookies = COOKIES,
}) => {
  const parsedUrl = url.parse(config.webUrl);
  const parsed = psl.parse(parsedUrl.hostname);
  const cookiesDomain = parsed.domain;

  ctx.cookies.set(cookies.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    domain: cookiesDomain,
  });
};

exports.unsetTokenCookies = (ctx) => {
  ctx.cookies.set(COOKIES.ACCESS_TOKEN);
};
