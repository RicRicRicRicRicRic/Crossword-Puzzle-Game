// src/store/modules/ play_crossword.js
import api from '@/services/api';

export const play_cwState = {
  gameData: null,
  gridAnswers: [],
  inputRefs: [],       // We store DOM element pointers here; note that such refs are generally best kept local,
  timerMinutes: 0,
  initialTime: 0,
  timeLeft: 0,
  score: 0,
  volume: 50,
  intervalId: null,
};

export const play_cwMutations = {
  SET_GAME_DATA(state, gameData) {
    state.gameData = gameData;
  },
  SET_GRID_ANSWERS(state, gridAnswers) {
    state.gridAnswers = gridAnswers;
  },
  SET_INPUT_REFS(state, inputRefs) {
    state.inputRefs = inputRefs;
  },
  UPDATE_CELL_STATUS(state, { row, col, status, answer }) {
    state.gridAnswers[row][col].status = status;
    if (answer !== undefined) {
      state.gridAnswers[row][col].answer = answer;
    }
  },
  SET_TIMER(state, { timerMinutes, initialTime, timeLeft }) {
    state.timerMinutes = timerMinutes;
    state.initialTime = initialTime;
    state.timeLeft = timeLeft;
  },
  DECREMENT_TIME(state) {
    if (state.timeLeft > 0) {
      state.timeLeft -= 1;
    }
  },
  SET_INTERVAL_ID(state, id) {
    state.intervalId = id;
  },
  CLEAR_INTERVAL(state) {
    state.intervalId = null;
  },
  UPDATE_SCORE(state, amount) {
    state.score += amount;
  },
  SET_VOLUME(state, volume) {
    state.volume = volume;
  },
  SET_TIME_LEFT(state, time) {
    state.timeLeft = time;
  },
};

export const play_cwActions = {
  async fetchGameData({ commit }, gameId) {
    try {
      const response = await api.get(`/startGame/${gameId}`);
      if (response.data.success) {
        const gameData = response.data.game;
        commit('SET_GAME_DATA', gameData);

        // Initialize the 2D grid for user answers
        const size = gameData.gridSize;
        const gridAnswers = Array.from({ length: size }, () =>
          Array.from({ length: size }, () => ({ answer: '', status: 'neutral' }))
        );
        commit('SET_GRID_ANSWERS', gridAnswers);

        // Initialize empty inputRefs array (to be set later in components)
        const inputRefs = Array.from({ length: size }, () =>
          Array.from({ length: size }, () => null)
        );
        commit('SET_INPUT_REFS', inputRefs);
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  },

  async fetchTimer({ commit, state }, gameId) {
    try {
      const response = await api.get(`/startGame/${gameId}`);
      if (response.data.success) {
        const timerMinutes = parseFloat(response.data.game.gridTimer);
        const initialTime = timerMinutes * 60;
        commit('SET_TIMER', { timerMinutes, initialTime, timeLeft: initialTime });

        // Start the countdown timer
        const intervalId = setInterval(() => {
          if (state.timeLeft > 0) {
            commit('DECREMENT_TIME');
          } else {
            clearInterval(state.intervalId);
            commit('CLEAR_INTERVAL');
          }
        }, 1000);
        commit('SET_INTERVAL_ID', intervalId);
      }
    } catch (error) {
      console.error('Error fetching timer:', error);
    }
  },

  handleInput({ commit, dispatch, state }, { row, col }) {
    const userLetter = state.gridAnswers[row][col].answer.trim();
    const expected = state.gameData ? state.gameData.gridLetters[row][col] : '';
    if (!userLetter) {
      commit('UPDATE_CELL_STATUS', { row, col, status: 'neutral' });
    } else if (userLetter.toLowerCase() === expected.toLowerCase()) {
      commit('UPDATE_CELL_STATUS', { row, col, status: 'correct' });
      dispatch('correctLetter', { row, col });
    } else {
      commit('UPDATE_CELL_STATUS', { row, col, status: 'incorrect' });
      dispatch('incorrectLetter', { row, col });
    }
  },

  correctLetter({ commit, state, dispatch }, { row, col }) {
    // Update score based on current time left
    const increment = 1.1 * state.timeLeft;
    commit('UPDATE_SCORE', increment);
    dispatch('autoFocusNext', { row, col });
  },

  incorrectLetter({ commit, state }, { row, col }) {
    const decrement = 0.55 * state.timeLeft;
    commit('UPDATE_SCORE', -decrement);
  },

  // In this action we decide which next cell should receive focus.
  // (Note: In Vuex, handling direct DOM focus is a side effect. You might return a reference for the component to act on.)
  autoFocusNext({ state }, { row, col }) {
    const size = state.gameData.gridSize;
    function solutionLetter(row, col) {
      return state.gameData ? state.gameData.gridLetters[row][col] : null;
    }
    let targetInput = null;
    if (col + 1 < size && solutionLetter(row, col + 1)) {
      if (state.gridAnswers[row][col + 1].status !== 'correct') {
        targetInput = state.inputRefs[row][col + 1];
      }
    }
    if (!targetInput && row + 1 < size && solutionLetter(row + 1, col)) {
      if (state.gridAnswers[row + 1][col].status !== 'correct') {
        targetInput = state.inputRefs[row + 1][col];
      }
    }
    // Return the found reference (the component can then call focus on it)
    return targetInput;
  },

  // Handles the arrow-key navigation in the grid.
  handleKeydown({ state }, { event, row, col }) {
    const key = event.key;
    let dr = 0, dc = 0;
    if (key === 'ArrowUp') {
      dr = -1;
    } else if (key === 'ArrowDown') {
      dr = 1;
    } else if (key === 'ArrowLeft') {
      dc = -1;
    } else if (key === 'ArrowRight') {
      dc = 1;
    } else {
      return null;
    }
    event.preventDefault();
    const gridSize = state.gameData.gridSize;
    function solutionLetter(row, col) {
      return state.gameData ? state.gameData.gridLetters[row][col] : null;
    }
    function findNextWhiteCell(currentRow, currentCol, dr, dc) {
      let newRow = currentRow + dr;
      let newCol = currentCol + dc;
      while (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
        if (solutionLetter(newRow, newCol)) {
          return { row: newRow, col: newCol };
        }
        newRow += dr;
        newCol += dc;
      }
      return null;
    }
    const nextCell = findNextWhiteCell(row, col, dr, dc);
    if (nextCell) {
      return state.inputRefs[nextCell.row][nextCell.col];
    }
    return null;
  },

  setInputRef({ state }, { el, row, col }) {
    if (el) {
      if (!state.inputRefs[row]) {
        state.inputRefs[row] = [];
      }
      state.inputRefs[row][col] = el;
    }
  },

  updateCellAnswer({ commit }, { row, col, answer }) {
    commit('UPDATE_CELL_STATUS', { row, col, status: 'neutral', answer });
  },
};
