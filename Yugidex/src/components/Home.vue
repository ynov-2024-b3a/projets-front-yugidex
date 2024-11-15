<script setup lang="ts">
import { ref, onMounted } from 'vue';
import cardsAPI from '@/api/cards';

interface Card {
  id: number;
  name: string;
  card_images: { image_url: string }[];
}

const cards = ref<Card[]>([]);
let numberOfCards = 12;
async function fetchCards() {
  try {
    cards.value = await cardsAPI.fetchCards(numberOfCards);
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
}
function increaseNumberCards() {
  numberOfCards += 4;
  fetchCards();
}

onMounted(() => {
  fetchCards();
});
</script>

<template>
  <div>
    <h1 id="homeTitle">Cartes Yu-Gi-Oh!</h1>
    <div id="searchbar">
      <div class="search-container">
        <img src="../assets/loupe.png" alt="Loupe" class="search-icon">
        <input type="text" id="search" placeholder="Rechercher une carte">
      </div>
    </div>
    <div id="grid-cards">
      <div v-for="card in cards" :key="card.id">
        <a :href="`/${encodeURIComponent(card.name)}`">
          <img :src="card.card_images[0].image_url" alt="Card Image" id="cards">
        </a>
      </div>
    </div>
    <div id="container">
      <button id="buttonIncreaseNumberCards" @click="increaseNumberCards">
        Charger plus de cartes
      </button>
    </div>
  </div>
</template>