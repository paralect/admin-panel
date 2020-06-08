import { generatePath } from 'react-router-dom';

const defaults = {
  url(options = {}) {
    return {
      ...options,
      pathname: generatePath(this.path, options.params),
    };
  },
};

export const routes = {
  signIn: {
    ...defaults,
    name: 'signIn',
    path: '/signin',
    exact: false,
    private: false,
  },
  home: {
    ...defaults,
    name: 'home',
    path: '/',
    exact: true,
    private: true,
  },
  notFound: {
    ...defaults,
    name: 'notFound',
    path: '/404',
  },
};
