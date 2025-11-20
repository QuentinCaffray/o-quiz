# Routes API (endpoints)

Idée : 
- conception et documentation de l'API
- réfléchir aux routes dont le front pourrait avoir besoin pour une interface utilisateur pratique

Prefix : 
- `/api`


## 📚 Quiz views

| Verbe | Chemin                   | Request | Response                  | Description     | Notes                                 | Pages         |
| ----- | ------------------------ | ------- | ------------------------- | --------------- | ------------------------------------- | ------------- |
| GET   | `/quizzes`               | -       | `Array<Quiz+Auteur+Tags>` | Tous les quiz   | Query params : `?order=recent&page=5` | Tous les quiz |
| GET   | `/quizzes/recent`        | -       | `Array<Quiz+Auteur+Tags>` | 6 derniers quiz |                                       | Home          |
| GET   | `/quizzes/:id`           | -       | `Quiz+Auteur,Tags`        | Quiz complet    |                                       | Jouer         |
| GET   | `/quizzes/:id/questions` | -       | `Array<Questions,Choix>`  |                 |                                       | Jouer         |

Remarque, on aurait le choix : 
- Option 1 : `GET /quizzes/:id` qui renvoie `Quiz+auteur+tags+questions+choix` (1 seule requête à l'API)
- Option 2 : `GET /quizzes/:id` + `GET /quizzes/:id/questions` (2 requêtes à l'API)

## 🛠️ Quiz Edition

| Verbe  | Chemin                  | Request                | Response     | Description                | Notes                | Pages    |
| ------ | ----------------------- | ---------------------- | ------------ | -------------------------- | -------------------- | -------- |
| POST   | `/quizzes`              | `{title, description}` | Quiz créé    | Créer un quiz              | `author_id` via auth | Création |
| PATCH  | `/quizzes/:id`          | `{title, description}` | Quiz modifié | Modifier un quiz           | -                    | Édition  |
| PUT    | `/quizzes/:id/tags/:id` | -                      | -            | Ajouter un tag à un quiz   | -                    | Édition  |
| DELETE | `/quizzes/:id/tags/:id` | -                      | -            | Supprimer un tag d’un quiz | -                    | Édition  |

## ❓ Questions & Choix

| Verbe  | Chemin                   | Request                   | Response | Description                   | Notes | Pages   |
| ------ | ------------------------ | ------------------------- | -------- | ----------------------------- | ----- | ------- |
| POST   | `/quizzes/:id/questions` | `{description, level_id}` | -        | Ajouter une question          | -     | Édition |
| PATCH  | `/questions/:id`         | `{description, level_id}` | -        | Modifier une question         | -     | Édition |
| DELETE | `/questions/:id`         | -                         | -        | Supprimer question (et choix) | -     | Édition |
| POST   | `/questions/:id/choices` | `{description, is_valid}` | -        | Ajouter un choix              | -     | Édition |
| PATCH  | `/choices/:id`           | `{description, is_valid}` | -        | Modifier un choix             | -     | Édition |
| DELETE | `/choices/:id`           | -                         | -        | Supprimer un choix            |       | Édition |

Notes : 
- On pourrait ajouter une route `PUT /questions/:id/choices` avec comme body `Array<{ description, is_valid}>` pour venir modifier tous les choix d'un quiz d'un seul coup

## 🎮 Quiz Player

| Verbe | Chemin                  | Request | Response                 | Description                   | Notes | Pages |
| ----- | ----------------------- | ------- | ------------------------ | ----------------------------- | ----- | ----- |
| POST  | `/quizzes/:id/attempts` | Note 1  | Note 2                   | Enregistrer une tentative     | -     | Jouer |
| GET   | `/quizzes/:id/attempts` | -       | `Array<{user, attempt}>` | Voir les tentatives d’un quiz | -     | Admin |

- Note 1 : `Array<{question_id, user_choice_id}>`
- Note 2 : `{ Attempt + Array<{question_id, user_choice_id, good_choice_id}>>`

## 👤 Utilisateur & Authentification

| Verbe | Chemin                | Request             | Response                      | Description                     | Notes | Pages      |
| ----- | --------------------- | ------------------- | ----------------------------- | ------------------------------- | ----- | ---------- |
| GET   | `/users`              | -                   | `Array<User>`                 | Liste des utilisateurs          | -     | Admin      |
| GET   | `/users/:id/profile`  | -                   | `{User, nb_quiz_played}`      | Profil d’un utilisateur         | -     | Profil     |
| GET   | `/users/:id/attempts` | -                   | `Array<{quiz, score, date}>`  | Tentatives d’un utilisateur     | -     | Historique |

| Verbe | Chemin                | Request             | Response                      | Description                     | Notes | Pages      |
| ----- | --------------------- | ------------------- | ----------------------------- | ------------------------------- | ----- | ---------- |
| POST  | `/auth/register`      | Note 1              | `User`                        | Inscription                     | -     | Signup     |
| POST  | `/auth/login`         | `{email, password}` | `{accessToken, refreshToken}` | Connexion                       | -     | Signin     |
| POST  | `/auth/refresh`       | Refresh token       | `{accessToken, refreshToken}` | Renouvellement automatique      | -     | Tâche fond |
| POST  | `/auth/me`            | -                   | `User`                        | Infos de l’utilisateur connecté | -     | Bannière   |
| POST  | `/auth/logout`        | -                   | -                             | Déconnexion                     | -     | Profil     |

- Note 1 : `{firstname, lastname, email, password, confirm}`

## 🧩 Niveaux (Levels)

| Verbe  | Chemin        | Request  | Response                       | Description         | Notes                                       | Pages |
| ------ | ------------- | -------- | ------------------------------ | ------------------- | ------------------------------------------- | ----- |
| GET    | `/levels`     | -        | `Array<{level, nb_questions}>` | Liste des niveaux   |                                             | Jouer |
| GET    | `/levels/:id` | -        | `{level, question_ids[]}`      | Infos d’un niveau   |                                             | Jouer |
| POST   | `/levels`     | `{name}` | -                              | Créer un niveau     | S'assurer que le nom est unique             | Admin |
| PATCH  | `/levels/:id` | `{name}` | `level`                        | Modifier un niveau  | S'assurer que le nom est unique             | Admin |
| DELETE | `/levels/:id` | -        | -                              | Supprimer un niveau | Uniquement s’il n’est lié à aucune question | Admin |

## 🏷️ Thèmes (Tags)

| Verbe  | Chemin      | Request         | Response                                   | Description        | Notes | Pages   |
| ------ | ----------- | --------------- | ------------------------------------------ | ------------------ | ----- | ------- |
| GET    | `/tags`     | -               | `Array<{tag, quizzes: Array<{id, name}>}>` | Liste des thèmes   | -     | Accueil |
| GET    | `/tags/:id` | -               | `{tag, quizzes: Array<{id, name}>}`        | Infos d’un thème   | -     | Thèmes  |
| POST   | `/tags`     | `{name, color}` | -                                          | Créer un thème     | -     | Admin   |
| PATCH  | `/tags/:id` | `{name, color}` | -                                          | Modifier un thème  | -     | Admin   |
| DELETE | `/tags/:id` | -               | -                                          | Supprimer un thème | -     | Admin   |

