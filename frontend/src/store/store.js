import { createStore } from 'vuex';

const userFromStorage = localStorage.getItem('user');
const tokenFromStorage = localStorage.getItem('token');

export default createStore({
  state: {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: tokenFromStorage || null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    }
  },
  actions: {},
  getters: {}
});
