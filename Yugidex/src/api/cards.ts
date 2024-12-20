import axios from 'axios';

/*
  Créer une instance personnalisée du client API.
*/
const apiClient = axios.create({
  baseURL: 'https://db.ygoprodeck.com/api/v7',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  /*
    Retourne toutes les cartes disponibles.
    Requête API : GET /cardinfo.php avec un paramètre en français.
  */
  async fetchAllCards() {
    try {
      const response = await apiClient.get<{ data: [] }>('/cardinfo.php?num=10000&offset=0&language=fr');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all cards:', error);
      throw error;
    }
  },

  /*
    Retourne un nombre limité de cartes défini par le paramètre 'numberOfCards'.
    Requête API : GET /cardinfo.php avec le paramètre 'num' pour limiter les résultats.
  */
  async fetchCards(numberOfCards: number) {
    try {
      const response = await apiClient.get<{ data: [] }>(`/cardinfo.php?num=${numberOfCards}&offset=0&language=fr`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  },

  /*
    Retourne les détails d'une carte spécifique en fonction de son nom.
    Requête API : GET /cardinfo.php avec le paramètre 'name'.
  */
  async fetchCardByName(cardName: string) {
    try {
      const response = await apiClient.get<{ data: any[] }>(`/cardinfo.php?name=${encodeURIComponent(cardName)}&language=fr`);
      return response.data.data[0];
    } catch (error) {
      console.error(`Error fetching card "${cardName}":`, error);
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
  async  fetchCardsBySetName(setName: string): Promise<Card[]> {
    try {
      const response = await axios.get(
        `https://db.ygoprodeck.com/api/v7/cardinfo.php?cardset=${encodeURIComponent(setName)}&language=fr`
      );
      return response.data.data; // Retourne les cartes
    } catch (error) {
      console.error(`Erreur lors de la récupération des cartes pour le set ${setName}:`, error);
      throw error;
    }
  }
};
