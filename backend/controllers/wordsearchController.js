//controllers/wordsearchController.js
// controllers/wordsearchController.js
const fs = require('fs');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

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

// Lookup function for word definitions
exports.lookup = (req, res, next) => {
  const word = req.params.word;
  try {
    wordpos.lookup(word, (results) => {
      if (!results || results.length === 0) {
        return res.status(404).json({ error: 'Word not found' });
      }
      res.json(results);
    });
  } catch (error) {
    next(error);
  }
};

// Suggestions function: Only returns words that have a definition per WordPOS
exports.suggestions = async (req, res, next) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }

  // First, filter candidate words from wordArray that start with the query (case-insensitive)
  const candidateWords = wordArray
    .filter(word => word.toLowerCase().startsWith(query.toLowerCase()))
    // Increase the slice size to check more candidates before limiting to 10 valid suggestions.
    .slice(0, 20);

  // Check each candidate word to see if it has a definition
  let validSuggestions = [];
  await Promise.all(
    candidateWords.map(word =>
      new Promise(resolve => {
        wordpos.lookup(word, (results) => {
          if (results && results.length > 0) {
            validSuggestions.push(word);
          }
          resolve();
        });
      })
    )
  );
  
  // Return up to 10 valid suggestions
  res.json(validSuggestions.slice(0, 10));
};
