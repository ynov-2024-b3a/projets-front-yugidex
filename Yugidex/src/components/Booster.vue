<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/api/cards";

interface CardSet {
  set_name: string;
  set_code: string;
  set_image: string;
}

interface Card {
  id: number;
  name: string;
  card_images: { image_url: string }[];
  card_sets: { set_rarity: string }[];
  rarity?: string;
}

const selectedSets = ref<CardSet[]>([]); 
const selectedBooster = ref<CardSet | null>(null);
const cards = ref<Card[]>([]);

const setCodes = ["MP14", "MP15", "MP16", "MP17", "MP18"];

// Détermine la rareté de la carte
const determineRarity = (card: Card): string => {
  if (!card.card_sets || card.card_sets.length === 0) return 'Common';
  
  const rarityPriority = [
    'Secret Rare',
    'Ultra Rare',
    'Super Rare',
    'Rare',
    'Common'
  ];

  for (const priorityRarity of rarityPriority) {
    if (card.card_sets.some(set => set.set_rarity === priorityRarity)) {
      return priorityRarity;
    }
  }

  return 'Common';
};

// Charger les boosters
onMounted(async () => {
  try {
    selectedSets.value = await api.fetchCardSetsByCodes(setCodes);
  } catch (error) {
    console.error("Erreur lors du chargement des boosters :", error);
  }
});

// Sélectionner un booster
const selectBooster = async (booster: CardSet) => {
  selectedBooster.value = booster;
  try {
    const allCards = await api.fetchCardsBySetName(booster.set_name);
    const randomCards = getRandomCards(allCards, 5);

    // Ajouter la rareté à chaque carte
    const cardsWithRarity = randomCards.map((card) => ({
      ...card,
      rarity: determineRarity(card),
    }));

    updateInventory(cardsWithRarity);
    cards.value = cardsWithRarity;
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes :", error);
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
  const inventory = JSON.parse(localStorage.getItem("inventory") || "[]") as Card[];
  const updatedInventory = [...inventory, ...newCards];
  localStorage.setItem("inventory", JSON.stringify(updatedInventory));
};
</script>

<template>
  <div>
    <!-- Afficher les boosters -->
    <div v-if="!selectedBooster">
      <h2 style="color:#333">Choisissez un booster :</h2>
      <div class="packs-container">
        <div
          v-for="set in selectedSets"
          :key="set.set_code"
          class="pack-item"
          @click="selectBooster(set)"
        >
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
      <h2 style="color:#333">Cartes du booster : {{ selectedBooster.set_name }}</h2>
      <div class="cards-container">
        <div 
          v-for="card in cards" 
          :key="card.id" 
          :class="[
            'card-item', 
            { 
              'card-normal': card.rarity === 'Common',
              'card-rare': card.rarity === 'Rare',
              'card-super-rare': card.rarity === 'Super Rare',
              'card-ultra-rare': card.rarity === 'Ultra Rare',
              'card-secret-rare': card.rarity === 'Secret Rare'
            }
          ]"
        >
          <router-link :to="`/card/${encodeURIComponent(card.name)}`" class="card-link">
            <img :src="card.card_images[0].image_url" :alt="card.name" />
            <div class="rarity-badge">{{ card.rarity }}</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
  
<style scoped>
.card-image-container:hover img {
  transform: scale(1.1); /* Zoom sur l'image au survol */
}

/* Base card styles */
.card-item {
  position: relative;
  width: 200px;
  text-align: center;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-item img {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.rarity-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  z-index: 10;
}

/* Common card style */
.card-normal {
  border: 2px solid #a0a0a0;
  box-shadow: 0 4px 6px rgba(160, 160, 160, 0.3);
}

.card-normal:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 12px rgba(160, 160, 160, 0.5);
}

/* Rare card style */
.card-rare {
  border: 2px solid #4a90e2;
  box-shadow: 0 4px 6px rgba(74, 144, 226, 0.3);
  background: linear-gradient(135deg, 
    rgba(74, 144, 226, 0.1) 0%, 
    rgba(74, 144, 226, 0.05) 100%
  );
}

.card-rare:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(74, 144, 226, 0.5);
  background: linear-gradient(135deg, 
    rgba(74, 144, 226, 0.2) 0%, 
    rgba(74, 144, 226, 0.1) 100%
  );
}

/* Super Rare card style */
.card-super-rare {
  border: 2px solid #9b59b6;
  box-shadow: 0 4px 6px rgba(155, 89, 182, 0.3);
  background: linear-gradient(135deg, 
    rgba(155, 89, 182, 0.1) 0%, 
    rgba(155, 89, 182, 0.05) 100%
  );
}

.card-super-rare:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(155, 89, 182, 0.5);
  background: linear-gradient(135deg, 
    rgba(155, 89, 182, 0.2) 0%, 
    rgba(155, 89, 182, 0.1) 100%
  );
  animation: superRareShimmer 2s infinite;
}

/* Ultra Rare card style */
.card-ultra-rare {
  border: 2px solid #f39c12;
  box-shadow: 0 4px 6px rgba(243, 156, 18, 0.3);
  background: linear-gradient(135deg, 
    rgba(243, 156, 18, 0.1) 0%, 
    rgba(243, 156, 18, 0.05) 100%
  );
}

.card-ultra-rare:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(243, 156, 18, 0.5);
  background: linear-gradient(135deg, 
    rgba(243, 156, 18, 0.2) 0%, 
    rgba(243, 156, 18, 0.1) 100%
  );
  animation: ultraRareRotate 2s infinite linear;
}

/* Secret Rare card style */
/* Secret Rare card style */
.card-secret-rare {
  border: 2px solid #2ecc71;
  box-shadow: 0 4px 6px rgba(46, 204, 113, 0.3);
  background: linear-gradient(
    45deg, 
    rgba(46, 204, 113, 0.1) 0%, 
    rgba(0, 255, 255, 0.1) 50%, 
    rgba(255, 0, 255, 0.1) 100%
  );
  background-size: 300% 300%;
}

.card-secret-rare:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(46, 204, 113, 0.5);
  background: linear-gradient(
    45deg, 
    rgba(46, 204, 113, 0.2) 0%, 
    rgba(0, 255, 255, 0.2) 50%, 
    rgba(255, 0, 255, 0.2) 100%
  );
  background-size: 300% 300%;
  animation: secretRareShake 0.3s ease infinite;
}

/* Animation de tremblement */
@keyframes secretRareShake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

/* Animations */
@keyframes superRareShimmer {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(360deg); }
}

@keyframes ultraRareRotate {
  0% { transform: scale(1.05) rotate(0deg); }
  100% { transform: scale(1.05) rotate(360deg); }
}

.packs-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.pack-item {
  width: 120px;
  text-align: center;
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: #333;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
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