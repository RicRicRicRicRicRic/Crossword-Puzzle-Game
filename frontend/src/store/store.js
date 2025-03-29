//src/store/store.js
import { createStore } from 'vuex';
import { authState, authMutations } from './modules/auth';

export default createStore({
  state: {
    ...authState
  },
  mutations: {
    ...authMutations
  },
  actions: {},
  getters: {}
});
