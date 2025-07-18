// Album Configuration
// Add new albums here - this is the single source of truth for all photo albums

export const albums = [
  {
    slug: 'camogli',
    name: 'Camogli',
    description: 'Coastal town in Liguria, Italy',
    albumDescription: 'A collection of photographs from the beautiful coastal town of Camogli, Italy.',
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
  // Add more albums here following the same structure:
  // {
  //   slug: 'album-folder-name',           // Must match Backblaze folder name
  //   name: 'Display Name',               // Shown on the albums page
  //   description: 'Short description',   // Shown under album name
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