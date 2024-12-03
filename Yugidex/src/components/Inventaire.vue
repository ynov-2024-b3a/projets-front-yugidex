<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Card {
  id: number;
  name: string;
  card_images: { image_url: string }[];
}

const inventory = ref<Card[]>([]);

// Charger les cartes depuis le localStorage
onMounted(() => {
  const storedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
  inventory.value = storedInventory;
});

// Réinitialiser l'inventaire
const resetInventory = () => {
  localStorage.removeItem('inventory');
  inventory.value = [];
};
</script>


<template>
    <div class="inventory-container">
      <h1 class="inventory-title">Inventaire</h1>
      
      <div class="card-grid">
        <div v-for="card in inventory" :key="card.id" class="card-item">
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
      
      <div class="actions-container">
        <button class="reset-button" @click="resetInventory">
          Réinitialiser l'inventaire
        </button>
      </div>
    </div>
  </template>
  
  
  <style scoped>
.inventory-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.inventory-title {
  font-family: 'Press Start 2P', cursive;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
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
  flex-direction: column;
  align-items: center;
  text-align: center;
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

.card-name {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;
  margin-top: 10px;
}

.card-link {
  text-decoration: none;
}

.actions-container {
  margin-top: 20px;
}

.reset-button {
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

.reset-button:hover {
  background-color: #CC0000;
}
</style>
  