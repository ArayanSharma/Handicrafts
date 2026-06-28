// Mapping of route slugs to database category names
export const categoryMap = {
  'brass-showpieces': 'brass-showpieces',
  'coffee-and-center-table': 'coffee-and-center-table',
  'console-tables': 'console-tables',
  'decorative-mirrors': 'decorative-mirrors',
  'dining-tables': 'dining-tables',
  'floor-lamps': 'floor-lamps',
  'furniture': 'furniture',
  'islamic-wall-art': 'islamic-wall-art',
  'led-mirrors': 'led-mirrors',
  'metal-wall-art': 'metal-wall-art',
  'planters': 'planters',
  'serving-trolley': 'serving-trolley',
  'side-tables': 'side-tables',
  'table-lamp': 'table-lamp',
  'wall-clock': 'wall-clock',
};

// Get category name from route slug
export const getCategoryName = (slug) => {
  return categoryMap[slug] || slug;
};
