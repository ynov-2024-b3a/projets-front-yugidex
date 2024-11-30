import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://db.ygoprodeck.com/api/v7',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
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
  async fetchCardSetByCode(setCode : string) {
    try {
      // Récupère tous les sets
      const response = await axios.get('https://db.ygoprodeck.com/api/v7/cardsets.php');
      const allSets = response.data;

      // Filtre pour trouver le set correspondant
      return allSets.find(set => set.set_code === setCode);
    } catch (error) {
      console.error(`Error fetching set with code "${setCode}":`, error);
      throw error;
    }
  },
  async fetchCardSetsByCodes(setCodes : string []) {
    try {
      // Récupère tous les sets
      const response = await axios.get('https://db.ygoprodeck.com/api/v7/cardsets.php');
      const allSets = response.data;

      // Filtre pour ne garder que les sets avec les `set_code` spécifiés
      return allSets.filter(set => setCodes.includes(set.set_code));
    } catch (error) {
      console.error('Error fetching sets by codes:', error);
      throw error;
    }
  },
};
