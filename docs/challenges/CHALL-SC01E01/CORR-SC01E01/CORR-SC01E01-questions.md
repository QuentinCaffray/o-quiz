# Question & Design Review

- Q. **Souhaitez vous etre contacté via email ou recevoir directement les messages sur le site dans l'espace administrateur ?**
  - Les deux sont bons à prendre --> Challenge : diagramme de séquence pour représenter le fonctionnement du contact par email

- Q. **Quel public ciblez vous?**
  - Entreprises qui ont des besoin de réalisation techniques (logiciels, sites vitrines)

- Q. **Comment gérer l'accès à l'écran de connexion et au dashboard pour les admins ?**
  - Un seul administrateur (type super admin)
  - Ajout d'une page non indexé, non référencé : `/admin` sur laquelle notre admin peut indiquer son pseudo / mot de passe
    - niveau sécurité : on peut whitelisté certains IP uniquement pour l'accès à cette page
  - Faire un projet annexe pour la partie **backoffice** que l'on héberge à part : une URL totalement différente
    - les deux projets (vitrine + backoffice) communiquent avec la même BDD.
      - On peut utiliser directement un CMS plutôt que de coder le backoffice à la main

- Q. **Comment on pourrait gérer l'authentification de l'administrateur dans le cas où on code tout à la main** 
  - voir schéma d'authentification

- Q. **Quel type de base de donnée prévue ?**
  - **Données sont structurés** => SGBDR = Système de gestion de base de données **Relationnel** (relation = table en anglais)
  - `Sqlite` -> très bien pour l'embarqué ou les petites BDD (la BDD est dans un simple fichié)
  - `MySQL` -> souvent fourni sur les serveurs avec Wordpress
  - `MariaDB`
  - `Postgres` -> le SGBDR le plus complet pour des projets web

