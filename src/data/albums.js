// Album Configuration
// Add new albums here - this is the single source of truth for all photo albums

export const albums = [
  {
    slug: 'rabat',
    name: 'Rabat',
    description: '',
    thumbnailPhoto: 5, // Specify which photo number to use as thumbnail (default: 1)
    albumDescription: 'These photographs will accompany an upcoming book about the history of women\'s health in Morocco. All were taken at l\'Hôpital de Maternité et Santé Reproductrice les Orangers.',
    photos: [
      { caption: 'Rabat, Morocco, 2024' },
      { caption: 'Rabat, Morocco, 2024' },
      { caption: 'Rabat, Morocco, 2024' },
      { caption: 'Rabat, Morocco, 2024' },
      { caption: 'Rabat, Morocco, 2024' },
      { caption: 'Rabat, Morocco, 2024' },
      { caption: 'Rabat, Morocco, 2024' },
      { caption: 'Rabat, Morocco, 2024' },
      { caption: 'Rabat, Morocco, 2024' },
      { caption: 'Rabat, Morocco, 2024' },
      { caption: 'Rabat, Morocco, 2024' }
    ]
  },
  {
    slug: 'tamarac',
    name: 'Tamarac',
    description: '',
    thumbnailPhoto: 2,
    albumDescription: '',
    photos: [
      { caption: 'Breakfast with dad and grandpa Billy, Tamarac, Florida, 2021' },
      { caption: 'Tamarac, Florida, 2021' },
      { caption: 'Tamarac, Florida, 2021' },
      { caption: 'Tamarac, Florida, 2021' }
    ]
  },
  {
    slug: 'camogli',
    name: 'Camogli',
    description: '',
    thumbnailPhoto: 6,
    albumDescription: '',
    photos: [
      { caption: 'Camogli, Italy, 2019' },
      { caption: 'Camogli, Italy, 2019' },
      { caption: 'Camogli, Italy, 2019' },
      { caption: 'Camogli, Italy, 2019' },
      { caption: 'Camogli, Italy, 2019' },
      { caption: 'Camogli, Italy, 2019' },
      { caption: 'Camogli, Italy, 2019' },
      { caption: 'Camogli, Italy, 2019' },
      { caption: 'Camogli, Italy, 2019' }
    ]
  },
  {
    slug: 'iowa',
    name: 'Iowa',
    description: '',
    thumbnailPhoto: 1,
    albumDescription: '',
    photos: [
      { caption: 'American Legion Park, West Des Moines, Iowa, 2019' },
      { caption: 'Madison County Fair, Winterset, Iowa, 2019' },
      { caption: 'Madison County Fair, Winterset, Iowa, 2019' },
      { caption: 'Snookies Malt Shop, Des Moines, Iowa, 2019' },
      { caption: 'Snookies Malt Shop, Des Moines, Iowa, 2019' },
      { caption: 'Iowa State Fair, Des Moines, Iowa, 2019' },
      { caption: 'Iowa State Fair, Des Moines, Iowa, 2019' },
      { caption: 'Iowa State Fair, Des Moines, Iowa, 2019' },
      { caption: 'Iowa State Fair, Des Moines, Iowa, 2019' },
      { caption: 'Iowa State Fair, Des Moines, Iowa, 2019' },
      { caption: 'Iowa State Fair, Des Moines, Iowa, 2019' }
    ]
  },
  {
    slug: 'party',
    name: 'Party',
    description: '',
    thumbnailPhoto: 1,
    albumDescription: '',
    photos: [
      { caption: 'Halloween, Queens, 2021' },
      { caption: 'Scotty\'s Birthday, Brooklyn, 2022' },
      { caption: 'Scotty\'s Birthday, Brooklyn, 2022' },
      { caption: 'Halloween, Brooklyn, 2022' },
      { caption: 'Chiara\'s Birthday, France, 2024' },
      { caption: 'Chiara\'s Birthday, France, 2024' },
      { caption: 'Chiara\'s Birthday, France, 2024' }
    ]
  },
  // Add more albums here following the same structure:
  // {
  //   slug: 'album-folder-name',           // Must match Backblaze folder name
  //   name: 'Display Name',               // Shown on the albums page
  //   description: 'Short description',   // Shown under album name
  //   thumbnailPhoto: 1,                  // Which photo number to use as thumbnail (default: 1)
  //   albumDescription: 'Longer text about the album project', // Optional, shown below photos
  //   photos: [
  //     { caption: 'Photo 1 caption' },   // Optional captions for each photo
  //     { caption: 'Photo 2 caption' },   // Photos are numbered 1.jpg, 2.jpg, etc.
  //     { caption: '' },                  // Empty string for no caption
  //     // ... add one entry per photo
  //   ]
  // }
];

// Helper function to get album data
export function getAlbum(slug) {
  return albums.find(album => album.slug === slug);
}

// Helper function to get album count
export function getAlbumPhotoCount(slug) {
  const album = getAlbum(slug);
  return album ? album.photos.length : 0;
}