<script setup lang="ts">
import { ref, onMounted } from 'vue';
import cardsAPI from '@/api/cards';

interface Card {
  id: number;
  name: string;
  card_images: { image_url: string }[];
}

const cards = ref<Card[]>([]);
const searchQuery = ref('');
const filteredCards = ref<Card[]>([]);
let numberOfCards = 12;

async function fetchCards() {
  try {
    cards.value = await cardsAPI.fetchCards(numberOfCards);
    filteredCards.value = cards.value;
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
}

function increaseNumberCards() {
  numberOfCards += 4;
  fetchCards();
}

function searchCards() {
  if (!searchQuery.value) {
    filteredCards.value = cards.value;
  } else {
    filteredCards.value = cards.value.filter(card => 
      card.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
}

onMounted(() => {
  fetchCards();
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
          @input="searchCards"
        >
      </div>
    </div>
    
    <div class="card-grid">
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
    
    <div class="load-more-container">
      <button 
        class="load-more-button" 
        @click="increaseNumberCards"
      >
        Charger plus de cartes
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
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-container {
  position: relative;
  width: 80%;
  max-width: 500px;
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