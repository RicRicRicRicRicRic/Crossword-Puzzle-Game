// src/store/modules/create_crossword.js
import api from '@/services/api';
const gridSizeFromStorage = sessionStorage.getItem('gridSize');
const placedWordsFromStorage = sessionStorage.getItem('placedWords');
const acrossWordsFromStorage = sessionStorage.getItem('acrossWords');
const downWordsFromStorage = sessionStorage.getItem('downWords');

const computeTimer = gridSize => {
  const fraction = (gridSize - 9) / (20 - 9);
  return Math.round(5 + fraction * (20 - 5));
};

const initialGridSize = gridSizeFromStorage ? Number(gridSizeFromStorage) : 15;

export const create_cwState = {
  gridSize: initialGridSize,
  placedWords: placedWordsFromStorage ? JSON.parse(placedWordsFromStorage) : [],
  acrossWords: acrossWordsFromStorage ? JSON.parse(acrossWordsFromStorage) : [],
  downWords: downWordsFromStorage ? JSON.parse(downWordsFromStorage) : [],
  selectedWordIndex: null,
  grid_timer: computeTimer(initialGridSize),
  
};

export const create_cwMutations = {
  setGridSize(state, newSize) {
    state.gridSize = newSize;
    const fraction = (newSize - 9) / (20 - 9);
    state.grid_timer = Math.round(5 + fraction * (20 - 5));
    sessionStorage.setItem('gridSize', newSize);
  },
  addPlacedWord(state, wordData) {
    state.placedWords.push(wordData);
    sessionStorage.setItem('placedWords', JSON.stringify(state.placedWords));
  },
  addStoredWord(state, wordData) {
    if (wordData.category === 'across') {
      state.acrossWords.push(wordData);
      sessionStorage.setItem('acrossWords', JSON.stringify(state.acrossWords));
    } else if (wordData.category === 'down') {
      state.downWords.push(wordData);
      sessionStorage.setItem('downWords', JSON.stringify(state.downWords));
    }
  },
  setSelectedWordIndex(state, index) {
    state.selectedWordIndex = index;
  },
  updateWordDirection(state, { wordText, newDirection }) {

    state.acrossWords = state.acrossWords.filter(item => item.word !== wordText);
    state.downWords = state.downWords.filter(item => item.word !== wordText);

    sessionStorage.setItem('acrossWords', JSON.stringify(state.acrossWords));
    sessionStorage.setItem('downWords', JSON.stringify(state.downWords));

    const placedWord = state.placedWords.find(item => item.word === wordText);
    if (placedWord) {
      placedWord.category = newDirection;
      sessionStorage.setItem('placedWords', JSON.stringify(state.placedWords));
      
      if (newDirection === 'across') {
        state.acrossWords.push(placedWord);
      } else if (newDirection === 'down') {
        state.downWords.push(placedWord);
      }
      sessionStorage.setItem('acrossWords', JSON.stringify(state.acrossWords));
      sessionStorage.setItem('downWords', JSON.stringify(state.downWords));
    }
  },
  
  moveWord(state, { wordIndex, newPos }) {
    state.placedWords[wordIndex].position = newPos;
    sessionStorage.setItem('placedWords', JSON.stringify(state.placedWords));
  },
  removeWord(state, wordText) {
    state.placedWords = state.placedWords.filter(item => item.word !== wordText);
    state.acrossWords = state.acrossWords.filter(item => item.word !== wordText);
    state.downWords = state.downWords.filter(item => item.word !== wordText);
    sessionStorage.setItem('placedWords', JSON.stringify(state.placedWords));
    sessionStorage.setItem('acrossWords', JSON.stringify(state.acrossWords));
    sessionStorage.setItem('downWords', JSON.stringify(state.downWords));
    if (
      state.selectedWordIndex !== null &&
      state.placedWords[state.selectedWordIndex]?.word === wordText
    ) {
      state.selectedWordIndex = null;
    }
  },
  resetCrossword(state) {
    state.gridSize = 15;
    state.placedWords = [];
    state.acrossWords = [];
    state.downWords = [];
    state.selectedWordIndex = null;
    sessionStorage.removeItem('gridSize');
    sessionStorage.removeItem('placedWords');
    sessionStorage.removeItem('acrossWords');
    sessionStorage.removeItem('downWords');
  },
};

