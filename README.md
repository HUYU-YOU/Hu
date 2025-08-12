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

## Base de données
Le projet utilise **PostgreSQL** via Prisma.

1. Créez une base de données et définissez `DATABASE_URL` dans votre `.env.local` :

   ```bash
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```

2. Générez le client et appliquez le schéma :

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

Le schéma complet se trouve dans `prisma/schema.prisma`.
