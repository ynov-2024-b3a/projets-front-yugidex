<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import cardsAPI from '@/api/cards';

interface Card {
  id: number;
  name: string;
  type: string;
  race: string;
  card_images: { image_url: string }[];
}

const cards = ref<Card[]>([]);
const searchQuery = ref('');
const numberOfCards = ref(12);
const isLoading = ref(false);
const searchOptions = ref({
  searchByName: true,
  searchByType: false,
  searchByRace: false
});

/*
  Récupération de toutes les cartes.
*/

async function fetchAllCards() {
  try {
    isLoading.value = true;
    const response = await cardsAPI.fetchAllCards();
    cards.value = response;
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching all cards:', error);
    isLoading.value = false;
  }
}

/*
  Récupération d'un nombre limité de cartes pour l'affichage initial.
*/

async function fetchInitialCards() {
  try {
    isLoading.value = true;
    const initialCards = await cardsAPI.fetchCards(numberOfCards.value);
    filteredCards.value = initialCards;
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching initial cards:', error);
    isLoading.value = false;
  }
}

const filteredCards = ref<Card[]>([]);

/*
  Filtre les cartes en fonction de la requête utilisateur et des options actives.
*/

const searchResults = computed(() => {
  if (!searchQuery.value) return [];

  const query = searchQuery.value.toLowerCase().trim();

  return cards.value.filter(card => {
    const matchName = searchOptions.value.searchByName 
      && card.name.toLowerCase().includes(query);
    
    const matchType = searchOptions.value.searchByType 
      && card.type.toLowerCase().includes(query);
    
    const matchRace = searchOptions.value.searchByRace 
      && card.race.toLowerCase().includes(query);

    return matchName || matchType || matchRace;
  });
});

/*
  Charge plus de résultats selon la requête de recherche ou la pagination.
*/

function loadMoreResults() {
  if (searchQuery.value) {
    const currentLength = filteredCards.value.length;
    const moreResults = searchResults.value.slice(
      currentLength, 
      currentLength + numberOfCards.value
    );
    filteredCards.value = [...filteredCards.value, ...moreResults];
  } else {
    numberOfCards.value += 4;
    fetchInitialCards();
  }
}

/*
  Active ou désactive une option de recherche.
*/

function toggleSearchOption(option: keyof typeof searchOptions.value) {
  searchOptions.value[option] = !searchOptions.value[option];
  
  const hasActiveOption = Object.values(searchOptions.value).some(value => value);
  if (!hasActiveOption) {
    searchOptions.value.searchByName = true;
  }
}

/*
  Exécute une recherche ou réinitialise les cartes si aucune requête n'est saisie.
*/

function performSearch() {
  if (!searchQuery.value) {
    fetchInitialCards();
  } else {
    filteredCards.value = searchResults.value.slice(0, numberOfCards.value);
  }
}

onMounted(() => {
  fetchInitialCards();
  fetchAllCards();
});
</script>

<template>
  <div class="home-container">
    <h1 class="home-title">Cartes Yu-Gi-Oh!</h1>
    
    <div class="searchbar">
      <div class="search-container">
        <img src="../assets/loupe.png" alt="Loupe" class="search-icon">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Rechercher une carte"
          v-model="searchQuery"
          @input="performSearch"
        >
      </div>

      <div class="search-options">
        <label>
          <input 
            type="checkbox" 
            :checked="searchOptions.searchByName"
            @change="toggleSearchOption('searchByName')"
          >
          Nom
        </label>
        <label>
          <input 
            type="checkbox" 
            :checked="searchOptions.searchByType"
            @change="toggleSearchOption('searchByType')"
          >
          Type
        </label>
        <label>
          <input 
            type="checkbox" 
            :checked="searchOptions.searchByRace"
            @change="toggleSearchOption('searchByRace')"
          >
          Race
        </label>
      </div>

      <div v-if="searchQuery" class="search-results-info">
        {{ searchResults.length }} résultats trouvés
      </div>
    </div>
    
    <div v-if="isLoading" class="loading-spinner">
      Chargement...
    </div>
    
    <div v-else-if="filteredCards.length === 0" class="no-results">
      Aucune carte trouvée
    </div>
    
    <div v-else class="card-grid">
      <div v-for="card in filteredCards" :key="card.id" class="card-item">
        <router-link :to="`/card/${encodeURIComponent(card.name)}`" class="card-link">
          <div class="card-image-container">
            <img 
              :src="card.card_images[0].image_url" 
              :alt="card.name" 
              class="card-image" 
            />
          </div>
        </router-link>
      </div>
    </div>
    
    <div class="load-more-container" v-if="searchQuery ? searchResults.length > filteredCards.length : true">
      <button 
        class="load-more-button" 
        @click="loadMoreResults"
      >
        {{ searchQuery ? 'Plus de résultats' : 'Charger plus de cartes' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.home-title {
  font-family: 'Press Start 2P', cursive;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.searchbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  width: 80%;
  max-width: 500px;
  margin: 0 auto;
}

.search-options {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
  width: 100%;
}

.search-options label {
  display: flex;
  align-items: center;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.7rem;
  color: #333;
}

.search-options input[type="checkbox"] {
  margin-right: 5px;
}

.search-results-info {
  text-align: center;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.7rem;
  margin-top: 10px;
  color: #666;
}

.loading-spinner, .no-results {
  text-align: center;
  font-family: 'Press Start 2P', cursive;
  margin-top: 20px;
  color: #666;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  pointer-events: none;
  z-index: 10;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 2px solid #4CAF50;
  border-radius: 20px;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;
  background-color: #f0f0f0;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  justify-content: center;
}

.card-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-link {
  text-decoration: none;
}

.card-image-container {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.card-image-container:hover {
  transform: scale(1.05);
}

.card-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.load-more-container {
  margin-top: 20px;
}

.load-more-button {
  font-family: 'Press Start 2P', cursive;
  background-color: #FF0000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.3s ease;
}

.load-more-button:hover {
  background-color: #CC0000;
}
</style>