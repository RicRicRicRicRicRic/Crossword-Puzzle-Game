// controllers/wordsearchController.js
const fs = require('fs');
const path = require('path');
const WordNet = require('node-wordnet');
const wordnet = new WordNet();

let wordArray = [];

// Dynamically import the word-list module (ES Module)
(async () => {
  try {
    const wordListModule = await import('word-list');
    // The package exports the path as the default export
    const wordListPath = wordListModule.default;
    
    fs.readFile(wordListPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error loading word list:', err);
      } else {
        wordArray = data.split('\n');
        console.log(`Loaded ${wordArray.length} words for suggestions.`);
      }
    });
  } catch (err) {
    console.error('Error importing word-list:', err);
  }
})();

// Lookup function for word definitions using WordNet
exports.lookup = (req, res, next) => {
  const word = req.params.word;
  wordnet.lookup(word, (err, definitions) => {
    if (err) {
      return next(err);
    }
    if (!definitions || definitions.length === 0) {
      return res.status(404).json({ error: 'Word not found' });
    }
    res.json(definitions);
  });
};

// Suggestions function: Only return words that WordNet can define
exports.suggestions = async (req, res, next) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }
  
  // First, filter candidate words that start with the query (case-insensitive)
  const candidateWords = wordArray
    .filter(word => word.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 20);
  
  let validSuggestions = [];
  
  // Helper function to check if a word has a definition in WordNet
  const lookupWord = (word) => new Promise((resolve) => {
    wordnet.lookup(word, (err, definitions) => {
      if (err || !definitions || definitions.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
  
  // Check each candidate word asynchronously
  await Promise.all(
    candidateWords.map(async (word) => {
      const isValid = await lookupWord(word);
      if (isValid) {
        validSuggestions.push(word);
      }
    })
  );
  
  // Return up to 10 valid suggestions
  res.json(validSuggestions.slice(0, 10));
};
