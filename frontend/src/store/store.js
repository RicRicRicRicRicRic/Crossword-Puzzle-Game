import { createStore } from 'vuex';

const userFromStorage = localStorage.getItem('user');

export default createStore({
  state: {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(state, token) {
      state.token = token;
    }
  },
  actions: {
  },
  getters: {}
});
