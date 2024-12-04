# Yu-Gi-Dex

Bienvenue dans **Yu-Gi-Dex**, un projet visant à offrir un répertoire interactif et complet de toutes les cartes Yu-Gi-Oh en français ! Ce projet est idéal pour les fans de Yu-Gi-Oh!, les collectionneurs ou les joueurs souhaitant explorer l'univers des cartes en détail.

---

## 🎯 Fonctionnalités

- **Rechercher des cartes :** Explorez les cartes par nom, type et attribut.
- **Détails complets :** Affichez les informations détaillées de chaque carte, y compris les effets et l'illustration.
- **Booster :** Rassemblez vos cartes virtuels à partir des boosters disponibles.
- **Inventaire :** Retrouvez vos cartes virtuels de vos ouverture de booster.

---

## 🛠️ Installation

### Prérequis
- Node.js (>= 16.x)
- Vue CLI (>= 5.x)

### Étapes
1. Clonez ce dépôt :

   ```bash
   git clone https://github.com/ynov-2024-b3a/projets-front-yugidex.git
   cd Yugidex/

2. Installez les dépendances :

   ```bash
    npm install

3. Lancez l'application :

   ```bash
    npm run dev

4. Accédez à l'application dans votre navigateur à l'adresse suivante :

   ```bash
    http://localhost:5173

---

## 📦 Structure du Projet

Yugidex/
├── public/                # Assets publics
├── src/
│   ├── assets/            # Images, icônes et styles
│   ├── components/        # Composants Vue.js
│   ├── views/             # Pages Vue.js (ex. HomeView, CarteDetailsView)
│   ├── router/            # Définition des routes
│   ├── store/             # Gestion d'état avec Vuex (ou Pinia)
│   ├── services/          # Appels API et gestion des données
│   ├── App.vue            # Composant principal
│   └── main.ts            # Point d'entrée de l'application
├── README.md              # Documentation du projet
├── package.json           # Dépendances et scripts
└── vite.config.ts         # Configuration Vite.ts

---

## 🚀 Fonctionnalités futures

- Système d'argent pour acheter des booster.
- Implémentation d'une boutique.
- Mode combat contre une IA avec les cartes obtenues.
- Comparateur de cartes.

---

## 📖 Sources de données

Les données des cartes sont récupérées via l'API publique YGOProDeck API. Merci de consulter leur documentation pour en savoir plus en cliquant (ici)[https://ygoprodeck.com/api-guide].

---

## 📜 Licence

Ce projet est sous licence MIT. Consultez le fichier [de licence MIT](./LICENSE) pour plus de détails.
