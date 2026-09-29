import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lokalscout.in";
  const now = new Date();

  // Core static pages
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sample`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  // Popular Indian Commercial Micro-Markets for SEO indexing
  const popularHubs = [
    { loc: "madhapur-hyderabad", cat: "specialty-coffee" },
    { loc: "gachibowli-hyderabad", cat: "cloud-kitchen" },
    { loc: "jubilee-hills-hyderabad", cat: "fine-dining-restaurant" },
    { loc: "indiranagar-bengaluru", cat: "dental-clinic" },
    { loc: "koramangala-bengaluru", cat: "boutique-coworking" },
    { loc: "hsr-layout-bengaluru", cat: "fitness-gym" },
    { loc: "bandra-west-mumbai", cat: "unisex-salon" },
    { loc: "andheri-west-mumbai", cat: "artisanal-bakery" },
    { loc: "dlf-cyber-city-gurugram", cat: "qsr-hub" },
    { loc: "koregaon-park-pune", cat: "specialty-coffee" },
    { loc: "baner-pune", cat: "pet-clinic" },
  ];

  const hubRoutes = popularHubs.map((h) => ({
    url: `${baseUrl}/sample?hub=${h.loc}&vertical=${h.cat}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...routes, ...hubRoutes];
}
