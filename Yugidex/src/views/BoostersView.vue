<script setup lang="ts">
import { ref, toRaw } from 'vue';

// Définir des interfaces pour les données
interface CardSet {
  set_name: string;
}

interface CardImage {
  image_url: string;
}

interface Card {
  id: number;
  name: string;
  card_sets?: CardSet[];
  card_images: CardImage[];
}

const cards = ref<Card[]>([]);
const boosters = ref<string[]>([]);
const selectedBoosters = ref<string[]>([]);  // Liste des boosters sélectionnés au hasard
const selectedCards = ref<Card[]>([]);

// L'état de la carte retournée
const flippedCards = ref<Record<number, boolean>>({}); // Gère l'état de flip pour chaque carte

// Fonction pour récupérer les cartes et extraire les boosters
const fetchCards = async () => {
  try {
    const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php');
    const data = await response.json();

    if (data && data.data) {
      cards.value = data.data as Card[]; // Caster les données en type Card
      console.log('Cartes récupérées :', cards.value);

      // Extraire les boosters uniques
      const boosterSet = new Set<string>();
      const boosterCardCounts: Record<string, number> = {};

      cards.value.forEach(card => {
        if (card.card_sets && Array.isArray(card.card_sets)) {
          card.card_sets.forEach(set => {
            boosterSet.add(set.set_name);

            // Compter le nombre de cartes par booster
            if (!boosterCardCounts[set.set_name]) {
              boosterCardCounts[set.set_name] = 0;
            }
            boosterCardCounts[set.set_name]++;
          });
        }
      });

      // Convertir l'ensemble en tableau
      boosters.value = Array.from(boosterSet);
      console.log('Boosters extraits :', boosters.value);

      // Filtrer les boosters qui ont moins de 5 cartes
      const validBoosters = boosters.value.filter(boosterName => {
        return boosterCardCounts[boosterName] >= 5;
      });

      // Sélectionner 5 boosters au hasard parmi ceux qui sont valides
      selectedBoosters.value = getRandomBoosters(validBoosters, 5);
      console.log('Boosters sélectionnés :', selectedBoosters.value);
    } else {
      console.error('Données mal formatées:', data);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des cartes:', error);
  }
};

// Fonction pour tirer un sous-ensemble aléatoire de boosters
const getRandomBoosters = (allBoosters: string[], count: number): string[] => {
  const shuffled = [...allBoosters].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Fonction pour tirer 5 cartes aléatoires d'un booster donné sans doublons
const drawCardsFromBooster = (boosterName: string) => {
  const cardsInBooster = toRaw(cards.value).filter(card => {
    return card.card_sets?.some(set => set.set_name === boosterName);
  });

  console.log(`Cartes dans le booster ${boosterName}:`, cardsInBooster);

  if (cardsInBooster.length === 0) {
    console.error(`Aucune carte trouvée pour le booster ${boosterName}`);
    return;
  }

  selectedCards.value = [];
  const selectedCardIds = new Set<number>();  // Utiliser un set pour éviter les doublons
  let attempt = 0;  // Limiter le nombre de tentatives pour éviter une boucle infinie

  // Tirer jusqu'à obtenir 5 cartes distinctes
  while (selectedCards.value.length < 5 && attempt < 50) {
    const randomIndex = Math.floor(Math.random() * cardsInBooster.length);
    const card = cardsInBooster[randomIndex];

    // Vérifier que la carte existe bien et qu'elle a un id unique
    if (card && card.id && !selectedCardIds.has(card.id)) {
      selectedCards.value.push(card);
      selectedCardIds.add(card.id); // Ajouter l'id à l'ensemble pour éviter les doublons
    } else {
      // Si la carte n'a pas d'id ou est déjà tirée, on continue le tirage
      console.warn(`Carte invalide ou déjà tirée, tirage à nouveau`);
    }

    attempt++;
  }

  if (selectedCards.value.length < 5) {
    console.error('Impossible de tirer 5 cartes uniques après 50 tentatives.');
  }

  console.log(`Cartes tirées pour ${boosterName} :`, selectedCards.value);
};

// Fonction pour retourner une carte
const flipCard = (cardId: number) => {
  flippedCards.value[cardId] = !flippedCards.value[cardId];
};

// Charger les cartes au montage du composant
fetchCards();
</script>

<template>
  <div>
    <h1>Boosters</h1>
    <div>
      <!-- Boutons pour 5 boosters sélectionnés au hasard -->
      <button
        v-for="booster in selectedBoosters"
        :key="booster"
        @click="drawCardsFromBooster(booster)"
        style="margin: 5px; padding: 10px; cursor: pointer; border: 1px solid #ccc; background: #f0f0f0;"
      >
        {{ booster }}
      </button>
    </div>

    <h2>Cartes sélectionnées</h2>
    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px;">
      <!-- Affichage des cartes tirées -->
      <div
        v-for="card in selectedCards"
        :key="card.id"
        class="card"
        @click="flipCard(card.id)"
        :class="{ flipped: flippedCards[card.id] }"
        style="width: 120px; height: 180px; position: relative; cursor: pointer;"
      >
        <!-- Image de dos de la carte -->
        <div class="card-front">
          <img :src="'/src/assets/carte.jpg'" alt="Carte de dos" style="width: 100%; height: 100%; object-fit: cover;"/>
        </div>
        <!-- Image de la carte de face -->
        <div class="card-back">
          <img :src="card.card_images[0]?.image_url || 'default-image.jpg'" alt="Carte" style="width: 100%; height: 100%; object-fit: cover;"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 120px;
  height: 180px;
  perspective: 1000px; /* Crée une perspective 3D */
  margin: 10px;
  transition: transform 0.6s; /* Ajoute une transition pour l'animation fluide */
}

.card-front, .card-back {
  position: absolute;
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease; /* Transition pour l'animation fluide */
}

.card-back {
  transform: rotateY(180deg); /* La face arrière est cachée au début */
}

.card.flipped .card-front {
  transform: rotateY(180deg); /* Quand la carte est retournée, la face avant se cache */
}

.card.flipped .card-back {
  transform: rotateY(0deg); /* La face arrière devient visible */
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}
</style>
