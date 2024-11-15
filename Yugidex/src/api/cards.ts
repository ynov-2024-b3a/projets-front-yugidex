import axios from 'axios';
import { ref } from 'vue';

const apiClient = axios.create({
  baseURL: 'https://db.ygoprodeck.com/api/v7',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async fetchCards(numberOfCards: number) {
    try {
      const response = await apiClient.get<{ data: [] }>(`/cardinfo.php?num=${numberOfCards}&offset=0`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  },
};
