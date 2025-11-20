# Oquiz - Installation et lancement

## Environnement local

Pré-requis : 
- `Node.js` (>= 22.18)
- `Postgres` (>= 17) (ou `Docker`)

### Installation

```bash
# Installer les dépendances
npm install --prefix api
npm install --prefix client

# Copier et ajuster les variables d'environnement pour l'API
# (attention au port de la BDD si vous utilisez Docker)
cp api/.env.example api/.env
code api/.env

cp client/.env.example client/.env
code client/.env

```


### Base de données

#### Méthode 1 : Postgres installé en local

```bash
# Se connecter à Postgres
sudo -i -u postgres psql

# Créer un utilisateur
CREATE ROLE oquiz WITH LOGIN CREATEDB PASSWORD 'oquiz';

# Créer une base de données
CREATE DATABASE oquiz WITH OWNER oquiz;

# Quitter psql
exit
```

#### Méthode 2 : Postgres dans un conteneur Docker

```bash
# Créer un conteneur Postgres:17 sur le port 5433
docker run \
--name oquiz-postgres \
-e POSTGRES_USER=oquiz \
-e POSTGRES_PASSWORD=oquiz \
-e POSTGRES_DB=oquiz \
-p 5433:5432 \
-d \
postgres:17
```

#### Lancer les migrations

```bash
# Appliquer les migrations et échantilloner
npm run db:reset --prefix api

# (Si besoin) Générer des migrations lors d'un changement de schéma Prisma
npm run db:migrate:dev --prefix api
```

### Lancer les serveurs de développement

```bash
# Démarrer le serveur API (Node - Express)
npm run dev --prefix api

# Démarrer le serveur Svelte (Vite)
npm run dev --prefix client
```



## Environnement de production

### Premier déploiement

Pré-requis : 
- Se connecter à la machine de production (en SSH)
- Installer Docker
- Cloner le dépôt et se déplacer dedans

```bash
# Créer un fichier pour les variables d'environnement
cp .env.docker.example .env.docker

# Ajuster les variables avec nano
nano .env.docker

# Lancer les services
docker compose -f docker-compose.yml -p oquiz --env-file=.env.docker up -d
```

### Déploiement futur

```bash
# Pull les derniers changement
git pull

# Eteint les conteneurs
docker compose -p oquiz down

# Relancer les services (en re-buildant les images au besoin)
docker compose -f docker-compose.yml -p oquiz --env-file=.env.docker up -d --build
```



## Environnement de test

Pré-requis : 
- Docker installé
- Installer les dépendances 
- Générer le client Prisma : `npm run db:generate --prefix api`

```bash
# Lancer les tests de l'API
npm run test:unit --prefix api
npm run test:spec --prefix api

# Lancer les tests du client
npm run test --prefix client
```
