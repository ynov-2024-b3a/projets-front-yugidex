<template>
  <div class="pokedex-app">
    <div class="pokedex-frame">
      <div class="pokedex-screen">
        <header class="pokedex-header">
          <h1>Yu-Gi-Dex!</h1>
        </header>
        
        <nav class="pokedex-nav">
          <router-link to="/" class="nav-link">Accueil</router-link>
          <router-link to="/about" class="nav-link">A propos</router-link>
          <router-link to="/Booster" class="nav-link">Booster</router-link>
        </nav>
        
        <main class="pokedex-main">
          <router-view />
        </main>
        
        <footer class="pokedex-footer">
          <p>&copy; 2024 Pokédex Yu-Gi-Oh!</p>
        </footer>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Press Start 2P', cursive;
}

.pokedex-app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.pokedex-frame {
  width: 100%;
  max-width: 900px;
  border-radius: 20px;
  padding: 20px;
}

.pokedex-screen {
  background-color: #90EE90;
  border-radius: 10px;
  padding: 20px;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.pokedex-header {
  background-color: #4CAF50;
  color: white;
  text-align: center;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
}

.pokedex-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.pokedex-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.nav-link {
  color: #FFFFFF;
  text-decoration: none;
  background-color: #3498db;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #2980b9;
}

.pokedex-main {
  flex-grow: 1;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
}

.pokedex-footer {
  background-color: #4CAF50;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.7rem;
}
</style>