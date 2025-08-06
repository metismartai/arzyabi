import axios from 'axios';
import { Approach } from '../types';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const apiService = {
  // Get all approaches
  getApproaches: async (): Promise<Approach[]> => {
    const response = await api.get('/approaches');
    return response.data.data;
  },

  // Get available CSV files
  getAvailableFiles: async (): Promise<string[]> => {
    const response = await api.get('/files');
    return response.data.files;
  }
};
