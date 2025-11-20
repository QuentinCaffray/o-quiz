# Stratégies d’authentification

## 1. Méthodes primaires (vérification initiale de l’identité)

### 🔐 1.1 Mot de passe (classique)

**Principe :**
L’utilisateur saisit un identifiant et un mot de passe, vérifiés côté serveur.

**Avantages :**

* Facile à implémenter
* Courant pour les utilisateurs

**Inconvénients :**

* Vulnérable aux attaques (phishing, bruteforce)
* Nécessite une bonne gestion des mots de passe (hash, salt, etc.)

---

### 🧾 1.2 OAuth2 / OpenID Connect (SSO via tiers)

**Principe :**
L’utilisateur s’authentifie via un fournisseur (Google, GitHub, Facebook, etc.), qui renvoie un jeton d’identité.

**Avantages :**

* Pas de gestion d’identifiants en local
* UX fluide si l’utilisateur est déjà connecté

**Inconvénients :**

* Complexité d’intégration (redirections, scopes, tokens…)
* Dépendance à un service tiers

---

### 📧 1.3 Lien magique (Magic Link)

**Principe :**
Un lien unique est envoyé par e-mail ; cliquer dessus connecte l’utilisateur.

**Avantages :**

* UX très simple
* Pas besoin de retenir un mot de passe

**Inconvénients :**

* Dépendance à l’e-mail
* Vulnérable si boîte mail compromise

---

### 🧬 1.4 Biométrie / WebAuthn

**Principe :**
Utilisation d’empreintes digitales, reconnaissance faciale ou clés de sécurité intégrées (FIDO2).

**Avantages :**

* Très sécurisé (données locales, cryptographie forte)
* Expérience fluide

**Inconvénients :**

* Nécessite matériel compatible
* Intégration plus complexe sans service tiers

---

## 2. Gestion de session et de jetons (maintien de l’authentification)

### 🍪 2.1 Sessions serveur (stateful)

**Principe :**
Le serveur stocke l’état d’authentification en mémoire ou en base ; le client garde un identifiant de session dans un cookie.

**Avantages :**

* Facile à invalider
* Sécurisé si HTTPS + cookies `HttpOnly`

**Inconvénients :**

* Pas stateless (scalabilité moindre sans store partagé)

---

### 🔑 2.2 Tokens JWT (stateless)

**Principe :**
Après authentification, un jeton signé (contenant des infos) est envoyé et vérifié par le serveur **sans accès à la base** (stateless).

**Avantages :**

* Stateless et scalable
* Compatible avec des clients variés (SPA, mobile, API)

**Inconvénients :**

* Difficile à invalider avant expiration
* Sensible au mauvais stockage côté client (ex. localStorage ≠ sécurisé)

---

### 🕶 2.3 Tokens opaques

**Principe :**
Un identifiant aléatoire (sans info encodée) est envoyé au client ; validé en base à chaque requête.

**Avantages :**

* Invalidation simple
* Pas de risque de fuite d’infos dans le jeton

**Inconvénients :**

* Pas stateless (nécessite stockage côté serveur)

---

## 3. Couches de sécurité additionnelles

### 📱 3.1 2FA / MFA

**Principe :**
Ajout d’un second facteur : code SMS, e-mail, application TOTP (Google Authenticator, Authy…).

**Avantages :**

* Sécurité renforcée même si le mot de passe est compromis

**Inconvénients :**

* Moins fluide pour l’utilisateur
* Nécessite gestion du timing et des OTP

---

### 🔐 3.2 Clés de sécurité physiques (FIDO2 / Yubikey)

**Principe :**
Dispositif matériel générant une authentification forte (souvent via WebAuthn).

**Avantages :**

* Sécurité maximale
* Résistant au phishing et aux malwares

**Inconvénients :**

* Nécessite un matériel spécifique
* Adoption limitée grand public

---

## 📊 Comparatif synthétique

| Catégorie                  | Méthode              | Sécurité      | UX                 | Complexité  | Idéal pour                        |
| -------------------------- | -------------------- | ------------- | ------------------ | ----------- | --------------------------------- |
| **Méthode primaire**       | Mot de passe         | 🟠 Moyen     | 🟢 Facile         | 🟢 Faible  | Sites classiques, MVP             |
|                            | OAuth2 / OpenID      | 🟢 Bon       | 🟢 Facile         | 🟠 Moyenne | Apps sociales, pro (SSO)          |
|                            | Lien magique         | 🟠 Moyen     | 🟢 Très bon       | 🟠 Moyenne | Apps mobiles, SaaS                |
|                            | Biométrie / WebAuthn | 🟢 Excellent | 🟢 Fluide         | 🔴 Haute   | Apps modernes, SSO entreprises    |
| **Maintient de connexion** | Session serveur      | 🟢 Bon       | 🟢 Facile         | 🟢 Faible  | Sites traditionnels, intranet     |
|                            | JWT                  | 🟢 Bon       | 🟢 Facile         | 🟠 Moyenne | API REST, apps SPA ou mobiles     |
|                            | Token opaque         | 🟢 Bon       | 🟢 Facile         | 🟠 Moyenne | API internes, invalidation rapide |
| **Sécurité additionnelle** | 2FA / MFA            | 🟢 Très bon  | 🔴 Plus difficile | 🟠 Moyenne | Banque, admin, données sensibles  |
|                            | Clés physiques       | 🟢 Excellent | 🔴 Plus difficile | 🔴 Haute   | Entreprises, sécurité critique    |
