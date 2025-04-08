// src/store/modules/ play_crossword.js
import api from '@/services/api';

export const play_cwState = {
    gameData: null,
    gridAnswers: [],
    score: 0,
    currentTimeLeft: 0,
    initialTime: 0,
    timerInterval: null
};
  
export const play_cwMutations = {
    SET_GAME_DATA(state, data) {
      state.gameData = data;
      state.gridAnswers = Array.from({ length: data.gridSize }, () =>
        Array.from({ length: data.gridSize }, () => ({
          answer: '',
          status: 'neutral',
        }))
      );
    },
    SET_ANSWER(state, { row, col, value }) {
      state.gridAnswers[row][col].answer = value;
    },
    SET_CELL_STATUS(state, { row, col, status }) {
      state.gridAnswers[row][col].status = status;
    },
    INCREMENT_SCORE(state, timeMultiplier) {
      state.score += 1.1 * timeMultiplier;
    },
    DECREMENT_SCORE(state, timeMultiplier) {
      state.score -= 0.55 * timeMultiplier;
    },
    SET_INITIAL_TIME(state, time) {
      state.initialTime = time;
      state.currentTimeLeft = time;
    },
    UPDATE_TIME_LEFT(state, time) {
      state.currentTimeLeft = time;
    },
    SET_TIMER_INTERVAL(state, interval) {
      state.timerInterval = interval;
    },
    CLEAR_TIMER_INTERVAL(state) {
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
      }
    }
};
  
export const play_cwActions = {
    async fetchGameData({ commit, dispatch }, gameId) {
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