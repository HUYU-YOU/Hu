# Projet Hu – Pitch détaillé pour le développement du site web

## Aperçu du concept Hu
Hu est un projet de réseau social mondial unique en son genre, fondé sur la bienveillance, la connexion humaine et l’émotion. Contrairement aux feeds traditionnels, Hu propose une expérience centrée sur une carte interactive (un globe terrestre en 3D) affichant en temps réel les contenus partagés aux quatre coins du monde. Chaque publication – vidéo enregistrée ou live stream – est géolocalisée et associée à une émotion dominante, représentée par un code couleur spécifique. L’objectif est de visualiser instantanément le climat émotionnel des différents pays et régions, et de favoriser une empathie globale en connectant les utilisateurs aux émotions du monde entier.

## Palette d’émotions et code couleur
Chaque contenu est tagué par une couleur correspondant à l’émotion principale qui s’en dégage. Hu utilise un code couleur permanent pour représenter ces émotions de façon universelle :
- **Jaune** : joie, créativité
- **Bleu** : curiosité, apprentissage
- **Rouge** : colère, esprit de révolution
- **Vert** : nature, apaisement
- **Orange** : énergie, enthousiasme
- **Noir** : besoin d’aide urgente, détresse
Ces couleurs apparaissent sur la carte sous forme de points ou d’auréoles, permettant en un coup d’œil de percevoir l’humeur et l’énergie d’un lieu. Par exemple, une concentration de points jaunes sur un pays traduit une ambiance joyeuse/créative dominante, tandis qu’un point noir indique qu’un utilisateur y a exprimé un appel à l’aide urgent.

## Carte interactive mondiale
La carte du monde est le cœur de l’interface de Hu. Il s’agit d’un globe interactif en 3D qui remplace le fil d’actualité classique. Par défaut, le globe adopte un style clair et épuré : les terres sont présentées dans un vert pâle apaisant, les océans en bleu clair, avec un léger relief suggérant les montagnes et plateaux. L’utilisateur peut interagir librement avec la carte : rotation du globe, zoom avant/arrière et clic sur les éléments. Une rotation automatique lente du globe est activée au repos pour afficher tour à tour différentes régions du monde, et elle se met en pause dès que l’utilisateur prend le contrôle (par un glisser-déposer ou un zoom) afin de ne pas gêner la navigation.

Plusieurs options de vue cartographique sont offertes pour enrichir l’expérience :
- **Mode satellite** pour admirer la Terre avec des textures réalistes.
- **Mode carte vectorielle** pour une apparence schématique (frontières, villes). L’utilisateur peut basculer entre ces modes.
- **Cycle jour/nuit** progressif : en fonction de l’heure réelle, la portion du globe éclairée est plus lumineuse, la partie nocturne assombrie. L’utilisateur peut choisir de figer ce mode (toujours jour ou nuit).
- **Bouton « Ma position »** recentrant le globe sur la géolocalisation de l’utilisateur (avec son accord).

L’implémentation se fait via `react-globe.gl` (WebGL/Three.js) pour un rendu client autonome, sans clé API externe. Des textures personnalisées sont prévues pour les modes clair et satellite. Un léger relief 3D et une couche terminator peuvent être ajoutés pour l’effet jour/nuit. L’optimisation WebGL doit assurer une fluidité de 60fps sur la plupart des appareils modernes.

## En-tête de page (Top Bar)
L’en-tête contient les principaux contrôles :
- **Logo « hu. »** (bouton Home) ramenant à l’écran principal.
- **Bascule VIDÉO/LIVE** au centre, indiquant le mode actif et le nombre de lives en cours.
- **Bouton Réglages** à droite, ouvrant un menu pour le thème jour/nuit, le style de carte et la déconnexion.

## Panneau latéral gauche
- **Sélecteur de pays** : recentre le globe et filtre les contenus par pays.
- **Bascule Biais ON/OFF** : active ou non la personnalisation du contenu. Biais OFF = feed neutre global, Biais ON = feed orienté selon les préférences utilisateur.

## Panneau latéral droit
- **Filtres par émotions** : cases de couleur (jaune, bleu, rouge, vert, orange, noir) permettant d’afficher ou cacher certaines émotions.
- **Liste de contenus** synchronisée avec la carte. Chaque vignette montre miniature, type (vidéo/live), ville/pays et couleur. Clic sur une vignette : recentrage du globe sur cette localisation. Défilement infini pour charger plus d’items.

## Contenus géolocalisés
- Points colorés selon l’émotion dominante.
- Halo animé ou icône spécifique pour les lives.
- Données fictives préchargées couvrant différentes régions du monde.
- Clic sur un point : zoom et éventuel panneau de détail.

## Statistiques émotionnelles
- Calcul en temps réel de l’émotion dominante par pays selon les contenus visibles.
- Possibilité de filtrer ces statistiques via les émotions sélectionnées.
- Coloration légère des pays (voile à 50 % d’opacité) selon l’émotion majoritaire, sans bordures marquées.

## Design et expérience utilisateur
- Interface moderne, minimaliste, adaptée aux mobiles (panneaux coulissants sur petits écrans).
- Thèmes clair et sombre, animés par transitions douces.
- Accessibilité : contrastes suffisants, navigation clavier, textes alternatifs.
- Le globe et les panneaux se synchronisent sans erreur console, même lors de filtrages ou zooms rapides.

## Gestion des utilisateurs
- Écran de connexion/inscription simplifié (mock).
- Profil basique (nom, avatar, bio) après authentification.
- Option de déconnexion dans les réglages.

## Architecture technique
- **Framework** : Next.js 13 (React 18).
- **Langage** : TypeScript recommandé.
- **State management** : Context API (ou équivalent léger) pour les filtres et données.
- **Librairies** : `react-globe.gl` pour le globe, `next-auth` pour l’auth (mock), outils de style CSS ou framework UI minimal.
- **Structure** : composants principaux (Globe, Header, Sidebars), dossiers `data` pour contenus fictifs, `pages` pour routing Next.js.
- **Qualité** : ESLint/Prettier, tests unitaires possibles.

## Livrable
Un prototype Next.js lançable localement (`npm run dev`) offrant :
- Navigation sur le globe interactif.
- Filtrage des contenus par type, émotion et pays.
- Bascule jour/nuit et style de carte.
- Authentification simulée avec page de profil de base.
- Documentation claire pour installer et lancer le projet.
