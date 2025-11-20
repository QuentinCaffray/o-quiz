# User Stories

= 🇫🇷 **Récits utilisateurs** :
- **scenari de test** pour l'application
- on se place du point de vu d'un utilisateur, et on regarde ce qu'il/elle est en mesure de réaliser sur la plateforme
- permet également de valider que le developpement est correct et répond bien au besoin

**Formalisme** : 
- 🇫🇷 `En tant que [role], je souhaite [action] ((, afin de [objectif] ))`
- 🇺🇸 `As a [role], I want to [action], (( so that [goal]))`

**Exemples** :
- En tant que visiteur, je souhaite accéder à une page d'accueil, afin parcourir la plateforme
- En tant que auteur, je souhaite pouvoir créer un quiz (, afin d'élargir le catalogue des quiz présents dans la plteorme)

**Exercice (10min)** : 
- réfléchir aux user stories pour clarifier le besoin de Jeff
- réfléchir aux questions 'ouvertes' à poser à Jeff pour comprendre son besoin

**Conseil** : 

- **Définir les rôles**
  - avant de rédiger des user stories, réfléchir aux **rôles** de notre application. Quel "type d'utilisateur" ? 
  - `visiteurs` : utilisateur non connecté
  - `membres` : utilisateur connecté à la plateforme
  - `auteurs` : utilisateur membre avec des droits particuliers (ex : créer un quiz, créer un thème)
  - `administrateurs` : utilisateur membre avec des droits de modération (ex : supprimer un compte, modifier le rôle d'un membre)

- **Les user stories doivent-être atomique (ciblé)**
  - par exemple, on évite certains "actions multiples"




## Variante : abuser story

> Le **récit d'abuseur** (jeu de mots en anglais entre « user story » et « **abuser story** ») est une variante utilisée pour intégrer la sécurité dès le début des développements. Ce type de récit présente les intentions d'un utilisateur malveillant que l'on cherchera à tenir en échec.
> [Wikipédia](https://fr.wikipedia.org/wiki/R%C3%A9cit_utilisateur) 

Exemple : 
- En tant qu'utilisateur malveillant, je souhaite pouvoir exécuter une injection SQL dans un champ afin de voler des informations sur la base de données.



## Brouillon des users stories

✅ = bien rédigé, et demandé par Jeff
🧪 = bien rédigé, mais pas demandé par Jeff
🚧 = à ajuster
🏴‍☠️ = abuser story à tenir en echec


```
- 🚧 En tant que admin je souhaite pouvoir modifier des quiz pour apporter des corrections.
  - ✅ En tant qu'administrateur, je souhaite pouvoir modifier **un quiz**, afin d'apporter des corrections.
  - ✅ En tant qu'auteur, je souhaite pouvoir modifier un quiz que j'ai créé, afin d'apporter des corrections.
  - 🏴‍☠️ En tant qu'auteur, je souhaite pouvoir modifier le quiz d'un autre auteur ==> à maintenir en echec


- 🚧 En tant qu'utilisateur je souhaite pouvoir créer un compte user pour garder mes résultats en mémoire.
  - ✅ En tant que visiteur je souhaite pouvoir créer un compte


- 🚧 En tant que user je souhaite me connecter à mon compte pour reprendre un quiz commencé.
  - ✅ En tant que visiteur, je souhaite me connecter afin d'avoir des droits de membres
  - 🧪 En tant que membre, je souhaite pouvoir reprendre un quiz débuté

- 🚧 En tant qu'utilisateur je souhaite parcourir un menu des thèmes pour choisir le thème de mon quiz.


- ✅ En tant que visiteur, je souhaite accéder à une page présentant les 5 quizzes les plus récents afin de me faire une idée du contenu de la plateforme
- ✅ En tant que membre, je souhaite pouvoir accéder à n'importe quel quiz de la plateforme
- ✅ En tant que membre, je souhaite parcourir l'ensemble des thèmes afin de m'aider à choisir un quiz.

- ✅ En tant que membre, je souhaite pouvoir choisir un sujet afin de voir les quizzes de ce sujet
- ✅ En tant que membre qui joue un quiz, je souhaite avoir la possibilité de revenir en arrière afin de retourner sur la page d'accueil

- ✅ En tant que visiteur, je souhaite accéder à une page d'accueil, afin parcourir la plateforme
- ✅ En tant qu'auteur, je souhaite pouvoir créer un quiz (, afin d'élargir le catalogue des quiz présents dans la plateforme)

- ✅ En tant que visiteur je souhaite m'inscrire afin de voir ma progression
- ✅ En tant que visiteur, je souhaite me connecter afin de voir mes informations
- 🧪/✅ En tant que membre, je souhaite acceder aux differents quizz deja effectués afin de voir mon score sur ces quiz
- ✅ En tant que admin, je souhaite voir les differents utilisateurs
- ✅ En tant qu'admin, je souhaite pouvoir rechercher un utilisateur par son nom
- ✅ En tant qu'admin, je souhaite pouvoir rechercher un utilisateur par son mail

- ✅ En tant que membre, je souhaite pouvoir modifier mon mot de passe, afin de le complexifier
- ✅ En tant que membre non connecté, je souhaite pouvoir faire un reset password, afin de reinitialiser celui-ci

- ✅ En tant que visiteur, je souhaite parcourir les différents quizz
- En tant que visiteur ,je souhaite voir mon classement sur les quizz 

- ✅ En tant que membre, je souhaite pouvoir rejoindre un quiz via son lien
- En tant qu'admin je souhaite pouvoir attribué un rôle à chaque utilisateur
- En tant qu'utilisateur, je souhaite pouvoir accéder à mes résultats, score...

- En tant que visiteur, je souhaite créer un compte utilisateur
- En tant que visiteur, je souhaite m'identifier à mon compte
- En tant qu'utilisateur, je souhaite accéder à mon profil, afin de modifier mes données
- En tant que utilisateur, je souhaite parcourir la liste des quizzs, afin d'en choisir un
- En tant que utilisateur, je souhaite envoyer mes réponses d'un quiz afin de découvrir et sauvegarder mon score
- En tant qu'auteur je souhaite accéder à une page de création de quiz, afin de l'envoyer
- En tant qu'auteur je souhaite retourner à la liste des quizzs créés afin de les modifier / supprimer
- En tant que utilisateur, je souhaite accéder aux quizzs effectués, afin de les réviser / refaire

- ✅ En tant que membre, je souhaite pouvoir rejouer un quiz déjà effectué
- En tant que membre, je souhaite voir le résultat du quiz avec mes erreurs et les corrections, afin de progresser

- 🚧 En tant que admin je souhaite creer des role utilisateur et moderateur afin de donner des autorisation aux eleve et professeur
  - ✅ En tant qu'admin, je souhaite pouvoir assigner un rôle à un utilisateur, afin de leur donner des permissions particulières



- En tant qu'éleve je souhaite pouvoir voir les quiz existants afin de choisir et répondre au quiz
- En tant que modérateur je souhaite pouvoir spécifier les quizz pour les classe eleve afin de differencier les groupes
- En tant que admin je souhaite creer des groupes afin de differencier la classe des utilisateur
- En tant que moderateur je souhaite creer des quiz afin de donner les objectif des eleves
- En tant que admin je souhaite modifier la page d'acceuil afin de faire des mise a jour pour les visiteurs
- 🧪 En tant que visiteur je souhaite envoyer un message (formulaire) a l'admin afin de prendre contact
- En tant que admin je souhaite voir les message recu directement dans l'espace administrateur afin de lire directement via l'interface pro

- ✅ En tant que membre, je souhaite pouvoir jouer un quiz
- En tant que visiteur je souhaite pouvoir trier les quizz selon les themes
- En tant qu'admin je souhaite pouvoir supprimer des quizz/questions afin de modérer

- En tant qu'admin, je souhaite pouvoir ajouter et retirer des auteurs de quizz
- En tant qu'admin, je souhaite pouvoir retirer des quizz
- En tant qu'admin, je souhaite pouvoir me connecter à une page administrateur
- En tant qu'auteur, je souhaite pouvoir créer de nouveaux quizz
- En tant qu'auteur, je souhaite pouvoir sélectionner la difficulté et le thème du quizz créé
- En tant que visiteur, je souhaite pouvoir créer un compte utilisateur
- En tant qu'utilisateur, je souhaite pouvoir sélectionner le quizz, afin de pouvoir choisir le thème et la difficulté
- En tant qu'utilisateur, je souhaite pouvoir répondre au quizz, afin de pouvoir soumettre les réponses
- En tant qu'utilisateur, je souhaite pouvoir voir les réponses du quizz une fois soumis


- En tant que visiteur, je souhaite pouvoir me creer un compte et me connecter.
- En tant qu'utilisateur je peux choisir et répondre aux différents quizz
- En tant qu'utilisateur je peux lancerle quizz et  soumettre mes réponses
- En tant qu'utilisateur je peux exporter mes résultats
- En tant qu'utilisateur je peux reprendre le quizz là ou je l'ai arrêté ?
- En tant qu'utilisateur je peux explorer mes résultats
- En tant qu'auteur je peux créer/supprimer un quizz
- En tant qu'auteur je peux paramétrer le quizz (anonyme ou non, timer, timer par question, essais max, taux de réussite...)
- En tant qu'auteur je peux me connecter à une page administrateur 

- En tant qu'auteur, je souhaite pouvoir modifier un quiz 
- En tant qu'utilisateur, je souhaite pouvoir choisir un thème
- En tant qu'utilisateur, je souhaite voir un classement ou podium à la fin du quizz afin de comparer les performances

- En tant que visiteur, je souhaite pouvoir accéder à un quizz
- En tant que visiteur, je souhaite pouvoir choisir le thème du quizz
- En tant que visiteur je souhaite pouvoir choisir le sujet du quizz
- En tant que visiteur, je souhaite pouvoir visualiser la difficulté des questions
- En tant que visiteur, je souhaite pouvoir visualiser mon score après envoie du quizz
- En tant que visiteur, je souhaite pouvoir avoir la correction aux questions afin de visualiser les réponses

- En tant que visiteur, je souhaite voir le résultat du quiz. 
- En tant que admin, je veux voir le résultat du quiz.
- En tant que visiteur, je veux comparer mon résultat avec les autres participant s'il y en a.
- En tant que admin, je veux avoir les résultats du/des quiz et les comparer.
- En tant que visiteur, je veux capturer mes meilleurs résultats et les afficher aux autres.
- En tant que admin, je veux que les uses aient  des points et cadeaux dans le jeux pour les stimuler.
- En tant que user, je veux pouvoir me connecter  à l'application et avoir accès à toutes mes infos et résultats.
- En tant que admin, je veux avoir accès à toutes les infos des users et de leurs résultats.
- En tant que user, je veux avoir le droit de supprimer mes résultat et mes données.
- En tant que user, je veux avoir le droit d'afficher ou non mes résultats.
- En tant que user, je veux avoir un avatar qui me ressemble.
- En tant que user, je veux pouvoir communiquer avec les autres users du quiz.
- En tant que user, je veux pouvoir données mon avis sur le quiz.

- En tant que visiteur je souhaite pouvoir accéder à une page d'inscription afin de me créer un compte
- En tant que visiteur, he souhaite accéder à une page de connexion afin de me connecter et profiter des droits des membres

- En tant que visiteur je souhaite consulter la page des quiz afin de voir la liste des quizz existant
- En tant que visiteur je souhaite accéder à la page d'un quizz afin de répondre a ce quiz
- En tant que visiteur je souhaite accéder à la page de correction d'un quizz afin de afin de se corriger
- En tant que visiteur je souhaite consulter la page des thèmes afin de voir la liste des quizz en fonction des thèmes
- En tant qu'administrateur je souhaitecréer / modifier / supprimer un quizz afin de l'administrer

```



## Correction (exemple !)

Hiérarchie des rôles : 
- `Visiteur <-- Membre <-- Auteur <-- Admin`


| En tant que | je souhaite pouvoir                                                 | afin de                                              |
| ----------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| visiteur    | accéder à une page d'accueil                                        | prévisualiser le contenu du site                     |
| visiteur    | accéder à un formulaire de création de compte                       | pouvoir créer un compte                              |
| visiteur    | accéder à un formulaire de connexion                                | pouvoir me connecter                                 |
| visiteur    | réinitialiser mon mot de passe                                      | palier à un éventuel oubli                           |
| visiteur    | lister un échantillon de quiz récents                               | pouvoir prévisualiser quelques quiz existants        |
| membre      | lister l'intégralité des quiz                                       |                                                      |
| membre      | lister les thèmes de la plateforme                                  |                                                      |
| membre      | lister les quiz d'un thème donné                                    |                                                      |
| membre      | jouer un quiz                                                       | répondre aux questions de ce quiz                    |
| membre      | obtenir mon score sur un quiz                                       |                                                      |
| membre      | visualiser mes bonnes et mauvaises réponses                         |                                                      |
| membre      | lister l'ensemble des quiz joués                                    | connaitre mes scores                                 |
| membre      | rechercher un quiz                                                  | le trouver un quiz via un ou plusieurs mots clés     |
| membre      | supprimer mon compte                                                | supprimer mes informations personnelles              |
| membre      | me déconnecter                                                      |                                                      |
| auteur      | lister les quiz que j'ai créé                                       |                                                      |
| auteur      | créer un nouveau quiz                                               | d'élargir le catalogue de quiz                       |
| auteur      | accéder au formulaire d'édition d'un quiz                           |                                                      |
| auteur      | ajouter une question d'un quiz                                      |                                                      |
| auteur      | modifier une question d'un quiz                                     |                                                      |
| auteur      | supprimer une question d'un quiz                                    |                                                      |
| auteur      | ajouter une proposition à un quiz                                   |                                                      |
| auteur      | modifier une proposition à un quiz                                  |                                                      |
| auteur      | ajouter une proposition à un quiz                                   |                                                      |
| auteur      | accéder aux scores des utilisateurs qui ont joué mon quiz           | connaitre sa bonne/mauvaise réussite                 |
| auteur      | assigner un niveau de difficulté existant à une question            | préciser sa difficulté                               |
| admin       | ajouter un thème                                                    | étendre le pool de thèmes assignables aux quiz       |
| admin       | modifier un thème                                                   |                                                      |
| admin       | supprimer un thème                                                  |                                                      |
| admin       | ajouter un niveau de difficulté                                     | étendre le pool de niveaux assignables aux questions |
| admin       | modifier un niveau de difficulté                                    |                                                      |
| admin       | supprimer un niveau de difficulté                                   |                                                      |
| admin       | consulter le nombre de questions associés à un niveau de difficulté |                                                      |
| admin       | modifier le rôle d'un utilisateur                                   |                                                      |


Cette liste n'est pas exaustive ==> l'objectif étant encore une fois de clarifier le besoin 

