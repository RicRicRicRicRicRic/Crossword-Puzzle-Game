//src/store/store.js
import { createStore } from 'vuex';
import { authState, authMutations } from './modules/auth';
import { create_cwState, create_cwMutations, create_cwActions } from './modules/create_crossword';
import { play_cwState, play_cwMutations, play_cwActions, play_cwGetters } from './modules/play_crossword';

export default createStore({
  state: {
    ...authState,
    ...create_cwState,
    ...play_cwState,
  },
  mutations: {
    ...authMutations,
    ...create_cwMutations,
    ...play_cwMutations,
  },
  actions: {
    ...create_cwActions,
    ...play_cwActions,
  },
  getters: {
    ...play_cwGetters,
  },
});