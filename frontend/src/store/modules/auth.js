//src/store/modules/auth.js
const userFromStorage = localStorage.getItem('user');
const tokenFromStorage = localStorage.getItem('token');

export const authState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage || null
};

export const authMutations = {
  setUser(state, user) {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  },
  setToken(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  }
};
