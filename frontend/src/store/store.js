//src/store/store.js
import { createStore } from 'vuex';
import { authState, authMutations } from './modules/auth';
import { crosswordState, crosswordMutations, crosswordActions } from './modules/crossword';

export default createStore({
  state: {
    ...authState,
    ...crosswordState,
  },
  mutations: {
    ...authMutations,
    ...crosswordMutations,
  },
  actions: {
    ...crosswordActions,
  },
  getters: {},
});
