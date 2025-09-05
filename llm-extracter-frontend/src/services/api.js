import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeText = async (text) => {
  try {
    const response = await api.post('/analyze', { text });
    return response.data;
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw error;
  }
};

export const searchAnalyses = async (topic = null) => {
  try {
    const params = topic ? { topic } : {};
    const response = await api.get('/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching analyses:', error);
    throw error;
  }
};
