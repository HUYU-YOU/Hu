# Projet Hu – Pitch détaillé

## Aperçu du concept
Hu est un réseau social mondial centré sur la bienveillance, la connexion humaine et l’émotion.
Une carte interactive en 3D remplace le fil traditionnel et affiche en temps réel les contenus géolocalisés.

## Palette d’émotions
- **Jaune** : joie, créativité
- **Bleu** : curiosité, apprentissage
- **Rouge** : colère, esprit de révolution
- **Vert** : nature, apaisement
- **Orange** : énergie, enthousiasme
- **Noir** : besoin d’aide urgente, détresse

## Carte interactive mondiale
- Globe 3D manipulable (rotation, zoom, clics)
- Modes clair/satellite et cycle jour/nuit ajustable
- Bouton « Ma position » pour centrer sur l’utilisateur
- Implémentation prévue avec react-globe.gl (WebGL/Three.js)

## En-tête de page
- Logo « hu. » renvoyant à l’écran d’accueil
- Bascule **VIDÉO/LIVE** avec compteur de lives actifs
- Bouton **Réglages** pour thème jour/nuit, style de carte et déconnexion

## Panneau latéral gauche
- Sélecteur de pays pour centrer le globe et filtrer les contenus
- Bascule **Biais ON/OFF** pour activer ou désactiver la personnalisation

## Panneau latéral droit
- Filtres par émotions (cases couleur)
- Liste de contenus (vidéos ou lives) synchronisée avec la carte
- Vignettes cliquables recentrant le globe sur la localisation

## Contenus géolocalisés
- Points colorés sur le globe selon l’émotion dominante
- Effet distinct pour les lives (halo animé ou icône)
- Données fictives préchargées pour la démonstration

## Statistiques émotionnelles
- Calcul de la couleur dominante par pays selon les contenus récents
- Possibilité de filtrer les statistiques par émotions visibles

## Design et expérience utilisateur
- Interface épurée, moderne, responsive et accessible
- Thèmes clair et sombre, animations fluides, navigation mobile adaptée

## Gestion des utilisateurs
- Écran de connexion/inscription simplifié
- Profil basique (nom, avatar) après authentification

## Architecture technique
- Application Next.js 13 (React 18)
- Composants principaux : Globe, Header, SidebarLeft, SidebarRight
- Gestion d’état via Context/Redux, données simulées en mémoire
- ESLint/Prettier, tests unitaires possibles

## Livrable
Prototype Next.js lançable localement (npm run dev) offrant la navigation sur le globe, le filtrage des contenus et l’authentification simulée.
