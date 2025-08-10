# Hu Prototype

Prototype initial du réseau social **Hu**.

## Scripts
- `npm run dev` – démarrage de l'application (nécessite les dépendances).
- `npm run build`
- `npm start`
- `npm test` – exécution des tests (placeholder).
- `npm run lint` – vérification de style (placeholder).

## Fonctionnalités
- Authentification simple par nom.
- Globe 3D basé sur **Mapbox GL** avec points colorés selon l'émotion.
- Barres latérales avec filtres et en-tête avec bascule VIDÉO/LIVE.
- Données fictives dans `src/data/contents.ts`.

Installez les dépendances avec `npm install` avant de lancer.

### Carte Mapbox
Cette version nécessite un token Mapbox.
Définissez la variable d'environnement `NEXT_PUBLIC_MAPBOX_TOKEN` avant d'exécuter `npm run dev`.
