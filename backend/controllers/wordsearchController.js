//controllers/wordsearchController.js
const fs = require('fs');
const path = require('path');
const WordNet = require('node-wordnet');
const wordnet = new WordNet();

const dictPath = path.join(__dirname, '..', 'node_modules', 'wndb-with-exceptions', 'dict');

let wordNetWords = [];

function loadWordNetWords() {
  const indexFiles = ['index.noun','index.verb','index.adj','index.adv','index.sense'];
  const words = new Set();

  indexFiles.forEach((file) => {
    const filePath = path.join(dictPath, file);
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n').filter(line => line && !line.startsWith('  '));
      lines.forEach(line => {
        const tokens = line.split(/\s+/);
        if (tokens.length && tokens[0] && tokens[0] !== '') {
          const word = tokens[0];
          if (
            !word.includes('_') &&
            !word.includes('-') &&
            !word.includes('.') &&
            !word.includes("'") &&
            !word.includes(":")
          ) {
            words.add(word);
          }
        }
      });
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
    }
  });
  return Array.from(words);
}

wordNetWords = loadWordNetWords();
console.log(`Loaded ${wordNetWords.length} words from WordNet for suggestions.`);

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

exports.suggestions = async (req, res, next) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }
  
  const suggestions = wordNetWords
    .filter(word => word.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 50);
  
  res.json(suggestions);
};
