import axios from 'axios';

interface CardImage {
  image_url: string;
}

const apiClient = axios.create({
  baseURL: 'https://db.ygoprodeck.com/api/v7',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async fetchCards() {
    try {
      const response = await apiClient.get<{ data: [] }>('/cardinfo.php');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  },
};
