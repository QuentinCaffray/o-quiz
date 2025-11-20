# Role-Based Access Control

Matrice des droits par rôle : 
- quels endpoint pour quels rôles ?

### 📚 Quiz views

| Verbe | Chemin                   | Visiteur | Membre | Auteur | Admin |
| ----- | ------------------------ | -------- | ------ | ------ | ----- |
| GET   | `/quizzes`               | no       | yes    | yes    | yes   |
| GET   | `/quizzes/recent`        | yes      | yes    | yes    | yes   |
| GET   | `/quizzes/:id`           | no       | yes    | yes    | yes   |
| GET   | `/quizzes/:id/questions` | no       | yes    | yes    | yes   |

### 🛠️ Quiz Edition

| Verbe  | Chemin                  | Visiteur | Membre | Auteur | Admin |
| ------ | ----------------------- | -------- | ------ | ------ | ----- |
| POST   | `/quizzes`              | no       | no     | yes    | yes   |
| PATCH  | `/quizzes/:id`          | no       | no     | self   | yes   |
| PUT    | `/quizzes/:id/tags/:id` | no       | no     | self   | yes   |
| DELETE | `/quizzes/:id/tags/:id` | no       | no     | self   | yes   |

`self` = ABAC = un auteur peut modifier uniquement les quiz dont il est le créateur
- on ne pourra pas forcement le codé au niveau du routeur
  - => logique métier liée à un attribut
  - => tout à fait possible de le factoriser, mais alourdie la mise en place des routes
  - => codera cette logique directement dans le controleur associée


### ❓ Questions & Choix

| Verbe  | Chemin                   | Visiteur | Membre | Auteur | Admin |
| ------ | ------------------------ | -------- | ------ | ------ | ----- |
| POST   | `/quizzes/:id/questions` | no       | no     | self   | yes   |
| PATCH  | `/questions/:id`         | no       | no     | self   | yes   |
| DELETE | `/questions/:id`         | no       | no     | self   | yes   |
| POST   | `/questions/:id/choices` | no       | no     | self   | yes   |
| PATCH  | `/choices/:id`           | no       | no     | self   | yes   |
| DELETE | `/choices/:id`           | no       | no     | self   | yes   |

### 🎮 Quiz Player


| Verbe | Chemin                  | Visiteur | Membre | Auteur | Admin |
| ----- | ----------------------- | -------- | ------ | ------ | ----- |
| POST  | `/quizzes/:id/attempts` | no       | yes    | yes    | yes   |
| GET   | `/quizzes/:id/attempts` | no       | no     | self   | yes   |

Un auteur peut voir toutes les tentatives d'un quiz s'il en est le créateur


### 👤 Utilisateurs

| Verbe | Chemin                | Visiteur | Membre | Auteur | Admin |
| ----- | --------------------- | -------- | ------ | ------ | ----- |
| GET   | `/users`              | no       | no     | no     | yes   |
| GET   | `/users/:id/profile`  | no       | yes    | yes    | yes   |
| GET   | `/users/:id/attempts` | no       | self*  | self*  | yes   |

- Membre = Un membre de peut voir que ses propres tentatives
- Auteur = Un auteur peut voir les tentatives que les utilisateurs ont effectuées sur ses quiz (et uniquement les quiz dont il est l'auteur).

### 🧩 Niveaux

| Verbe  | Chemin        | Visiteur | Membre | Auteur | Admin |
| ------ | ------------- | -------- | ------ | ------ | ----- |
| GET    | `/levels`     | no       | yes    | yes    | yes   |
| GET    | `/levels/:id` | no       | yes    | yes    | yes   |
| POST   | `/levels`     | no       | no     | no     | yes   |
| PATCH  | `/levels/:id` | no       | no     | no     | yes   |
| DELETE | `/levels/:id` | no       | no     | no     | yes   |

### 🏷️ Thèmes


| Verbe  | Chemin      | Visiteur | Membre | Auteur | Admin |
| ------ | ----------- | -------- | ------ | ------ | ----- |
| GET    | `/tags`     | no       | yes    | yes    | yes   |
| GET    | `/tags/:id` | no       | yes    | yes    | yes   |
| POST   | `/tags`     | no       | no     | yes    | yes   |
| PATCH  | `/tags/:id` | no       | no     | self*  | yes   |
| DELETE | `/tags/:id` | no       | no     | self*  | yes   |

`*` = sous entendu, il faudrait rajouter un attribut `author_id` sur un `tag` afin de vérifier si l'auteur a le droit de modifier le tag s'il en est propriétaire

