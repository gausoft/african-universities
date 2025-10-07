# African Universities Registry - Data Structure

## 📁 Structure des fichiers

```
data/
├── index.json              # Index des pays disponibles
├── schema.json             # Schéma JSON pour validation
└── countries/
    ├── togo.json          # Données du Togo
    ├── ghana.json         # Données du Ghana (à venir)
    ├── nigeria.json       # Données du Nigeria (à venir)
    └── ...                # Autres pays africains
```

## 📊 Format des données

### Structure principale (par pays)

Chaque fichier JSON de pays contient :

- **country** : Métadonnées du pays
- **statistics** : Statistiques générales
- **institutions** : Liste des établissements

### Exemple d'institution

```json
{
  "id": "TG001",
  "name": "Université de Lomé", 
  "type": "public",
  "category": "university",
  "status": "recognized",
  "location": {
    "city": "Lomé",
    "coordinates": {"latitude": 6.1319, "longitude": 1.2228}
  },
  "contact": {
    "website": "https://www.univ-lome.tg/",
    "email": "info@univ-lome.tg"
  }
}
```

## 🔑 Champs principaux

### Types d'établissements

- `public` : Universités publiques
- `private` : Universités privées  
- `religious` : Établissements religieux
- `international` : Campus internationaux

### Catégories

- `university` : Universités complètes
- `institute` : Instituts spécialisés
- `college` : Collèges
- `school` : Écoles supérieures
- `center` : Centres de recherche

### Statuts

- `recognized` : Reconnu officiellement
- `provisional` : Reconnaissance provisoire
- `pending` : En attente de reconnaissance
- `suspended` : Reconnaissance suspendue

## 🎯 Identifiants

Format : `[CODE_PAYS][NUMERO]`

- `TG001`, `TG002`... pour le Togo
- `GH001`, `GH002`... pour le Ghana
- `NG001`, `NG002`... pour le Nigeria

## 📊 Sources de données

- **Togo** : [Ministère de l'Enseignement Supérieur](https://edusup.gouv.tg/)
- **Ghana** : National Accreditation Board (NAB)
- **Nigeria** : National Universities Commission (NUC)

## 🔄 Mise à jour

Les données sont mises à jour selon le calendrier académique de chaque pays.

## 📝 Validation

Utilisez le fichier `schema.json` pour valider la structure des données :

```bash
# Exemple avec ajv-cli
npx ajv validate -s schema.json -d countries/togo.json
```

## 🤝 Contribution

Pour ajouter ou modifier des données :

1. Respecter le schéma JSON
2. Vérifier les sources officielles
3. Mettre à jour les statistiques
4. Tester la validation

## 📄 License

Données sous licence MIT - Voir le fichier LICENSE du projet principal.
