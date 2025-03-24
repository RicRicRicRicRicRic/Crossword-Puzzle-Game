//controllers/wordsearchController.js
const fs = require('fs');
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

let wordArray = [];

(async () => {
  try {
    const wordListModule = await import('word-list');
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

exports.suggestions = (req, res, next) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }
  const suggestions = wordArray
    .filter(word => word.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 10);
  res.json(suggestions);
};
