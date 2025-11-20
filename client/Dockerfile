# Construction de l'image du client O'quiz
# docker build -t oquiz-client --build-arg VITE_API_BASE_URL=http://localhost:3001/api ./client

# ------------------------------------------------------
# -------- PARTIE 1 : construire le dossier dist -------
# ------------------------------------------------------

# On part de Node.js 24 (LTS)
# AS = alias pour un "stage"
FROM node:24 AS builder

# Définir un espace de travail
WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install 

# Copier le reste des sources
# On pense au .dockerignore
COPY ./ ./

# On a besoin d'une variable d'environnement pour construire le dist
# On construit le "dist" au moment du build de l'image
# (et non pas au moment du lancement du conteneur)
# Donc il nous faut une "variable de build" (plutôt qu'une variable d'environnement classique)
# Injecter une variable d'environnement au moment de lancer la commande "docker build" à l'aide du flag :
# --build-arg <VARIABLE>=<VALEUR>
# --build-arg VITE_API_BASE_URL=http://localhost:3000/api
# Pour documenter ce besoin d'ajouter une variable de build, on utilise la syntaxe ARG
ARG VITE_API_BASE_URL

# Build le dossier "dist" (dans /app/dist)
RUN npm run build


# ------------------------------------------------------
# -------- PARTIE 2 : servir le dist avec Nginx -------
# ------------------------------------------------------

# On part d'une image Nginx car il nous faut un serveur statique
FROM nginx:alpine

# On vide le dossier de Nginx
RUN rm -rf /usr/share/nginx/html/* 

# On copie le dist de l'étape présente dans le dossier servi statiquement par Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Documenter le port exposé par le conteneur (80 par défaut pour Nginx)
EXPOSE 80

# Lancer Nginx
CMD [ "nginx", "-g", "daemon off;" ]
