// Film Configuration
// Add new films here - this is the single source of truth for all films

export const films = [
  // Add your films here
  {
    slug: 'months-at-home',
    name: 'Months at Home',
    type: 'vimeo',
    vimeoId: '907969900',  // Sample Vimeo ID for testing
    description: `My BA film thesis about my parents, filmed during the pandemic.
    © 2021`,
    year: 2024
  },
  {
    slug: '16mm-project',
    name: 'Lakeview / Hyde Park',
    type: 'moving-album',
    videos: [
      { caption: 'a place to run, washington park' },
      { caption: 'view from behind my childhood house, lakeview' },
      { caption: 'where I would eat and study, hyde park' },
      { caption: 'view of middle school from the park, old town' },
      { caption: 'pickup basketball games played here, lakeview' },
      { caption: 'dad and david at home, lakeview' },
      { caption: 'view of my parents\' room from the hallway, lakeview' },
      { caption: 'the view outside my college bedroom, hyde park' },
      { caption: 'abi and mom at home, lakeview' }
    ],
    description: ''
  },
  {
    slug: 'to-make-matters-worse',
    name: 'To Make Matters Worse',
    type: 'vimeo',
    vimeoId: '397719584',
    description: `A comedy centered on an otherwise perfect date that gets derailed by one of the date's friends who impersonates a waiter.

© 2019`,
    year: 2019
  },
  {
    slug: 'open-circuit-short-circuit',
    name: 'Open Circuit Short Circuit Test',
    type: 'vimeo',
    vimeoId: '911294215',
    description: `"open circuit and short circuit test 斷路以及短路測試"
Liang-Jung Chen

An exploration of the tangled digital connections that comprise everyday life. Performed as part of Playing House's inaugural installation series.

"Inspired by the artist's frustration in constantly searching for adapters while traveling in different countries, the live performance is based on an intricately woven structure consisting of cables, LEDs and other electronic components, a literal and metaphorical exploration of a 'circuit' in contemporary lives."

Film by Ethan MacCumber
September 2023 at Hudson Wilder`,
    year: 2023
  },
  // Example Vimeo film - uncomment and modify
  // {
  //   slug: 'film-name',           // Must match Backblaze folder name for thumbnail
  //   name: 'Film Display Name',   // Shown on the films page
  //   type: 'vimeo',              // Either 'vimeo' or 'moving-album'
  //   vimeoId: '911294215',       // Vimeo video ID
  //   description: 'Extended description about the film...', // Optional, shown below video
  //   year: 2024,                 // Optional
  //   duration: '12:34'           // Optional
  // },
  
  // Example moving album - uncomment and modify
  // {
  //   slug: 'moving-album',
  //   name: '16mm Project',
  //   type: 'moving-album',
  //   videos: [
  //     { caption: 'Scene 1' },
  //     { caption: 'Scene 2' },
  //     // ... one entry per video (1.mp4, 2.mp4, etc.)
  //   ],
  //   description: 'Shot on 16mm film...'
  // }
];

// Helper function to get thumbnail URL
export function getFilmThumbnail(slug) {
  return `https://f004.backblazeb2.com/file/ethan-site-media/videos/films/${slug}/cover_optimized.webm`;
}

// Helper function to get poster image URL
export function getFilmPoster(slug) {
  return `https://f004.backblazeb2.com/file/ethan-site-media/videos/films/${slug}/poster.png`;
}

// Helper function to get video base URL for moving albums
export function getMovingAlbumBaseUrl(slug) {
  return `https://f004.backblazeb2.com/file/ethan-site-media/videos/films/${slug}`;
}

// Helper function to get a specific film
export function getFilm(slug) {
  return films.find(film => film.slug === slug);
}