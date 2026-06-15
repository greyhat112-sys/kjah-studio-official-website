export default function sitemap() {
  return [
    {
      url: 'https://kjahstudio.com',
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
