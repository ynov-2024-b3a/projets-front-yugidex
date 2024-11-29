import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://db.ygoprodeck.com/api/v7',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async fetchAllCards() {
    try {
      const response = await apiClient.get<{ data: [] }>('/cardinfo.php?num=10000&offset=0&language=fr');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all cards:', error);
      throw error;
    }
  },

  async fetchCards(numberOfCards: number) {
    try {
      const response = await apiClient.get<{ data: [] }>(`/cardinfo.php?num=${numberOfCards}&offset=0&language=fr`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  },

  async fetchCardByName(cardName: string) {
    try {
      const response = await apiClient.get<{ data: any[] }>(`/cardinfo.php?name=${encodeURIComponent(cardName)}&language=fr`);
      return response.data.data[0];
    } catch (error) {
      console.error(`Error fetching card "${cardName}":`, error);
      throw error;
    }
  },
};
