// Film Configuration
// Add new films here - this is the single source of truth for all films

export const films = [
  // Add your films here
  {
    slug: 'months-at-home',
    name: 'Months at Home',
    type: 'vimeo',
    vimeoId: '907969900',  // Sample Vimeo ID for testing
    description: `Submitted in partial fulfillment of the requirements for my BA in Cinema 
    and Media Studies at the University of Chicago. © 2021`,
    year: 2024
  },
  {
    slug: '16mm-project',
    name: 'Lakeview / Hyde Park',
    type: 'moving-album',
    videos: [
      { caption: 'Scene 1' },
      { caption: 'Scene 2' },
      { caption: 'Scene 3' }
    ],
    description: 'A project shot on 16mm film, presented as individual clips.'
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
  return `https://f004.backblazeb2.com/file/ethan-site-media/videos/films/${slug}/cover.mp4`;
}

// Helper function to get video base URL for moving albums
export function getMovingAlbumBaseUrl(slug) {
  return `https://f004.backblazeb2.com/file/ethan-site-media/videos/films/${slug}`;
}

// Helper function to get a specific film
export function getFilm(slug) {
  return films.find(film => film.slug === slug);
}