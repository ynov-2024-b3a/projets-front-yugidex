<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import cardsAPI from '@/api/cards';

const route = useRoute();
const cardName = route.params.name as string;

interface CardDetail {
    id: number;
    name: string;
    type: string;
    frameType: string;
    desc: string;
    ygoprodeck_url: string;
    atk?: number;
    def?: number;
    level?: number;
    race: string;
    attribute?: string;
    archetype?: string;
    scale?: number;
    linkval?: number;
    linkmarkers?: string[];
    card_images: {
        id: number;
        image_url: string;
        image_url_small: string;
        image_url_cropped: string;
    }[];
}

const cardDetail = ref<CardDetail | null>(null);
const isLoading = ref(true);

async function fetchCardDetails() {
  try {
    cardDetail.value = await cardsAPI.fetchCardByName(cardName);
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
}

function getCardAttributeImage(attribute: string) {
  try {
    return `/src/assets/${attribute}.png`;
  } catch (e) {
    return '/src/assets/default.png'; 
  }
}

onMounted(() => {
  fetchCardDetails();
});
</script>

<template>
  <div class="pokedex-container">
    <div class="pokedex-frame">
      <div class="pokedex-screen">
        <div v-if="isLoading" class="loading-screen">
          <div class="loading-spinner"></div>
        </div>
        
        <div v-else-if="cardDetail" class="card-details">
          <div class="screen-header">
            <h1 class="card-name">{{ cardDetail.name }}</h1>
          </div>
          
          <div class="card-content">
            <div class="card-image">
              <img :src="cardDetail.card_images[0].image_url" :alt="cardDetail.name" />
            </div>
            
            <div class="card-info">
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Type:</span>
                  <span class="value">{{ cardDetail.type }}</span>
                </div>
                
                <div v-if="cardDetail.attribute && (cardDetail.type !== 'Spell Card' && cardDetail.type !== 'Trap Card')" class="info-item">
                  <span class="label">Attribute:</span>
                  <div class="attribute-container">
                    <img 
                      :src="getCardAttributeImage(cardDetail.attribute)" 
                      :alt="cardDetail.attribute" 
                      class="attribute-icon" 
                    />
                    <span class="value">{{ cardDetail.attribute }}</span>
                  </div>
                </div>
                
                <div v-if="cardDetail.level && (cardDetail.type !== 'Spell Card' && cardDetail.type !== 'Trap Card')" class="info-item">
                  <span class="label">Level:</span>
                  <div class="level-container">
                    <span class="value">{{ cardDetail.level }}</span>
                    <div class="stars">
                      <img 
                        v-for="n in cardDetail.level" 
                        :key="n" 
                        src="/src/assets/level.png" 
                        alt="Level Star" 
                        class="star-icon" 
                      />
                    </div>
                </div>
                </div>
                
                <div v-if="cardDetail.atk" class="info-item">
                  <span class="label">ATK:</span>
                  <span class="value">{{ cardDetail.atk }}</span>
                </div>
                
                <div v-if="cardDetail.def" class="info-item">
                  <span class="label">DEF:</span>
                  <span class="value">{{ cardDetail.def }}</span>
                </div>
                
                <div v-if="cardDetail.race" class="info-item">
                  <span class="label">Race:</span>
                  <span class="value">{{ cardDetail.race }}</span>
                </div>
                
                <div v-if="cardDetail.archetype" class="info-item">
                  <span class="label">Archetype:</span>
                  <span class="value">{{ cardDetail.archetype }}</span>
                </div>
              </div>
              
              <div class="description">
                <span class="label">Description:</span>
                <p class="value">{{ cardDetail.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.pokedex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Press Start 2P', cursive;
}

.pokedex-frame {
  width: 800px;
  border-radius: 20px;
  padding: 20px;
}

.pokedex-screen {
  background-color: #F45B69;
  border-radius: 10px;
  padding: 20px;
  min-height: 600px;
  position: relative;
}

.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #333;
  border-top: 5px solid #FF0000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.screen-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: #52489C;
  padding: 10px;
  border-radius: 5px;
}

.card-id {
  color: #FFF;
  margin-right: 20px;
  font-size: 1rem;
}

.card-name {
  color: #FFF;
  font-size: 1.5rem;
  margin: 0;
}

.card-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
}

.card-image {
  background-color: #FFF;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.card-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.card-info {
  background-color: #FFF;
  border-radius: 10px;
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
}

.value {
  font-size: 0.9rem;
  color: #333;
}

.attribute-container,
.level-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.attribute-icon,
.star-icon {
  width: 20px;
  height: 20px;
}

.description {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 10px;
}
</style>