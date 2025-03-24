//components/services/dictionary.js
import axios from 'axios';

const definition = axios.create({
  baseURL: import.meta.env.VITE_API_DEFINITION_URL,
});

const wordSuggest = axios.create({
  baseURL: import.meta.env.VITE_API_WORDSUGGESTION_URL,
})

export { definition , wordSuggest};
