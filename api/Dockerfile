# Idée : construire une image pour l'API qui contient : node:24 + code + les étapes de lancement
# Créer l'image à partir du Dockerfile : 
# - docker build -t NOM_IMAGE DOSSIER_CONTENANT_LE_DOCKERFILE
# - docker build -t oquiz-api ./api

# Partir d'une image existante
FROM node:24

# Définir un espace de travail (dans on quel dossier on travaille ?)
# Convention pour les projet Node.js : le dossier de travail est souvent '/app'
WORKDIR /app

# Installer les dépendances
# Généralement avant la copie des autres fichiers pour optimiser la vitesse de création de l'image (cache)
COPY package*.json ./
RUN npm install 

# Récupérer le reste du code de l'api
# Ici : tout le contenu du dossier courant (local) vers le dossier courant du conteneur (/app)
# SAUF les fichiers/dossiers précisés dans le .dockerignore
COPY ./ ./ 

# Générer le client Prisma
RUN npm run db:generate

# Builder le code TS -> JS
RUN npm run build

# Convention/bonne pratique
# Documenter le port utilisé par le service dans le conteneur
EXPOSE 3000

# Lancer le serveur (via CMD = au moment où le conteneur est généré)
CMD [ "npm", "run", "docker:start" ]