export const create_cwActions = {
  setGridSize({ state, commit }, newSize) {
    const cannotFit = state.placedWords.some(word => {
      if (word.position.row >= newSize || word.position.col >= newSize) {
        return true;
      }
      if (word.category === 'across') {
        return word.position.col + word.word.length > newSize;
      } else if (word.category === 'down') {
        return word.position.row + word.word.length > newSize;
      }
      return false;
    });
    if (cannotFit) {
      alert("Cannot make grid smaller because one or more words do not fit. Please remove them first.");
    } else {
      commit('setGridSize', newSize);
    }
  },
  addWord({ state, commit }, wordData) {
    const exists =
      state.acrossWords.some(item => item.word === wordData.word) ||
      state.downWords.some(item => item.word === wordData.word);
    if (exists) {
      alert(`The word "${wordData.word}" already exists.`);
      return;
    }
    if (wordData.word.length > state.gridSize) {
      alert(`The word "${wordData.word}" is too long for the ${state.gridSize} x ${state.gridSize} grid.`);
      return;
    }
    const startPos = { row: 0, col: 0 };
    if (
      wordData.category === 'across' &&
      startPos.col + wordData.word.length > state.gridSize
    ) {
      alert(`Word "${wordData.word}" is too long to fit horizontally.`);
      return;
    } else if (
      wordData.category === 'down' &&
      startPos.row + wordData.word.length > state.gridSize
    ) {
      alert(`Word "${wordData.word}" is too long to fit vertically.`);
      return;
    }
    const newWord = { ...wordData, position: startPos };
    commit('addPlacedWord', newWord);
    commit('addStoredWord', newWord);
  },
  moveWord({ state, commit }, direction) {
    if (
      state.selectedWordIndex === null ||
      !state.placedWords[state.selectedWordIndex]
    ) {
      return;
    }
    const word = state.placedWords[state.selectedWordIndex];
    const newPos = { ...word.position };
    switch (direction) {
      case 'up':
        newPos.row = Math.max(0, newPos.row - 1);
        break;
      case 'down':
        newPos.row = Math.min(state.gridSize - 1, newPos.row + 1);
        break;
      case 'left':
        newPos.col = Math.max(0, newPos.col - 1);
        break;
      case 'right':
        newPos.col = Math.min(state.gridSize - 1, newPos.col + 1);
        break;
    }
    if (word.category === 'across' && (newPos.col + word.word.length > state.gridSize)) {
      return;
    } else if (word.category === 'down' && (newPos.row + word.word.length > state.gridSize)) {
      return;
    }
    commit('moveWord', { wordIndex: state.selectedWordIndex, newPos });
  },
  setWordDirection({ state, commit }, newDirection) {
    if (
      state.selectedWordIndex === null ||
      !state.placedWords[state.selectedWordIndex]
    ) {
      return;
    }
    const word = state.placedWords[state.selectedWordIndex];
    if (
      newDirection === 'across' &&
      word.position.col + word.word.length > state.gridSize
    ) {
      alert(`Word "${word.word}" does not fit horizontally.`);
      return;
    } else if (
      newDirection === 'down' &&
      word.position.row + word.word.length > state.gridSize
    ) {
      alert(`Word "${word.word}" does not fit vertically.`);
      return;
    }
    commit('updateWordDirection', { wordText: word.word, newDirection });
  },
  removeWord({ commit }, wordText) {
    commit('removeWord', wordText);
  },
  selectWord({ state, commit }, wordText) {
    const index = state.placedWords.findIndex(item => item.word === wordText);
    if (index !== -1) {
      commit('setSelectedWordIndex', index);
    }
  },
  resetCrossword({ commit }) {
    commit('resetCrossword');
  },
  saveGame({ state }, { gameName }) {
    const gridSize = state.gridSize;
    const grid_letters = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(null)
    );
    const grid_cell_numbers = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(null)
    );
  
    state.placedWords.forEach(word => {
      const startRow = word.position.row;
      const startCol = word.position.col;
      for (let i = 0; i < word.word.length; i++) {
        const row = startRow + (word.category === 'down' ? i : 0);
        const col = startCol + (word.category === 'across' ? i : 0);
        if (row < gridSize && col < gridSize) {
          grid_letters[row][col] = word.word[i];
        }
      }
      let label = "";
      if (word.category === "across") {
        const idx = state.acrossWords.findIndex(item => item.word === word.word);
        if (idx !== -1) label = "a" + (idx + 1);
      } else if (word.category === "down") {
        const idx = state.downWords.findIndex(item => item.word === word.word);
        if (idx !== -1) label = "d" + (idx + 1);
      }
      if (grid_cell_numbers[startRow][startCol]) {
        grid_cell_numbers[startRow][startCol] += "," + label;
      } else {
        grid_cell_numbers[startRow][startCol] = label;
      }
    });
  
    const payload = {
      grid_size: gridSize,
      grid_cell_numbers,
      grid_letters,
      def_Across_data: state.acrossWords,
      def_Down_data: state.downWords,
      grid_timer: state.grid_timer,
      placedWords: state.placedWords,
      game_name: gameName  // Add the game name to the payload
    };
  
    api.post('/saveGame', payload, {
      headers: {
        Authorization: `Bearer ${state.token}`
      }
    })
    .then(response => {
      if (response.data.success) {
        alert(response.data.message);
      } else {
        alert("Failed to save game: " + response.data.error);
      }
    })
    .catch(error => {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.error
      ) {
        alert(error.response.data.error);
      } else {
        console.error("Error saving game: ", error);
        alert("Error saving game.");
      }
    });
}

};
