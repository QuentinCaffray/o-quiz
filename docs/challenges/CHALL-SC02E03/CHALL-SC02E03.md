# Challenge SC02E03 - Ajout de routes et de tests

## Rappel : Git Flow

- Penser à mettre à jour votre dépôt à l'aide du Git Flow, et à créer une branche dédiée pour réaliser le challenge.
  - 🔥 n'hésitez pas à créer une **Pull Request (PR)** en fin de challenge si vous souhaitez un retour !

- Penser à `npm install` pour les nouvelles dépendances dans les deux sous dossiers
- Penser à `db:reset` pour appliquer les nouvelles migrations sur votre BDD locale

## Lecture

Un peu de veille technologique ne fera pas de mal sur les [bonnes pratiques des tests](https://github.com/goldbergyoni/nodejs-testing-best-practices) 
- en particulier, lire les titres, et quelques paragraphes qui vous semblent pertinents

## Echauffement (facultatif) : test unitaire

Implémenter la fonction `buildSlug` du fichier `api/src/lib/slug.ts` et ajouter un ou deux tests unitaires associés

Rappels : pour lancer ces tests : `npm run test:unit` (dans l'`api`)

## Echauffement : lancer les tests d'intégration

**Vérifier que vos tests d'intégrations** se lancent bien dans votre environnement local : 
- `npm run test:spec --prefix api`

En cas de difficulté, faites une issue : https://github.com/O-clock-Dublin/Soutien-ateliers et ping sur Slack un/une formateur ou helper 

## Exercices : API et tests
- En vous inspirant de ce qui a été fait en cours, implémenter les routes des `/api/levels` manquantes, ainsi que quelques tests associés
- **API** : suivre les [spécifications](../../conception/api-rest/endpoints.md)
- **Tests** : voici quelques exemples de tests qu'il est possible d'implémenter

**Je préfère 1 route bien testé (puisqu'on travaille surtout les tests) que toutes les routes sans tests !**


<details><summary>
Exemple de tests à implémenter
</summary>

```js
// - GET /levels
//   - s'il n'y a aucun level dans la BDD, la route renvoie un tableau vide
//   - s'il y a deux levels dans la BDD, la route renvoie bien les 2
//   - la route renvoie les levels avec les propriétés attendues (id, name, created_at, updated_at)

// - GET /levels/:id
//   - si le level existe dans la BDD, il est renvoyé avec les bonnes propriétés attendues
//   - si le level demandé n'existe pas, on nous renvoie une 404

// - POST /levels
//   - si toutes les données sont fournies, le level est bien créé et présent dans la BDD
//   - si toutes les données sont fournies, le level est bien renvoyé avec les propriétés attendues
//   - si les données obligatoires ne sont pas fournies, la requête échoue (422)
//   - si les données obligatoires ne respectent pas les conditions de validation, la requête échoue (422)
//   - s'il existe déjà un level avec le même nom, la requête échoue (409)

// - PATCH /levels/:id
//   - si le level existe, il est mis à jour et renvoyé avec les bonnes propriétés attendues
//   - si le level n'existe pas, la requête échoue (404)
//   - si les données fournies ne respectent pas les conditions de validation, la requête échoue (422)
//   - s'il existe déjà un level avec le même nom, la requête échoue (409)
//   - si le levels existe, mais que le nom est déjà utilisé par un autre level, on nous renvoie une 404

// - DELETE /levels/:id
//   - si le level existe, il est alors supprimé (204) et n'est plus présent en BDD
//   - si le level n'existe pas, la requête échoue (404)
```

</details>

