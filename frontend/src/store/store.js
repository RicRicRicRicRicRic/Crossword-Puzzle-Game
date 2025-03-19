import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null,
    token: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    }
  },
  actions: {
    // Define actions if needed
  },
  getters: {
    // Define getters if needed
  }
});

export default store;
