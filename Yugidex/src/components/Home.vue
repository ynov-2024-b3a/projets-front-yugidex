<script setup lang="ts">
import { ref, onMounted } from 'vue';
import cardsAPI from '@/api/cards';

interface Card {
  id: number;
  name: string;
  card_images: { image_url: string }[];
}

const cards = ref<Card[]>([]);

async function fetchCards() {
  try {
    cards.value = await cardsAPI.fetchCards();
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
}

onMounted(() => {
  fetchCards();
});
</script>

<template>
  <div>
    <h1>Cartes Yu-Gi-Oh</h1>
      <div v-for="card in cards.slice(0, 20)" :key="card.id">
        <img :src="card.card_images[0].image_url" alt="Card Image" style="height: 30vh; width: 10vw;">
      </div>
  </div>
</template>
