# O'Quiz API

API REST complète pour gérer une plateforme de quiz interactifs avec système d'authentification, gestion des utilisateurs et contrôle d'accès basé sur les rôles.

**Projet réalisé dans le cadre de ma formation de développeur web full-stack chez O'clock.**

---

## 🎯 Fonctionnalités

### Gestion des Quiz

- **CRUD complet** sur les quiz (création, lecture, mise à jour, suppression)
- **Questions avec choix multiples** : chaque quiz contient plusieurs questions avec leurs choix de réponses
- **Récupération des derniers quiz** : endpoint dédié pour afficher les 6 quiz les plus récents
- **Niveaux de difficulté** : système de classification par niveau
- **Tags** : catégorisation des quiz par thématiques

### Authentification & Autorisation

- **Inscription et connexion sécurisées** avec Argon2 pour le hashing des mots de passe
- **JWT avec Refresh Token** : système d'authentification stateless avec renouvellement automatique
- **Système de rôles** : `member`, `author`, `admin` avec permissions granulaires
- **Protection des routes** : middleware de vérification des rôles

### Architecture & Qualité

- **API RESTful** suivant les standards HTTP
- **Tests automatisés** : tests unitaires et d'intégration avec Node.js Test Runner
- **Architecture MVC** claire et maintenable
- **Validation des données** avec Zod
- **TypeScript** : typage strict pour une meilleure fiabilité du code

---

## 🛠️ Stack Technique

### Backend

- **Runtime** : Node.js v24+
- **Framework** : Express v5.1.0
- **Langage** : TypeScript v5.9.3
- **Base de données** : PostgreSQL 18
- **ORM** : Prisma v6.19.0

### Sécurité & Authentification

