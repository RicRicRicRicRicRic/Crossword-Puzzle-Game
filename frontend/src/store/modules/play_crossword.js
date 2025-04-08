// src/store/modules/ play_crossword.js
import api from '@/services/api';

// Helper keys for session storage.
const STORAGE_KEYS = {
  gameData: 'play_game_gameData',
  gridAnswers: 'play_game_gridAnswers',
  score: 'play_game_score',
  currentTimeLeft: 'play_game_currentTimeLeft',
  initialTime: 'play_game_initialTime'
};

export const play_cwState = {
  gameData: JSON.parse(sessionStorage.getItem(STORAGE_KEYS.gameData)) || null,
  gridAnswers: JSON.parse(sessionStorage.getItem(STORAGE_KEYS.gridAnswers)) || [],
  score: Number(sessionStorage.getItem(STORAGE_KEYS.score)) || 0,
  currentTimeLeft: Number(sessionStorage.getItem(STORAGE_KEYS.currentTimeLeft)) || 0,
  initialTime: Number(sessionStorage.getItem(STORAGE_KEYS.initialTime)) || 0,
  timerInterval: null
};

function persistState(state) {
  sessionStorage.setItem(STORAGE_KEYS.gameData, JSON.stringify(state.gameData));
  sessionStorage.setItem(STORAGE_KEYS.gridAnswers, JSON.stringify(state.gridAnswers));
  sessionStorage.setItem(STORAGE_KEYS.score, state.score);
  sessionStorage.setItem(STORAGE_KEYS.currentTimeLeft, state.currentTimeLeft);
  sessionStorage.setItem(STORAGE_KEYS.initialTime, state.initialTime);
}

export const play_cwMutations = {
  SET_GAME_DATA(state, data) {
    state.gameData = data;
    state.gridAnswers = Array.from({ length: data.gridSize }, () =>
      Array.from({ length: data.gridSize }, () => ({
        answer: '',
        status: 'neutral'
      }))
    );
    persistState(state);
  },
  SET_ANSWER(state, { row, col, value }) {
    state.gridAnswers[row][col].answer = value;
    persistState(state);
  },
  SET_CELL_STATUS(state, { row, col, status }) {
    state.gridAnswers[row][col].status = status;
    persistState(state);
  },
  INCREMENT_SCORE(state, timeMultiplier) {
    state.score += 1.2 * timeMultiplier;
    persistState(state);
  },
  DECREMENT_SCORE(state, timeMultiplier) {
    state.score -= 0.9 * timeMultiplier;
    persistState(state);
  },
  SET_INITIAL_TIME(state, time) {
    state.initialTime = time;
    state.currentTimeLeft = time;
    persistState(state);
  },
  UPDATE_TIME_LEFT(state, time) {
    state.currentTimeLeft = time;
    persistState(state);
  },
  SET_TIMER_INTERVAL(state, interval) {
    state.timerInterval = interval;
    // No persistence for runtime values.
  },
  CLEAR_TIMER_INTERVAL(state) {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  },
  RESET_PLAY_GAME(state) {
    state.gameData = null;
    state.gridAnswers = [];
    state.score = 0;
    state.currentTimeLeft = 0;
    state.initialTime = 0;
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    sessionStorage.removeItem(STORAGE_KEYS.gameData);
    sessionStorage.removeItem(STORAGE_KEYS.gridAnswers);
    sessionStorage.removeItem(STORAGE_KEYS.score);
    sessionStorage.removeItem(STORAGE_KEYS.currentTimeLeft);
    sessionStorage.removeItem(STORAGE_KEYS.initialTime);
  }
};

export const play_cwActions = {
  async fetchGameData({ commit, dispatch }, gameId) {
    // Only fetch if no gameData already exists.
    if (!commit.state?.gameData) {
      try {
        const response = await api.get(`/startGame/${gameId}`);
        if (response.data.success) {
          commit('SET_GAME_DATA', response.data.game);
          const timerMinutes = parseFloat(response.data.game.gridTimer);
          const initialTime = timerMinutes * 60;
          commit('SET_INITIAL_TIME', initialTime);
          dispatch('startTimer');
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error fetching game data:', error);
        return false;
      }
    }
    return true;
  },

  handleInput({ commit, state, getters }, { row, col, value }) {
    commit('SET_ANSWER', { row, col, value });
    const expected = getters.solutionLetter(row, col);
    if (!value.trim()) {
      commit('SET_CELL_STATUS', { row, col, status: 'neutral' });
    } else if (value.trim().toLowerCase() === expected.toLowerCase()) {
      commit('SET_CELL_STATUS', { row, col, status: 'correct' });
      commit('INCREMENT_SCORE', state.currentTimeLeft);
      return 'correct';
    } else {
      commit('SET_CELL_STATUS', { row, col, status: 'incorrect' });
      commit('DECREMENT_SCORE', state.currentTimeLeft);
      return 'incorrect';
    }
    return null;
  },

  startTimer({ commit, state }) {
    commit('CLEAR_TIMER_INTERVAL');
    const interval = setInterval(() => {
      if (state.currentTimeLeft > 0) {
        commit('UPDATE_TIME_LEFT', state.currentTimeLeft - 1);
      } else {
        commit('CLEAR_TIMER_INTERVAL');
      }
    }, 1000);
    commit('SET_TIMER_INTERVAL', interval);
  },

  stopTimer({ commit }) {
    commit('CLEAR_TIMER_INTERVAL');
  },

  resetPlayGame({ commit }) {
    commit('RESET_PLAY_GAME');
  }
};

export const play_cwGetters = {
  gridSize: state => state.gameData ? state.gameData.gridSize : 0,

  solutionLetter: state => (row, col) => {
    return state.gameData ? state.gameData.gridLetters[row][col] : null;
  },

  cellNumber: state => (row, col) => {
    return state.gameData ? state.gameData.gridCellNumbers[row][col] : null;
  },

  formattedTime: state => {
    const minutes = Math.floor(state.currentTimeLeft / 60);
    const seconds = state.currentTimeLeft % 60;
    const mm = minutes < 10 ? '0' + minutes : minutes;
    const ss = seconds < 10 ? '0' + seconds : seconds;
    return `${mm}:${ss}`;
  },

  progressPercentage: state => {
    return state.initialTime === 0 ? 0 : (state.currentTimeLeft / state.initialTime) * 100;
  },

  progressColor: (state, getters) => {
    const percentage = getters.progressPercentage;
    if (percentage < 33) {
      return "#FF0000";
    } else if (percentage < 66) {
      return "#ea951a";
    }
    return "#47b94a";
  }
};
