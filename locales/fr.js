/* ================================================================
   L'ORDRE DES LANTERNES — Wiki
   locales/fr.js — French translations
   ================================================================
   This file defines all translatable strings for the French UI.
   It must be loaded before main.js in index.html.

   Structure: nested objects matching the data-i18n keys used
   in the HTML. Example: data-i18n="nav.world" maps to
   LODL_LANG_FR.nav.world

   To add a new translatable string:
   1. Add the key here (and in en.js with the English version)
   2. Add data-i18n="your.key" to the HTML element
   3. main.js will apply it automatically
================================================================ */

const LODL_LANG_FR = {

  /* Gate (password screen) */
  gate: {
    title:               "L'Ordre des Lanternes",
    subtitle:            'Archives Secrètes — Accès Restreint',
    passwordLabel:       'Mot de passe',
    passwordPlaceholder: 'Mot de passe',
    enterBtn:            'Entrer',
    error:               'Mot de passe incorrect. Les archives restent scellées.',
  },

  /* Header */
  header: {
    logo:     "L'Ordre des Lanternes",
    loginBtn: '⚔ Se connecter',
  },

  /* Main navigation */
  nav: {
    world:       'Le Monde',
    order:       "L'Ordre",
    bestiary:    'Le Bestiaire',
    characters:  'Les Personnages',
    archives:    'Les Archives',
    lanternerie: 'La Lanternerie',
  },

  /* Hero section */
  hero: {
    eyebrow: "Archives Secrètes — Terre d'Ailleurs",
    title:   "L'Ordre des Lanternes",
    tagline: 'Un monde où les sylphes vivent dans les lanternes, et où les lanterneurs gardent l\'équilibre entre deux mondes.',
    cta:     'Explorer les archives',
  },

  /* Search bar */
  search: {
    placeholder: 'Rechercher dans les archives…',
    noResult:    'Aucun résultat trouvé dans les archives.',
  },

  /* Banner sections */
  banner: {
    monde: {
      num:   'Cartographie',
      title: 'Le Monde',
      desc:  "Terre d'Ailleurs et ses continents, ses cités, ses portails vers le Monde Commun et les peuples fantastiques qui l'habitent depuis l'aube des temps.",
      btn:   'Explorer la carte →',
    },
    ordre: {
      num:   'Institution',
      title: "L'Ordre des Lanternes",
      desc:  "Six classes, des Ligues d'élite, des Citadelles de formation. Tout ce qu'il faut savoir sur l'institution qui protège les deux mondes.",
      btn:   "Rejoindre l'Ordre →",
    },
    bestiaire: {
      num:   'Bestiaire',
      title: 'Monstres & Démons',
      desc:  "Créatures transformées par la Brume, démons surgis de l'Inferi, spectres errants — chaque menace documentée pour survivre à Ailleurs.",
      btn:   'Consulter le bestiaire →',
    },
    personnages: {
      num:   'Personnages',
      title: 'Personnages',
      desc:  "Héros, antagonistes, figures historiques liées à Ailleurs — de Merlin à Galaad, des Semeurs d'Horreur aux Lanterneurs légendaires.",
      btn:   'Voir les fiches →',
    },
    archives: {
      num:   'Archives',
      title: 'Archives',
      desc:  "Journaux fictifs d'Ailleurs, chronologie des événements fondateurs, glossaire des termes de l'univers — l'histoire vue de l'intérieur.",
      btn:   'Ouvrir les archives →',
    },
  },

  /* Featured article section */
  featured: {
    tag:         'Article à la une',
    title:       "Terre d'Ailleurs",
    desc:        "Monde originel des créatures fantastiques, redécouvert en 535 après J.-C. par Galaad du Lac et Merlin l'enchanteur. Composée de quatre continents aux paysages variés, séparés du Monde Commun par des portails que seuls les membres de l'Ordre peuvent traverser librement.",
    quickAccess: 'Accès rapide',
    link1: { cat: 'Personnages',    title: 'Chloé' },
    link2: { cat: 'Créatures',      title: 'Les Sylphes' },
    link3: { cat: 'Organisations',  title: "L'Ordre des Lanternes" },
    link4: { cat: 'Histoire',       title: 'La Fondation' },
  },

  /* Login / register panel */
  login: {
    title:         'Connexion',
    registerTitle: 'Créer un compte',
    emailLabel:    'Adresse email',
    emailPlaceholder: 'votre@email.com',
    pseudoLabel:   'Pseudo (nom de Lanterneur)',
    pseudoPlaceholder: 'Votre pseudo',
    passwordLabel: 'Mot de passe',
    confirmLabel:  'Confirmer le mot de passe',
    submitBtn:     "Entrer dans l'Ordre",
    registerBtn:   "Rejoindre l'Ordre",
    toggleText:    'Pas encore de compte ?',
    toggleLink:    "S'inscrire",
    hasAccount:    'Déjà un compte ?',
    signInLink:    'Se connecter',
  },

  /* Lanternerie panel */
  lanternerie: {
    title:        '🏮 La Lanternerie',
    filamentColor: 'Couleur du filament',
    brightness:   'Luminosité',
    presetColors: 'Couleurs des lanternes',
    trailActive:  'Filament actif',
  },

  /* Footer */
  footer: {
    copy: "L'Ordre des Lanternes — © Willy Dessalines",
  },

};