- **Hashing** : Argon2 (recommandé par l'OWASP)
- **Tokens** : JWT avec refresh token
- **Validation** : Zod v4.1.12

### Frontend

- **Framework** : Svelte
- **Build** : Vite

### DevOps & Outils

- **Containerisation** : Docker & Docker Compose
- **Reverse Proxy** : Nginx
- **DB Admin** : Adminer
- **Tests** : Node.js Test Runner natif
- **Linting** : ESLint v9
- **Git Hooks** : Husky

---

## 📦 Installation

### Prérequis

- Node.js (v24+)
- Docker & Docker Compose
- npm

### Étapes

#### 1. Clone le repository

```bash
git clone https://github.com/QuentinCaffray/oquiz-api.git
cd oquiz-api
```

#### 2. Configure l'environnement

Crée un fichier `.env.docker.example` à la racine du projet :

```env
# Base de données PostgreSQL
POSTGRES_USER=oquiz
POSTGRES_PASSWORD=oquiz
POSTGRES_DB=oquiz
DATABASE_PORT=5432

# API
API_PORT=3000
JWT_SECRET=ton_secret_jwt_super_securise_ici
ALLOWED_ORIGIN=http://localhost:5173

# Client
CLIENT_PORT=5173
VITE_API_BASE_URL=http://localhost:3000

# Adminer
ADMINER_PORT=8080
```

#### 3. Lance l'application avec Docker

```bash
# Lance tous les services (API, Base de données, Client, Adminer, Proxy)
docker compose -p oquiz -f docker-compose.yml --env-file=.env.docker.example up -d

# Vérifie que les conteneurs sont bien lancés
docker ps
```

L'API sera accessible sur `http://localhost:3000`  
Le client Svelte sur `http://localhost:5173`  
Adminer (interface DB) sur `http://localhost:8080`

#### 4. (Optionnel) Développement local sans Docker

```bash
cd api

# Installe les dépendances
npm install

# Configure l'environnement
cp .env.example .env
# Édite le fichier .env avec tes valeurs

# Génère le client Prisma
npm run db:generate

# Applique les migrations
npm run db:migrate:dev

# Charge les données de test
npm run db:seed

# Lance le serveur en mode développement
npm run dev
```

---

## 🚀 Endpoints API

### 🔐 Authentification

| Méthode | Endpoint         | Description                                 | Authentification |
| ------- | ---------------- | ------------------------------------------- | ---------------- |
| `POST`  | `/auth/register` | Inscription d'un nouvel utilisateur         | ❌               |
| `POST`  | `/auth/login`    | Connexion (retourne JWT + Refresh Token)    | ❌               |
| `POST`  | `/auth/refresh`  | Renouvellement du JWT avec le refresh token | ❌               |
| `GET`   | `/auth/me`       | Informations de l'utilisateur connecté      | ✅               |
| `POST`  | `/auth/logout`   | Déconnexion (invalide le refresh token)     | ✅               |

### 👤 Utilisateurs

| Méthode | Endpoint     | Description                 | Rôles autorisés |
| ------- | ------------ | --------------------------- | --------------- |
| `GET`   | `/users`     | Liste tous les utilisateurs | `admin`         |
| `GET`   | `/users/:id` | Détails d'un utilisateur    | `admin`         |

### 🎯 Quiz

| Méthode | Endpoint                 | Description                          | Rôles autorisés             |
| ------- | ------------------------ | ------------------------------------ | --------------------------- |
| `GET`   | `/quizzes`               | Liste tous les quiz                  | `member`, `author`, `admin` |
| `GET`   | `/quizzes/recent`        | 6 derniers quiz créés                | `member`, `author`, `admin` |
| `GET`   | `/quizzes/:id`           | Détails d'un quiz                    | `member`, `author`, `admin` |
| `GET`   | `/quizzes/:id/questions` | Questions d'un quiz avec leurs choix | `member`, `author`, `admin` |

### 📊 Niveaux de difficulté

| Méthode  | Endpoint      | Description            | Rôles autorisés             |
| -------- | ------------- | ---------------------- | --------------------------- |
| `GET`    | `/levels`     | Liste tous les niveaux | `member`, `author`, `admin` |
| `GET`    | `/levels/:id` | Détails d'un niveau    | `member`, `author`, `admin` |
| `POST`   | `/levels`     | Créer un niveau        | `admin`                     |
| `PATCH`  | `/levels/:id` | Modifier un niveau     | `admin`                     |
| `DELETE` | `/levels/:id` | Supprimer un niveau    | `admin`                     |

### 🏷️ Tags

| Méthode  | Endpoint    | Description         | Rôles autorisés             |
| -------- | ----------- | ------------------- | --------------------------- |
| `GET`    | `/tags`     | Liste tous les tags | `member`, `author`, `admin` |
| `GET`    | `/tags/:id` | Détails d'un tag    | `member`, `author`, `admin` |
| `POST`   | `/tags`     | Créer un tag        | `admin`                     |
| `PATCH`  | `/tags/:id` | Modifier un tag     | `admin`                     |
| `DELETE` | `/tags/:id` | Supprimer un tag    | `admin`                     |

### 🏥 Health Check

| Méthode | Endpoint  | Description     |
| ------- | --------- | --------------- |
| `GET`   | `/health` | Statut de l'API |

---

## 🏗️ Structure du Projet

```
oquiz-api/
├── api/                           # Backend Express + TypeScript
│   ├── src/
│   │   ├── controllers/           # Logique métier (auth, quiz, tag, level, user)
│   │   ├── routers/               # Définition des routes Express
│   │   ├── middlewares/           # Authentification, validation, gestion d'erreurs
│   │   ├── models/                # Configuration Prisma et seeding
│   │   ├── lib/                   # Utilitaires (auth, errors, validation)
│   │   └── @types/                # Types TypeScript personnalisés
│   ├── prisma/
│   │   ├── schema.prisma          # Modèles de données Prisma
│   │   └── migrations/            # Historique des migrations
│   ├── test/                      # Configuration et fixtures de test
│   ├── Dockerfile                 # Image Docker de l'API
│   └── package.json
├── client/                        # Frontend Svelte
│   ├── src/
│   │   ├── lib/                   # Composants Svelte
│   │   └── services/              # Services API
│   ├── Dockerfile
│   └── package.json
├── proxy/
│   └── nginx.conf                 # Configuration Nginx
├── docker-compose.yml             # Orchestration des services
└── README.md
```

---

## 📝 Scripts Disponibles

### Production

```bash
npm run build              # Compile TypeScript en JavaScript
npm start                  # Lance le serveur en production
npm run docker:start       # Lance l'API dans Docker (avec migrations)
```

### Développement

```bash
npm run dev                # Lance le serveur avec hot-reload
npm run lint               # Vérifie le code avec ESLint
npm run lint:fix           # Corrige automatiquement les erreurs ESLint
```

### Base de données

```bash
npm run db:migrate:dev     # Crée une nouvelle migration
npm run db:migrate:deploy  # Applique les migrations (production)
npm run db:migrate:reset   # Réinitialise la base de données
npm run db:generate        # Génère le client Prisma
npm run db:seed            # Charge les données de test
npm run db:reset           # Reset + seed en une commande
npm run db:studio          # Ouvre Prisma Studio (interface graphique)
```

### Tests

```bash
npm run test:unit          # Lance les tests unitaires
npm run test:unit:watch    # Tests unitaires en mode watch
npm run test:spec          # Lance les tests d'intégration
```

---

## 🗄️ Schéma de Base de Données

### Modèles principaux

#### User

- Authentification avec email/password
- Rôles : `member`, `author`, `admin`
- Stockage des refresh tokens

#### Quiz

- Nom et description
- Relations : Questions (1-N)

#### Question

- Description, anecdote, lien wiki
- Relations : Quiz (N-1), Choices (1-N)

#### Choice

- Description et validation (`is_valid`)
- Relation : Question (N-1)

#### Level & Tag

- Systèmes de classification des quiz
- Noms uniques

---

## 🔒 Sécurité

### Bonnes pratiques implémentées

- **Mots de passe** : Hashés avec **Argon2** (algorithme recommandé par l'OWASP, résistant aux attaques GPU)
- **Authentification** : JWT avec expiration courte (15 min) + Refresh Token longue durée (7 jours)
- **Validation stricte** : Schémas Zod pour valider toutes les entrées utilisateur
- **Protection CORS** : Configuration des origines autorisées
- **Variables sensibles** : Stockées dans `.env` (non versionné)
- **Middleware d'autorisation** : Vérification des rôles avant accès aux ressources
- **Gestion d'erreurs globale** : Pas de fuite d'informations sensibles
- **SQL Injection** : Protection native via Prisma ORM

### Flux d'authentification

1. **Login** → Retourne `accessToken` (JWT, 15min) + `refreshToken` (cookie httpOnly)
2. **Requêtes protégées** → Header `Authorization: Bearer <accessToken>`
3. **Token expiré** → Appel à `/auth/refresh` avec le refresh token en cookie
4. **Logout** → Suppression du refresh token en base

---

## 🧪 Tests

Le projet inclut une suite de tests complète :

### Tests unitaires

- Fonctions utilitaires (lib/utils, lib/slug)
- Validation des schémas Zod

### Tests d'intégration (spec)

- Tous les endpoints CRUD (Levels, Tags, Quizzes)
- Authentification (register, login, refresh, logout)
- Tests de permissions (vérification des rôles)
- Tests d'erreurs (404, 409, 422)

### Configuration de test

- **Base de données dédiée** : PostgreSQL de test dans Docker
- **Isolation** : Reset de la DB avant chaque describe block
- **Fixtures** : Requesters préconfigurés (admin, author, member)

Exemple de lancement :

```bash
# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:spec

# Mode watch pour le développement
npm run test:unit:watch
```

---

## 🐳 Docker

L'application utilise Docker Compose pour orchestrer 5 services :

1. **database** : PostgreSQL 18
2. **api** : Backend Node.js + Express
3. **client** : Frontend Svelte
4. **adminer** : Interface d'administration de la base de données
5. **proxy** : Nginx comme reverse proxy

### Commandes utiles

```bash
# Lancer tous les services
docker compose -p oquiz up -d

# Voir les logs
docker compose -p oquiz logs -f api

# Arrêter les services
docker compose -p oquiz down

# Reconstruire les images
docker compose -p oquiz build --no-cache
```

---

## 📚 Apprentissages Clés

Ce projet m'a permis de développer mes compétences sur :

### Architecture & Conception

- ✅ Modélisation de base de données relationnelle avec Prisma
- ✅ Architecture MVC pour une séparation claire des responsabilités
- ✅ Design d'API RESTful respectant les conventions HTTP

### Sécurité

- ✅ Implémentation complète d'un système d'authentification JWT + Refresh Token
- ✅ Gestion des autorisations avec RBAC (Role-Based Access Control)
- ✅ Hashing sécurisé des mots de passe avec Argon2

### DevOps & Outils

- ✅ Containerisation multi-services avec Docker Compose
- ✅ Mise en place de tests automatisés (unitaires + intégration)
- ✅ Configuration de linting et hooks Git avec Husky

### Développement

- ✅ TypeScript pour un code type-safe et maintenable
- ✅ Gestion d'erreurs centralisée avec middleware Express
- ✅ Validation robuste des données avec Zod

---

## 📄 Licence

Projet pédagogique réalisé dans le cadre de la formation **Développeur Web Full-Stack** chez [O'clock](https://oclock.io).

---

## 👨‍💻 Auteur

**Quentin Caffray**

- 💼 [LinkedIn](https://www.linkedin.com/in/quentin-caffray-dev)
- 🐙 [GitHub](https://github.com/QuentinCaffray)

---
