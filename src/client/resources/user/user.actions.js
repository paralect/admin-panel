import history from 'services/history.service';

import { routes } from 'routes';

import * as api from './user.api';


export const signIn = ({
  email,
  password,
}) => async (dispatch) => {
  const { data: user } = await api.signIn({
    email,
    password,
  });
  dispatch({ type: 'user:set', payload: { user } });

  const searchParams = new URLSearchParams(window.location.search);
  history.push(searchParams.get('to') || routes.home.path);
};

export const signOut = () => async (dispatch) => {
  await api.signOut();
  dispatch({ type: 'user:delete' });
};

export const getCurrentUser = () => async (dispatch) => {
  const { data: user } = await api.getCurrentUser();
  dispatch({ type: 'user:set', payload: { user } });
};
