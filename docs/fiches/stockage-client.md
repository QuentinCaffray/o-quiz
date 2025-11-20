# Stockage côté client

Voici un tableau comparatif clair des principales différences entre **localStorage**, **sessionStorage**, **cookies** et **IndexedDB** dans un contexte **front-end web** :

| Critère                  | `localStorage`                            | `sessionStorage`                     | `Cookies`                                  | `IndexedDB`                                    |
| ------------------------ | ----------------------------------------- | ------------------------------------ | ------------------------------------------ | ---------------------------------------------- |
| **Taille max.**          | \~5 à 10 Mo                               | \~5 à 10 Mo                          | \~4 Ko                                     | Centaines de Mo à plusieurs Go                 |
| **Durée de vie**         | Persistant (jusqu'à suppression manuelle) | Expire à la fermeture de l’onglet    | Définie par date d'expiration (ou session) | Persistant                                     |
| **Accessibilité**        | JS côté client uniquement                 | JS côté client uniquement            | JS (client) + Serveur (HTTP headers)       | JS côté client uniquement                      |
| **Envoyé avec requêtes** | ❌ Non                                    | ❌ Non                               | ✅ Oui, avec chaque requête HTTP           | ❌ Non                                         |
| **Support JSON**         | ❌ Doit faire `JSON.stringify/parse`      | ❌ Doit faire `JSON.stringify/parse` | ❌ Doit encoder manuellement               | ✅ Stocke des objets complexes nativement      |
| **Sécurité**             | Moyenne (visible via dev tools)           | Moyenne                              | Faible (exposé aux attaques CSRF si mal paramétré)      | Meilleure (sandbox, mais XSS reste un risque)  |
| **Cas d’usage typiques** | Préférences utilisateur, panier    | Même chose mais pour une session     | Authentification, tracking, session ID     | Données complexes : cache offline, gros objets |
| **API**                  | Simple (clé/valeur)                       | Simple (clé/valeur)                  | Bas niveau (document.cookie)               | API asynchrone (promesses ou callbacks)        |

---

### 📝 En résumé :

* **localStorage** : stockage persistant simple pour données non sensibles.
* **sessionStorage** : similaire mais limité à la durée de l’onglet.
* **Cookies** : petit, utilisé pour interagir avec le serveur (auth, suivi).
* **IndexedDB** : base de données puissante côté client, adaptée au stockage structuré de grande taille.

Tu veux un exemple d’usage concret pour chacun ?
