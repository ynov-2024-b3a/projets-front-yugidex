<template>
  <div>
    <!-- Afficher les boosters -->
    <div v-if="!selectedBooster">
      <h2>Choisissez un booster :</h2>
      <div class="packs-container">
        <div v-for="set in selectedSets" :key="set.set_code" class="pack-item" @click="selectBooster(set)">
          <div class="card-image-container">
            <img :src="set.set_image" :alt="set.set_name" />
          </div>
          <p>{{ set.set_name }}</p>
        </div>
      </div>
    </div>

    <!-- Afficher les cartes du booster sélectionné -->
    <div v-else>
      <button @click="resetSelection">Retour</button>
      <h2>Cartes du booster : {{ selectedBooster.set_name }}</h2>
      <div class="cards-container">
        <div v-for="card in cards" :key="card.id" class="card-item">
          <router-link :to="`/card/${encodeURIComponent(card.name)}`" class="card-link">
            <img :src="card.card_images[0].image_url" :alt="card.name" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/cards';

interface CardSet {
  set_name: string;
  set_code: string;
  set_image: string;
}

interface Card {
  id: number;
  name: string;
  card_images: { image_url: string }[];
}

const router = useRouter(); // Initialiser le router
const selectedSets = ref<CardSet[]>([]); // Liste des boosters
const selectedBooster = ref<CardSet | null>(null); // Booster sélectionné
const cards = ref<Card[]>([]); // Cartes du booster sélectionné

const setCodes = ['MP14', 'MP15', 'MP16', 'MP17', 'MP18']; // Liste des codes de boosters

// Charger les boosters
onMounted(async () => {
  try {
    selectedSets.value = await api.fetchCardSetsByCodes(setCodes);
  } catch (error) {
    console.error('Erreur lors du chargement des boosters :', error);
  }
});

// Sélectionner un booster
const selectBooster = async (booster: CardSet) => {
  selectedBooster.value = booster;
  try {
    // Récupérer les cartes du booster sélectionné
    const allCards = await api.fetchCardsBySetName(booster.set_name);
    const randomCards = getRandomCards(allCards, 5); // Obtenir 5 cartes aléatoires

    // Ajouter les nouvelles cartes à l'inventaire
    updateInventory(randomCards);

    // Mettre à jour les cartes affichées
    cards.value = randomCards;
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes :', error);
  }
};

// Réinitialiser la sélection
const resetSelection = () => {
  selectedBooster.value = null;
  cards.value = [];
};

// Obtenir des cartes aléatoires
const getRandomCards = (allCards: Card[], count: number): Card[] => {
  const shuffled = [...allCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Ajouter des cartes à l'inventaire dans localStorage
const updateInventory = (newCards: Card[]) => {
  const inventory = JSON.parse(localStorage.getItem('inventory') || '[]') as Card[];
  const updatedInventory = [...inventory, ...newCards];
  localStorage.setItem('inventory', JSON.stringify(updatedInventory));
};

// Naviguer vers Inventaire


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
  color: #333; /* Couleur du texte */
}
.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding: 20px;
}

/* Conteneur pour chaque carte */
.card-item {
  width: 100px; /* Largeur fixe pour chaque carte */
  text-align: center;
}

.card-link {
  text-decoration: none;
}

/* Image de chaque carte */
.card-item img {
  width: 100%;
  height: 150px; /* Hauteur fixe pour les cartes */
  object-fit: cover; /* Assure que l'image conserve son ratio sans déformation */
}

/* Style pour chaque bouton de booster */
.pack-item {
  width: 120px; /* Largeur fixe pour chaque booster */
  text-align: center;
}

.pack-item img {
  width: 100%;
  height: auto;
}

/* Bouton pour ouvrir le booster */
button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
  </style>
  