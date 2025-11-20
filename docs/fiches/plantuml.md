# PlantUML

## Installation

- `Extension VSCode` à installer : 
  - `PlantUML (jebbs)`

### Option 1 - serveur en ligne

- Éditer les `Préférence User Settings (JSON)` :
  - `CTRL + SHIFT + P` pour ouvrir la palette de commande VSCode et rechercher `Preference User Settings (JSON)`

```json
{
  "plantuml.render": "PlantUMLServer",
  "plantuml.server": "https://www.plantuml.com/plantuml"
}
```

Attention, s'il y a du rouge :
- c'est probablement qu'il manque une virgule à la ligne du dessus (et oui, c'est un JSON)
- attention à bien mettre les options DANS l'objet

Penser à bien enregistrer

### Option 2 - serveur en local (Docker)

Lancer un conteneur PlantUML :
- `docker run -d --name plantuml -p 8585:8080 plantuml/plantuml-server`

- Éditer les `Préférence User Settings (JSON)` : 

```json
{
  "plantuml.render": "PlantUMLServer",
  "plantuml.server": "http://localhost:8585"
}
```

## Utilisation 

- Fichier avec l'extension : `.puml`
- Commande palette (`CTRL + SHIFT + P`) : 
  - `PlantUML: Preview Current Diagram`
  - `PlantUML: Export Current Diagram`

## Exemple de code UML

```plantuml
@startuml Nom du diagramme

' Dépend du type de diagramme que l'on souhaite utiliser
' Documentation : https://plantuml.com/fr/

@enduml
```

## Alternative

On retrouve directement une interface pour créer des graphiques UML sur [plantuml.com](https://plantuml.com/fr/)
