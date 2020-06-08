import { apiClient } from 'services/api';

export const signIn = ({
  email,
  password,
}) => {
  return apiClient.post('/api/account/signin', {
    email,
    password,
  });
};

export const signOut = () => {
  return apiClient.post('/api/account/logout');
};

export const getCurrentUser = () => {
  return apiClient.get('/api/users/current');
};

export const get = ({
  sortBy,
  sortDirection,
  page,
  pageSize,
  searchText,
}) => {
  return apiClient.get('/api/users', {
    sortBy,
    sortDirection,
    page,
    pageSize,
    searchText,
  });
};

export const shadowLogin = (id) => {
  return apiClient.post(`/api/users/${id}/shadow-login`);
};
