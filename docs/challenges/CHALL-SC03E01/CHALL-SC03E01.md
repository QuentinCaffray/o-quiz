# Challenge SC03E01 - Authentification

## Rappel : Git Flow

- Penser à mettre à jour votre dépôt à l'aide du Git Flow, et à créer une branche dédiée pour réaliser le challenge.
  - 🔥 n'hésitez pas à créer une **Pull Request (PR)** en fin de challenge si vous souhaitez un retour !

- N'oubliez pas de reset la BDD (car on a ajouté un nouveau modèle !) : 
  - `npm run db:reset --prefix api`

- N'oubliez pas d'installer les nouvelles dépendances
  - `npm install`

## Implémentation & tests

Les exercices suivants sont indépendants. Ils peuvent être codé dans n'importe quel ordre.

Si possible, rajouter un test automatisé (intégration) par route.

## Exercice n°1 : `GET /auth/me`

Implémenter la route `GET /auth/me` afin de récupérer les données d'utilisateur qui s'authentifie en fournissant un `access token` valide via les headers de sa requête. Tester cette route manuellement, puis implémenter au moins un test automatisé pour cette route.

<details><summary>
Pseudo-code détaillé
</summary>

- Récupérer et extraire l'acess token depuis le **header** `Authorization` de la requête
  - note : côté front, on le fournit généralement sous ce format : `"Authorization": "Bearer XXXXXX"`
  - si le token n'est pas fourni, renvoyer une 401
  - (bonus : ou le récupérer depuis les cookies)

- Valider et décoder l'`access token` (JWT) à l'aide de la librairie `jsonwebtoken`. 
  - `jwt.verify`
  - si le token n'est pas valide ou expiré, renvoyer une 401

- Récupérer l'ID de l'utilisateur depuis le payload du JWT décodé

- Récupérer l'utilisateur associé en base de données
  - si l'utilisateur n'existe plus, renvoyer une 401

- Renvoyer les données de l'utilisateur au client (sauf le mot de passe bien sûr !)

</details>


## Exercice n°2 (bonus) : `POST /auth/refresh`

Implémenter la route `POST /auth/refresh` afin de générer un nouveau couple de tokens (`access token` JWT et `refresh token`) lorsque l'utilisateur fourni un `refresh token` valide dans le body de la requête. Tester cette route manuellement, puis implémenter au moins un test automatisé pour cette route.

<details><summary>
Pseudo-code détaillé
</summary>

- Récupérer le `refresh token` depuis le **body** de la requête
  - (bonus : ou depuis les cookies)
  - si le token n'est pas fourni, renvoyer une 401

- Récupérer le `refresh token` associé en base de données
  - s'il n'est pas présent, renvoyer une 401

- Vérifier la validité du token
  - si celui-ci est expiré, renvoyer une 401

- Récupérer l'utilisateur associé au `refresh token` en BDD
  - si celui-ci n'existe plus, renvoyer une 401

- Générer un `access token` et un `refresh token`, de la même manière que sur la route `POST /auth/login`.

- Supprimer l'ancien `refresh token` tout juste utilisé de la BDD, et sauvegarder le nouveau qui vient d'être généré.

- Renvoyer les tokens via le corps de la réponse
  - (bonus : et également via les cookies sécurisés)
  
</details>

## Exercice n°3 (bonus) : `POST /auth/logout`

Implémenter la route `POST /auth/logout` afin d'écraser les cookies côté client.

Explication : 
- si le client stock l'`access token` et le `refresh token` dans le `localStorage`, alors pour se déconnecter, il lui suffit de les retirer du `localStorage` (~= perdre les tokens !)
- si le client stock l'`access token` et le `refresh token` dans les `cookies`, alors c'est le serveur qui doit envoyer de nouveau cookies pour écraser les valeurs existantes, puisque ceux-ci sont `HTTPOnly` (donc non accessible côté client !)

<details><summary>
Pseudo-code détaillé
</summary>

- Utiliser la fonction [`clearCookie` d'Express](https://expressjs.com/fr/api.html) pour retirer l'`access token`
- Utiliser la fonction [`clearCookie` d'Express](https://expressjs.com/fr/api.html) pour retirer le `refresh token`
- Renvoyer une réponse `204 - No Content`

</details>

