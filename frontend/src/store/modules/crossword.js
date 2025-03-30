// src/store/modules/crossword.js
const gridSizeFromStorage = localStorage.getItem('gridSize');

export const crosswordState = {
  gridSize: gridSizeFromStorage ? Number(gridSizeFromStorage) : 15,
  placedWords: [],
  acrossWords: [],
  downWords: [],
  selectedWordIndex: null,
};

export const crosswordMutations = {
  setGridSize(state, newSize) {
    state.gridSize = newSize;
    localStorage.setItem('gridSize', newSize);
  },
  addPlacedWord(state, wordData) {
    state.placedWords.push(wordData);
  },
  addStoredWord(state, wordData) {
    if (wordData.category === 'across') {
      state.acrossWords.push(wordData);
    } else if (wordData.category === 'down') {
      state.downWords.push(wordData);
    }
  },
  setSelectedWordIndex(state, index) {
    state.selectedWordIndex = index;
  },
  updateWordDirection(state, { wordText, newDirection }) {
    state.acrossWords = state.acrossWords.filter(item => item.word !== wordText);
    state.downWords = state.downWords.filter(item => item.word !== wordText);
    const placedWord = state.placedWords.find(item => item.word === wordText);
    if (placedWord) {
      placedWord.category = newDirection;
      if (newDirection === 'across') {
        state.acrossWords.push(placedWord);
      } else if (newDirection === 'down') {
        state.downWords.push(placedWord);
      }
    }
  },
  moveWord(state, { wordIndex, newPos }) {
    state.placedWords[wordIndex].position = newPos;
  },
  removeWord(state, wordText) {
    state.placedWords = state.placedWords.filter(item => item.word !== wordText);
    state.acrossWords = state.acrossWords.filter(item => item.word !== wordText);
    state.downWords = state.downWords.filter(item => item.word !== wordText);
    if (
      state.selectedWordIndex !== null &&
      state.placedWords[state.selectedWordIndex]?.word === wordText
    ) {
      state.selectedWordIndex = null;
    }
  },
};

export const crosswordActions = {
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
};