- Q. **Quelles informations seront montré sur une page de projet ?**
  - Titre du projet --> STRING
  - Description --> STRING (MD)
  - Les technos utilisés --> ENTITE A PART (MCD) --> table à part (MLD)
  - Photo du projet --> STRING (URL de l'image)
    - la photo elle même est stockée généralement dans un **dossier statique** 
      - ou mieux, dans un serveur à part : généralement, le genre de serveur pour stocker des images, des ressources statiques, sont des **CDN**

**CDN** = Content Delivery Network = réseau de serveurs répartis géographiquement afin que le serveur le plus proche réponde au client qui demande une ressource

- Q. **Combien de projets visible sur la vitrine page ?**
  - Système de pagination. On affiche 5 projets sur la page principale et une page "tous les projets"

- Q. **Visibilité des plus anciens? Sur une page différente?**
  - Trier par ordre de plus récent -> plus ancien


- Q. **Souhaiter vous que les visiteurs puisse mettre des commentaire, comme un livre d'or sur votre site ?**
- Q. **Ajouter une partie Testimonials (recommandations ou avis des clients) ?**
  - Non. 


- Q. **Combien de projets prévoyez-vous d'afficher au lancement ? Et à terme ?**
  - une dizaine

- Q. **Souhaitez-vous pouvoir modifier/supprimer un projet?**
  - oui, via le backoffice

- Q. **faut il une route bien spécifique pour que seul l'admin voit sa page de connexion ou lui faut il une route normal sur le site ?**
  - oui, route `/admin`


- Q. **Où voulez vous que la barre de navigation ce situe ?**
  - ==> zoning (grandes zones de l'application)
  - ==> wireframe (croquis) 

- Q. **Souhaitez vous classer les projets en différentes sections?**
  - non, mais on peut trier par les techno (pastille)


- Q. **L’espace administrateur doit-il être protégé par un mot de passe ?**
  - oui


- Q. **Où seront stockées les données des projets ?**
  - en BDD

- Q. **Charte graphique déjà existante ?**
  - Non => on en parle tout à l'heure


- Q. **Avez vous déjà une idée/maquette pour le site ?**
  - Non => à vous de jouer (challenge)

- Q. **Souhaitez vous afficher le nombre de visite quotidienne du site ?**
  - Non
    - CMS = pluging pour ça 
    - A la main : middleware qui compte les visites 
      - module NPM pour ça 


| Cas d’usage                                    | Recommandé     |
| ---------------------------------------------- | -------------- |
| Application **production** à fort trafic       | 🏎️ **Pino**   |
| Application **classique / Express / API REST** | 🧰 **Winston** |
| Application **petite / front-end / CLI**       | 💻 **Consola** |
| Environnement **corporate ou Java-like**       | 🏢 **Log4js**  |
| Projet **legacy ou JSON structuré**            | 🧱 **Bunyan**  |


- Q. **Voudriez vous donner accès à de potentiel futur administrateur, pour la rédaction des projet, repondre au message ?**
  - Non. 

- Q. **Pensez vous à l'avenir faire grandir votre site pour réaliser des ventes directement dessus et donnée des accès a de potentiel membres ?**
  - Non. 
  - `KISS` = `Keep It Simple Stupid`

- Q. **Souhaitez vous que l'entete (le logo, barre de navigation) reste visible quand la page defile ver le bas ?**
  - Oui. Comment on le gère ? 
    - ==> CSS position sticky
    - A noter : bannir les librairies "JS" pour ce genre de chose. En terme d'eco-conception et performance, on allourdi notre site pour rien
      - (JQuery)
    - ==> Toujours prévilégier du CSS à du JS (quand c'est possible !)


Q. **Quelle est votre date de mise en ligne souhaitée ? Y a-t-il une deadline impérative ?**
  - Projet scolaire 
  - Outil de gestion de projet pour nous aider à visualiser le temps que va prendre le projet : 
    - SCRUM = poker planning
      - necessite d'avoir découpé précisement les étapes du projet en amont
      - phase de conception importante pour aider à budgetiser et prévoir le projet dans le temps

Q. **Mentions légales : contenu fourni par le client ou on doit générer un template ?**


Q. **Vous ne voulez pas mettre plus en avant vos informations de contact (visibilité plus importante des réseaux) au niveau de la page d'accueil ?**
  - pourquoi pas, avec une sidebar par exemple : (ex : `aside`)

-Q. **Le site doit il être optimisé pour le référencement ? (SEO)**
  - OUI ! Donc la parti frontoffice => SSR 
    - Express + (EJS/Eta/Pug/Handlebar)
    - Next.js / Nuxt.js / SvelteKit
    - CMS front


- Les images des projets seront-elles fournies par vos équipes ?
  - oui, upload via le backoffic


- Q. **Quel est votre budget ?** (détermine l'ampleur du projet)
  - Vous serez payé en connaissance

- Q. **Quelle est votre deadline ?** (détermine le planning)

- Q. **Qui fournit le contenu et quand ?** (risque de blocage)
  - Texte, images => gérer par la partie Backoffice
  - Zonign/wireframes/mockup => le plus tôt possible (à nous !)

- Q. **Avez-vous un hébergement ?** (peut nécessiter config)
  - Non. Que suggérez-vous ? 
    - OVH (Kimsufi)
    - Hostinger
    - o2switch
    - ionos
    - infomaniak
    - Amazon Web Service (AWS)
    - Google Cloud Plateform (GCP)
    - Microsoft Azure (Azure)
    - Digital Ocean
  - Attention à distinguer les offres
    - Serveur privé physique -> ici on loue une machine complète
    - Serveurs privés virtuel (VPS) -> ici on loue une VM dans une machine (accès root)
    - Hebergement mutualisé -> ici on loue une VM préconfiguré avec des soft (pas root) --> `Wordpress`

- Q. **Combien d'admin et quelles fonctionnalités admin exactement ?** (impact architecture)
  - gestion du backoffice
  - 1 seul admin
