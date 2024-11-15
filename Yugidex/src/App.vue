<template>
  <div id="app">
    <header>
      <h1>Yu-Gi-Dex!</h1>
    </header>
    <nav>
      <router-link to="/">Accueil</router-link>
      <router-link to="/about">A propos</router-link>
    </nav>
    <main>
      <router-view />
    </main>
    <footer>
      <p>&copy; 2024 Pokédex Yu-Gi-Oh!</p>
    </footer>
  </div>
</template>

<style>

</style>