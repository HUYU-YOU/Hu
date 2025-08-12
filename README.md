# Hu Prototype

Prototype initial du réseau social **Hu**.

## Scripts
- `npm run dev` – démarrage de l'application (nécessite les dépendances).
- `npm run build`
- `npm start`
- `npm test` – exécution des tests (placeholder).
- `npm run lint` – vérification de style (placeholder).

## Fonctionnalités
- Authentification via e-mail, téléphone (OTP) ou Google (`next-auth`).
- Globe 3D basé sur **react-globe.gl** avec points colorés selon l'émotion.
- Barres latérales avec filtres et en-tête avec bascule VIDÉO/LIVE.
- Données fictives dans `src/data/contents.ts`.

### Variables d'environnement
Créez un fichier `.env.local` avec :

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change_me
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Installez les dépendances avec `npm install` avant de lancer.
