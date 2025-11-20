
## GitHub Actions

**GitHub Actions** est un service d'intégration et de déploiement continu (CI/CD) intégré directement à GitHub. Il permet d'automatiser des workflows comme :

* **Tester automatiquement le code** à chaque *push* ou *pull request*
* **Construire (build)** des applications
* **Déployer** sur des serveurs, cloud, ou autres services
* **Lancer des scripts de maintenance ou d'audit**

### Fonctionnement

Un **workflow GitHub Actions** est défini par un fichier YAML dans le dossier `.github/workflows` de votre dépôt.

Il est composé de :

* **Événements déclencheurs** : `push`, `pull_request`, `cron` (programmation régulière), `tag`, release...
* **Jobs** : une suite d'étapes qui s'exécutent sur un **runner** (machine virtuelle avec Docker pré-installé mise à disposition par GitHub ou auto-hébergée).
* **Steps** : chaque étape peut exécuter un script ou une **action** (des fonctionnalités réutilisables créées par la communauté ou GitHub).

### Exemple minimal

```yaml
name: Run Tests # Nom du Workflow

on: [push] # Déclencheur

jobs:
  test: # Le Job sur un runner ubuntu
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3   # Cloner le dépot
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm run test
```

### Avantages

* **Intégré à GitHub** : pas besoin d'outil externe.
* **Facile à configurer**.
* **Marketplace d’actions** déjà prêtes.
* **Gratuit dans certaines limites** pour les dépôts publics et plans gratuits.

### Cas d’usage courants

* Lancer des tests unitaires ou E2E
* Vérifier le formatage ou la qualité du code (linting, sécurité...)
* Construire des artefacts (ex : Docker image)
* Publier sur npm, PyPI, etc.
* Déployer sur AWS, GCP, Azure, Vercel, Netlify, Surge, etc.
