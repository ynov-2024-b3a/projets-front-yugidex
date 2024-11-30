<template>
    <div class="packs-container">
    <div v-for="set in selectedSets" :key="set.set_code" class="pack-item">
      <div class="card-image-container">
        <img :src="set.set_image" :alt="set.set_name" />
      </div>
      <p>{{ set.set_name }}</p>
      
    </div>
  </div>
  </template>
  
  <script setup lang="ts">
  
  import { ref, onMounted } from 'vue';
  import api from '@/api/cards'; // Assure-toi d'importer ton module API
  interface CardSet {
  set_name: string;
  set_code: string;
  num_of_cards: number;
  tcg_date: string;
  set_image: string;
}
const selectedSets = ref<CardSet[]>([]); // Référence pour stocker les packs sélectionnés
const setCodes = ['MP14', 'MP15', 'MP16','MP17','MP18','MP19']; // Liste des codes des packs à récupérer

onMounted(async () => {
  try {
    // Récupère plusieurs packs
    selectedSets.value = await api.fetchCardSetsByCodes(setCodes);
    console.log('Packs sélectionnés :', selectedSets.value); // Vérifie les données
  } catch (error) {
    console.error('Erreur lors du chargement des packs:', error);
  }
});
</script>
  
  
  <style scoped>
  .booster-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    padding: 20px;
  }
  
  .booster-title {
    font-family: 'Press Start 2P', cursive;
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }
  
  .draw-button {
    font-family: 'Press Start 2P', cursive;
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .draw-button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
  
  .draw-button:hover:not(:disabled) {
    background-color: #45a049;
  }
  
  .card-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }
  
  .card img {
    width: 120px;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  .packs-container {
  display: flex; /* Utilise Flexbox */
  flex-wrap: wrap; /* Permet de revenir à la ligne si nécessaire */
  justify-content: center; /* Centre les packs horizontalement */
  gap: 16px; /* Espacement entre les packs */
}
.card-image-container:hover img {
  transform: scale(1.1); /* Zoom sur l'image au survol */
}


.pack-item {
  width: 200px; /* Largeur fixe pour les packs */
  text-align: center; /* Centre le texte et l'image */
  border: 1px solid #ccc; /* Ajoute une bordure pour mieux visualiser */
  padding: 16px; /* Ajoute de l'espace intérieur */
  border-radius: 8px; /* Arrondit les coins */
  background-color: #f9f9f9; /* Ajoute un fond léger */
}
  </style>
  