/* ================================================================
   L'ORDRE DES LANTERNES — Wiki
   locales/en.js — English translations
   ================================================================
   This file defines all translatable strings for the English UI.
   It must be loaded before main.js in index.html.

   Every key here must match exactly the keys in fr.js.
   If a key exists in fr.js but not here, main.js will
   fall back to displaying the key itself as a placeholder.

   To add a new translatable string:
   1. Add the key here (and in fr.js with the French version)
   2. Add data-i18n="your.key" to the HTML element
   3. main.js will apply it automatically
================================================================ */

const LODL_LANG_EN = {

  /* Gate (password screen) */
  gate: {
    title:               'The Order of Lanterns',
    subtitle:            'Secret Archives — Restricted Access',
    passwordLabel:       'Password',
    passwordPlaceholder: 'Password',
    enterBtn:            'Enter',
    error:               'Incorrect password. The archives remain sealed.',
  },

  /* Header */
  header: {
    logo:     'The Order of Lanterns',
    loginBtn: '⚔ Sign in',
  },

  /* Main navigation */
  nav: {
    world:       'The World',
    order:       'The Order',
    bestiary:    'The Bestiary',
    characters:  'Characters',
    archives:    'Archives',
    lanternerie: 'The Lanternery',
  },

  /* Hero section */
  hero: {
    eyebrow: 'Secret Archives — Terre d\'Ailleurs',
    title:   'The Order of Lanterns',
    tagline: 'A world where sylphs live inside lanterns, and where lantern-bearers keep the balance between two worlds.',
    cta:     'Explore the archives',
  },

  /* Search bar */
  search: {
    placeholder: 'Search the archives…',
    noResult:    'No results found in the archives.',
  },

  /* Banner sections */
  banner: {
    monde: {
      num:   'Cartography',
      title: 'The World',
      desc:  "Terre d'Ailleurs and its continents, its cities, its portals to the Common World and the fantastical peoples who have inhabited it since the dawn of time.",
      btn:   'Explore the map →',
    },
    ordre: {
      num:   'Institution',
      title: 'The Order of Lanterns',
      desc:  'Six classes, elite Leagues, training Citadels. Everything you need to know about the institution that protects both worlds.',
      btn:   'Join the Order →',
    },
    bestiaire: {
      num:   'Bestiary',
      title: 'Monsters & Demons',
      desc:  "Creatures transformed by the Mist, demons risen from the Inferi, wandering spectres — every threat documented to survive in Ailleurs.",
      btn:   'Browse the bestiary →',
    },
    personnages: {
      num:   'Characters',
      title: 'Characters',
      desc:  "Heroes, antagonists, historical figures tied to Ailleurs — from Merlin to Galahad, from the Horror-Sowers to the legendary Lantern-Bearers.",
      btn:   'View character sheets →',
    },
    archives: {
      num:   'Archives',
      title: 'Archives',
      desc:  "Fictional journals from Ailleurs, timeline of founding events, glossary of universe terms — history seen from within.",
      btn:   'Open the archives →',
    },
  },

  /* Featured article section */
  featured: {
    tag:         'Featured article',
    title:       "Terre d'Ailleurs",
    desc:        "The original world of fantastical creatures, rediscovered in 535 AD by Galahad of the Lake and Merlin the enchanter. Comprised of four continents with varied landscapes, separated from the Common World by portals that only Order members may freely cross.",
    quickAccess: 'Quick access',
    link1: { cat: 'Characters',    title: 'Chloé' },
    link2: { cat: 'Creatures',     title: 'The Sylphs' },
    link3: { cat: 'Organizations', title: 'The Order of Lanterns' },
    link4: { cat: 'History',       title: 'The Foundation' },
  },

  /* Login / register panel */
  login: {
    title:            'Sign in',
    registerTitle:    'Create an account',
    emailLabel:       'Email address',
    emailPlaceholder: 'your@email.com',
    pseudoLabel:      'Username (Lantern-Bearer name)',
    pseudoPlaceholder: 'Your username',
    passwordLabel:    'Password',
    confirmLabel:     'Confirm password',
    submitBtn:        'Enter the Order',
    registerBtn:      'Join the Order',
    toggleText:       'No account yet?',
    toggleLink:       'Sign up',
    hasAccount:       'Already have an account?',
    signInLink:       'Sign in',
  },

  /* Lanternerie panel */
  lanternerie: {
    title:         '🏮 The Lanternery',
    filamentColor: 'Filament color',
    brightness:    'Brightness',
    presetColors:  'Lantern colors',
    trailActive:   'Filament active',
  },

  /* Footer */
  footer: {
    copy: 'The Order of Lanterns — © Willy Dessalines',
  },

};